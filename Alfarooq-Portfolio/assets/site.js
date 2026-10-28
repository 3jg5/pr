/* ====== مشترك بين index.html و admin.html: تنسيق البيانات ورسم البطاقات ====== */

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

// **عريض** + أسطر جديدة، مع تهريب بقية الوسوم
const rich = s => esc(s)
  .replace(/\*\*(.+?)\*\*/gs, '<strong>$1</strong>')
  .replace(/\n{2,}/g, '<br><br>')
  .replace(/\n/g, '<br>');

const arDigits = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

const hostOf = u => { try { return new URL(u, location.href).hostname.replace(/^www\./, ''); } catch (e) { return u || ''; } };

function renderWork(w, i) {
  const chips = (w.chips || []).filter(Boolean)
    .map(c => `<span class="chip">${esc(c)}</span>`).join('');
  const extra = w.extra && w.extra.url
    ? `<a class="btn btn-ghost" href="${esc(w.extra.url)}" target="_blank" rel="noopener">${esc(w.extra.label || 'رابط إضافي')}</a>` : '';
  return `<article class="work rv">
    <span class="num">${esc(w.num || arDigits(String(i + 1).padStart(2, '0')))}</span>
    <div class="work-inner">
      <div>
        <h3>${esc(w.title)}</h3>
        <div class="tagline">${esc(w.tagline)}</div>
        <p class="desc">${rich(w.desc)}</p>
        <div class="chips">${chips}</div>
        <div class="actions">
          <a class="btn btn-gold" href="${esc(w.url)}" target="_blank" rel="noopener">${esc(w.btn || 'زيارة الموقع')} ↗</a>
          ${extra}
          <span class="url">${esc(w.host || hostOf(w.url))}</span>
        </div>
      </div>
      <div class="thumb">
        <div class="glyph">${esc(w.glyph)}</div>
        <div class="dot"></div>
        <div class="t">${rich(w.caption)}</div>
      </div>
    </div>
  </article>`;
}

function renderWorks(list, mount) {
  if (!mount) return;
  mount.innerHTML = list && list.length
    ? list.map(renderWork).join('')
    : '<div class="empty">لا توجد أعمال بعد — أضِف عملًا من صفحة إدارة الموقع.</div>';
  observeReveal(mount);
}

function observeReveal(root) {
  const els = (root || document).querySelectorAll('.rv:not(.in)');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  els.forEach(el => io.observe(el));
}

/* غبار ذهبي خفيف — يعمل فقط إذا وُجدت لوحة الرسم */
function startDust() {
  const c = document.getElementById('dust');
  if (!c || !c.getContext) return;
  const x = c.getContext('2d');
  let W, H, ps = [];
  const size = () => { W = c.width = innerWidth; H = c.height = innerHeight; };
  addEventListener('resize', size); size();
  for (let i = 0; i < 46; i++) ps.push({
    x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + .4,
    dx: (Math.random() - .5) * .25, dy: (Math.random() - .5) * .25,
    col: i % 3 === 0 ? 'rgba(46,196,182,.35)' : 'rgba(235,209,151,.45)'
  });
  (function loop() {
    x.clearRect(0, 0, W, H);
    ps.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
      x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fillStyle = p.col; x.fill();
    });
    requestAnimationFrame(loop);
  })();
}
