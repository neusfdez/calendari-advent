/*
  QUIN PERSONATGE NADALENC ETS?
  -----------------------------
  6 preguntes, 4 respostes cadascuna. Cada resposta suma punts als personatges
  (p: { personatge: punts }). Surt el personatge amb més punts; si n’hi ha
  empat, en triem un a l’atzar.

  Per canviar textos, preguntes o personatges, edita només TEXTOS, PERSONATGES i PREGUNTES.
*/
(function () {
  const TEXTOS = {
    progres:    "Pregunta {n} de {t}",
    calculant:  "✨ Consultant el sac del Pare Noel…",
    ets:        "Ets…",
    afinitat:   "Afinitat",
    toc:        "Amb un toc de",
    reiniciar:  "Tornar a començar"
  };

  const PERSONATGES = {
    noel:   { emo: "🎅", nom: "El Pare Noel",
              txt: "Generós, organitzat i amb un cor més gran que el sac. Tothom compta amb tu perquè el Nadal surti rodó, i tu ho fas semblar fàcil." },
    grinch: { emo: "💚", nom: "El Grinch",
              txt: "Sarcàstic i amb poca paciència per al xivarri… però per dins tens un cor que creix un parell de talles cada Nadal. Els qui et coneixen saben que ets d’una lleialtat a prova de tot." },
    follet: { emo: "🧝", nom: "Un follet de Nadal",
              txt: "Treballador, creatiu i sempre amb alguna entremaliadura a punt. Tu fas que tot passi, i ho fas amb un somriure i un barret ridícul." },
    rudolf: { emo: "🦌", nom: "Rudolf, el ren",
              txt: "Diferent i ben orgullós de ser-ho. Quan tot és fosc, ets qui il·lumina el camí i fa que la festa comenci." },
    ninot:  { emo: "⛄", nom: "Un ninot de neu",
              txt: "Tranquil, alegre i amb la millor abraçada de l’hivern. Amb tu s’està tan bé que ningú vol marxar. Sí, només cal vigilar la calefacció." },
    tio:    { emo: "🪵", nom: "El Tió de Nadal",
              txt: "Tradicional, acollidor i amb molta paciència. Poca gent és tan generosa com tu quan arriba el moment: caga, tió!" }
  };

  const PREGUNTES = [
    { q: "Divendres a la tarda de desembre. Què et ve més de gust?", op: [
      { t: "Sofà, manta i una pel·lícula nadalenca",                    p: { tio: 2, ninot: 1 } },
      { t: "Organitzar el sopar perquè tothom ho passi bé",             p: { noel: 2, follet: 1 } },
      { t: "Que ningú em demani res i em deixin en pau",                p: { grinch: 2, ninot: 1 } },
      { t: "Sortir de festa fins a les tantes",                         p: { rudolf: 2, follet: 1 } }
    ]},
    { q: "Al dinar de Nadal, tu ets…", op: [
      { t: "Qui s’ha passat tres dies cuinant",                         p: { noel: 2, follet: 1 } },
      { t: "Qui fa bromes i anima tota la taula",                       p: { follet: 2, rudolf: 1 } },
      { t: "Qui ho observa tot i deixa anar algun comentari sarcàstic",    p: { grinch: 2 } },
      { t: "Qui vigila que tothom estigui còmode i tingui de tot",      p: { ninot: 2, tio: 1 } }
    ]},
    { q: "Com emboliques els regals?", op: [
      { t: "Paper perfecte, llaç i etiqueta feta a mà",                 p: { follet: 2, rudolf: 1 } },
      { t: "En una bossa i ja està",                                    p: { grinch: 2 } },
      { t: "A l’últim minut, però amb molta imaginació",                p: { rudolf: 2, ninot: 1 } },
      { t: "Els amago amb temps i ningú els troba fins a Nadal",        p: { tio: 2, noel: 1 } }
    ]},
    { q: "Quin és el teu moment preferit del Nadal?", op: [
      { t: "Veure la cara de qui obre el meu regal",                    p: { noel: 2, follet: 1 } },
      { t: "La cursa d’última hora per trobar el regal perfecte",       p: { rudolf: 2, follet: 1 } },
      { t: "Quan s’acaba tot i torna la tranquil·litat",                p: { grinch: 2, ninot: 1 } },
      { t: "Una tarda de fred amb xocolata desfeta ben calenta",        p: { ninot: 2, tio: 1 } }
    ]},
    { q: "Com decores casa per Nadal?", op: [
      { t: "Arbre, llums, pessebre… com més millor!",                   p: { noel: 2, follet: 1 } },
      { t: "Pessebre i tió, com mana la tradició",                      p: { tio: 2, follet: 1 } },
      { t: "Manualitats fetes per mi, amb molta purpurina",             p: { follet: 2, rudolf: 1 } },
      { t: "Una garlanda de llums i una mica de neu de mentida",        p: { ninot: 2, rudolf: 1 } }
    ]},
    { q: "Quin és el teu superpoder nadalenc?", op: [
      { t: "Fer que tothom se senti estimat",                           p: { noel: 2, ninot: 1 } },
      { t: "Dir la veritat amb un toc d’humor negre",                   p: { grinch: 2 } },
      { t: "Il·luminar la nit més fosca",                               p: { rudolf: 2, follet: 1 } },
      { t: "Tenir paciència fins que arriba el moment",                 p: { tio: 2, ninot: 1 } }
    ]}
  ];

  /* ---------- càlcul del resultat ---------- */
  function shuffle(a) {
    const b = a.slice();
    for (let k = b.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [b[k], b[j]] = [b[j], b[k]];
    }
    return b;
  }

  function resultat(respostes) {
    const claus = Object.keys(PERSONATGES);
    const pts = {}, max = {};
    claus.forEach(k => {
      pts[k] = 0;
      max[k] = PREGUNTES.reduce((s, q) => s + Math.max.apply(null, q.op.map(o => o.p[k] || 0)), 0);
    });
    respostes.forEach(o => Object.keys(o.p).forEach(k => { pts[k] += o.p[k]; }));
    // barregem abans d’ordenar perquè els empats es resolguin a l’atzar
    const ordre = shuffle(claus).sort((a, b) => pts[b] - pts[a]);
    return ordre.map(k => ({ k, pts: pts[k], afinitat: Math.round(100 * pts[k] / max[k]) }));
  }

  /* ---------- estils ---------- */
  const css = `
  .pj { text-align: center; animation: pjIn .35s ease both; }
  .pj-prog { margin: 0 0 6px; font-size: .8rem; font-weight: 700; color: #a7203d; letter-spacing: .06em; }
  .pj-bar { height: 5px; margin: 0 0 14px; border-radius: 3px; background: rgba(229, 179, 74, .25); overflow: hidden; }
  .pj-bar i { display: block; height: 100%; background: var(--gold); border-radius: 3px; transition: width .4s ease; }
  .pj-q { margin: 0 0 12px; font-weight: 700; font-size: 1.1rem; line-height: 1.3; }
  .pj-opts { display: grid; gap: 8px; }
  .pj-opt {
    font: 700 .95rem var(--sans); color: var(--text); text-align: left; line-height: 1.25;
    background: #fff; border: 2px solid var(--gold); border-radius: 12px;
    padding: 10px 12px; cursor: pointer; transition: background .15s, transform .1s;
  }
  .pj-opt:active:not(:disabled) { transform: translateY(1px); }
  .pj-opt:disabled { cursor: default; }
  .pj-opt.sel { background: var(--gold-l); border-color: #c4932a; }
  .pj-wait { margin: 40px 0; font-weight: 700; font-size: 1.05rem; color: #7a5848; }
  .pj-emo { font-size: 4.6rem; line-height: 1.1; animation: pjPop .7s cubic-bezier(.3, 1.6, .5, 1) both; }
  .pj-ets { margin: 2px 0 0; font-size: .85rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #a7203d; }
  .pj-nom { margin: 0 0 6px; font-family: var(--script); font-weight: 700; font-size: 2.3rem; line-height: 1.05; color: var(--text); }
  .pj-txt { margin: 0 0 12px; font-size: .98rem; line-height: 1.4; }
  .pj-toc { margin: 0 0 12px; font-size: .85rem; font-weight: 700; color: #7a5848; }
  .pj-afin { margin: 0 0 12px; text-align: left; }
  .pj-afin h4 { margin: 0 0 6px; font-size: .75rem; letter-spacing: .1em; text-transform: uppercase; color: #a0786a; text-align: center; }
  .pj-row { display: grid; grid-template-columns: 7.2em 1fr 2.6em; align-items: center; gap: 8px; margin: 4px 0; font-size: .8rem; font-weight: 700; }
  .pj-row span:first-child { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pj-track { height: 9px; border-radius: 5px; background: rgba(229, 179, 74, .25); overflow: hidden; }
  .pj-track i { display: block; height: 100%; width: 0; border-radius: 5px; background: linear-gradient(90deg, var(--gold), var(--gold-l)); transition: width .9s cubic-bezier(.2, .8, .3, 1) .2s; }
  .pj-row span:last-child { text-align: right; color: #7a5848; }
  .pj-btn {
    font: 700 1rem var(--sans); color: var(--cream); background: var(--red);
    border: 0; border-radius: 999px; padding: 10px 22px; cursor: pointer;
  }
  @keyframes pjIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  @keyframes pjPop { 0% { transform: scale(.4) rotate(-12deg); opacity: 0; } 100% { transform: none; opacity: 1; } }
  @media (prefers-reduced-motion: reduce) {
    .pj, .pj-emo { animation: none !important; }
    .pj-bar i, .pj-track i { transition: none; }
  }
  `;

  function injectCss() {
    if (document.getElementById('pj-css')) return;
    const s = document.createElement('style');
    s.id = 'pj-css';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function h(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* ---------- el test ---------- */
  function start(host) {
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const espera = (ms, fn) => setTimeout(() => { if (host.isConnected) fn(); }, reduce ? 0 : ms);
    const total = PREGUNTES.length;
    const respostes = [];

    function pregunta(i) {
      host.innerHTML = '';
      const p = PREGUNTES[i];
      const wrap = h('div', 'pj');
      wrap.appendChild(h('p', 'pj-prog', TEXTOS.progres.replace('{n}', i + 1).replace('{t}', total)));
      const bar = h('div', 'pj-bar');
      const fill = h('i');
      fill.style.width = (100 * i / total) + '%';
      bar.appendChild(fill);
      wrap.append(bar, h('p', 'pj-q', p.q));

      const opts = h('div', 'pj-opts');
      shuffle(p.op).forEach(o => {
        const b = h('button', 'pj-opt', o.t);
        b.type = 'button';
        b.onclick = () => {
          opts.querySelectorAll('button').forEach(x => { x.disabled = true; });
          b.classList.add('sel');
          fill.style.width = (100 * (i + 1) / total) + '%';
          respostes.push(o);
          espera(380, () => (i + 1 < total ? pregunta(i + 1) : calculant()));
        };
        opts.appendChild(b);
      });
      wrap.appendChild(opts);
      host.appendChild(wrap);
    }

    function calculant() {
      host.innerHTML = '';
      const wrap = h('div', 'pj');
      wrap.appendChild(h('p', 'pj-wait', TEXTOS.calculant));
      host.appendChild(wrap);
      espera(1100, final);
    }

    function final() {
      const r = resultat(respostes);
      const guanyador = PERSONATGES[r[0].k];
      host.innerHTML = '';
      const wrap = h('div', 'pj');
      wrap.append(
        h('div', 'pj-emo', guanyador.emo),
        h('p', 'pj-ets', TEXTOS.ets),
        h('p', 'pj-nom', guanyador.nom),
        h('p', 'pj-txt', guanyador.txt)
      );
      if (r[1].pts > 0) {
        wrap.appendChild(h('p', 'pj-toc', `${TEXTOS.toc} ${PERSONATGES[r[1].k].emo} ${PERSONATGES[r[1].k].nom.toLowerCase()}`));
      }

      const afin = h('div', 'pj-afin');
      afin.appendChild(h('h4', null, TEXTOS.afinitat));
      const fills = [];
      r.slice(0, 3).forEach(x => {
        const pj = PERSONATGES[x.k];
        const row = h('div', 'pj-row');
        const track = h('div', 'pj-track');
        const f = h('i');
        track.appendChild(f);
        fills.push([f, x.afinitat]);
        row.append(h('span', null, `${pj.emo} ${pj.nom.replace(/^(El|Un) /, '')}`), track, h('span', null, x.afinitat + '%'));
        afin.appendChild(row);
      });
      wrap.appendChild(afin);

      const again = h('button', 'pj-btn', TEXTOS.reiniciar);
      again.type = 'button';
      again.onclick = () => { respostes.length = 0; pregunta(0); };
      wrap.appendChild(again);
      host.appendChild(wrap);

      // les barres s’omplen després de pintar-se
      requestAnimationFrame(() => requestAnimationFrame(() => fills.forEach(([f, v]) => { f.style.width = v + '%'; })));
    }

    pregunta(0);
  }

  /* app.js crida això cada cop que s’obre una habitació */
  window.initPersonatge = function (root) {
    const host = root && root.querySelector('[data-personatge]');
    if (!host) return;
    injectCss();
    start(host);
  };
})();
