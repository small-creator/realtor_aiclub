import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

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
      { id: 2, date: "2026-08-08" },
      { id: 1, date: "2026-07-08" }
    ];
  }

  let postUrls = '';
  posts.forEach(p => {
    const d = p.date || '2026-08-08';
    postUrls += `
  <url>
    <loc>https://realtor-aiclub-rosy.vercel.app/news/${p.id}</loc>
    <lastmod>${d}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://realtor-aiclub-rosy.vercel.app/news-detail?id=${p.id}</loc>
    <lastmod>${d}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://realtor-aiclub-rosy.vercel.app/news-detail.html?id=${p.id}</loc>
    <lastmod>${d}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://realtor-aiclub-rosy.vercel.app/</loc>
    <lastmod>2026-07-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://realtor-aiclub-rosy.vercel.app/news</loc>
    <lastmod>2026-07-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>${postUrls}
  <url>
    <loc>https://realtor-aiclub-rosy.vercel.app/llms.txt</loc>
    <lastmod>2026-07-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://realtor-aiclub-rosy.vercel.app/docs/intro.md</loc>
    <lastmod>2026-07-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://realtor-aiclub-rosy.vercel.app/docs/curriculum.md</loc>
    <lastmod>2026-07-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://realtor-aiclub-rosy.vercel.app/docs/vault.md</loc>
    <lastmod>2026-07-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://realtor-aiclub-rosy.vercel.app/docs/join.md</loc>
    <lastmod>2026-07-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://realtor-aiclub-rosy.vercel.app/docs/board-qa.md</loc>
    <lastmod>2026-07-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;

  res.status(200).send(xml);
}
