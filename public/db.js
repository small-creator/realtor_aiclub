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
  const filePath = cfg.data_file_path || 'public/data/board.json';
  const url = `https://api.github.com/repos/${cfg.github_owner}/${cfg.github_repo}/contents/${filePath}`;
  const headers = { 'Accept': 'application/vnd.github+json', 'Authorization': 'token ' + tok };
  try {
    const r = await fetch(url, { headers });
    if (!r.ok) return null;
    return r.json();
  } catch (e) { return null; }
}

const DEFAULT_POSTS = [
  {
    "id": 2,
    "category": "GEO마케팅",
    "title": "챗GPT·제미나이가 우리 부동산을 추천할까? AI 시대, 공인중개사 필수 GEO 전략",
    "date": "2026-08-08",
    "content": "# 🤖 \"챗GPT·제미나이가 우리 부동산을 추천할까?\" AI 시대, 공인중개사 필수 GEO 전략\n\n> **[핵심 요약 (TL;DR)]**\n> - **AI 검색의 급부상**: 검색 이용자의 50% 이상이 네이버 대신 챗GPT·제미나이 등 AI 검색을 활용하고 있습니다.\n> - **AI 추천의 비밀**: AI에게 \"OO동 부동산 추천해줘\"라고 물었을 때 추천되는 부동산의 출처는 100% **'구글 지도(구글 비즈니스 프로필)'** 데이터였습니다.\n> - **지금 당장 할 일**: 구글 비즈니스 프로필에 10분만 투자해 무료 등록하고, 실거주자/계약 고객의 리뷰를 확보하여 AI 추천 후보군 선점에 나서야 합니다.\n\n---\n\n## 📊 1. AI 검색 시대, 바뀌는 고객 방문 경로\n\n네이버만 잘 관리하면 손님이 저절로 찾아오던 시대가 지나가고 있습니다. \n\n최근 발표된 **오픈서베이(2026년 7월) 조사 결과**에 따르면, 검색 이용자 1,000명 중 **절반 이상(50%+)'이 이미 챗GPT, 제미나이(Gemini) 같은 생성형 AI를 통해 검색**을 진행하고 있는 것으로 나타났습니다.\n\n- **챗GPT 이용률**: 1년 전 대비 **15% 증가**\n- **제미나이 이용률**: 1년 전 대비 **약 3배 급증**\n- **네이버 검색 점유율**: AI 검색 전환으로 인해 지속적인 약보합세\n\n이러한 변화는 매물을 찾거나 동네 전문 부동산을 찾는 고객들의 검색 습관 역시 AI 중심으로 빠르게 재편되고 있음을 의미합니다.\n\n---\n\n## 🔍 2. AI 비교 테스트: 챗GPT·제미나이·클로드는 어디서 정보를 가져올까?\n\n\"정말 AI가 동네 부동산까지 추천해줄까?\" 궁금하여 대표적인 3대 AI(제미나이·챗GPT·클로드)에 동일한 조건으로 검색을 진행해보았습니다.\n\n> 💡 **테스트 검색어**: `\"OO동 아파트 전문 추천 부동산 사무소 알려줘\"` \n\n놀랍게도 3개 AI 모두 특정 부동산 사무실들을 구체적으로 추천해 주었습니다. 각 AI의 데이터 출처를 직접 역추적한 결과는 다음과 같았습니다.\n\n| AI 모델 | 답변 특징 | 정보 출처 (Source) |\n| :--- | :--- | :--- |\n| **Google Gemini** | 상호명, 평점, 위치, 영업시간을 가장 정밀하게 출력 | 구글 지도 (Google Business Profile) |\n| **OpenAI ChatGPT** | 웹 검색 기반 답변이나 추천 리스트의 근거 데이터는 구글 지도 | 구글 지도 및 웹 인덱싱 페이지 |\n| **Anthropic Claude** | 상권 및 위치 기반으로 친절하게 추천 | 구글 지도 통합 데이터베이스 |\n\n---\n\n### 🎬 AI 비교 테스트, 1분 쇼츠 영상으로 직접 확인하세요!\n\n말로만 설명해 드리는 것보다 눈으로 직접 확인하시는 것이 좋을 것 같아, 세 AI에 똑같이 검색하고 데이터 출처를 확인하는 전 과정을 **1분 쇼츠 영상**으로 담았습니다. \n\n👇 **아래 영상 이미지를 클릭하시면 시연 영상을 바로 보실 수 있습니다.**\n\n[![AI 비교 테스트 쇼츠 영상](https://img.youtube.com/vi/i23LAIhm2Fs/hqdefault.jpg)](https://youtube.com/shorts/i23LAIhm2Fs?feature=share)\n\n> 📺 **[영상 클릭]** 👉 [3대 AI 부동산 추천 출처 비교 테스트 영상 보러가기](https://youtube.com/shorts/i23LAIhm2Fs?feature=share)\n\n**[영상 핵심 요약]**\n1. **제미나이**: 구글 지도 기반으로 상호·평점·위치 등 가장 디테일한 부동산 정보 출력\n2. **챗GPT**: 웹 검색 답변 시 결국 구글 지도 페이지 데이터를 최종 인용\n3. **클로드**: 동일하게 구글 지도 데이터를 참고하여 부동산 사무소 추천\n\n> ⚠️ **핵심 시사점**: 세 AI 모두 추천 인터페이스는 달랐으나, 인용 데이터의 출처는 100% **'구글 지도'** 한 곳이었습니다.\n\n---\n\n## ⏱️ 3. 10분 만에 끝내는 구글 비즈니스 프로필 등록 3단계\n\n구글 지도에 내 중개사무소를 등록하는 것은 **100% 무료**이며, 과정도 매우 간단합니다.\n\n1. **프로필 접속**: [Google 비즈니스 프로필 홈페이지](https://business.google.com) 접속\n2. **사무소 정보 입력**: 상호명, 위치 주소, 전화번호, 주요 중개 분야 입력\n3. **인증 완료**: 전화/우편/동영상 인증을 완료하면 며칠 내 구글 지도에 공식 등록됩니다.\n\n---\n\n## 💡 4. AI가 '리뷰 많은 부동산'을 먼저 추천하는 이유 (GEO 핵심 전략)\n\n등록만 해두었다고 해서 AI가 무조건 내 부동산을 1등으로 추천해주지는 않습니다. AI 엔진이 우수 부동산으로 인식하게 만드는 **GEO(생성형 AI 최적화) 3대 수칙**을 기억하세요.\n\n### ① 구글 지도 리뷰(Review) 축적\n- AI는 **\"리뷰가 꾸준히 쌓이는 곳 = 실제로 활발히 영업 중이며 고객 만족도가 높은 곳\"**으로 판단합니다.\n- 계약 마무리 시 고객에게 \"구글 지도에 한 줄 리뷰 부탁드립니다\"라고 친절히 안내해보세요.\n- 작성된 리뷰에는 짧더라도 **감사 답글**을 달아 데이터 활성도를 높이세요.\n\n### ② 키워드 중심의 대표 소개글 작성\n- 상호명과 소개글에 지역명과 아파트명, 주요 중개 유형을 명확히 작성하세요.  \n  *(예: \"OO동 아파트 재개발 갭투자 전문 OO공인중개사사무소\")*\n\n### ③ 최근 정보 업데이트 유지\n- 영업시간, 외관/내부 사진, 휴무일 정보를 최신으로 유지하면 AI 챗봇의 신뢰도 점수(Trust Score)가 상승합니다.\n\n---\n\n## ❓ 5. AI 검색 최적화(GEO) FAQ\n\n**Q1. 네이버 플레이스만 관리하면 안 되나요?**  \nA. 네이버 플레이스도 중요하지만, 챗GPT나 제미나이 등 글로벌 대형 AI 모델들은 구글 지도의 글로벌 비즈니스 데이터를 기반으로 지역 정보를 인용합니다. 구글 지도 미등록 시 AI 검색 결과 후보군에서 아예 제외됩니다.\n\n**Q2. 구글 지도 등록에 비용이 드나요?**  \nA. 전액 무료입니다. 비즈니스 프로필 등록만으로 AI 검색엔진에 무료 광고 노출 효과를 얻을 수 있습니다.\n\n---\n\n## ✅ 지금 바로 실행하세요!\n\n아직 국내 상당수의 부동산 사무소가 구글 지도 등록의 중요성을 체감하지 못하고 있습니다.  \n**남들보다 먼저 시작하는 지금이 선점할 수 있는 골든타임**입니다.\n\n지금 당장 10분만 투자하여 AI가 가장 먼저 추천하는 우리 동네 대표 부동산으로 거듭나세요!"
  },
  {
    "id": 1,
    "category": "AI뉴스",
    "title": "중개사 AI 클럽 첫 게시판 개설!",
    "date": "2026-07-08",
    "content": "## 중개사 AI 클럽 게시판 오픈\n\n중개업 자동화를 위한 최신 **AI 뉴스**와 **개발 팁**을 이곳에서 확인하실 수 있습니다."
  }
];

async function getPosts() {
  try {
    const meta = await _getFileData();
    if (meta && meta.content) {
      const raw = atob(meta.content.replace(/\s/g, ''));
      const decoded = decodeURIComponent(raw.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(decoded);
    }
  } catch (e) {}

  try {
    const r = await fetch('/data/board.json?v=' + Date.now());
    if (r.ok) {
      const ct = r.headers.get('content-type') || '';
      if (ct.includes('json')) {
        const list = await r.json();
        if (Array.isArray(list) && list.length > 0) return list;
      }
    }
  } catch (e) {}

  return DEFAULT_POSTS;
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
