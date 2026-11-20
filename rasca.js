/*
  RASCA Y GANA
  ------------
  Para cambiar el mensaje o la foto, edita solo las dos líneas de abajo.
*/
(function () {
  const MENSAJE = "Un bombó per a un altre bombó (us porto xocolatess)";
  const FOTO = "contingut/bombon.jpg";   // sube tu foto a la carpeta rasca/ del repositorio
  const UMBRAL = 0.5;                // al rascar esta fracción se destapa todo

  const css = `
  .rs { text-align: center; }
  .rs-hint { margin: 0 0 10px; font-weight: 700; color: #7a5848; }
  .rs-box {
    position: relative; width: 100%; aspect-ratio: 4 / 3;
    border-radius: 14px; overflow: hidden;
    background: linear-gradient(180deg, #fff7df, #f6e2b0);
    box-shadow: 0 0 0 3px var(--gold);
  }
  .rs-prize {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 6px; padding: 10px;
  }
  .rs-pic { flex: 1; min-height: 0; width: 100%; display: flex; align-items: center; justify-content: center; }
  .rs-pic img { display: block; max-width: 100%; max-height: 100%; object-fit: contain; }
  .rs-emoji { font-size: 5rem; line-height: 1; }
  .rs-msg {
    margin: 0; font-family: var(--script); font-weight: 700;
    font-size: 1.7rem; line-height: 1.1; color: var(--text);
  }
  .rs-cv {
    position: absolute; inset: 0; width: 100%; height: 100%;
    touch-action: none; cursor: grab; transition: opacity .6s ease;
  }
  .rs-cv.gone { opacity: 0; pointer-events: none; }
  .rs-box.won .rs-msg { animation: rsPop .7s cubic-bezier(.3, 1.6, .5, 1); }
  .rs-skip {
    margin-top: 10px; background: none; border: 0; cursor: pointer;
    font: 600 .85rem var(--sans); color: #a0786a; text-decoration: underline;
  }
  @keyframes rsPop { 0% { transform: scale(.6); opacity: 0; } 100% { transform: none; opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .rs-cv { transition: none; } }
  `;

  function injectCss() {
    if (document.getElementById('rs-css')) return;
    const s = document.createElement('style');
    s.id = 'rs-css';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function h(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function start(host) {
    host.innerHTML = '';
    const wrap = h('div', 'rs');
    const hint = h('p', 'rs-hint', 'Rasca amb el dit 👆');
    const box = h('div', 'rs-box');

    /* premio (debajo) */
    const prize = h('div', 'rs-prize');
    const pic = h('div', 'rs-pic');
    const img = new Image();
    img.alt = 'Un bombó';
    img.onerror = () => { pic.innerHTML = ''; pic.appendChild(h('span', 'rs-emoji', '🍫')); };
    img.src = FOTO;
    pic.appendChild(img);
    prize.append(pic, h('p', 'rs-msg', MENSAJE));

    /* capa plateada (encima) */
    const cv = h('canvas', 'rs-cv');
    box.append(prize, cv);

    const skip = h('button', 'rs-skip', 'Descobrir sense rascar');
    skip.type = 'button';
    wrap.append(hint, box, skip);
    host.appendChild(wrap);

    let ctx, W, H, done = false, drawing = false, last = null, lastCheck = 0;

    function pintarCapa() {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#b9bdc7');
      g.addColorStop(.35, '#eceef2');
      g.addColorStop(.6, '#c3c7d0');
      g.addColorStop(1, '#e4e6eb');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = .35;
      for (let k = 0; k < 160; k++) {
        ctx.fillStyle = Math.random() < .5 ? '#ffffff' : '#9aa0ad';
        ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#6f7685';
      ctx.font = '700 22px Quicksand, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨ Rasca aquí ✨', W / 2, H / 2);
    }

    function preparar() {
      if (!host.isConnected || done) return;
      W = box.offsetWidth; H = box.offsetHeight;
      if (!W || !H) { requestAnimationFrame(preparar); return; }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = W * dpr; cv.height = H * dpr;
      ctx = cv.getContext('2d', { willReadFrequently: true });
      ctx.scale(dpr, dpr);
      pintarCapa();
    }

    function pos(e) {
      const r = cv.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
    }

    function rascar(a, b) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = '#000';
      ctx.lineWidth = 36; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.beginPath(); ctx.arc(b.x, b.y, 18, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    function porcentaje() {
      const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
      let n = 0, t = 0;
      for (let k = 3; k < d.length; k += 64) { n++; if (d[k] < 128) t++; }
      return t / n;
    }

    function revisar() {
      if (!done && ctx && porcentaje() >= UMBRAL) descubrir();
    }

    function descubrir() {
      if (done) return;
      done = true;
      cv.classList.add('gone');
      box.classList.add('won');
      skip.hidden = true;
    }

    cv.addEventListener('pointerdown', (e) => {
      if (done || !ctx) return;
      drawing = true;
      cv.setPointerCapture(e.pointerId);
      last = pos(e);
      rascar(last, last);
    });
    cv.addEventListener('pointermove', (e) => {
      if (!drawing || done) return;
      const p = pos(e);
      rascar(last, p);
      last = p;
      const now = Date.now();
      if (now - lastCheck > 350) { lastCheck = now; revisar(); }
    });
    const soltar = () => { if (!drawing) return; drawing = false; revisar(); };
    cv.addEventListener('pointerup', soltar);
    cv.addEventListener('pointercancel', soltar);
    skip.addEventListener('click', descubrir);

    preparar();
  }

  /* app.js llama a esto cada vez que se abre una habitación */
  window.initRasca = function (root) {
    const host = root && root.querySelector('[data-rasca]');
    if (!host) return;
    injectCss();
    start(host);
  };
})();
