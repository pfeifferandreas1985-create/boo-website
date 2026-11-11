// Boo. – Website: Navigation, Einblenden, Lichtschein auf Karten, Gesicht zum Ausprobieren, Warteliste.
(() => {
  'use strict';
  const $ = (s, w = document) => w.querySelector(s);
  const $$ = (s, w = document) => [...w.querySelectorAll(s)];

  // Navigation: beim Scrollen mit Glas hinterlegt, auf dem Handy als Klappmenü
  const nav = $('.nav');
  const fest = () => nav && nav.classList.toggle('fest', scrollY > 24);
  addEventListener('scroll', fest, { passive: true });
  fest();
  const menue = $('.menue');
  if (menue) menue.addEventListener('click', () => {
    const offen = nav.classList.toggle('offen');
    menue.setAttribute('aria-expanded', offen);
  });
  $$('.nav ul a').forEach(a => a.addEventListener('click', () => nav.classList.remove('offen')));

  // Einblenden von unten, gestaffelt (wie .rein in der App)
  const io = 'IntersectionObserver' in window && new IntersectionObserver(eintraege => {
    for (const e of eintraege) if (e.isIntersecting) { e.target.classList.add('da'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.rein').forEach(el => io ? io.observe(el) : el.classList.add('da'));

  // Lichtschein folgt der Maus auf Karten
  $$('.karte.glimm').forEach(k => k.addEventListener('pointermove', e => {
    const r = k.getBoundingClientRect();
    k.style.setProperty('--mx', `${e.clientX - r.left}px`);
    k.style.setProperty('--my', `${e.clientY - r.top}px`);
  }));

  // Gesicht zum Ausprobieren: echtes Boo-Gesicht (boo_gesicht.js aus der App)
  const cv = $('#gesicht');
  if (cv && window.BooGesicht) {
    const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const g = new BooGesicht(cv, { farbe: '#3ff0ff', emotion: 'smile', idle: !ruhig, boot: !ruhig });
    window.__booGross = { g, el: cv };
    const buehne = cv.closest('.buehne');
    $$('[data-emotion]').forEach(b => b.addEventListener('click', () => {
      $$('[data-emotion]').forEach(x => x.classList.toggle('an', x === b));
      if (b.dataset.geste) g.geste(b.dataset.geste); else g.emotion(b.dataset.emotion);
      if (b.dataset.farbe) setzeFarbe(b.dataset.farbe);
    }));
    const setzeFarbe = f => {
      g.farbe(f);
      buehne.style.setProperty('--c', f);
      $$('.farben button').forEach(x => x.setAttribute('aria-pressed', x.dataset.f === f));
    };
    $$('.farben button').forEach(b => {
      b.style.setProperty('--f', b.dataset.f);
      b.addEventListener('click', () => setzeFarbe(b.dataset.f));
    });
  }

  // Kleine Boos in den Karten: erst anlegen, wenn sie ins Bild kommen
  const minis = [];
  const io2 = window.BooGesicht && 'IntersectionObserver' in window && new IntersectionObserver(eintraege => {
    for (const e of eintraege) if (e.isIntersecting) {
      io2.unobserve(e.target);
      const cv2 = $('canvas', e.target);
      const f = getComputedStyle(e.target).getPropertyValue('--c').trim() || '#3ff0ff';
      const g2 = new BooGesicht(cv2, { farbe: f, emotion: e.target.dataset.emo || 'smile', boot: false, grid: false });
      minis.push({ g: g2, el: cv2 });
    }
  }, { rootMargin: '0px 0px 10% 0px' });
  $$('.mini-boo').forEach(m => io2 && io2.observe(m));

  // Alle Gesichter schauen dem Mauszeiger nach; ohne Bewegung blicken sie nach kurzer Zeit wieder frei umher
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(pointer: fine)').matches) {
    addEventListener('pointermove', e => {
      const alle = minis.slice(); if (window.__booGross) alle.push(window.__booGross);
      const jetzt = performance.now();
      for (const { g: f, el } of alle) {
        const r = el.getBoundingClientRect(); if (!r.width) continue;
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy), s = Math.min(1, d / 420) / (d || 1);
        f.sac = { x: dx * s * 40, y: dy * s * 30 };
        f.nextSac = jetzt + 2500;
      }
    }, { passive: true });
  }

  // Warteliste: noch ohne Versanddienst – nichts wird gespeichert oder verschickt (siehe Hinweis im Formular)
  $$('form.eintragen').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const feld = $('input[type=email]', f);
    if (!feld.checkValidity()) { feld.reportValidity(); return; }
    const danke = f.parentElement.querySelector('.danke');
    if (danke) danke.classList.add('an');
    f.reset();
  }));

  // Sprachwahl: Klick daneben oder Escape schließt das Menü
  const sprache = $('.sprache');
  if (sprache) {
    addEventListener('click', e => { if (!sprache.contains(e.target)) sprache.open = false; });
    addEventListener('keydown', e => { if (e.key === 'Escape') sprache.open = false; });
  }

  // Jahr im Fuß
  $$('[data-jahr]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
