// Builds index.html from projects.json. No dependencies: `node build.mjs`.
// Fails if the page contains anything that looks private.
import fs from 'node:fs';

const d = JSON.parse(fs.readFileSync(new URL('./projects.json', import.meta.url), 'utf8'));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const cards = d.projects.map((p) => `    <section class="card">
      <h2>${esc(p.name)}</h2>
      <p>${esc(p.summary)}</p>
${p.tags?.length ? `      <div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>\n` : ''}${p.links?.length ? `      <div class="links">${p.links.map((l) => `<a href="${esc(l.url)}" rel="noopener">${esc(l.label)}</a>`).join('')}</div>\n` : ''}    </section>`).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(d.title)}</title>
<meta name="description" content="${esc(d.intro)}">
<style>
:root{--bg:#faf8f4;--fg:#2b2620;--muted:#6f675c;--line:#e4ddd2;--card:#fff;--accent:#2f6f5e}
@media (prefers-color-scheme:dark){:root{--bg:#1b1a18;--fg:#ece7df;--muted:#a59d90;--line:#35322d;--card:#24221f;--accent:#7cc4ad}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:860px;margin:0 auto;padding:48px 20px 80px}a{color:var(--accent)}
h1{font-size:1.9rem;margin:0 0 .3rem}.intro{color:var(--muted);margin:0}
.grid{display:grid;gap:14px;margin-top:28px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px 20px}
.card h2{margin:0 0 .3rem;font-size:1.15rem}.card p{margin:0}
.tags{margin-top:.6rem;display:flex;gap:6px;flex-wrap:wrap}
.tag{font-size:.75rem;border:1px solid var(--line);border-radius:99px;padding:1px 9px;color:var(--muted)}
.links{margin-top:.6rem;display:flex;gap:16px;flex-wrap:wrap}
footer{margin-top:40px;font-size:.85rem;color:var(--muted)}
</style>
</head>
<body>
<main>
  <h1>${esc(d.title)}</h1>
  <p class="intro">${esc(d.intro)}</p>
  <div class="grid">
${cards}
  </div>
  <footer><a href="https://github.com/p4vz">github.com/p4vz</a></footer>
</main>
</body>
</html>
`;

const leaks = [/up\.railway\.app/i, /@gmail\.com/i, /claude\//i, /ccr-/i, /verismo/i, /_KEY|_SECRET|TOKEN/];
const hit = leaks.find((r) => r.test(html));
if (hit) { console.error(`Refusing to build: page matches ${hit}`); process.exit(1); }

fs.writeFileSync(new URL('./index.html', import.meta.url), html);
console.log(`index.html written (${d.projects.length} projects)`);
