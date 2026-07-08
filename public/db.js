let _config = null;

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function loadConfig() {
  if (_config) return _config;
  let api = {}, file = {};
  try { const r = await fetch('/api/config'); if (r.ok) api = await r.json(); } catch (e) {}
  try { const r = await fetch('config/git_config.json'); if (r.ok) file = await r.json(); } catch (e) {}
  const apiTok = String(api.github_token || '').trim();
  const fileTok = String(file.github_token || '').trim();
  _config = {
    github_token: (apiTok && apiTok !== 'YOUR_GITHUB_TOKEN') ? apiTok : fileTok,
    github_owner: file.github_owner || '',
    github_repo: file.github_repo || '',
    data_file_path: file.data_file_path || 'data/board.json',
    admin_password: api.admin_password || file.admin_password || 'admin1234'
  };
  return _config;
}

function isAdmin() {
  return sessionStorage.getItem('isAdmin') === 'true';
}

function requireAdmin() {
  if (!isAdmin()) window.location.href = 'admin.html';
}

async function _getFileData() {
  const cfg = await loadConfig();
  const tok = String(cfg.github_token || '').replace(/\s+/g, '');
  if (!tok || tok === 'YOUR_GITHUB_TOKEN') return null;
  const url = `https://api.github.com/repos/${cfg.github_owner}/${cfg.github_repo}/contents/${cfg.data_file_path || 'data/board.json'}`;
  const headers = { 'Accept': 'application/vnd.github+json', 'Authorization': 'token ' + tok };
  try {
    const r = await fetch(url, { headers });
    if (!r.ok) return null;
    return r.json();
  } catch (e) { return null; }
}

async function getPosts() {
  try {
    const meta = await _getFileData();
    if (!meta) return [];
    const raw = atob(meta.content.replace(/\s/g, ''));
    const decoded = decodeURIComponent(raw.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(decoded);
  } catch (e) { return []; }
}

async function savePosts(posts) {
  const cfg = await loadConfig();
  const tok = String(cfg.github_token || '').replace(/\s+/g, '');
  if (!tok || tok === 'YOUR_GITHUB_TOKEN') throw new Error('GitHub 토큰이 설정되지 않았습니다.');
  const url = `https://api.github.com/repos/${cfg.github_owner}/${cfg.github_repo}/contents/${cfg.data_file_path || 'data/board.json'}`;
  const headers = { 'Accept': 'application/vnd.github+json', 'Authorization': 'token ' + tok, 'Content-Type': 'application/json' };
  const meta = await _getFileData();
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(posts, null, 2))));
  const body = { message: 'update: board.json', content };
  if (meta && meta.sha) body.sha = meta.sha;
  const r = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.message || 'GitHub 저장 실패');
  }
  return true;
}

async function savePost(post) {
  const posts = await getPosts();
  const idx = posts.findIndex(p => p.id === post.id);
  if (idx >= 0) {
    posts[idx] = post;
  } else {
    post.id = posts.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) + 1;
    posts.unshift(post);
  }
  return savePosts(posts);
}

async function deletePost(id) {
  const posts = await getPosts();
  return savePosts(posts.filter(p => p.id !== Number(id)));
}

function renderMarkdown(src) {
  if (!src) return '';
  const lines = src.split('\n');
  let html = '';
  let inCode = false, codeLines = [];
  let listType = '', listItems = [];

  function flushList() {
    if (!listItems.length) return '';
    const tag = listType === 'ol' ? 'ol' : 'ul';
    const cls = listType === 'ol' ? 'list-decimal' : 'list-disc';
    const r = `<${tag} class="${cls} list-inside my-2 pl-4 space-y-1">${listItems.map(i => `<li>${i}</li>`).join('')}</${tag}>`;
    listItems = []; listType = '';
    return r;
  }

  function inline(text) {
    return text.split('`').map((p, i) => {
      if (i % 2 === 1) return `<code class="bg-gray-800 px-1 rounded text-sm font-mono text-cyan-400">${escapeHtml(p)}</code>`;
      let s = escapeHtml(p);
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
        html += flushList() + `<pre class="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto my-3"><code class="text-sm font-mono text-gray-300">${escapeHtml(codeLines.join('\n'))}</code></pre>`;
        inCode = false; codeLines = [];
      } else {
        html += flushList(); inCode = true;
      }
      continue;
    }
    if (inCode) { codeLines.push(line); continue; }

    const hm = line.match(/^(#{1,6})\s+(.*)/);
    if (hm) {
      html += flushList();
      const sz = ['text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm', 'text-xs'][hm[1].length - 1];
      html += `<h${hm[1].length} class="${sz} font-bold my-3 text-cyan-400">${inline(hm[2])}</h${hm[1].length}>`;
      continue;
    }
    if (/^-{3,}$/.test(line.trim())) { html += flushList() + '<hr class="my-4 border-gray-800">'; continue; }
    if (line.startsWith('> ')) { html += flushList() + `<blockquote class="border-l-4 border-cyan-500 pl-4 my-2 text-gray-400 italic">${inline(line.slice(2))}</blockquote>`; continue; }

    const ulm = line.match(/^[-*]\s+(.*)/);
    if (ulm) { if (listType && listType !== 'ul') html += flushList(); listType = 'ul'; listItems.push(inline(ulm[1])); continue; }
    const olm = line.match(/^\d+\.\s+(.*)/);
    if (olm) { if (listType && listType !== 'ol') html += flushList(); listType = 'ol'; listItems.push(inline(olm[1])); continue; }

    html += flushList();
    if (line.trim() === '') { html += '<br>'; continue; }
    html += `<p class="my-1 leading-relaxed">${inline(line)}</p>`;
  }
  html += flushList();
  if (inCode) html += `<pre class="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto my-3"><code class="text-sm font-mono text-gray-300">${escapeHtml(codeLines.join('\n'))}</code></pre>`;
  return html;
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
