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

function getCategoryColor(category) {
  switch (category) {
    case '실무자동화':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'AI인사이트':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'GEO마케팅':
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    case '개발팁':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    default:
      return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
  }
}

function extractYoutubeId(post) {
  if (!post) return '';
  if (post.videoId && /^[a-zA-Z0-9_-]{11}$/.test(String(post.videoId).trim())) {
    return String(post.videoId).trim();
  }
  const src = String(post.content || '');
  const patterns = [
    /@\[youtube\]\(([a-zA-Z0-9_-]{11})\)/,
    /img\.youtube\.com\/vi\/([a-zA-Z0-9_-]{11})/,
    /i\.ytimg\.com\/vi\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/(?:watch\?v=|shorts\/|embed\/)([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/
  ];
  for (const re of patterns) {
    const m = src.match(re);
    if (m && m[1]) return m[1];
  }
  return '';
}

function markdownToText(src) {
  if (!src) return '';
  return src
    .replace(/```[\s\S]*?```/g, '')
    .replace(/@\[youtube\]\([^)]+\)/g, '')
    .replace(/\[!\[[^\]]*\]\([^)]+\)\]\([^)]+\)/g, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
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
  let tableRows = [];

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
    tableRows = [];
    return tHtml;
  }

  function inline(text) {
    return text.split('`').map((p, i) => {
      if (i % 2 === 1) return `<code class="bg-gray-800 px-1 rounded text-sm font-mono text-cyan-400">${escapeHtml(p)}</code>`;
      let s = escapeHtml(p);
      s = s.replace(/\[!\[([^\]]*)\]\((https?:\/\/[^)]+)\)\]\((https?:\/\/[^)]+)\)/g, '<a href="$3" target="_blank" rel="noopener noreferrer" class="block my-3"><img src="$2" alt="$1" class="rounded-lg max-w-full h-auto"></a>');
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

    const ytm = line.trim().match(/^@\[youtube\]\(([a-zA-Z0-9_-]{11})\)$/);
    if (ytm) {
      html += flushList() + flushTable();
      const vid = ytm[1];
      html += `<div class="my-6 overflow-hidden rounded-xl border border-gray-800 bg-black aspect-video"><iframe class="w-full h-full" src="https://www.youtube.com/embed/${vid}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>`;
      continue;
    }

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

function buildCourseCtaHtml(postId) {
  const loc = 'news_post_' + postId;
  const url = 'https://cojungsa.liveklass.com/classes/317917?utm_source=club&utm_medium=referral&utm_content=' + loc;
  return `
    <div class="mt-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-[#141420] to-purple-500/10 border border-cyan-500/25">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-2">
          <span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">중개사 AI 클럽 정규과정 VOD</span>
          <h3 class="font-heading-lg text-xl font-bold text-on-surface">코딩을 몰라도 나만의 중개 자동화 시스템을 직접 구축하세요</h3>
          <p class="font-body-md text-sm text-grey-600 leading-relaxed">영상에서 소개한 실무 자동화 원리를 내 중개사무소 환경에 맞게 직접 구현하고, 수강 후 중개사 AI 클럽 정예 크루로 합류하실 수 있습니다.</p>
        </div>
        <a href="${url}" target="_blank" rel="noopener noreferrer" onclick="trackNewsCourseClick('${loc}', '${url}')" class="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all min-h-[48px]">
          <span>정규과정 VOD 수강 신청하기</span>
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </a>
      </div>
    </div>
  `;
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

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
        id: 1,
        category: "AI뉴스",
        title: "중개사 AI 클럽 첫 게시판 개설!",
        date: "2026-07-08",
        content: "## 중개사 AI 클럽 게시판 오픈\n\n중개업 자동화를 위한 최신 **AI 뉴스**와 **개발 팁**을 이곳에서 확인하실 수 있습니다."
      }
    ];
  }

  const post = posts.find(p => p.id === postId) || posts[0];

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
  const canonicalUrl = `https://realtor-aiclub-rosy.vercel.app/news/${post.id}`;
  const videoId = extractYoutubeId(post);
  const thumbUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
  const isoDate = /^\d{4}-\d{2}-\d{2}$/.test(String(post.date || '').trim())
    ? `${String(post.date).trim()}T09:00:00+09:00`
    : (post.date || new Date().toISOString());

  const blogPosting = {
    "@type": "BlogPosting",
    "headline": post.title,
    "datePublished": isoDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "author": {
      "@type": "Organization",
      "name": "중개사 AI 클럽",
      "url": "https://realtor-aiclub-rosy.vercel.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "중개사 AI 클럽",
      "url": "https://realtor-aiclub-rosy.vercel.app"
    },
    "description": summary,
    "articleBody": markdownToText(post.content || '')
  };
  if (thumbUrl) {
    blogPosting.image = thumbUrl;
  }

  const graph = [blogPosting];
  if (videoId) {
    graph.push({
      "@type": "VideoObject",
      "name": post.title,
      "description": summary,
      "thumbnailUrl": thumbUrl,
      "uploadDate": isoDate,
      "embedUrl": `https://www.youtube.com/embed/${videoId}`,
      "contentUrl": `https://www.youtube.com/watch?v=${videoId}`
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": graph
  };

  const ogImageTag = thumbUrl ? `<meta property="og:image" content="${thumbUrl}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="${thumbUrl}">` : '';

  const metaHead = `
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(summary)}">
<link rel="canonical" href="${canonicalUrl}">
<meta property="og:title" content="${escapeHtml(post.title)}">
<meta property="og:description" content="${escapeHtml(summary)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${canonicalUrl}">
${ogImageTag}
<script id="jsonld-schema" type="application/ld+json">${JSON.stringify(schema)}</script>
`;

  html = html.replace(/<title>.*?<\/title>/i, metaHead);

  const categoryColor = getCategoryColor(post.category);

  const postContainerHtml = `
    <div class="mb-6 flex items-center gap-3">
      <span class="px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-bold ${categoryColor}">${escapeHtml(post.category || '')}</span>
      <span class="text-muted font-label-sm text-xs">${escapeHtml(post.date || '')}</span>
    </div>
    <h1 class="font-display-hero text-2xl md:text-3xl text-on-surface mb-6 leading-snug font-bold">${escapeHtml(post.title || '')}</h1>
    <hr class="border-border mb-8">
    <div class="prose-content font-body-lg text-body-lg text-on-surface leading-relaxed">${renderMarkdown(post.content || '')}</div>
    ${buildCourseCtaHtml(post.id)}
  `;

  html = html.replace(
    /<article id="post-container"[^>]*>[\s\S]*?<\/article>/i,
    `<article id="post-container" class="detail-card rounded-2xl p-lg md:p-xl">${postContainerHtml}</article>`
  );

  return res.status(200).send(html);
}
