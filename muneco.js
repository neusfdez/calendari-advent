/*
  VISTE AL MUÑECO DE NIEVE
  ------------------------
  1) El jugador elige accesorios (todos opcionales) y pulsa OK.
  2) Aparece su muñeco encima de vuestra foto y se derrite por el calor.

  Lo que puedes cambiar sin tocar nada más:
  - FOTO:     ruta de la foto (súbela a la carpeta muneco/ del repositorio)
  - POSICION: dónde se coloca el muñeco sobre la foto ("izquierda" | "centro" | "derecha")
  - TEXTOS:   todos los textos del juego
  - Accesorios: lista CATS más abajo (y su dibujo en HATS, GAFAS, NARIZ, CUELLO, CUERPO, MANO)
*/
(function () {
  const FOTO = "contingut/xina.jpeg";
  const POSICION = "derecha";

  const TEXTOS = {
    intro:     "Vesteix al ninot de neu",
    ok:        "OK ✔",
    reiniciar: "Tornar a començar",
    otro:      "Vestir un altre ninot de neu",
    calor1:    "Uf, quina calor! 🥵",
    calor2:    "Ai, ai, ai… s'està fonent 💧",
    fin:       "Bye 💦"
  };

  /* lo que lleva puesto al empezar */
  const DEFECTO = { nariz: "zanahoria" };

  /* ================= ACCESORIOS DISPONIBLES ================= */
  const CATS = [
    { id: "sombrero", ico: "🎩", nom: "Barret", ops: [
      { k: "santa",    ico: "🎅", nom: "Pare Noel" },
      { k: "copa",     ico: "🎩", nom: "De copa" },
      { k: "lana",     ico: "🧶", nom: "De llana" },
      { k: "cuernos",  ico: "🦌", nom: "Banyes" },
      { k: "corona",   ico: "👑", nom: "Corona" },
      { k: "orejeras", ico: "🎧", nom: "Tapadores d'orelles" }
    ]},
    { id: "gafas", ico: "🕶️", nom: "Ulleres", ops: [
      { k: "sol",       ico: "🕶️", nom: "De sol" },
      { k: "redondas",  ico: "👓", nom: "Rodones" },
      { k: "estrella",  ico: "⭐", nom: "Estrelles" }
    ]},
    { id: "nariz", ico: "🥕", nom: "Nas", ops: [
      { k: "zanahoria", ico: "🥕", nom: "Pastanaga" },
      { k: "reno",      ico: "🔴", nom: "De ren" }
    ]},
    { id: "cuello", ico: "🧣", nom: "Coll", ops: [
      { k: "roja",     ico: "🧣", nom: "Bufanda vermella" },
      { k: "rayas",    ico: "🍬", nom: "Bufanda de ratlles" },
      { k: "verde",    ico: "🟢", nom: "Bufanda verda" },
      { k: "pajarita", ico: "🎀", nom: "Corbatí" }
    ]},
    { id: "cuerpo", ico: "🔘", nom: "Cos", ops: [
      { k: "botones", ico: "⚫", nom: "Botons" },
      { k: "colores", ico: "🔵", nom: "De colors" },
      { k: "luces",   ico: "💡", nom: "Llums" }
    ]},
    { id: "mano", ico: "🍭", nom: "Mà", ops: [
      { k: "baston",  ico: "🍭", nom: "Bastó" },
      { k: "regalo",  ico: "🎁", nom: "Regal" },
      { k: "taza",    ico: "☕", nom: "Xocolata" },
      { k: "abanico", ico: "🌬️", nom: "Ventall" }
    ]}
  ];

  /* ================= DIBUJO (SVG 200 x 260, suelo en y=240) ================= */
  const HATS = {
    santa: `<path d="M78 58 C77 34 98 16 120 24 C114 32 122 46 122 58 Z" fill="#c9342d"/>
            <rect x="76" y="55" width="48" height="11" rx="5.5" fill="#fff" stroke="#e3e3e3"/>
            <circle cx="120" cy="25" r="7" fill="#fff" stroke="#e3e3e3"/>`,
    copa: `<ellipse cx="100" cy="58" rx="30" ry="6" fill="#262626"/>
           <rect x="81" y="22" width="38" height="36" rx="3" fill="#2b2b2b"/>
           <rect x="81" y="46" width="38" height="8" fill="#c9342d"/>
           <ellipse cx="100" cy="22" rx="19" ry="4" fill="#3a3a3a"/>`,
    lana: `<path d="M77 60 C77 30 123 30 123 60 Z" fill="#3f6fb5"/>
           <rect x="76" y="54" width="48" height="10" rx="5" fill="#2d5190"/>
           <path d="M84 54v10 M92 54v10 M100 54v10 M108 54v10 M116 54v10" stroke="#5b86c9" stroke-width="1.5"/>
           <circle cx="100" cy="31" r="8" fill="#fff" stroke="#e3e3e3"/>`,
    cuernos: `<g stroke="#8a5a2b" stroke-width="4" stroke-linecap="round" fill="none">
                <path d="M84 58 L74 38 M79 48 L66 44 M75 41 L76 28"/>
                <path d="M116 58 L126 38 M121 48 L134 44 M125 41 L124 28"/></g>
              <path d="M78 62 Q100 48 122 62" stroke="#5a3a1a" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
    corona: `<path d="M77 60 L79 36 L90 48 L100 32 L110 48 L121 36 L123 60 Z" fill="#f2c24b" stroke="#c4932a" stroke-width="1.5" stroke-linejoin="round"/>
             <circle cx="100" cy="52" r="3" fill="#c9342d"/><circle cx="88" cy="54" r="2.2" fill="#2f7d4f"/><circle cx="112" cy="54" r="2.2" fill="#2f7d4f"/>`,
    orejeras: `<path d="M77 80 Q100 40 123 80" stroke="#444" stroke-width="4" fill="none" stroke-linecap="round"/>
               <circle cx="77" cy="82" r="11" fill="#c9342d"/><circle cx="123" cy="82" r="11" fill="#c9342d"/>`
  };

  const STAR = `points="0,-9 2.6,-3 9,-2.8 4,1.6 5.6,8 0,4.5 -5.6,8 -4,1.6 -9,-2.8 -2.6,-3"`;
  const GAFAS = {
    sol: `<g fill="#1b1b1b"><rect x="81" y="66" width="17" height="12" rx="5"/><rect x="102" y="66" width="17" height="12" rx="5"/><rect x="97" y="69" width="6" height="2.6"/></g>
          <path d="M81 69 L76 67 M119 69 L124 67" stroke="#1b1b1b" stroke-width="2" fill="none"/>
          <path d="M85 69 h4 M106 69 h4" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"/>`,
    redondas: `<g fill="rgba(180,220,255,.25)" stroke="#333" stroke-width="2"><circle cx="91" cy="72" r="8.5"/><circle cx="109" cy="72" r="8.5"/></g>
               <path d="M99 71 Q100 69.5 101 71 M82.5 70 L77 68 M117.5 70 L123 68" stroke="#333" stroke-width="2" fill="none"/>`,
    estrella: `<g fill="#f2c24b" stroke="#c4932a" stroke-width="1">
                 <polygon transform="translate(91 72) scale(1.15)" ${STAR}/>
                 <polygon transform="translate(109 72) scale(1.15)" ${STAR}/></g>`
  };

  const NARIZ = {
    zanahoria: `<polygon points="98,77 124,82.5 98,88" fill="#f08a24"/><path d="M106 79.5 l0 5 M113 81 l0 3.4" stroke="#c96c12" stroke-width="1.2"/>`,
    reno: `<circle cx="100" cy="81" r="6" fill="#d62b2b"/><circle cx="98" cy="79" r="1.7" fill="#fff" fill-opacity=".7"/>`
  };

  function scarf(fill, fringe) {
    return `<g stroke="rgba(0,0,0,.12)" stroke-width="1">
              <rect x="72" y="96" width="56" height="14" rx="7" fill="${fill}"/>
              <rect x="108" y="104" width="14" height="36" rx="4" fill="${fill}" transform="rotate(-6 115 104)"/></g>
            <path d="M113 141 v6 M118 141 v6 M123 141 v6" stroke="${fringe}" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;
  }
  const CUELLO = {
    roja: scarf("#c9342d", "#c9342d"),
    rayas: scarf("url(#mn-stripe)", "#c9342d"),
    verde: scarf("#2f7d4f", "#2f7d4f"),
    pajarita: `<path d="M100 106 L80 96 L80 116 Z M100 106 L120 96 L120 116 Z" fill="#8e1b3a"/><rect x="95" y="100" width="10" height="12" rx="3" fill="#6d1229"/>`
  };

  const BULBS = [[76, 131, "#e5484d"], [88, 137, "#f2c24b"], [100, 139, "#4cae6c"], [112, 137, "#4a90e2"], [124, 131, "#e5484d"]];
  const CUERPO = {
    botones: `<g fill="#262626"><circle cx="100" cy="118" r="4"/><circle cx="100" cy="132" r="4"/><circle cx="100" cy="146" r="4"/></g>`,
    colores: `<circle cx="100" cy="118" r="4.5" fill="#c9342d"/><circle cx="100" cy="132" r="4.5" fill="#f2c24b"/><circle cx="100" cy="146" r="4.5" fill="#2f7d4f"/>`,
    luces: `<path d="M70 126 Q100 152 130 126" fill="none" stroke="#2f4a2f" stroke-width="1.6"/>` +
           BULBS.map(b => `<circle cx="${b[0]}" cy="${b[1]}" r="6.5" fill="${b[2]}" fill-opacity=".25"/><circle cx="${b[0]}" cy="${b[1]}" r="3.4" fill="${b[2]}"/>`).join("")
  };

  const MANO = {
    baston: `<path d="M166 150 L166 98 Q166 86 176 86 Q186 86 186 96" fill="none" stroke="#bdbdbd" stroke-width="9" stroke-linecap="round"/>
             <path d="M166 150 L166 98 Q166 86 176 86 Q186 86 186 96" fill="none" stroke="url(#mn-stripe)" stroke-width="6.5" stroke-linecap="round"/>`,
    regalo: `<rect x="150" y="100" width="28" height="24" rx="2.5" fill="#2f7d4f"/><rect x="161" y="100" width="6" height="24" fill="#f2c24b"/>
             <rect x="150" y="109" width="28" height="5" fill="#f2c24b"/>
             <path d="M164 100 C152 88 148 100 164 100 C176 88 180 100 164 100 Z" fill="#f2c24b"/>`,
    taza: `<path d="M152 98 h22 v14 a7 7 0 0 1 -7 7 h-8 a7 7 0 0 1 -7 -7 z" fill="#fff" stroke="#c9342d" stroke-width="2"/>
           <path d="M174 102 h4 a5 5 0 0 1 0 10 h-4" fill="none" stroke="#c9342d" stroke-width="2"/>
           <ellipse cx="163" cy="98" rx="11" ry="2.5" fill="#6b3a1e"/>
           <path d="M158 92 q-3 -5 0 -9 M164 92 q-3 -5 0 -9 M170 92 q-3 -5 0 -9" stroke="#9aa7b8" stroke-opacity=".8" fill="none" stroke-width="2" stroke-linecap="round"/>`,
    abanico: `<path d="M163 106 L163 124" stroke="#8a5a2b" stroke-width="3" stroke-linecap="round"/>
              <circle cx="163" cy="96" r="15" fill="#f2c24b" stroke="#c4932a" stroke-width="2"/>
              <path d="M163 96 L163 82 M163 96 L151 89 M163 96 L175 89 M163 96 L150 98 M163 96 L176 98" stroke="#c4932a" stroke-width="1.3"/>`
  };

  const DROP = `<path d="M0 -6 C4 0 5 4 0 6 C-5 4 -4 0 0 -6 Z" fill="#7fc6f0"/>`;

  function svg(sel, melt) {
    const pick = (obj, k) => (k && obj[k]) || "";
    const drips = melt
      ? `<g transform="translate(64 184)"><g class="drip" style="animation-delay:1.8s">${DROP}</g></g>
         <g transform="translate(138 190)"><g class="drip" style="animation-delay:2.6s">${DROP}</g></g>
         <g transform="translate(100 206)"><g class="drip" style="animation-delay:3.4s">${DROP}</g></g>`
      : "";
    const sweat = melt ? `<g transform="translate(128 64)"><g class="sweat">${DROP}</g></g>` : "";
    const puddle = melt
      ? `<ellipse class="puddle" cx="100" cy="241" rx="60" ry="9" fill="#bfe0f5" fill-opacity=".9" stroke="#e8f5ff" stroke-width="1.5"/>`
      : "";
    return `<svg class="mn-svg${melt ? " mn-melting" : ""}" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ninot de neu">
      <defs>
        <radialGradient id="mn-b" cx="35%" cy="30%" r="80%">
          <stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e6eff8"/><stop offset="1" stop-color="#c3d5e8"/>
        </radialGradient>
        <pattern id="mn-stripe" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="10" fill="#ffffff"/><rect width="5" height="10" fill="#c9342d"/>
        </pattern>
      </defs>
      ${puddle}
      <ellipse class="mn-shadow" cx="100" cy="241" rx="46" ry="6" fill="rgba(0,0,0,.16)"/>
      <g class="m-all">
        <circle cx="100" cy="196" r="44" fill="url(#mn-b)" stroke="#c3d5e8"/>
        <g stroke="#6b4a2a" stroke-width="3.5" stroke-linecap="round" fill="none">
          <path d="M70 126 L36 104 M50 114 L42 96 M46 111 L32 113"/>
          <path d="M130 126 L164 104 M150 114 L158 96 M154 111 L168 113"/>
        </g>
        <circle cx="100" cy="128" r="32" fill="url(#mn-b)" stroke="#c3d5e8"/>
        ${pick(CUERPO, sel.cuerpo)}
        <circle cx="100" cy="78" r="24" fill="url(#mn-b)" stroke="#c3d5e8"/>
        <g fill="#2a2a2a"><circle cx="91" cy="72" r="2.8"/><circle cx="109" cy="72" r="2.8"/>
          <circle cx="89" cy="86.5" r="1.7"/><circle cx="93.5" cy="90" r="1.7"/><circle cx="100" cy="91.5" r="1.7"/>
          <circle cx="106.5" cy="90" r="1.7"/><circle cx="111" cy="86.5" r="1.7"/></g>
        ${pick(NARIZ, sel.nariz)}
        ${pick(GAFAS, sel.gafas)}
        ${pick(CUELLO, sel.cuello)}
        ${pick(MANO, sel.mano)}
        ${sweat}
      </g>
      ${drips}
      <g class="hat-fall">${pick(HATS, sel.sombrero)}</g>
    </svg>`;
  }

  /* ================= ESTILOS ================= */
  const css = `
  .mn { text-align: center; }
  .mn-intro { margin: 0 0 8px; font-size: .9rem; font-weight: 600; color: #7a5848; }
  .mn-stage {
    height: 172px; border-radius: 14px; overflow: hidden;
    display: flex; justify-content: center; align-items: flex-end; padding: 6px 0 2px;
    background: linear-gradient(#cfe6f7 0, #eef6fd 68%, #ffffff 68%);
    box-shadow: 0 0 0 3px var(--gold);
  }
  .mn-stage .mn-svg { display: block; height: 100%; width: auto; transform-origin: 50% 100%; }
  .mn-stage.bump .mn-svg { animation: mnBump .3s ease; }
  .mn-tabs { display: flex; gap: 2px; margin: 12px 0 8px; }
  .mn-tab {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 1px;
    padding: 5px 0 4px; background: none; border: 0; border-bottom: 3px solid transparent;
    cursor: pointer; font-family: var(--sans); color: #7a5848;
  }
  .mn-tab.on { border-bottom-color: var(--gold); color: var(--text); }
  .mn-tab-i { font-size: 1.3rem; line-height: 1.2; }
  .mn-tab-n { font-size: .66rem; font-weight: 700; }
  .mn-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
  .mn-chip {
    font: 700 .85rem var(--sans); color: var(--text);
    background: #fff; border: 2px solid var(--gold); border-radius: 999px;
    padding: 6px 11px; cursor: pointer; transition: background .15s, transform .1s;
  }
  .mn-chip:active { transform: translateY(1px); }
  .mn-chip.on { background: var(--gold-l); border-color: #c4932a; }
  .mn-actions { margin-top: 14px; display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .mn-btn {
    font: 700 1rem var(--sans); color: var(--cream); background: var(--red);
    border: 0; border-radius: 999px; padding: 10px 30px; cursor: pointer;
  }
  .mn-link { background: none; border: 0; cursor: pointer; font: 600 .85rem var(--sans); color: #a0786a; text-decoration: underline; }

  /* escena del derretimiento */
  .mn-scene {
    position: relative; width: 100%; aspect-ratio: 4 / 3; border-radius: 14px; overflow: hidden;
    background: #9ad6ff; box-shadow: 0 0 0 3px var(--gold);
  }
  .mn-scene.nofoto { background: linear-gradient(#8fd3ff 0 58%, #f1d9a2 58% 100%); }
  .mn-photo { position: absolute; inset: 0; width: 100%; height: 100%; max-width: none !important; object-fit: cover; border-radius: 0 !important; }
  .mn-miss { position: absolute; left: 8px; top: 8px; z-index: 3; font: 700 .7rem var(--sans); color: #fff; background: rgba(0,0,0,.4); padding: 3px 8px; border-radius: 999px; }
  .mn-snow { position: absolute; bottom: 2%; width: 38%; aspect-ratio: 200 / 260; }
  .mn-derecha .mn-snow { right: 4%; }
  .mn-izquierda .mn-snow { left: 4%; }
  .mn-centro .mn-snow { left: 50%; transform: translateX(-50%); }
  .mn-snow .mn-svg { display: block; width: 100%; height: 100%; overflow: visible; }
  .mn-heat {
    position: absolute; inset: 0; pointer-events: none; opacity: 0;
    background: radial-gradient(circle at 92% 6%, rgba(255,170,40,.75), rgba(255,140,40,.25) 45%, rgba(255,140,40,0) 75%);
    animation: mnHeat 9s ease-in both;
  }
  .mn-sun {
    position: absolute; top: 6px; right: 10px; font-size: 2.2rem; line-height: 1;
    filter: drop-shadow(0 0 8px rgba(255,200,60,.9)); animation: mnSun 9s ease-in both;
  }
  .mn-cap { margin: 12px 0 0; font-weight: 700; min-height: 1.5em; }

  .mn-melting .m-all { transform-origin: 100px 241px; animation: mnMelt 8s cubic-bezier(.5, 0, .6, 1) 1s both; }
  .mn-melting .puddle { transform-origin: 100px 241px; animation: mnPuddle 8s ease-in 1s both; }
  .mn-melting .hat-fall { transform-origin: 100px 56px; animation: mnHat 8s ease-in 1s both; }
  .mn-melting .drip { opacity: 0; animation: mnDrip 1.5s ease-in infinite; }
  .mn-melting .sweat { opacity: 0; animation: mnSweat 1.8s ease-in 1.2s infinite; }

  @keyframes mnBump { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
  @keyframes mnMelt {
    0% { transform: scale(1, 1); }
    25% { transform: scale(1.03, .93); }
    60% { transform: scale(1.18, .55); }
    100% { transform: scale(1.42, .24); }
  }
  @keyframes mnPuddle {
    0% { transform: scale(.15, .3); opacity: 0; }
    15% { opacity: .9; }
    100% { transform: scale(1.45, 1.25); opacity: .9; }
  }
  @keyframes mnHat {
    0% { transform: none; }
    20% { transform: translate(0, 6px) rotate(-3deg); }
    50% { transform: translate(6px, 40px) rotate(10deg); }
    75% { transform: translate(20px, 92px) rotate(22deg); }
    100% { transform: translate(38px, 132px) rotate(34deg); }
  }
  @keyframes mnDrip { 0% { opacity: 0; transform: translateY(0); } 15% { opacity: 1; } 100% { opacity: 0; transform: translateY(46px); } }
  @keyframes mnSweat { 0% { opacity: 0; transform: translateY(0); } 15% { opacity: 1; } 100% { opacity: 0; transform: translateY(22px); } }
  @keyframes mnHeat { 0% { opacity: 0; } 100% { opacity: 1; } }
  @keyframes mnSun { 0% { transform: scale(.8); } 100% { transform: scale(1.8) rotate(40deg); } }

  @media (prefers-reduced-motion: reduce) {
    .mn-melting *, .mn-sun, .mn-heat, .mn-stage.bump .mn-svg { animation-duration: .01s !important; animation-delay: 0s !important; animation-iteration-count: 1 !important; }
    .mn-melting .drip, .mn-melting .sweat { display: none; }
  }
  `;

  function injectCss() {
    if (document.getElementById('mn-css')) return;
    const s = document.createElement('style');
    s.id = 'mn-css';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function h(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* ================= PASO 1: VESTIR ================= */
  function vestir(host) {
    const sel = Object.assign({}, DEFECTO);
    let tab = 0;

    host.innerHTML = '';
    const wrap = h('div', 'mn');
    const stage = h('div', 'mn-stage');
    const tabs = h('div', 'mn-tabs');
    tabs.setAttribute('role', 'tablist');
    const chips = h('div', 'mn-chips');
    const actions = h('div', 'mn-actions');
    const ok = h('button', 'mn-btn', TEXTOS.ok);
    ok.type = 'button';
    const reset = h('button', 'mn-link', TEXTOS.reiniciar);
    reset.type = 'button';
    actions.append(ok, reset);
    wrap.append(h('p', 'mn-intro', TEXTOS.intro), stage, tabs, chips, actions);
    host.appendChild(wrap);

    function pintar(bump) {
      stage.innerHTML = svg(sel, false);
      if (bump) { stage.classList.remove('bump'); void stage.offsetWidth; stage.classList.add('bump'); }

      tabs.innerHTML = '';
      CATS.forEach((c, i) => {
        const b = h('button', 'mn-tab' + (i === tab ? ' on' : ''));
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-selected', String(i === tab));
        b.append(h('span', 'mn-tab-i', c.ico), h('span', 'mn-tab-n', c.nom));
        b.onclick = () => { tab = i; pintar(false); };
        tabs.appendChild(b);
      });

      chips.innerHTML = '';
      const c = CATS[tab];
      [{ k: null, ico: '🚫', nom: 'Cap' }].concat(c.ops).forEach(o => {
        const b = h('button', 'mn-chip' + ((sel[c.id] || null) === o.k ? ' on' : ''), `${o.ico} ${o.nom}`);
        b.type = 'button';
        b.onclick = () => { sel[c.id] = o.k; pintar(true); };
        chips.appendChild(b);
      });
    }

    reset.onclick = () => {
      Object.keys(sel).forEach(k => delete sel[k]);
      Object.assign(sel, DEFECTO);
      pintar(true);
    };
    ok.onclick = () => derretir(host, Object.assign({}, sel));

    pintar(false);
  }

  /* ================= PASO 2: DERRETIR ================= */
  function derretir(host, sel) {
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    host.innerHTML = '';
    const wrap = h('div', 'mn');
    const box = h('div', 'mn-scene mn-' + POSICION);

    const img = new Image();
    img.className = 'mn-photo';
    img.alt = 'La nostra foto';
    img.onerror = () => {
      img.remove();
      box.classList.add('nofoto');
      box.appendChild(h('span', 'mn-miss', 'Falta la foto ' + FOTO));
    };
    img.src = FOTO;

    const snow = h('div', 'mn-snow');
    snow.innerHTML = svg(sel, true);
    box.append(img, snow, h('div', 'mn-heat'), h('div', 'mn-sun', '☀️'));

    const cap = h('p', 'mn-cap', TEXTOS.calor1);
    cap.setAttribute('aria-live', 'polite');
    const again = h('button', 'mn-btn', TEXTOS.otro);
    again.type = 'button';
    again.hidden = true;
    again.style.marginTop = '12px';
    again.onclick = () => vestir(host);

    wrap.append(box, cap, again);
    host.appendChild(wrap);

    const espera = (ms, fn) => setTimeout(() => { if (host.isConnected) fn(); }, reduce ? 0 : ms);
    espera(4500, () => { cap.textContent = TEXTOS.calor2; });
    espera(9500, () => { cap.textContent = TEXTOS.fin; again.hidden = false; });
  }

  /* app.js llama a esto cada vez que se abre una habitación */
  window.initMuneco = function (root) {
    const host = root && root.querySelector('[data-muneco]');
    if (!host) return;
    injectCss();
    vestir(host);
  };
})();
