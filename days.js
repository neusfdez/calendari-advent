/*
  CONTENIDO DE CADA DÍA
  ---------------------
  De momento están vacíos. Para rellenar un día, cambia su objeto:

    { titulo: "Un pingüino patinador", html: "<p>Texto, <b>HTML</b>, imágenes…</p>" }

  - titulo: opcional, aparece bajo "Día N".
  - html:   lo que se verá dentro de la habitación. Puede llevar <img src="img/dia1.jpg">,
            un <iframe> de Spotify/YouTube, enlaces, etc.

  Si un día se queda vacío, se muestra un mensaje de "pronto habrá una sorpresa".
*/
window.DAYS = [
  /* 1 */ { titulo: "It's tiimeeee", html: "<iframe src='https://www.youtube.com/embed/2qIZ1A3P8po' style='width:100%;aspect-ratio:16/9;border:0' allow='encrypted-media; picture-in-picture; fullscreen' allowfullscreen loading='lazy'></iframe>" },
  /*  2 */ { titulo: "Rasca i guanya", html: "<div data-rasca data-img='contingut/bombon.jpg' data-msg='Us porto xocolatitos' data-alt='Un bombó' data-emoji='🍫'></div>" },
  /*  3 */ { titulo: "Repte del dia", html: "Escriu tres coses de les que estiguis orgullos/a d'aquest any" },
  /*  4 */ { titulo: "El gatet et desitja un bon dia", html: '<img src="contingut/gat.jpg" alt="Foto">' },
  /*  5 */ { titulo: "Bon dia", html: '<p>De quan encara erem universitaris i no teniem responsabilitats d\'adult...</p><img src="contingut/casa-geri.jpeg" alt="Foto">' },
  /*  6 */ { titulo: "Vesteix al ninot de neu", html: '<div data-muneco></div>' },
  /*  7 */ { titulo: "<3", html: "Avui només et vull dir que t'estimo molt ❤️" },
  /*  8 */ { titulo: "Throwback to Zhangjiajie", html: '<iframe src="https://open.spotify.com/embed/track/76FZM38RC8XaAjJ77CVTNe?utm_source=generator&si=a5c3e66e751b4960" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>' },
  /*  9 */ { titulo: "Galeta de la sort", html: '<div data-galeta></div>' },
  /* 10 */ { titulo: "Gradua2", html: "<p>Petit recordatori de que aquest any we graduadooo 🎓 moment per estar proud de nosaltres</p><img src='contingut/gradu1.jpeg' alt='gradua2'><img src='contingut/gradu2.jpeg' alt='gradua2'>" },
  /* 11 */ { titulo: "Repte del dia", html: "<p>Posa't mitjons de nadal o amb estampat guai</p><img src='contingut/mitjons.jpg' alt='Mitjons de Nadal'>" },
  /* 12 */ { titulo: "Endevina la peli", html: '<div data-quiz></div>' },
  /* 13 */ { titulo: "Pure cinema", html: '<video src="video/samurai.mp4" controls playsinline preload="metadata" style="max-height:44svh"></video>' },
  /* 14 */ { titulo: "No perdem mai la tradició dels pokes please", html: "<img src='contingut/poke.jpeg' alt='poke'>" },
  /* 15 */ { titulo: "Rasca i guanya", html: "<div data-rasca data-img='contingut/xuxes.jpg' data-msg='Xuxes per alegrar el dia' data-alt='Xuxes'></div>" },
  /* 16 */ { titulo: "Quin personatge de Nadal ets?", html: '<div data-personatge></div>' },
  /* 17 */ { titulo: "Postal de Nadal", html: "<p>Teniu un repte: fer una postal de nadal amb Strava.</p><p>@mary ho sento però t’hauràs de instalar la app de corredors... 😅</p><p>Per fer-ho sortiu a còrrer / caminar fent una forma d’algo relacionat amb el nadal 🎅⭐🎁</p><p>Us deixo alguns exemples de rutes meves del strava pq us serveixi de inspiració 👇</p><div style='display:flex;gap:8px;align-items:flex-start;margin-top:10px'><img src='contingut/strava1.jpeg' alt='Ruta de Strava 1' style='width:calc(50% - 4px);height:auto'><img src='contingut/strava2.jpg' alt='Ruta de Strava 2' style='width:calc(50% - 4px);height:auto'></div>" },
  /* 18 */ { titulo: "Una carta per a tu", html: "<div data-sobre data-img='contingut/shanghai.jpeg' data-alt='Xina'></div>" },
  /* 19 */ { titulo: "Repte del dia", html: "Escriu tres objectius pel 2027" },
  /* 20 */ { titulo: "Matí navideño", html: 'Quedem a les 10h, estigueu preparats!' }, // xurros
  /* 21 */ { titulo: "4 dies per Nadal", html: '<img src="contingut/foto-tres.jpeg" alt="Foto">' },
  /* 22 */ { titulo: "Bola de vidre", html: '<div data-bola></div>' },
  /* 23 */ { titulo: "Repte del dia", html: "<p>Avui toca fer <b>3 fotos</b> i enviar-les al grup abans de mitjanit:</p><ol style='text-align:left'><li>El teu esmorzar</li><li>Una decoració de Nadal que vegis pel carrer ⭐</li><li>L'arbre de Nadal de casa teva 🎄</li></ol>" },
  /* 24 */ { titulo: "Bon Nadal 🎄", html: "<p>Tinc una última cosa per vosaltres, per haver arribat al dia 24, quan ens veguem us la dono.</p><p>Ja heu arribat al final del calendari!! Espero que us hagi agradat, l’he fet amb molt amor pq i love u molt. Disfruteu del Nadal amb tanta ilusió com jo.</p>" },
];

