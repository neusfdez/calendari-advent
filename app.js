(() => {
  'use strict';

  /* =========================================================
     AJUSTES
     ========================================================= */
  const CONFIG = {
    year: 2026,   // año del calendario
    month: 11,    // 11 = diciembre (en JS los meses empiezan en 0)
  };

  const $ = (s) => document.querySelector(s);
  const SVGNS = 'http://www.w3.org/2000/svg';
  const KEY = 'adviento-' + CONFIG.year;

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* nada */ } },
  };

  const qs = new URLSearchParams(location.search);
  if (qs.has('reset')) ['-opened', '-opened-test', '-test'].forEach((s) => store.del(KEY + s));

  // Modo prueba: todas las ventanas se pueden abrir. Lo que abras en modo prueba
  // se guarda aparte, así no afecta a las ventanas "de verdad".
  let testMode = store.get(KEY + '-test', false);
  const openedReal = new Set(store.get(KEY + '-opened', []));
  let openedTest = new Set(store.get(KEY + '-opened-test', []));
  const openedSet = () => (testMode ? openedTest : openedReal);
  const saveOpened = () => {
    if (testMode) store.set(KEY + '-opened-test', [...openedTest]);
    else store.set(KEY + '-opened', [...openedReal]);
  };

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const unlockDate = (n) => new Date(CONFIG.year, CONFIG.month, n);
  const isUnlocked = (n) => testMode || new Date() >= unlockDate(n);
  const todayN = () => {
    const d = new Date();
    return d.getFullYear() === CONFIG.year && d.getMonth() === CONFIG.month ? d.getDate() : 0;
  };
  const daysUntil = (date) => Math.ceil((date - new Date()) / 864e5);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* =========================================================
     PINCEL: formas con bordes ligeramente irregulares
     ========================================================= */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  let rand = mulberry32(1);
  const seed = (s) => { rand = mulberry32(s); };
  const J = (r) => (rand() - 0.5) * 2 * r;
  const f = (n) => Math.round(n * 10) / 10;

  function el(tag, attrs, parent) {
    const e = document.createElementNS(SVGNS, tag);
    if (attrs) for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function crPath(pts, closed) {
    const n = pts.length;
    const P = closed ? [pts[n - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[n - 1]];
    let d = `M${f(P[1][0])} ${f(P[1][1])}`;
    for (let i = 1; i < P.length - 2; i++) {
      const p0 = P[i - 1], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2];
      d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ` +
        `${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d + (closed ? 'Z' : '');
  }
  const polyD = (pts) => 'M' + pts.map((q) => f(q[0]) + ' ' + f(q[1])).join('L') + 'Z';

  // mancha de color (sin contorno)
  function paint(parent, pts, fill, o = {}) {
    const { curved = false, jit = 0.5, extra } = o;
    const p = jit ? pts.map((q) => [q[0] + J(jit), q[1] + J(jit)]) : pts;
    return el('path', Object.assign({ d: curved ? crPath(p, true) : polyD(p), fill }, extra || {}), parent);
  }
  // trazo suave
  function stroke(parent, d, color, w = 1.5, extra) {
    return el('path', Object.assign({ d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, extra || {}), parent);
  }
  // pinceladas para dar textura de gouache
  function brush(parent, x, y, w, h, color, n, op = 0.18, sw = 3) {
    let d = '';
    for (let i = 0; i < n; i++) {
      const bx = x + rand() * w, by = y + rand() * h, len = 4 + rand() * 12;
      d += `M${f(bx)} ${f(by)}q${f(J(2))} ${f(len / 2)} ${f(J(1.5))} ${f(len)}`;
    }
    stroke(parent, d, color, sw, { opacity: op });
  }

  const rectPts = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  const circlePts = (cx, cy, rx, ry = rx, steps = 18) => {
    const a0 = rand() * Math.PI, pts = [];
    for (let i = 0; i < steps; i++) {
      const a = a0 + (i / steps) * Math.PI * 2;
      pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    }
    return pts;
  };
  const archPts = (x, y, w, h, steps = 14) => {
    const r = w / 2, cx = x + r, cy = y + r, pts = [[x, y + h]];
    for (let i = 0; i <= steps; i++) {
      const a = Math.PI + (Math.PI * i) / steps;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    pts.push([x + w, y + h]);
    return pts;
  };
  const starPts = (cx, cy, R, r = R * 0.42, k = 5) => {
    const pts = [];
    for (let i = 0; i < k * 2; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / k, rr = i % 2 ? r : R;
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
    }
    return pts;
  };
  const heartPts = (cx, cy, s) => {
    const pts = [];
    for (let i = 0; i < 24; i++) {
      const t = (i / 24) * Math.PI * 2;
      pts.push([cx + 16 * Math.pow(Math.sin(t), 3) * s, cy - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * s]);
    }
    return pts;
  };

  // nieve acumulada sobre un borde (lista de puntos de izquierda a derecha)
  function snowOn(parent, edge, thick = 8, drip = true) {
    const top = edge.map((p) => [p[0], p[1] - thick * (0.55 + rand() * 0.35)]);
    const bot = edge.slice().reverse().map((p) => [p[0], p[1] + (drip && rand() < 0.3 ? 2 + rand() * 4 : rand() * 1.5)]);
    paint(parent, top.concat(bot), '#fbfcff', { curved: true, jit: 0.3 });
    stroke(parent, crPath(edge.map((p) => [p[0], p[1] + 1.5]), false), '#cfdcea', 1.4, { opacity: 0.8 });
  }
  const hline = (x0, x1, y, step = 8) => {
    const pts = [];
    for (let x = x0; x <= x1 + 0.01; x += (x1 - x0) / Math.max(2, Math.round((x1 - x0) / step))) pts.push([x, y]);
    return pts;
  };
  const sline = (a, b, step = 9) => {
    const n = Math.max(2, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / step)), pts = [];
    for (let i = 0; i <= n; i++) pts.push([a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n]);
    return pts;
  };

  // lucecitas a lo largo de un camino
  function lightsAlong(parent, pts, every = 11, sag = 0) {
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(len / every));
      stroke(parent, `M${f(a[0])} ${f(a[1])}Q${f((a[0] + b[0]) / 2)} ${f((a[1] + b[1]) / 2 + sag)} ${f(b[0])} ${f(b[1])}`, '#3b2a1e', 0.8, { opacity: 0.6 });
      for (let k = 0; k < n; k++) {
        const t = (k + 0.5) / n;
        const x = (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * ((a[0] + b[0]) / 2) + t * t * b[0];
        const y = (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * ((a[1] + b[1]) / 2 + sag) + t * t * b[1];
        el('circle', { cx: f(x), cy: f(y + 1.5), r: 3.6, fill: '#ffe39a', opacity: 0.35 }, parent);
        el('circle', { cx: f(x), cy: f(y + 1.5), r: 1.7, fill: '#fff4c2', class: rand() < 0.35 ? 'bulb' : null, style: `animation-delay:${f(rand() * 2.4)}s` }, parent);
      }
    }
  }

  // guirnalda verde con bolitas
  function garland(parent, x0, x1, y, sag = 10, swags = 3) {
    const w = (x1 - x0) / swags;
    let d = '';
    for (let i = 0; i < swags; i++) d += `M${f(x0 + i * w)} ${f(y)}Q${f(x0 + i * w + w / 2)} ${f(y + sag * 2)} ${f(x0 + (i + 1) * w)} ${f(y)}`;
    stroke(parent, d, '#1f5a3e', 7);
    stroke(parent, d, '#2f7a52', 3.5, { 'stroke-dasharray': '2 4' });
    for (let i = 0; i < swags; i++) {
      for (let k = 1; k < 5; k++) {
        const t = k / 5, x = x0 + i * w + t * w, yy = y + 2 * sag * 2 * t * (1 - t);
        el('circle', { cx: f(x + J(1)), cy: f(yy + J(1.5)), r: 1.8, fill: k % 2 ? '#e0393a' : '#f2c75c' }, parent);
      }
    }
  }

  function wreath(parent, cx, cy, r) {
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      el('ellipse', { cx: f(cx + Math.cos(a) * r), cy: f(cy + Math.sin(a) * r), rx: f(r * 0.38), ry: f(r * 0.2), transform: `rotate(${f((a * 180) / Math.PI + 90)} ${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)})`, fill: i % 3 ? '#245f40' : '#3a8556' }, parent);
    }
    for (let i = 0; i < 9; i++) {
      const a = rand() * 6.28;
      el('circle', { cx: f(cx + Math.cos(a) * r), cy: f(cy + Math.sin(a) * r), r: f(r * 0.1 + 0.6), fill: '#e0393a' }, parent);
    }
    paint(parent, [[cx, cy + r * 0.9], [cx - r * 0.55, cy + r * 0.55], [cx - r * 0.5, cy + r * 1.25]], '#d23b38', { jit: 0.3 });
    paint(parent, [[cx, cy + r * 0.9], [cx + r * 0.55, cy + r * 0.55], [cx + r * 0.5, cy + r * 1.25]], '#d23b38', { jit: 0.3 });
    el('circle', { cx, cy: f(cy + r * 0.9), r: f(r * 0.14 + 0.6), fill: '#a92a2a' }, parent);
  }

  function pine(parent, x, base, h, o = {}) {
    const w = h * 0.62;
    paint(parent, rectPts(x - 4, base - 12, 8, 14), '#5a3b28');
    const tiers = 4;
    for (let k = 0; k < tiers; k++) {
      const top = base - h + (k * h * 0.2), bot = base - 10 - (tiers - 1 - k) * h * 0.17;
      const ww = w * (0.38 + k * 0.2);
      const pts = [[x, top]];
      const steps = 7;
      for (let i = 0; i <= steps; i++) pts.push([x + ww / 2 - (ww * i) / steps, bot + (i % 2 ? -4 : 2)]);
      paint(parent, pts, k % 2 ? '#2a6b47' : '#235c3d', { jit: 0.8 });
      brush(parent, x - ww * 0.3, top + 8, ww * 0.6, bot - top - 10, '#4f9a68', 6, 0.35, 2);
      if (o.snow) paint(parent, [[x, top], [x + ww * 0.12, top + 10], [x, top + 8], [x - ww * 0.12, top + 10]], '#fbfcff', { jit: 0.3 });
    }
    if (o.lights !== false) {
      for (let i = 0; i < Math.round(h / 5); i++) {
        const t = 0.15 + rand() * 0.8, yy = base - h + t * (h - 12), half = (w * (0.15 + t * 0.85)) / 2 - 4;
        const col = ['#e0393a', '#ffe08a', '#f2c75c', '#fdf6e3'][i % 4];
        el('circle', { cx: f(x + J(half)), cy: f(yy), r: col === '#ffe08a' ? 1.9 : 2.3, fill: col, class: col === '#ffe08a' ? 'bulb' : null, style: `animation-delay:${f(rand() * 2)}s` }, parent);
      }
    }
    if (o.star) {
      el('circle', { cx: x, cy: base - h - 2, r: 12, fill: 'url(#warmGlow)' }, parent);
      paint(parent, starPts(x, base - h - 2, 9), 'url(#gold)', { jit: 0.2, extra: { class: 'twinkle' } });
    }
  }

  function lampPost(parent, x, base) {
    paint(parent, rectPts(x - 2.2, base - 128, 4.4, 128), '#22252e', { jit: 0.2 });
    paint(parent, rectPts(x - 6, base - 8, 12, 8), '#22252e', { jit: 0.2 });
    el('circle', { cx: x, cy: base - 138, r: 30, fill: 'url(#warmGlow)', class: 'lamp' }, parent);
    paint(parent, [[x - 8, base - 128], [x + 8, base - 128], [x + 10, base - 148], [x - 10, base - 148]], '#ffe7a3', { jit: 0.2 });
    paint(parent, [[x - 13, base - 147], [x + 13, base - 147], [x, base - 158]], '#22252e', { jit: 0.2 });
    paint(parent, rectPts(x - 10, base - 130, 20, 3), '#22252e', { jit: 0.1 });
    paint(parent, [[x - 13, base - 149], [x + 13, base - 149], [x + 6, base - 156], [x - 6, base - 156]], '#fbfcff', { curved: true, jit: 0.3 });
  }

  /* =========================================================
     COLORES (inspirados en la ilustración)
     ========================================================= */
  const H = {
    blue: { wall: '#3d7d92', dark: '#2c5f71', light: '#5899ae' },
    red: { wall: '#c9342d', dark: '#9c2420', light: '#de5045' },
    pink: { wall: '#ec8f96', dark: '#d16f79', light: '#f6aab0' },
    mint: { wall: '#79c4ab', dark: '#57a48b', light: '#97d5bf' },
    crimson: { wall: '#a7203d', dark: '#7f172e', light: '#c03556' },
  };
  const TEAL = '#2b7880', TEAL_D = '#1f5d63', CREAM = '#f7efe2', GOLD = '#e5b34a', SNOW = '#fbfcff';
  const CURTAINS = ['#f3e2c4', '#f1bdb2', '#cfe6df', '#f4d792', '#e8c6dd'];

  /* =========================================================
     LAS 24 VENTANAS
     ========================================================= */
  const OPENINGS = [
    // casa azul
    { type: 'round', cx: 119, cy: 262, r: 19 },
    { type: 'arch', x: 46, y: 340, w: 34, h: 54 },
    { type: 'arch', x: 102, y: 340, w: 34, h: 54 },
    { type: 'arch', x: 158, y: 340, w: 34, h: 54 },
    { type: 'door', x: 142, y: 530, w: 48, h: 120, color: '#c9342d' },
    // casa roja (juguetería)
    { type: 'rect', x: 239, y: 282, w: 32, h: 46 },
    { type: 'rect', x: 289, y: 282, w: 32, h: 46 },
    { type: 'rect', x: 339, y: 282, w: 32, h: 46 },
    { type: 'arch', x: 238, y: 352, w: 34, h: 68 },
    { type: 'arch', x: 288, y: 352, w: 34, h: 68 },
    { type: 'arch', x: 338, y: 352, w: 34, h: 68 },
    // casa rosa
    { type: 'round', cx: 491, cy: 230, r: 17 },
    { type: 'arch', x: 419, y: 318, w: 34, h: 58 },
    { type: 'arch', x: 474, y: 318, w: 34, h: 58 },
    { type: 'arch', x: 529, y: 318, w: 34, h: 58 },
    { type: 'door', x: 506, y: 530, w: 48, h: 120, color: '#c9342d' },
    // casa menta
    { type: 'rect', x: 661, y: 238, w: 30, h: 36 },
    { type: 'rect', x: 604, y: 330, w: 36, h: 54 },
    { type: 'rect', x: 712, y: 330, w: 36, h: 54 },
    { type: 'door', x: 712, y: 530, w: 44, h: 120, color: '#3d7d92' },
    // casa granate
    { type: 'round', cx: 871, cy: 240, r: 19 },
    { type: 'arch', x: 794, y: 352, w: 34, h: 60 },
    { type: 'arch', x: 914, y: 352, w: 34, h: 60 },
    { type: 'door', x: 896, y: 530, w: 48, h: 120, color: '#1f5d63' },
  ];
  // qué día es cada hueco (la puerta de la casa rosa es el 24)
  const DAY_OF = [6, 14, 3, 19, 11, 1, 22, 8, 16, 4, 20, 9, 13, 2, 17, 24, 23, 10, 5, 21, 7, 15, 12, 18];
  // ventanas decorativas (siempre encendidas, no se tocan)
  const DECO = [
    { type: 'rect', x: 658, y: 330, w: 36, h: 54 },
    { type: 'arch', x: 854, y: 352, w: 34, h: 60 },
  ];
  const groups = {};

  /* =========================================================
     DIBUJAR LA CALLE
     ========================================================= */
  function buildStreet() {
    const svg = $('#house');
    svg.setAttribute('viewBox', '0 0 1000 800');
    svg.setAttribute('preserveAspectRatio', 'xMidYMax meet');

    const defs = el('defs', null, svg);
    const grad = (id, stops, attrs = {}, tag = 'linearGradient') => {
      const g = el(tag, Object.assign({ id }, attrs), defs);
      stops.forEach(([o, c, op]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': op == null ? 1 : op }, g));
    };
    grad('sky', [[0, '#121a3d'], [0.55, '#1c2858'], [1, '#26366e']], { x1: 0, y1: 0, x2: 0, y2: 1 });
    grad('warmGlow', [[0, '#fff1b8', 0.9], [0.4, '#ffc75a', 0.45], [1, '#ff9a3c', 0]], {}, 'radialGradient');
    grad('winLight', [[0, '#fff4c4'], [0.55, '#ffd36e'], [1, '#f7a74c']], { x1: 0, y1: 0, x2: 0, y2: 1 });
    grad('gold', [[0, '#fbe39a'], [0.5, '#e5b34a'], [1, '#c58f2a']], { x1: 0, y1: 0, x2: 1, y2: 1 });
    grad('moonGlow', [[0, '#ffe7a6', 0.35], [1, '#ffe7a6', 0]], {}, 'radialGradient');
    grad('road', [[0, '#d3e1ec'], [1, '#b9cddd']], { x1: 0, y1: 0, x2: 0, y2: 1 });
    grad('beam', [[0, '#fff3c4', 0.55], [1, '#fff3c4', 0]], { x1: 0, y1: 0, x2: 1, y2: 0 });

    drawSky(el('g', { 'pointer-events': 'none' }, svg));
    drawBackTrees(el('g', { 'pointer-events': 'none' }, svg));
    const houses = el('g', null, svg);
    drawBlue(houses); drawRed(houses); drawPink(houses); drawMint(houses); drawCrimson(houses);
    const deco = el('g', { 'pointer-events': 'none' }, svg);
    DECO.forEach((o, i) => drawWindow(deco, o, 0, 200 + i, true));
    const openLayer = el('g', null, svg);
    OPENINGS.forEach((o, i) => drawWindow(openLayer, o, DAY_OF[i], i, false));
    drawStreetFront(el('g', { 'pointer-events': 'none' }, svg));
    addGrain(svg);
  }

  function drawSky(g) {
    seed(5);
    el('rect', { x: -1500, y: -400, width: 4000, height: 1100, fill: 'url(#sky)' }, g);
    // confeti de colores
    const conf = ['#4fb3b0', '#7f6bb8', '#9fd6e0', '#c9b6e8', '#ffffff'];
    for (let i = 0; i < 260; i++) {
      const x = -900 + rand() * 2800, y = -200 + rand() * 640, s = 1 + rand() * 2.6;
      paint(g, [[x, y], [x + s, y + J(1)], [x + s + J(1), y + s], [x + J(1), y + s * 0.8]], conf[i % conf.length], { jit: 0.3, extra: { opacity: f(0.35 + rand() * 0.5) } });
    }
    // remolinos de viento
    const swirl = (x, y, w, dir) => {
      const d = `M${x} ${y}c${w * 0.25} ${-30 * dir} ${w * 0.55} ${30 * dir} ${w * 0.8} ${-4 * dir}` +
        `c${w * 0.12} ${-10 * dir} ${w * 0.1} ${-30 * dir} ${-w * 0.02} ${-30 * dir}c${-w * 0.08} 0 ${-w * 0.1} ${14 * dir} ${-w * 0.02} ${18 * dir}`;
      stroke(g, d, '#dfe9f7', 5, { opacity: 0.22 });
      stroke(g, d, '#ffffff', 1.6, { opacity: 0.55 });
      for (let k = 0; k < 10; k++) {
        el('circle', { cx: f(x + rand() * w), cy: f(y + J(22)), r: f(0.8 + rand() * 1.4), fill: '#f6d47b', opacity: 0.8 }, g);
      }
    };
    swirl(60, 130, 320, 1); swirl(560, 100, 260, -1); swirl(-500, 140, 300, 1); swirl(1150, 120, 300, -1);
    // estrellas doradas
    for (let i = 0; i < 120; i++) {
      const x = -900 + rand() * 2800, y = -150 + rand() * 430, R = 3 + rand() * rand() * 12;
      paint(g, starPts(x, y, R, R * 0.4, rand() < 0.3 ? 4 : 5), 'url(#gold)', { jit: R * 0.06, extra: { class: rand() < 0.5 ? 'twinkle' : null, style: `animation-delay:${f(rand() * 3)}s` } });
    }
    // luna dorada
    el('circle', { cx: 900, cy: 92, r: 110, fill: 'url(#moonGlow)' }, g);
    paint(g, circlePts(900, 92, 44, 44, 26), 'url(#gold)', { curved: true, jit: 0.6 });
    for (let i = 0; i < 16; i++) {
      const a = rand() * 6.28, rr = rand() * 34;
      paint(g, circlePts(900 + Math.cos(a) * rr, 92 + Math.sin(a) * rr, 3 + rand() * 7, 2 + rand() * 5, 9), rand() < 0.5 ? '#c98f2c' : '#fbe7a6', { curved: true, jit: 0.8, extra: { opacity: 0.55 } });
    }
  }

  function drawBackTrees(g) {
    seed(9);
    for (let x = -700; x < 1700; x += 34 + rand() * 30) {
      const h = 170 + rand() * 170, base = 660;
      paint(g, [[x, base - h], [x + h * 0.22, base], [x - h * 0.22, base]], rand() < 0.5 ? '#1b2f55' : '#1f375e', { jit: 2 });
    }
    // suelo nevado al fondo
    el('rect', { x: -1500, y: 640, width: 4000, height: 400, fill: '#eef3f8' }, g);
  }

  /* ---------- casas ---------- */
  function wall(g, c, x, y, w, h) {
    paint(g, rectPts(x, y, w, h), c.wall, { jit: 0.4 });
    brush(g, x, y, w, h, c.light, Math.round((w * h) / 380), 0.22, 3);
    brush(g, x, y, w, h, c.dark, Math.round((w * h) / 900), 0.18, 2.5);
  }
  function band(g, x, y, w, h, color) { paint(g, rectPts(x, y, w, h), color, { jit: 0.3 }); }
  function sign(g, x, y, w, h, bg, text, font, color, size) {
    if (bg) paint(g, rectPts(x, y, w, h), bg, { jit: 0.3 });
    const t = el('text', { x: f(x + w / 2), y: f(y + h / 2), 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-family': font, 'font-size': size, 'font-weight': 700, fill: color, 'letter-spacing': font.includes('Playfair') ? (text.length > 12 ? 0.8 : 2) : 0 }, g);
    t.textContent = text;
  }
  function shopWindow(g, x, y, w, h, kind) {
    el('circle', { cx: f(x + w / 2), cy: f(y + h / 2), r: f(Math.max(w, h) * 0.75), fill: 'url(#warmGlow)', opacity: 0.55 }, g);
    paint(g, rectPts(x - 4, y - 4, w + 8, h + 8), CREAM, { jit: 0.3 });
    paint(g, rectPts(x, y, w, h), 'url(#winLight)', { jit: 0.2 });
    const cx = x + w / 2, by = y + h;
    if (kind === 'tree') pine(g, cx, by - 6, h * 0.7, { star: true });
    if (kind === 'toys') {
      // osito y cascanueces
      paint(g, circlePts(cx - 12, by - 22, 12, 13), '#a8693e', { curved: true });
      paint(g, circlePts(cx - 12, by - 42, 9), '#a8693e', { curved: true });
      paint(g, circlePts(cx - 19, by - 50, 3.5), '#a8693e', { curved: true });
      paint(g, circlePts(cx - 5, by - 50, 3.5), '#a8693e', { curved: true });
      paint(g, rectPts(cx + 8, by - 52, 14, 46), '#c9342d');
      paint(g, rectPts(cx + 9, by - 66, 12, 14), '#f2cfa8');
      paint(g, rectPts(cx + 8, by - 78, 14, 12), '#1f2235');
      paint(g, rectPts(cx + 8, by - 30, 14, 4), GOLD);
      paint(g, rectPts(cx - 30, by - 12, 18, 12), '#3d7d92');
    }
    if (kind === 'sweets') {
      [[-22, '#e0393a'], [-2, '#79c4ab'], [18, '#f2c75c']].forEach(([dx, col], i) => {
        paint(g, rectPts(cx + dx - 8, by - 38 - i * 4, 16, 30 + i * 4), 'rgba(255,255,255,.55)');
        for (let k = 0; k < 6; k++) el('circle', { cx: f(cx + dx + J(5)), cy: f(by - 12 - rand() * 20), r: 2.6, fill: col }, g);
      });
      stroke(g, `M${f(cx - 26)} ${f(y + 14)}q4 -8 8 0v20`, '#e0393a', 4);
    }
    if (kind === 'cakes') {
      [[-24, 14], [2, 18], [26, 12]].forEach(([dx, s]) => {
        paint(g, rectPts(cx + dx - s / 2, by - 8 - s, s, s), '#f4d0a0');
        paint(g, rectPts(cx + dx - s / 2 - 1, by - 10 - s, s + 2, 5), '#fbfcff', { jit: 0.4 });
        el('circle', { cx: f(cx + dx), cy: f(by - 13 - s), r: 2, fill: '#e0393a' }, g);
        paint(g, rectPts(cx + dx - s / 2 - 3, by - 8, s + 6, 2.5), '#c9b28a');
      });
    }
    if (kind === 'gifts') {
      [[-18, 22, '#a7203d'], [6, 16, '#2b7880'], [24, 12, GOLD]].forEach(([dx, s, col]) => {
        paint(g, rectPts(cx + dx - s / 2, by - s - 2, s, s), col);
        paint(g, rectPts(cx + dx - 1.5, by - s - 2, 3, s), '#fbe7a6');
      });
      for (let k = 0; k < 8; k++) paint(g, starPts(x + 6 + rand() * (w - 12), y + 8 + rand() * (h * 0.5), 2.5 + rand() * 2), '#fff8dc', { jit: 0.1 });
    }
    // marco y travesaño
    stroke(g, `M${f(x)} ${f(y + h * 0.3)}H${f(x + w)}M${f(cx)} ${f(y)}V${f(y + h * 0.3)}`, CREAM, 2.5);
    snowOn(g, hline(x - 6, x + w + 6, y + h + 4), 5, false);
  }
  function awning(g, x, y, w, h, c1, c2) {
    const n = Math.max(4, Math.round(w / 13));
    for (let i = 0; i < n; i++) {
      const sx = x + (w * i) / n, sw = w / n;
      paint(g, [[sx, y], [sx + sw, y], [sx + sw + 1, y + h], [sx + sw / 2, y + h + 6], [sx - 1, y + h]], i % 2 ? c2 : c1, { jit: 0.25 });
    }
    snowOn(g, hline(x - 2, x + w + 2, y), 5, false);
  }

  function drawBlue(g) {
    seed(21); const c = H.blue;
    wall(g, c, 24, 300, 190, 350);
    // hastial
    paint(g, [[24, 302], [119, 202], [214, 302]], c.wall, { jit: 0.4 });
    brush(g, 60, 230, 118, 70, c.light, 18, 0.2);
    // entramado
    stroke(g, 'M40 300L119 220L198 300M119 220V300M60 300V280M178 300V280', c.dark, 3, { opacity: 0.5 });
    // tejado nevado
    paint(g, [[6, 314], [119, 186], [232, 314], [216, 318], [119, 206], [22, 318]], SNOW, { jit: 0.6 });
    stroke(g, 'M22 318L119 206L216 318', '#cfdcea', 2, { opacity: 0.8 });
    lightsAlong(g, [[24, 322], [119, 214], [214, 322]], 10, 4);
    // banda decorativa con festón
    band(g, 24, 412, 190, 14, c.dark);
    let d = 'M24 426'; for (let x = 24; x < 214; x += 12) d += 'q6 9 12 0'; stroke(g, d, CREAM, 2, { opacity: 0.7 });
    band(g, 24, 452, 190, 8, CREAM);
    // tienda
    sign(g, 34, 466, 170, 30, null, 'Bon Nadal', "'Dancing Script', cursive", CREAM, 25);
    shopWindow(g, 38, 514, 86, 122, 'tree');
  }

  function drawRed(g) {
    seed(33); const c = H.red;
    wall(g, c, 214, 196, 182, 454);
    band(g, 208, 192, 194, 22, TEAL);
    band(g, 214, 214, 182, 6, TEAL_D);
    snowOn(g, hline(204, 406, 192), 10);
    lightsAlong(g, [[216, 224], [305, 232], [394, 224]], 10, 6);
    wreath(g, 305, 253, 15);
    // cornisas entre pisos
    band(g, 214, 336, 182, 7, c.dark);
    band(g, 214, 428, 182, 6, CREAM);
    sign(g, 228, 436, 154, 26, '#7c1c1a', 'CASA MARY', "'Playfair Display', serif", '#f6d47b', 16);
    awning(g, 222, 470, 80, 24, '#c9342d', CREAM);
    awning(g, 308, 470, 80, 24, '#c9342d', CREAM);
    shopWindow(g, 226, 504, 74, 132, 'toys');
    shopWindow(g, 312, 504, 74, 132, 'gifts');
  }

  function drawPink(g) {
    seed(45); const c = H.pink;
    const gable = [[396, 304], [397, 282], [424, 270], [446, 264], [451, 238], [465, 214], [480, 198], [491, 192], [502, 198], [517, 214], [531, 238], [536, 264], [558, 270], [585, 282], [586, 304]];
    stroke(g, crPath(gable, false), TEAL, 9);
    paint(g, gable.concat([[586, 320], [396, 320]]), c.wall, { curved: false, jit: 0.3 });
    wall(g, c, 396, 300, 190, 350);
    brush(g, 450, 210, 82, 90, c.light, 20, 0.22);
    lightsAlong(g, gable.filter((p, i) => i % 2 === 0), 10, 3);
    paint(g, circlePts(491, 178, 8), TEAL, { curved: true });
    paint(g, circlePts(491, 166, 3.5), GOLD, { curved: true });
    snowOn(g, [[398, 284], [424, 272], [446, 266]], 6);
    snowOn(g, [[536, 266], [558, 272], [584, 284]], 6);
    // banderines
    const flags = (y, x0, x1) => {
      stroke(g, `M${x0} ${y}Q${(x0 + x1) / 2} ${y + 14} ${x1} ${y}`, '#7a4a3a', 1, { opacity: 0.7 });
      const n = 10;
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n, x = x0 + (x1 - x0) * t, yy = y + 28 * t * (1 - t);
        paint(g, [[x - 5, yy], [x + 5, yy], [x, yy + 10]], ['#f2c75c', '#2b7880', '#c9342d', '#fbfcff'][i % 4], { jit: 0.2 });
      }
    };
    flags(296, 400, 582); flags(392, 400, 582);
    band(g, 396, 446, 190, 8, CREAM);
    sign(g, 408, 464, 166, 28, TEAL, 'SUNRISE CAFÉ', "'Playfair Display', serif", CREAM, 12);
    shopWindow(g, 410, 506, 80, 130, 'sweets');
    garland(g, 404, 578, 456, 5, 4);
  }

  function drawMint(g) {
    seed(57); const c = H.mint;
    wall(g, c, 586, 296, 180, 354);
    // tejado abuhardillado nevado
    paint(g, [[578, 304], [598, 232], [754, 232], [774, 304]], '#f6eef2', { jit: 0.5 });
    brush(g, 600, 240, 150, 60, '#d9c8d6', 22, 0.4, 3);
    stroke(g, 'M578 304H774', '#cfdcea', 3);
    // buhardilla
    wall(g, c, 650, 220, 52, 74);
    paint(g, [[642, 228], [676, 190], [710, 228], [700, 232], [676, 206], [652, 232]], SNOW, { jit: 0.4 });
    paint(g, [[652, 228], [676, 204], [700, 228]], '#2b7880', { jit: 0.3 });
    lightsAlong(g, [[586, 306], [676, 312], [766, 306]], 10, 6);
    band(g, 586, 404, 180, 7, c.dark);
    band(g, 586, 452, 180, 8, CREAM);
    awning(g, 594, 470, 164, 26, '#f2a7b5', CREAM);
    shopWindow(g, 598, 508, 100, 128, 'cakes');
    sign(g, 594, 404 + 14, 164, 26, null, 'CASA ERIC', "'Dancing Script', cursive", '#1f5d63', 24);
  }

  function drawCrimson(g) {
    seed(69); const c = H.crimson;
    wall(g, c, 766, 318, 210, 332);
    paint(g, [[766, 322], [871, 172], [976, 322]], c.wall, { jit: 0.4 });
    brush(g, 800, 220, 140, 100, c.light, 26, 0.2);
    stroke(g, 'M758 330L871 166L984 330', TEAL, 10);
    stroke(g, 'M760 328L871 170L982 328', TEAL_D, 3, { opacity: 0.6 });
    lightsAlong(g, [[760, 334], [871, 176], [982, 334]], 10, 0);
    snowOn(g, [[855, 190], [863, 180], [871, 170], [879, 180], [887, 190]], 7);
    // entramado
    stroke(g, 'M766 330H976M800 330V440M942 330V440M766 440H976', c.dark, 3, { opacity: 0.45 });
    band(g, 766, 446, 210, 8, CREAM);
    sign(g, 776, 462, 190, 32, null, 'OCINE', "'Dancing Script', cursive", '#f6d47b', 25);
    garland(g, 772, 970, 500, 6, 4);
    shopWindow(g, 782, 512, 96, 124, 'gifts');
  }

  /* ---------- una ventana / puerta ---------- */
  function drawWindow(layer, o, day, idx, deco) {
    seed(300 + idx * 17);
    const g = el('g', deco ? null : { class: 'opening', 'data-day': day, tabindex: 0, role: 'button', 'aria-label': `Día ${day}` }, layer);
    let frame, glass, cx, cy, bw, bh, sillY = null, badgeY, badgeR, curved = false;

    if (o.type === 'rect') {
      cx = o.x + o.w / 2; cy = o.y + o.h / 2; bw = o.w; bh = o.h;
      frame = rectPts(o.x - 4, o.y - 4, o.w + 8, o.h + 8); glass = rectPts(o.x, o.y, o.w, o.h);
      sillY = o.y + o.h + 4; badgeR = Math.min(11, o.w * 0.33); badgeY = cy;
    } else if (o.type === 'arch') {
      cx = o.x + o.w / 2; cy = o.y + o.h / 2 + o.w * 0.12; bw = o.w; bh = o.h;
      frame = archPts(o.x - 4, o.y - 4, o.w + 8, o.h + 8); glass = archPts(o.x, o.y, o.w, o.h);
      sillY = o.y + o.h + 4; badgeR = 11; badgeY = cy + 4;
    } else if (o.type === 'round') {
      cx = o.cx; cy = o.cy; bw = bh = o.r * 2; curved = true;
      frame = circlePts(cx, cy, o.r + 4.5, o.r + 4.5, 22); glass = circlePts(cx, cy, o.r, o.r, 22);
      badgeR = 10.5; badgeY = cy;
    } else if (o.type === 'door') {
      cx = o.x + o.w / 2; cy = o.y + o.h / 2; bw = o.w; bh = o.h;
      frame = archPts(o.x - 6, o.y - 6, o.w + 12, o.h + 6); glass = archPts(o.x, o.y, o.w, o.h);
      badgeR = 13; badgeY = o.y + o.h * 0.6;
    }

    el('circle', { class: 'glow', cx: f(cx), cy: f(cy), r: f(Math.max(bw, bh) * 1.1 + 12), fill: 'url(#warmGlow)', opacity: deco ? 0.7 : null }, g);
    paint(g, frame, CREAM, { curved, jit: 0.3 });
    paint(g, glass, '#28365f', { curved, jit: 0 });

    // interior encendido
    const light = el('g', { class: 'light', opacity: deco ? 1 : null }, g);
    paint(light, glass, 'url(#winLight)', { curved, jit: 0 });
    const inside = (idx % 5);
    if (o.type === 'door') {
      pine(light, cx, o.y + o.h - 8, 56, { star: true, lights: true });
    } else if (bh > 40) {
      const by = (o.type === 'round' ? cy + o.r : o.y + o.h) - 3;
      if (inside === 0) pine(light, cx, by, bh * 0.55, { lights: false });
      else if (inside === 1) { paint(light, starPts(cx, o.y + bh * 0.3, 5), GOLD, { jit: 0.1 }); paint(light, rectPts(cx - 3, by - 14, 6, 14), CREAM); paint(light, [[cx - 2, by - 14], [cx, by - 21], [cx + 2, by - 14]], '#f08a2c'); }
      else if (inside === 2) { stroke(light, `M${f(o.x)} ${f(o.y + 10)}q${f(bw / 2)} 12 ${f(bw)} 0`, '#2f7a52', 3.5); el('circle', { cx: f(cx), cy: f(o.y + 16), r: 2, fill: '#e0393a' }, light); }
      else if (inside === 3) paint(light, heartPts(cx, o.y + bh * 0.45, 0.45), '#e05a4f', { curved: true, jit: 0.2 });
      else { for (let k = 0; k < 3; k++) { const yy = o.y + 12 + k * 12; stroke(light, `M${f(cx)} ${f(yy - 6)}V${f(yy)}`, '#7a4a3a', 0.8); el('circle', { cx: f(cx + J(4)), cy: f(yy + 3), r: 3, fill: ['#e0393a', GOLD, '#2b7880'][k] }, light); } }
    }
    if (deco) { paint(light, rectPts(cx - bw / 2, (o.y || cy) , bw * 0.18, bh * 0.75), '#f1bdb2', { jit: 0.2 }); paint(light, rectPts(cx + bw / 2 - bw * 0.18, (o.y || cy), bw * 0.18, bh * 0.75), '#f1bdb2', { jit: 0.2 }); }

    // parteluces
    if (o.type === 'rect') stroke(g, `M${f(cx)} ${f(o.y)}V${f(o.y + o.h)}M${f(o.x)} ${f(o.y + o.h * 0.45)}H${f(o.x + o.w)}`, CREAM, 2);
    if (o.type === 'arch') stroke(g, `M${f(cx)} ${f(o.y)}V${f(o.y + o.h)}M${f(o.x)} ${f(o.y + o.w / 2 + 4)}H${f(o.x + o.w)}`, CREAM, 2);
    if (o.type === 'round') stroke(g, `M${f(cx - o.r)} ${f(cy)}H${f(cx + o.r)}M${f(cx)} ${f(cy - o.r)}V${f(cy + o.r)}`, CREAM, 2);

    if (!deco) {
      // cortinas (ventanas) o puerta
      if (o.type === 'door') {
        const pg = el('g', { class: 'panel' }, g);
        paint(pg, glass, o.color, { jit: 0 });
        brush(pg, o.x, o.y, o.w, o.h, '#ffffff', 10, 0.08, 3);
        stroke(pg, polyD(rectPts(o.x + 7, o.y + 44, o.w - 14, 28)) + polyD(rectPts(o.x + 7, o.y + 80, o.w - 14, 32)), 'rgba(0,0,0,.25)', 1.4);
        wreath(pg, cx, o.y + 26, 11);
        el('circle', { cx: f(o.x + o.w - 7), cy: f(o.y + 76), r: 2.6, fill: GOLD }, pg);
      } else {
        const cid = `clip-${idx}`;
        const cp = el('clipPath', { id: cid }, g);
        paint(cp, glass, '#000', { curved, jit: 0 });
        const cg = el('g', { 'clip-path': `url(#${cid})` }, g);
        const col = CURTAINS[idx % CURTAINS.length];
        const x0 = cx - bw / 2 - 1, y0 = cy - bh / 2 - 2, half = bw / 2 + 1;
        ['l', 'r'].forEach((side) => {
          const cg2 = el('g', { class: 'curtain ' + side }, cg);
          const sx = side === 'l' ? x0 : cx;
          paint(cg2, rectPts(sx, y0, half, bh + 6), col, { jit: 0 });
          let d = '';
          for (let k = 1; k < 4; k++) d += `M${f(sx + (half * k) / 4)} ${f(y0)}v${f(bh + 6)}`;
          stroke(cg2, d, 'rgba(90,40,30,.18)', 1.6);
          paint(cg2, rectPts(sx, y0 + bh * 0.62, half, 3), 'rgba(90,40,30,.15)', { jit: 0 });
        });
      }
    }

    // alféizar con nieve
    if (sillY) {
      paint(g, rectPts(cx - bw / 2 - 7, sillY, bw + 14, 5), CREAM, { jit: 0.3 });
      snowOn(g, hline(cx - bw / 2 - 7, cx + bw / 2 + 7, sillY), 5, true);
    }
    if (deco) return;

    // número
    const badge = el('g', { class: 'badge' }, g);
    let by = 0;
    if (sillY) by = sillY + 2 - badgeY;
    else if (o.type === 'round') by = o.r + 5;
    badge.style.setProperty('--by', f(by) + 'px');
    el('circle', { cx: f(cx), cy: f(badgeY + 1.2), r: badgeR, fill: 'rgba(40,20,10,.25)' }, badge);
    paint(badge, circlePts(cx, badgeY, badgeR, badgeR, 14), 'url(#gold)', { curved: true, jit: 0.2 });
    const t = el('text', {
      x: f(cx), y: f(badgeY), 'text-anchor': 'middle', 'dominant-baseline': 'central',
      'font-family': "'Playfair Display', Georgia, serif", 'font-weight': 800,
      'font-size': f(badgeR * 1.15), fill: '#5a1a1a', dy: '.02em',
    }, badge);
    t.textContent = day;

    const xs = frame.map((q) => q[0]), ys = frame.map((q) => q[1]);
    const pad = 6;
    el('rect', {
      class: 'hit', x: f(Math.min(...xs) - pad), y: f(Math.min(...ys) - pad),
      width: f(Math.max(...xs) - Math.min(...xs) + pad * 2), height: f(Math.max(...ys) - Math.min(...ys) + pad * 2 + (sillY ? 6 : 0)),
      fill: '#000', 'fill-opacity': 0, rx: 6,
    }, g);

    g.addEventListener('click', () => tap(day));
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(day); } });
    groups[day] = g;
  }

  function drawStreetFront(g) {
    seed(81);
    // nieve amontonada al pie de las casas
    const drift = [];
    for (let x = -1500; x <= 2500; x += 18) drift.push([x, 652 + J(3)]);
    const top = drift.map((p) => [p[0], p[1] - 6 - rand() * 6]);
    paint(g, top.concat([[2500, 712], [-1500, 712]]), '#f4f8fb', { curved: false, jit: 0 });
    stroke(g, crPath(top.filter((p) => p[0] > -100 && p[0] < 1100), false), '#d5e1ec', 1.4);
    // calzada
    el('rect', { x: -1500, y: 708, width: 4000, height: 200, fill: 'url(#road)' }, g);
    stroke(g, 'M-1500 708H2500', '#e9f0f6', 5);
    for (let x = -1500; x < 2500; x += 90) stroke(g, `M${x} 760h40`, '#eef4f8', 3, { opacity: 0.8 });
    stroke(g, 'M-1500 738C200 734 700 742 2500 736M-1500 784C300 780 800 790 2500 782', '#a9bfd1', 2, { opacity: 0.5 });

    // regalos, árboles, farolas, buzón
    const gift = (x, y, w, h, col, rib) => { paint(g, rectPts(x, y, w, h), col); paint(g, rectPts(x + w / 2 - 1.5, y, 3, h), rib); paint(g, rectPts(x, y + h / 2 - 1.5, w, 3), rib); };
    pine(g, 6, 700, 150, { star: true, snow: true });
    pine(g, 400, 702, 140, { star: true, snow: true });
    pine(g, 800, 704, 160, { star: true, snow: true });
    pine(g, 1000, 700, 140, { star: true, snow: true });
    gift(372, 686, 16, 14, '#e8a5b6', '#fbfcff'); gift(420, 690, 12, 11, GOLD, '#c9342d');
    gift(826, 688, 18, 14, '#c9342d', '#f6d47b'); gift(772, 692, 12, 10, '#79c4ab', '#fbfcff');
    gift(130, 692, 14, 11, '#e8a5b6', '#c9342d');
    lampPost(g, 30, 702); lampPost(g, 352, 702); lampPost(g, 580, 702); lampPost(g, 960, 702);
    // buzón rojo
    paint(g, rectPts(600, 640, 26, 56), '#c9342d'); paint(g, archPts(598, 626, 30, 30), '#c9342d', { jit: 0 });
    paint(g, rectPts(596, 694, 34, 6), '#8e2420');
    paint(g, rectPts(605, 652, 16, 3), '#2a1a1a');
    paint(g, circlePts(613, 676, 4), GOLD, { curved: true });
    snowOn(g, [[598, 628], [606, 620], [613, 618], [620, 620], [628, 628]], 6);

    // coche rojo con abeto
    const car = el('g', { class: 'car' }, g);
    const body = el('g', { class: 'body' }, car);
    el('path', { d: 'M150 728L330 712L330 750L150 752Z', fill: 'url(#beam)', opacity: 0.6 }, body);
    paint(body, [[18, 742], [22, 722], [44, 716], [62, 694], [118, 692], [138, 714], [156, 718], [160, 742]], '#d1322b', { curved: true, jit: 0.4 });
    paint(body, [[66, 712], [74, 698], [96, 698], [96, 712]], '#bfe0ee', { jit: 0.3 });
    paint(body, [[102, 712], [102, 698], [116, 698], [130, 712]], '#bfe0ee', { jit: 0.3 });
    paint(body, rectPts(152, 722, 8, 6), '#fff1b8', { jit: 0.2 });
    paint(body, rectPts(18, 724, 6, 6), '#ff8a7a', { jit: 0.2 });
    stroke(body, 'M24 732H154', '#a8231e', 1.6, { opacity: 0.6 });
    // abeto en el techo
    const tree = [[38, 690], [56, 676], [60, 684], [80, 670], [86, 680], [104, 668], [110, 678], [130, 670], [128, 682], [146, 690]];
    paint(body, tree.concat([[142, 696], [42, 696]]), '#2a6b47', { jit: 0.8 });
    brush(body, 44, 672, 98, 20, '#4f9a68', 14, 0.5, 2);
    stroke(body, 'M70 692V700M114 692V700', '#c9342d', 2.4);
    paint(body, rectPts(140, 686, 14, 6), '#5a3b28', { jit: 0.3 });
    [[46, 744], [132, 744]].forEach(([x, y]) => {
      paint(car, circlePts(x, y, 13), '#24222a', { curved: true, jit: 0.3 });
      paint(car, circlePts(x, y, 6.5), '#efe1c4', { curved: true, jit: 0.2 });
    });
  }

  // grano de papel por encima de todo
  function addGrain(svg) {
    try {
      const c = document.createElement('canvas'); c.width = c.height = 160;
      const ctx = c.getContext('2d'), img = ctx.createImageData(160, 160);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 16;
      }
      ctx.putImageData(img, 0, 0);
      const defs = svg.querySelector('defs');
      const pat = el('pattern', { id: 'grain', width: 160, height: 160, patternUnits: 'userSpaceOnUse' }, defs);
      el('image', { href: c.toDataURL(), width: 160, height: 160 }, pat);
      el('rect', { x: -1500, y: -400, width: 4000, height: 1400, fill: 'url(#grain)', 'pointer-events': 'none', style: 'mix-blend-mode:multiply' }, svg);
    } catch (e) { /* sin textura */ }
  }

  /* =========================================================
     ESTADOS Y TEXTOS
     ========================================================= */
  function refresh() {
    const today = todayN();
    const set = openedSet();
    for (let d = 1; d <= 24; d++) {
      const g = groups[d];
      const unlocked = isUnlocked(d);
      g.classList.toggle('locked', !unlocked);
      g.classList.toggle('open', set.has(d) && unlocked);
      g.classList.toggle('today', unlocked && !testMode && d === today);
      g.setAttribute('aria-label', `Día ${d}` + (unlocked ? (set.has(d) ? ', abierta' : '') : ', bloqueada'));
    }
    const btn = $('#testBtn');
    if (btn) {
      btn.textContent = `🧪 Modo prueba: ${testMode ? 'ON' : 'OFF'}`;
      btn.setAttribute('aria-pressed', String(testMode));
    }
    const sub = $('#subtitle');
    const now = new Date(), start = unlockDate(1);
    if (testMode) sub.textContent = 'Modo prueba: puedes abrir todas las ventanas';
    else if (now < start) {
      const n = daysUntil(start);
      sub.textContent = n <= 1 ? '¡Mañana se abre la primera ventana!' : `Faltan ${n} días para la primera ventana`;
    } else if (today >= 1 && today <= 24) sub.textContent = `Hoy se abre la ventana ${today} ✨`;
    else sub.textContent = '¡Bon Nadal! 🎄';
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* =========================================================
     ABRIR UNA VENTANA Y ENTRAR
     ========================================================= */
  let busy = false;
  let currentRoom = 0;

  async function tap(day) {
    if (busy || currentRoom) return;
    const g = groups[day];
    if (!isUnlocked(day)) {
      g.classList.remove('shake'); void g.getBBox(); g.classList.add('shake');
      setTimeout(() => g.classList.remove('shake'), 520);
      const n = daysUntil(unlockDate(day));
      toast(n <= 1 ? '🔒 Esta ventana se abre mañana' : `🔒 Se abre el ${day} de diciembre (faltan ${n} días)`);
      return;
    }
    busy = true;
    if (!g.classList.contains('open')) {
      g.classList.add('open');
      openedSet().add(day);
      saveOpened();
      await wait(reduceMotion ? 50 : 1100);
    } else await wait(120);
    await enterRoom(day, g);
    busy = false;
  }

  async function enterRoom(day, g) {
    const scene = $('#scene');
    const target = g.querySelector('.light').getBoundingClientRect();
    const vw = innerWidth, vh = innerHeight;
    const cx = target.left + target.width / 2, cy = target.top + target.height / 2;
    const s = Math.min(9, Math.max(vw / Math.max(target.width, 1), vh / Math.max(target.height, 1)) * 1.1);
    scene.classList.remove('back');
    scene.style.transformOrigin = `${f(cx)}px ${f(cy)}px`;
    scene.style.transform = `translate(${f(vw / 2 - cx)}px, ${f(vh / 2 - cy)}px) scale(${f(s)})`;
    document.body.classList.add('zooming');
    buildRoom(day);
    fillCard(day);
    currentRoom = day;
    history.pushState({ room: day }, '');
    await wait(reduceMotion ? 30 : 950);
    const room = $('#room');
    room.classList.add('show');
    room.setAttribute('aria-hidden', 'false');
    $('#back').focus({ preventScroll: true });
  }

  function closeRoom(fromHistory) {
    if (!currentRoom) return;
    const day = currentRoom;
    currentRoom = 0;
    if (!fromHistory && history.state && history.state.room) history.back();
    const room = $('#room');
    room.classList.remove('show');
    room.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      const scene = $('#scene');
      scene.classList.add('back');
      scene.style.transform = '';
      document.body.classList.remove('zooming');
      setTimeout(() => { scene.classList.remove('back'); groups[day] && groups[day].focus({ preventScroll: true }); }, 1000);
    }, reduceMotion ? 0 : 350);
  }

  function fillCard(day) {
    const data = (window.DAYS && window.DAYS[day - 1]) || {};
    $('#cardDate').textContent = `${day} de diciembre`;
    const title = $('#cardTitle');
    title.textContent = `Día ${day}`;
    if (data.titulo) { const sm = document.createElement('small'); sm.textContent = data.titulo; title.appendChild(sm); }
    $('#cardBody').innerHTML = data.html && data.html.trim()
      ? data.html
      : '<p class="empty"><span>🎁</span>Aquí habrá una sorpresa muy pronto…</p>';
    if (window.initQuiz) window.initQuiz($('#cardBody'));
    if (window.initBola) window.initBola($('#cardBody'));
  }

  /* =========================================================
     LA HABITACIÓN (colores de la calle; cambia cada día)
     ========================================================= */
  function buildRoom(n) {
    const svg = $('#roomArt');
    svg.innerHTML = '';
    seed(n * 131 + 7);
    const pals = [
      ['#3d7d92', '#4a8ba0', '#c9342d'], ['#c9342d', '#d4453d', '#2b7880'], ['#ec8f96', '#f2a2a8', '#2b7880'],
      ['#79c4ab', '#8bcfb8', '#c9342d'], ['#a7203d', '#b52e4a', '#e5b34a'], ['#2b7880', '#36868e', '#ec8f96'],
    ];
    const [wallC, wall2, accent] = pals[(n - 1) % pals.length];
    const defs = el('defs', null, svg);
    const grad = (id, stops, attrs = {}, tag = 'radialGradient') => {
      const g = el(tag, Object.assign({ id }, attrs), defs);
      stops.forEach(([o, c, op]) => el('stop', { offset: o, 'stop-color': c, 'stop-opacity': op == null ? 1 : op }, g));
    };
    grad('roomWarm', [[0, '#fff1c2', 0.42], [1, '#fff1c2', 0]], { cx: '.5', cy: '.4', r: '.7' });
    grad('roomVig', [[0.6, '#1a0f0c', 0], [1, '#1a0f0c', 0.42]], { cx: '.5', cy: '.5', r: '.75' });
    grad('fireGlow', [[0, '#ffcf6b', 0.7], [1, '#ff8a3c', 0]]);
    grad('gold', [[0, '#fbe39a'], [0.5, '#e5b34a'], [1, '#c58f2a']], { x1: 0, y1: 0, x2: 1, y2: 1 }, 'linearGradient');
    grad('warmGlow', [[0, '#fff1b8', 0.9], [0.4, '#ffc75a', 0.45], [1, '#ff9a3c', 0]]);

    const root = el('g', n % 2 ? { transform: 'translate(400 0) scale(-1 1)' } : null, svg);
    el('rect', { x: -60, y: -60, width: 520, height: 630, fill: wallC }, root);
    brush(root, -40, -40, 480, 590, '#ffffff', 90, 0.06, 4);
    const wp = n % 3;
    if (wp === 0) for (let x = -40; x < 440; x += 28) paint(root, rectPts(x, -60, 12, 630), wall2, { jit: 0.4 });
    else if (wp === 1) for (let i = 0; i < 60; i++) paint(root, starPts(-40 + rand() * 480, -40 + rand() * 590, 3 + rand() * 2), '#fff3da', { jit: 0.2, extra: { opacity: 0.3 } });
    else { let d = ''; for (let x = -60; x < 460; x += 34) d += `M${x} -60L${x + 300} 570M${x + 300} -60L${x} 570`; stroke(root, d, wall2, 1.6); }

    // guirnalda
    garland(root, -40, 440, 30, 12, 6);

    // ventana con nieve
    const wg = el('g', { transform: 'translate(0 -48)' }, root);
    paint(wg, rectPts(232, 120, 120, 150), CREAM);
    paint(wg, rectPts(241, 129, 102, 132), '#1c2858', { jit: 0 });
    for (let i = 0; i < 14; i++) paint(wg, starPts(246 + rand() * 92, 134 + rand() * 80, 1.5 + rand() * 2.5), 'url(#gold)', { jit: 0.1 });
    paint(wg, circlePts(318, 152, 9), 'url(#gold)', { curved: true });
    paint(wg, [[241, 261], [241, 236], [270, 226], [300, 236], [343, 224], [343, 261]], '#eef3fb', { curved: false });
    stroke(wg, 'M292 129V261M241 195H343', CREAM, 3);
    paint(wg, rectPts(224, 268, 136, 9), '#e7cf9f');
    paint(wg, [[220, 104], [252, 104], [244, 200], [254, 290], [222, 290]], accent, { jit: 0.5 });
    paint(wg, [[364, 104], [332, 104], [340, 200], [330, 290], [362, 290]], accent, { jit: 0.5 });
    stroke(wg, 'M210 104H374', '#6b4a35', 3.2);

    // cuadro
    const pg = el('g', { transform: 'translate(0 -56)' }, root);
    paint(pg, rectPts(46, 150, 72, 58), 'url(#gold)');
    paint(pg, rectPts(54, 158, 56, 42), '#f7eedb');
    paint(pg, heartPts(82, 180, 0.75), '#e05a4f', { curved: true });

    // zócalo y suelo
    paint(root, rectPts(-60, 550, 520, 16), '#f3e6cf', { jit: 0 });
    el('rect', { x: -60, y: 566, width: 520, height: 260, fill: '#b98457' }, root);
    for (let y = 594, row = 0; y < 780; y += 28, row++) {
      stroke(root, `M-60 ${y}H460`, '#8e6040', 1.2, { opacity: 0.5 });
      for (let x = -40 + (row % 2) * 60; x < 460; x += 120) stroke(root, `M${x} ${y - 28}V${y}`, '#8e6040', 1, { opacity: 0.4 });
    }
    brush(root, -40, 570, 480, 190, '#d9a273', 50, 0.25, 3);
    paint(root, circlePts(200, 668, 160, 40, 26), accent, { curved: true });
    stroke(root, crPath(circlePts(200, 668, 136, 30, 26), true), '#fdf4dc', 1.6, { 'stroke-dasharray': '5 6' });

    // chimenea
    const fp = el('g', { transform: 'translate(0 24)' }, root);
    el('ellipse', { cx: 307, cy: 600, rx: 120, ry: 40, fill: 'url(#fireGlow)' }, fp);
    paint(fp, rectPts(236, 418, 142, 148), '#ece0cc');
    for (let i = 0; i < 12; i++) {
      const x = 244 + rand() * 120, y = 426 + rand() * 132;
      if (x > 255 && x < 360 && y > 455) continue;
      paint(fp, circlePts(x, y, 8 + rand() * 6, 5 + rand() * 3, 10), '#d9cbb3', { curved: true });
    }
    paint(fp, archPts(262, 462, 90, 104), '#2b1b17', { jit: 0 });
    paint(fp, [[272, 556], [342, 548], [344, 558], [274, 566]], '#6b4a35');
    paint(fp, [[276, 548], [338, 558], [336, 566], [274, 558]], '#7b5640');
    [['#ff7a3c', 307, 548, 26, 50], ['#ffb347', 298, 550, 18, 38], ['#ffe27a', 314, 552, 12, 26]].forEach(([col, x, y, w, h], i) => {
      const fl = el('g', { class: 'flame', style: `animation-delay:${i * 0.23}s` }, fp);
      paint(fl, [[x - w / 2, y], [x - w * 0.4, y - h * 0.45], [x - w * 0.1, y - h * 0.7], [x, y - h], [x + w * 0.15, y - h * 0.65], [x + w * 0.45, y - h * 0.4], [x + w / 2, y]], col, { curved: true, jit: 0.3 });
    });
    paint(fp, rectPts(224, 402, 166, 16), '#7a4a32');
    garland(fp, 228, 386, 404, 4, 3);
    [[248, 380], [366, 384]].forEach(([x, y]) => {
      paint(fp, rectPts(x - 4, y, 8, 402 - y), '#fdf4dc');
      const fl = el('g', { class: 'flame' }, fp);
      paint(fl, [[x - 3, y - 1], [x, y - 11], [x + 3, y - 1]], '#ffd25a', { curved: true, jit: 0.2 });
    });
    [[262, '#c9342d'], [322, '#2b7880']].forEach(([x, col], i) => {
      paint(fp, [[x, 430], [x + 20, 430], [x + 20, 462], [x + 30, 472], [x + 26, 484], [x + 6, 480], [x, 466]], col);
      paint(fp, rectPts(x - 2, 422, 24, 11), '#fdf4dc');
      if (i === 0) paint(fp, starPts(x + 11, 452, 5), 'url(#gold)', { jit: 0.1 });
      else paint(fp, heartPts(x + 11, 452, 0.3), '#fdf4dc', { curved: true, jit: 0.1 });
    });

    // árbol
    const tg = el('g', { transform: 'translate(0 26)' }, root);
    paint(tg, [[70, 534], [122, 534], [116, 566], [76, 566]], '#c9342d');
    pine(tg, 96, 540, 250, { star: true });
    [[134, 532, 38, 34, '#3d7d92', GOLD], [28, 544, 34, 22, GOLD, '#c9342d']].forEach(([x, y, w, h, col, rib]) => {
      paint(tg, rectPts(x, y, w, h), col);
      paint(tg, rectPts(x + w / 2 - 1.5, y, 3, h), rib);
      paint(tg, rectPts(x, y + h / 2 - 1.5, w, 3), rib);
    });

    // gatito
    const catCol = ['#e3a35b', '#5b5552', '#f3ece0', '#9b8a7a'][n % 4];
    paint(root, circlePts(190, 662, 30, 15, 16), catCol, { curved: true });
    paint(root, circlePts(218, 654, 13, 11, 14), catCol, { curved: true });
    paint(root, [[209, 647], [211, 635], [217, 644]], catCol);
    paint(root, [[221, 644], [228, 634], [229, 647]], catCol);
    stroke(root, 'M212 656q3 2 6 0M221 656q3 2 6 0', '#3a2622', 1.2);
    stroke(root, 'M162 668q-16 8 -4 14q14 5 30 -2', catCol, 4);
    const zg = el('g', n % 2 ? { transform: 'translate(472 0) scale(-1 1)' } : null, root);
    const z = el('text', { x: 236, y: 632, 'font-family': "'Dancing Script', cursive", 'font-size': 20, 'font-weight': 700, fill: '#fdf4dc', class: 'zzz' }, zg);
    z.textContent = 'z z';

    el('rect', { x: -60, y: -60, width: 520, height: 880, fill: 'url(#roomWarm)' }, svg);
    el('rect', { x: -60, y: -60, width: 520, height: 880, fill: 'url(#roomVig)' }, svg);
  }

  /* =========================================================
     NIEVE
     ========================================================= */
  function startSnow() {
    const c = $('#snow');
    if (reduceMotion) { c.remove(); return; }
    const ctx = c.getContext('2d');
    let W, H2, flakes = [], last = performance.now();
    const newFlake = (any) => ({ x: Math.random() * W, y: any ? Math.random() * H2 : -10, r: 0.8 + Math.random() * 2.2, v: 16 + Math.random() * 36, ph: Math.random() * 6.28, a: 0.45 + Math.random() * 0.5 });
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H2 = innerHeight;
      c.width = W * dpr; c.height = H2 * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(130, Math.round((W * H2) / 8500));
      while (flakes.length < count) flakes.push(newFlake(true));
      flakes.length = count;
    }
    function frame(t) {
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      if (!document.hidden && !currentRoom) {
        ctx.clearRect(0, 0, W, H2);
        ctx.fillStyle = '#ffffff';
        for (const fl of flakes) {
          fl.y += fl.v * dt * (0.6 + fl.r / 4);
          fl.ph += dt * 1.2;
          fl.x += Math.sin(fl.ph) * 12 * dt;
          if (fl.y > H2 + 5) Object.assign(fl, newFlake(false));
          ctx.globalAlpha = fl.a;
          ctx.beginPath(); ctx.arc(fl.x, fl.y, fl.r, 0, 6.283); ctx.fill();
        }
      }
      requestAnimationFrame(frame);
    }
    addEventListener('resize', resize);
    resize();
    requestAnimationFrame(frame);
  }

  /* =========================================================
     ARRANQUE
     ========================================================= */
  function init() {
    buildStreet();
    refresh();
    requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove('noanim')));
    startSnow();
    setInterval(refresh, 60 * 1000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });

    $('#back').addEventListener('click', () => closeRoom(false));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') closeRoom(false); });
    addEventListener('popstate', () => { if (currentRoom) closeRoom(true); });

    // pista de "desliza" y posición inicial de la calle
    const street = $('#street'), hint = $('#hint');
    const checkHint = () => { if (street.scrollWidth <= street.clientWidth + 4) hint.classList.add('hide'); };
    street.addEventListener('scroll', () => hint.classList.add('hide'), { passive: true, once: true });
    requestAnimationFrame(() => {
      const t = todayN();
      if (!testMode && t >= 1 && t <= 24 && groups[t]) {
        const r = groups[t].getBoundingClientRect();
        street.scrollLeft += r.left + r.width / 2 - innerWidth / 2;
      }
      checkHint();
    });
    addEventListener('resize', checkHint);

    // BOTÓN DE MODO PRUEBA (temporal: borra este bloque y el botón del HTML cuando acabes)
    const btn = $('#testBtn');
    if (btn) btn.addEventListener('click', () => {
      testMode = !testMode;
      store.set(KEY + '-test', testMode);
      if (testMode) { openedTest = new Set(); store.del(KEY + '-opened-test'); }
      document.body.classList.add('noanim');
      refresh();
      requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove('noanim')));
      toast(testMode ? '🔓 Modo prueba activado: abre la ventana que quieras' : '🔒 Modo prueba desactivado');
    });
  }

  init();
})();
