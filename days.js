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
  /*  1 */ { titulo: "", html: "" }, // intro
  /*  2 */ { titulo: "Rasca i guanya", html: '<div data-rasca></div>' },
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
  /* 14 */ { titulo: "Rasca i guanya", html: "<div data-rasca data-img='contingut/xuxes.jpg' data-msg='Xuxes per alegrar el dia' data-alt='Xuxes'></div>" },
  /* 15 */ { titulo: "", html: "" }, // adivinalla
  /* 16 */ { titulo: "Quin personatge de Nadal ets?", html: '<div data-personatge></div>' },
  /* 17 */ { titulo: "Una carta per a tu", html: "<div data-sobre data-img='contingut/shanghai.jpeg' data-alt='Xina'></div>" },
  /* 18 */ { titulo: "Fun fact", html: "A República Txeca per Nadal és tradició llençar una sabata per sobre de l'hombro. Si la punta de la sabata senyala a la porta, suposadament et cases l'any vinent. (in case u wanna try)" },
  /* 19 */ { titulo: "Repte del dia", html: "Escriu tres objectius pel 2027" },
  /* 20 */ { titulo: "Bola de vidre", html: '<div data-bola></div>' },
  /* 21 */ { titulo: "4 dies per Nadal", html: '<img src="contingut/foto-tres.jpeg" alt="Foto">' },
  /* 22 */ { titulo: "", html: "" }, // xurros
  /* 23 */ { titulo: "", html: "" }, // envia una foto pel grup
  /* 24 */ { titulo: "", html: "" }, // regalet
];
