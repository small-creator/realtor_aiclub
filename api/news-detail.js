import fs from 'fs';
import path from 'path';

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function markdownToText(src) {
  if (!src) return '';
  return src
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^-{3,}$/gm, '')
    .replace(/\n+/g, ' ')
    .trim();
}

function renderMarkdown(src) {
  if (!src) return '';
  const lines = src.split('\n');
  let html = '';
  let inCode = false, codeLines = [];
  let listType = '', listItems = [];
  let inTable = false, tableRows = [];

  function flushList() {
    if (!listItems.length) return '';
    const tag = listType === 'ol' ? 'ol' : 'ul';
    const cls = listType === 'ol' ? 'list-decimal' : 'list-disc';
    const r = `<${tag} class="${cls} list-inside my-2 pl-4 space-y-1">${listItems.map(i => `<li>${i}</li>`).join('')}</${tag}>`;
    listItems = []; listType = '';
    return r;
  }

  function flushTable() {
    if (!tableRows.length) return '';
    let tHtml = '<div class="overflow-x-auto my-4"><table class="w-full text-left border-collapse border border-gray-800 text-sm">';
    tableRows.forEach((row, idx) => {
      const cells = row.split('|').slice(1, -1).map(c => c.trim());
      if (idx === 0) {
        tHtml += '<thead class="bg-gray-900 border-b border-gray-800 text-cyan-400"><tr>' + cells.map(c => `<th class="p-3 border-r border-gray-800 font-semibold">${inline(c)}</th>`).join('') + '</tr></thead><tbody>';
      } else if (row.includes('---')) {
        return;
      } else {
        tHtml += '<tr class="border-b border-gray-800/60 hover:bg-gray-800/30">' + cells.map(c => `<td class="p-3 border-r border-gray-800/60 text-gray-300">${inline(c)}</td>`).join('') + '</tr>';
      }
    });
    tHtml += '</tbody></table></div>';
    tableRows = []; inTable = false;
    return tHtml;
  }

  function inline(text) {
    return text.split('`').map((p, i) => {
      if (i % 2 === 1) return `<code class="bg-gray-800 px-1 rounded text-sm font-mono text-cyan-400">${escapeHtml(p)}</code>`;
      let s = escapeHtml(p);
      s = s.replace(/!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g, '<img src="$2" alt="$1" class="my-3 rounded-lg max-w-full h-auto">');
      s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
      s = s.replace(/~~(.+?)~~/g, '<del>$1</del>');
      s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+|mailto:[^)]+)\)/g, '<a href="$2" class="text-cyan-400 underline" target="_blank" rel="noopener noreferrer">$1</a>');
      return s;
    }).join('');
  }

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) {
        html += flushList() + flushTable() + `<pre class="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto my-3"><code class="text-sm font-mono text-gray-300">${escapeHtml(codeLines.join('\n'))}</code></pre>`;
        inCode = false; codeLines = [];
      } else {
        html += flushList() + flushTable(); inCode = true;
      }
      continue;
    }
    if (inCode) { codeLines.push(line); continue; }

    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      html += flushList();
      tableRows.push(line.trim());
      continue;
    } else if (tableRows.length > 0) {
      html += flushTable();
    }

    const hm = line.match(/^(#{1,6})\s+(.*)/);
    if (hm) {
      html += flushList() + flushTable();
      const sz = ['text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm', 'text-xs'][hm[1].length - 1];
      html += `<h${hm[1].length} class="${sz} font-bold my-3 text-cyan-400">${inline(hm[2])}</h${hm[1].length}>`;
      continue;
    }
    if (/^-{3,}$/.test(line.trim())) { html += flushList() + flushTable() + '<hr class="my-4 border-gray-800">'; continue; }
    if (line.startsWith('> ')) { html += flushList() + flushTable() + `<blockquote class="border-l-4 border-cyan-500 pl-4 my-2 text-gray-400 italic">${inline(line.slice(2))}</blockquote>`; continue; }

    const ulm = line.match(/^[-*]\s+(.*)/);
    if (ulm) { if (listType && listType !== 'ul') html += flushList(); listType = 'ul'; listItems.push(inline(ulm[1])); continue; }
    const olm = line.match(/^\d+\.\s+(.*)/);
    if (olm) { if (listType && listType !== 'ol') html += flushList(); listType = 'ol'; listItems.push(inline(olm[1])); continue; }

    html += flushList() + flushTable();
    if (line.trim() === '') { html += '<br>'; continue; }
    html += `<p class="my-1 leading-relaxed">${inline(line)}</p>`;
  }
  html += flushList() + flushTable();
  if (inCode) html += `<pre class="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto my-3"><code class="text-sm font-mono text-gray-300">${escapeHtml(codeLines.join('\n'))}</code></pre>`;
  return html;
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  // Determine requested post ID from query parameter or request URL
  let postId = null;
  if (req.query && req.query.id) {
    postId = Number(req.query.id);
  } else {
    const parts = (req.url || '').split('?')[0].split('/');
    const lastPart = parts.pop();
    if (lastPart && !isNaN(Number(lastPart))) {
      postId = Number(lastPart);
    }
  }

  // Load board posts from JSON file
  let posts = [];
  try {
    const p1 = path.join(process.cwd(), 'public', 'data', 'board.json');
    const p2 = path.join(process.cwd(), 'data', 'board.json');
    let raw = '';
    if (fs.existsSync(p1)) raw = fs.readFileSync(p1, 'utf8');
    else if (fs.existsSync(p2)) raw = fs.readFileSync(p2, 'utf8');

    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) posts = parsed;
    }
  } catch (e) {}

  if (!posts.length) {
    posts = [
      {
        id: 2,
        category: "GEO마케팅",
        title: "챗GPT·제미나이가 우리 부동산을 추천할까? AI 시대, 공인중개사 필수 GEO 전략",
        date: "2026-08-08",
        content: "# 🤖 \"챗GPT·제미나이가 우리 부동산을 추천할까?\" AI 시대, 공인중개사 필수 GEO 전략\n\n> **[핵심 요약 (TL;DR)]**\n> - **AI 검색의 급부상**: 검색 이용자의 50% 이상이 네이버 대신 챗GPT·제미나이 등 AI 검색을 활용하고 있습니다."
      },
      {
        id: 1,
        category: "AI뉴스",
        title: "중개사 AI 클럽 첫 게시판 개설!",
        date: "2026-07-08",
        content: "## 중개사 AI 클럽 게시판 오픈\n\n중개업 자동화를 위한 최신 **AI 뉴스**와 **개발 팁**을 이곳에서 확인하실 수 있습니다."
      }
    ];
  }

  // Find requested post or fallback to first post
  const post = posts.find(p => p.id === postId) || posts.find(p => p.id === 1) || posts[0];

  // Load template HTML file
  let html = '';
  try {
    const t1 = path.join(process.cwd(), 'public', 'news-detail.html');
    const t2 = path.join(process.cwd(), 'news-detail.html');
    if (fs.existsSync(t1)) html = fs.readFileSync(t1, 'utf8');
    else if (fs.existsSync(t2)) html = fs.readFileSync(t2, 'utf8');
  } catch (e) {}

  if (!html) {
    return res.status(500).send('Template error');
  }

  const title = `${post.title} | 중개사 AI 클럽`;
  const summary = markdownToText(post.content || '').slice(0, 160);
  const canonicalUrl = `https://realtor-aiclub-rosy.vercel.app/news-detail?id=${post.id}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "중개사 AI 클럽"
    },
    "description": summary,
    "articleBody": markdownToText(post.content || '')
  };

  const metaHead = `
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(summary)}">
<link rel="canonical" href="${canonicalUrl}">
<meta property="og:title" content="${escapeHtml(post.title)}">
<meta property="og:description" content="${escapeHtml(summary)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${canonicalUrl}">
<script id="jsonld-schema" type="application/ld+json">${JSON.stringify(schema)}</script>
`;

  // Inject meta tags into <head>
  html = html.replace(/<title>.*?<\/title>/i, metaHead);

  // Pre-render post container HTML for SSR
  const categoryColor = post.category === 'AI뉴스'
    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20';

  const postContainerHtml = `
    <div class="mb-6 flex items-center gap-3">
      <span class="px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-bold ${categoryColor}">${escapeHtml(post.category || '')}</span>
      <span class="text-muted font-label-sm text-xs">${escapeHtml(post.date || '')}</span>
    </div>
    <h1 class="font-display-hero text-2xl md:text-3xl text-on-surface mb-6 leading-snug font-bold">${escapeHtml(post.title || '')}</h1>
    <hr class="border-border mb-8">
    <div class="prose-content font-body-lg text-body-lg text-on-surface leading-relaxed">${renderMarkdown(post.content || '')}</div>
  `;

  html = html.replace(
    /<article id="post-container"[^>]*>[\s\S]*?<\/article>/i,
    `<article id="post-container" class="detail-card rounded-2xl p-lg md:p-xl">${postContainerHtml}</article>`
  );

  return res.status(200).send(html);
}
