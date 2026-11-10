/* KidsGame: utilidades compartidas para todos los juegos (sin internet, sin librerías). */
(function () {
  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null;
  function audio() {
    if (!AC) return null;
    if (!ctx) { try { ctx = new AC(); } catch (e) { return null; } }
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    return ctx;
  }
  function tone(freq, dur, type, when, vol) {
    var c = audio(); if (!c) return;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    var t = c.currentTime + (when || 0);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.25, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.05);
  }
  var sounds = {
    tap:   function () { tone(600, 0.08, 'square', 0, 0.12); },
    pop:   function () { tone(900, 0.06, 'sine', 0, 0.2); tone(300, 0.1, 'sine', 0.03, 0.15); },
    ok:    function () { tone(523, 0.12, 'sine'); tone(659, 0.12, 'sine', 0.1); tone(784, 0.2, 'sine', 0.2); },
    wrong: function () { tone(220, 0.18, 'sawtooth', 0, 0.12); tone(180, 0.25, 'sawtooth', 0.15, 0.12); },
    win:   function () { [523, 659, 784, 1047, 784, 1047].forEach(function (f, i) { tone(f, 0.18, 'triangle', i * 0.13, 0.25); }); },
    note:  function (freq) { tone(freq, 0.5, 'triangle', 0, 0.3); }
  };
  // Desbloquea el audio con el primer toque (requisito de Android/Chrome)
  document.addEventListener('touchstart', audio, { once: true, passive: true });
  document.addEventListener('mousedown', audio, { once: true });

  function say(text) {
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-MX'; u.rate = 0.9; u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }
  function vibrate(ms) { try { if (navigator.vibrate) navigator.vibrate(ms || 30); } catch (e) {} }

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function rand(n) { return Math.floor(Math.random() * n); }
  function pick(a) { return a[rand(a.length)]; }

  var stars = 0, starsEl = null;
  function addStar(n) {
    stars += (n || 1);
    if (starsEl) { starsEl.textContent = '⭐ ' + stars; starsEl.classList.remove('pop'); void starsEl.offsetWidth; starsEl.classList.add('pop'); }
    try {
      var key = 'kg-total-stars';
      localStorage.setItem(key, String((parseInt(localStorage.getItem(key) || '0', 10) || 0) + (n || 1)));
      var per = JSON.parse(localStorage.getItem('kg-stars-game') || '{}');
      var g = (location.pathname.match(/([^\/]+)\.html?$/) || [0, 'menu'])[1];
      per[g] = (per[g] || 0) + (n || 1); localStorage.setItem('kg-stars-game', JSON.stringify(per));
      var day = new Date().toISOString().slice(0, 10);
      var days = JSON.parse(localStorage.getItem('kg-stars-day') || '{}');
      days[day] = (days[day] || 0) + (n || 1); localStorage.setItem('kg-stars-day', JSON.stringify(days));
    } catch (e) {}
  }

  function confetti(n) {
    var colors = ['#f582ae', '#3da9fc', '#2cb67d', '#ffb703', '#7f5af0', '#ff8906'];
    for (var i = 0; i < (n || 60); i++) {
      var d = document.createElement('div');
      d.className = 'kg-confetti';
      d.style.left = Math.random() * 100 + 'vw';
      d.style.background = pick(colors);
      d.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
      d.style.animationDelay = (Math.random() * 0.6) + 's';
      document.body.appendChild(d);
      (function (el) { setTimeout(function () { el.remove(); }, 3800); })(d);
    }
  }

  var overlay = null;
  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'kg-overlay';
    overlay.innerHTML = '<div class="box"><div class="starsrow"></div><div class="msg"></div><div class="sub"></div><div class="row"></div></div>';
    document.body.appendChild(overlay);
    return overlay;
  }
  // celebrate({ msg, sub, stars, onAgain, onNext }) -> muestra "¡Muy bien!" con botones
  function celebrate(opts) {
    opts = opts || {};
    var o = ensureOverlay();
    o.querySelector('.msg').textContent = opts.msg || pick(['¡Muy bien!', '¡Excelente!', '¡Lo lograste!', '¡Bravo!', '¡Genial!']);
    o.querySelector('.sub').textContent = opts.sub || '';
    var s = opts.stars == null ? 3 : opts.stars;
    var sr = o.querySelector('.starsrow'); sr.innerHTML = ''; for (var si = 0; si < Math.max(0, s); si++) { var sp = document.createElement('span'); sp.textContent = '⭐'; sp.style.animationDelay = (0.15 + si * 0.18) + 's'; sr.appendChild(sp); }
    var row = o.querySelector('.row'); row.innerHTML = '';
    function btn(txt, cls, fn) { var b = document.createElement('button'); b.className = 'btn ' + cls; b.textContent = txt; b.onclick = function () { sounds.tap(); o.classList.remove('show'); fn && fn(); }; row.appendChild(b); }
    if (opts.onNext) btn('Siguiente ▶', 'green', opts.onNext);
    if (opts.onAgain) btn('Otra vez 🔁', 'blue', opts.onAgain);
    btn('Menú 🏠', 'yellow', function () { go('../index.html'); });
    var rw = o.querySelector('.reward'); if (!rw) { rw = document.createElement('div'); rw.className = 'reward'; o.querySelector('.box').insertBefore(rw, o.querySelector('.row')); }
    if (pendingReward) {
      var R = pendingReward; pendingReward = null;
      rw.innerHTML = '<div class="rw-ttl">🎁 ¡Nuevo sticker!</div><div class="rw-row"><div class="rw-st' + (R.gold ? ' gold' : '') + '"><span class="emoji">' + R.e + '</span><span>' + R.n + '</span></div>' +
        (R.extra ? '<div class="rw-st' + (R.extra.gold ? ' gold' : '') + '"><span class="emoji">' + R.extra.e + '</span><span>' + R.extra.n + '</span></div>' : '') + '</div><div class="rw-sub">Álbum: ' + (R.extra ? R.extra.total : R.total) + ' / ' + R.max + (R.extra ? ' · ¡Reto del día cumplido! 🌟' : '') + '</div>';
      rw.style.display = 'block';
    } else { rw.style.display = 'none'; }
    o.classList.add('show');
    sounds.win(); confetti(); vibrate(80); music.duck(2500);
    if (opts.say !== false) say(o.querySelector('.msg').textContent);
  }

  var toastTimer = null;
  function toast(text, ms) {
    var t = document.getElementById('kg-toast');
    if (!t) { t = document.createElement('div'); t.id = 'kg-toast'; document.body.appendChild(t); }
    t.textContent = text; t.style.display = 'block';
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.style.display = 'none'; }, ms || 1200);
  }

  // init({ title, showStars }) -> crea la barra superior con botón de regreso y devuelve el contenedor del juego
  // loading(texto) muestra un aviso con la mascota mientras se calcula algo pesado; devuelve función para cerrarlo
  function loading(text) {
    var d = document.createElement('div'); d.id = 'kg-loading'; d.innerHTML = '<div class="panel bx">' + mascotSVG(90) + '<div class="tx">' + (text || 'Preparando…') + '</div><div class="dots"><i></i><i></i><i></i></div></div>';
    document.body.appendChild(d); return function () { d.remove(); };
  }
  // defer(fn) ejecuta fn después de pintar la pantalla (para que el aviso de carga se vea)
  function defer(fn) { requestAnimationFrame(function () { setTimeout(fn, 30); }); }
  function go(url) { document.body.classList.add('kg-out'); setTimeout(function () { location.href = url; }, 220); }
  function init(opts) {
    opts = opts || {};
    var bar = document.createElement('div');
    bar.className = 'topbar';
    var back = document.createElement('button');
    back.className = 'btn round blue'; back.textContent = '🏠'; back.setAttribute('aria-label', 'Menú');
    back.onclick = function () { sounds.tap(); go('../index.html'); };
    bar.appendChild(back);
    var h = document.createElement('h1'); h.textContent = opts.title || ''; bar.appendChild(h);
    starsEl = document.createElement('div'); starsEl.className = 'stars'; starsEl.textContent = '⭐ 0';
    if (opts.showStars === false) starsEl.style.display = 'none';
    bar.appendChild(starsEl);
    var mb = document.createElement('button'); mb.id = 'kg-music-btn'; mb.className = 'btn round purple'; mb.textContent = music.isOn() ? '🎵' : '🔇'; mb.setAttribute('aria-label', 'Música');
    mb.onclick = function () { sounds.tap(); music.toggle(); };
    bar.insertBefore(mb, starsEl);
    document.body.insertBefore(bar, document.body.firstChild);
    document.body.classList.add('kg-in');
    var game = document.querySelector('.game');
    if (!game) { game = document.createElement('div'); game.className = 'game'; document.body.appendChild(game); }
    return game;
  }


  // levelPicker({ title, onPick }) -> pantalla "Elige tu nivel" con 3 botones; llama onPick(1|2|3).
  // Recuerda el último nivel elegido por juego (localStorage) y lo marca con un anillo.

  // ======================= Capa de diseño de juego =======================
  // ---- Mascota "Mazi" (zorrita) en SVG, con parpadeo y boca que habla ----
  function mascotSVG(size) {
    size = size || 120;
    return '<svg class="kg-mazi" viewBox="0 0 120 120" width="' + size + '" height="' + size + '" aria-hidden="true">' +
      '<defs><radialGradient id="mzf" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffb866"/><stop offset="1" stop-color="#f07a1f"/></radialGradient>' +
      '<radialGradient id="mzw" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#f3e6d8"/></radialGradient></defs>' +
      '<ellipse cx="60" cy="112" rx="34" ry="6" fill="rgba(0,0,0,.18)"/>' +
      '<path d="M22 44 L14 12 L44 30 Z" fill="url(#mzf)" stroke="#c8601a" stroke-width="2" stroke-linejoin="round"/><path d="M98 44 L106 12 L76 30 Z" fill="url(#mzf)" stroke="#c8601a" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M26 40 L20 20 L38 32 Z" fill="#ffd9b8"/><path d="M94 40 L100 20 L82 32 Z" fill="#ffd9b8"/>' +
      '<ellipse cx="60" cy="64" rx="44" ry="40" fill="url(#mzf)" stroke="#c8601a" stroke-width="2"/>' +
      '<path d="M26 72 Q60 112 94 72 Q78 92 60 92 Q42 92 26 72Z" fill="url(#mzw)"/>' +
      '<g class="mz-eyes"><ellipse cx="44" cy="58" rx="7" ry="8" fill="#fff"/><ellipse cx="76" cy="58" rx="7" ry="8" fill="#fff"/>' +
      '<circle cx="45" cy="60" r="4.2" fill="#2b2b2b"/><circle cx="77" cy="60" r="4.2" fill="#2b2b2b"/><circle cx="46.5" cy="58" r="1.5" fill="#fff"/><circle cx="78.5" cy="58" r="1.5" fill="#fff"/></g>' +
      '<ellipse cx="60" cy="78" rx="7" ry="5" fill="#2b2b2b"/><ellipse cx="58" cy="76.5" rx="2.5" ry="1.5" fill="#fff" opacity=".7"/>' +
      '<path class="mz-mouth" d="M50 86 Q60 94 70 86" stroke="#9c3b12" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<circle cx="34" cy="74" r="5" fill="#ff8aa8" opacity=".55"/><circle cx="86" cy="74" r="5" fill="#ff8aa8" opacity=".55"/></svg>';
  }
  var talkTimer = null;
  function mascotTalk(el, ms) {
    el = el || document.querySelector('.kg-mazi'); if (!el) return;
    el.classList.add('talk'); clearTimeout(talkTimer);
    talkTimer = setTimeout(function () { el.classList.remove('talk'); }, ms || 2500);
  }
  // say() hace hablar a la mascota si está en pantalla
  var _say = say;
  say = function (text) { _say(text); mascotTalk(null, Math.min(6000, 1200 + text.length * 70)); };

  // ---- Efectos (partículas, texto flotante, sacudida) ----
  var fx = {
    burst: function (x, y, opts) {
      opts = opts || {}; var n = opts.n || 14, colors = opts.colors || ['#ffd166', '#ff6f61', '#3da9fc', '#2cb67d', '#f582ae', '#fff'];
      var chars = opts.chars || null;
      for (var i = 0; i < n; i++) {
        var d = document.createElement('div'); d.className = 'kg-p' + (chars ? ' ch' : '');
        var a = (Math.PI * 2 * i) / n + Math.random() * 0.5, r = (opts.r || 70) * (0.6 + Math.random() * 0.7);
        d.style.left = x + 'px'; d.style.top = y + 'px';
        d.style.setProperty('--dx', Math.cos(a) * r + 'px'); d.style.setProperty('--dy', Math.sin(a) * r - 30 + 'px');
        if (chars) d.textContent = pick(chars); else d.style.background = pick(colors);
        d.style.animationDuration = (0.6 + Math.random() * 0.4) + 's';
        document.body.appendChild(d); (function (el) { setTimeout(function () { el.remove(); }, 1100); })(d);
      }
    },
    burstAt: function (el, opts) { var b = el.getBoundingClientRect(); fx.burst(b.left + b.width / 2, b.top + b.height / 2, opts); },
    floatText: function (x, y, text, cls) {
      var d = document.createElement('div'); d.className = 'kg-float ' + (cls || ''); d.textContent = text;
      d.style.left = x + 'px'; d.style.top = y + 'px'; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 1300);
    },
    shake: function (el) { el = el || document.body; el.classList.remove('kg-shake'); void el.offsetWidth; el.classList.add('kg-shake'); setTimeout(function () { el.classList.remove('kg-shake'); }, 450); },
    ring: function (el) { var b = el.getBoundingClientRect(); var d = document.createElement('div'); d.className = 'kg-ring'; d.style.left = (b.left + b.width / 2) + 'px'; d.style.top = (b.top + b.height / 2) + 'px'; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 800); }
  };

  // ---- Manita de tutorial: hand({ el }) toca; hand({ from, to }) arrastra. Devuelve {stop} ----
  function hand(opts) {
    opts = opts || {}; var h = document.createElement('div'); h.className = 'kg-hand'; h.textContent = '👆';
    document.body.appendChild(h); var alive = true;
    function center(el) { var b = el.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }
    function loop() {
      if (!alive) return;
      var a = opts.from ? center(opts.from) : center(opts.el), b = opts.to ? center(opts.to) : null;
      h.style.transition = 'none'; h.style.left = a.x + 'px'; h.style.top = a.y + 'px'; h.classList.remove('press');
      setTimeout(function () { if (!alive) return; h.classList.add('press');
        if (b) { h.style.transition = 'left 1s ease-in-out, top 1s ease-in-out'; h.style.left = b.x + 'px'; h.style.top = b.y + 'px'; }
        setTimeout(function () { if (!alive) return; h.classList.remove('press'); setTimeout(loop, 500); }, b ? 1100 : 500);
      }, 400);
    }
    loop();
    var stop = function () { alive = false; h.remove(); };
    if (opts.until !== false) { document.addEventListener('pointerdown', function once() { document.removeEventListener('pointerdown', once); setTimeout(stop, 50); }, true); }
    if (opts.timeout) setTimeout(stop, opts.timeout);
    return { stop: stop, el: h };
  }

  // ---- Música de fondo generada (chiptune suave), con botón 🎵 en la barra ----
  var music = (function () {
    var on = true, playing = false, theme = 'alegre', node = null, timer = null, step = 0, nextT = 0, gain = null;
    try { on = localStorage.getItem('kg-music') !== 'off'; } catch (e) {}
    var THEMES = {
      alegre:   { bpm: 118, bass: [0, 0, 5, 5, 7, 7, 5, 5], lead: [12, 16, 19, 16, 12, 16, 19, 24, 17, 21, 24, 21, 17, 21, 24, 28, 19, 23, 26, 23, 19, 23, 26, 31, 17, 21, 24, 21, 19, 16, 12, 7], type: 'triangle' },
      calma:    { bpm: 84,  bass: [0, 0, 0, 0, -3, -3, -3, -3, 5, 5, 5, 5, 7, 7, 7, 7], lead: [12, 16, 19, 23, 19, 16, 12, 16, 9, 12, 16, 19, 16, 12, 9, 12, 17, 21, 24, 28, 24, 21, 17, 21, 19, 23, 26, 23, 19, 16, 12, 7], type: 'sine' },
      aventura: { bpm: 132, bass: [0, 0, 0, 0, -2, -2, -2, -2, 3, 3, 3, 3, -4, -4, -2, -2], lead: [12, 15, 19, 15, 12, 15, 19, 22, 10, 14, 17, 14, 10, 14, 17, 22, 15, 19, 22, 19, 15, 19, 22, 27, 8, 12, 15, 12, 10, 14, 17, 19], type: 'square' }
    };
    function freq(semi) { return 130.81 * Math.pow(2, semi / 12); }
    function tick() {
      var c = audio(); if (!c || !playing) return;
      var T = THEMES[theme], beat = 60 / T.bpm / 2;
      while (nextT < c.currentTime + 0.25) {
        var i = step % T.lead.length, b = step % (T.bass.length * 2);
        var o = c.createOscillator(), g = c.createGain(); o.type = T.type; o.frequency.value = freq(T.lead[i]);
        g.gain.setValueAtTime(0.0001, nextT); g.gain.exponentialRampToValueAtTime(0.06, nextT + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, nextT + beat * 0.9);
        o.connect(g); g.connect(gain); o.start(nextT); o.stop(nextT + beat);
        if (b % 2 === 0) { var ob = c.createOscillator(), gb = c.createGain(); ob.type = 'sine'; ob.frequency.value = freq(T.bass[(b / 2) % T.bass.length] - 12);
          gb.gain.setValueAtTime(0.0001, nextT); gb.gain.exponentialRampToValueAtTime(0.09, nextT + 0.02); gb.gain.exponentialRampToValueAtTime(0.0001, nextT + beat * 1.6);
          ob.connect(gb); gb.connect(gain); ob.start(nextT); ob.stop(nextT + beat * 2); }
        nextT += beat; step++;
      }
      timer = setTimeout(tick, 120);
    }
    function start(th) {
      if (th) theme = THEMES[th] ? th : 'alegre';
      if (!on || playing) return; var c = audio(); if (!c) return;
      if (!gain) { gain = c.createGain(); gain.gain.value = 0.5; gain.connect(c.destination); }
      playing = true; nextT = c.currentTime + 0.1; step = 0; tick(); updateBtn();
    }
    function stop() { playing = false; clearTimeout(timer); updateBtn(); }
    function toggle() { on = !on; try { localStorage.setItem('kg-music', on ? 'on' : 'off'); } catch (e) {} if (on) start(); else stop(); updateBtn(); }
    function updateBtn() { var b = document.getElementById('kg-music-btn'); if (b) b.textContent = on ? '🎵' : '🔇'; }
    function duck(ms) { if (!gain) return; var c = audio(); gain.gain.cancelScheduledValues(c.currentTime); gain.gain.setValueAtTime(0.12, c.currentTime); gain.gain.linearRampToValueAtTime(0.5, c.currentTime + (ms || 1500) / 1000); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else if (on && pendingTheme) start(pendingTheme); });
    var pendingTheme = null;
    return { start: function (t) { pendingTheme = t || theme; start(t); }, stop: stop, toggle: toggle, duck: duck, isOn: function () { return on; } };
  })();

  // ---- Stickers de recompensa ----
  var STICKERS = [
    ['Animales', '🦊 Zorrito,🐼 Panda,🦁 León,🐨 Koala,🦒 Jirafa,🐧 Pingüino,🦉 Búho,🐢 Tortuga,🦜 Loro,🐬 Delfín,🦋 Mariposa,🐝 Abeja'],
    ['Fantasía', '🦄 Unicornio,🐉 Dragón,🧚 Hada,🧜 Sirena,🧞 Genio,🏰 Castillo,🪄 Varita,👑 Corona,🧙 Mago,🦸 Superheroína,🧸 Osito,🎠 Carrusel'],
    ['Espacio', '🚀 Cohete,🪐 Saturno,🌙 Luna,☀️ Sol,⭐ Estrella,☄️ Cometa,👩‍🚀 Astronauta,🛸 Ovni,🌍 Tierra,🌌 Galaxia,🔭 Telescopio,👽 Marcianito'],
    ['Mar', '🐙 Pulpo,🦀 Cangrejo,🐠 Pez,🦈 Tiburón,🐳 Ballena,🐚 Caracol,🧜‍♂️ Tritón,⛵ Velero,🏝️ Isla,🪸 Coral,🦑 Calamar,🐡 Pez globo'],
    ['Dinos', '🦕 Brontosaurio,🦖 T-Rex,🥚 Huevo,🌋 Volcán,🦴 Hueso,🌴 Palmera,🪨 Roca,🐊 Cocodrilo,🦎 Lagartija,🌿 Helecho,🔥 Fuego,🍖 Carne'],
    ['Dulces', '🍩 Dona,🧁 Pastelito,🍭 Paleta,🍦 Helado,🍪 Galleta,🎂 Pastel,🍫 Chocolate,🍬 Dulce,🍰 Rebanada,🥞 Hot cakes,🍉 Sandía,🍓 Fresa']
  ].map(function (c) { return { name: c[0], items: c[1].split(',').map(function (x) { var i = x.indexOf(' '); return { e: x.slice(0, i), n: x.slice(i + 1) }; }) }; });
  function allStickers() { var out = []; STICKERS.forEach(function (c, ci) { c.items.forEach(function (it, ii) { out.push({ id: ci + '-' + ii, e: it.e, n: it.n, col: c.name }); }); }); return out; }
  function unlockSticker(level) {
    var owned = readJSON('kg-stickers', {}); var pool = allStickers().filter(function (s) { return !owned[s.id]; });
    if (!pool.length) return null;
    var s = pick(pool); owned[s.id] = { t: Date.now(), gold: level === 4 }; writeJSON('kg-stickers', owned);
    return { e: s.e, n: s.n, col: s.col, gold: level === 4, total: Object.keys(owned).length, max: allStickers().length };
  }
  var pendingReward = null;
  // Reto del día: 3 juegos elegidos por la fecha; completar un nivel en ellos da sticker extra
  var GAME_LIST = 'sudoku robot hanoi quien matrices patrones intruso diferencias memoria simon numeros sumas balanza tienda reloj reparte formas letras palabras rimas adivinanzas historia tangram simetria bloques rompecabezas colorear dibujar monstruo vestir piano sombras laberinto carrera pesca globos atrapa alimenta mascota gato'.split(' ');
  function dailyGames() {
    var d = new Date(), seed = d.getFullYear() * 400 + (d.getMonth() + 1) * 31 + d.getDate(), out = [], used = {};
    for (var i = 0; out.length < 3 && i < 20; i++) { seed = (seed * 9301 + 49297) % 233280; var g = GAME_LIST[seed % GAME_LIST.length]; if (!used[g]) { used[g] = 1; out.push(g); } }
    return out;
  }
  function dailyKey() { return new Date().toISOString().slice(0, 10); }

  var LEVELS = [
    { n: 1, txt: 'Fácil',   stars: '⭐',     cls: 'green'  },
    { n: 2, txt: 'Medio',   stars: '⭐⭐',    cls: 'blue'   },
    { n: 3, txt: 'Difícil', stars: '⭐⭐⭐',   cls: 'purple' },
    { n: 4, txt: 'Experto', stars: '🏆',     cls: 'yellow' }
  ];
  function gameKey() {
    var m = location.pathname.match(/([^\/]+)\.html?$/);
    return m ? m[1] : (document.title || 'juego').replace(/\W+/g, '-').toLowerCase();
  }
  function readJSON(key, def) { try { return JSON.parse(localStorage.getItem(key)) || def; } catch (e) { return def; } }
  function writeJSON(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  // levelPicker({ title, labels: {1:'3 piezas',2:'6 piezas',...}, onPick }) -> pantalla "¿Qué tan difícil?" con 4 niveles.
  // Recuerda el último nivel por juego y muestra ✅ en los niveles ya completados (ver levelDone).
  function levelPicker(opts) {
    opts = opts || {};
    var g = opts.key || gameKey();
    var key = 'kg-level-' + g;
    var last = 0; try { last = parseInt(localStorage.getItem(key) || '0', 10) || 0; } catch (e) {}
    var done = readJSON('kg-done', {})[g] || {};
    var o = document.createElement('div'); o.id = 'kg-levels';
    var howto = '';
    if (opts.howto && opts.howto.length) {
      howto = '<div class="howto"><div class="mz">' + mascotSVG(110) + '</div><div class="steps">' + (opts.art ? '<div class="art emoji">' + opts.art + '</div>' : '') +
        '<div class="hw-ttl">¿Cómo se juega?</div>' + opts.howto.map(function (st) { return '<div class="st"><span class="emoji">' + st.icon + '</span><span>' + st.text + '</span></div>'; }).join('') +
        '<button class="btn round blue hw-say" aria-label="Escuchar">🔊</button></div></div>';
    }
    o.innerHTML = '<div class="box panel' + (howto ? ' with-howto' : '') + '">' + howto + '<div class="ttl">' + (opts.title || '¿Qué tan difícil?') + '</div><div class="row"></div></div>';
    var row = o.querySelector('.row');
    if (howto) {
      var speech = opts.howto.map(function (st) { return st.text; }).join('. ');
      var sayBtn = o.querySelector('.hw-say'); sayBtn.onclick = function () { sounds.tap(); say(speech); };
      setTimeout(function () { if (document.body.contains(o)) say(speech); }, 600);
    }
    LEVELS.forEach(function (L) {
      var b = document.createElement('button');
      b.className = 'btn big ' + L.cls + (last === L.n ? ' last' : '');
      var sub = opts.labels && opts.labels[L.n] ? '<span class="lv-sub">' + opts.labels[L.n] + '</span>' : '';
      b.innerHTML = '<span class="lv-stars">' + L.stars + '</span><span class="lv-txt">' + L.txt + '</span>' + sub + (done[L.n] ? '<span class="lv-done">✅</span>' : '');
      b.onclick = function () {
        sounds.tap(); try { localStorage.setItem(key, String(L.n)); } catch (e) {}
        o.classList.add('hide'); setTimeout(function () { o.remove(); }, 250);
        try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
        music.start(opts.music || 'alegre');
        opts.onPick && opts.onPick(L.n);
      };
      row.appendChild(b);
    });
    document.body.appendChild(o);
    return o;
  }
  // levelDone(nivel) -> registra que la niña completó ese nivel de este juego (para el selector y la página de progreso)
  function levelDone(level) {
    var g = gameKey(); var all = readJSON('kg-done', {}); all[g] = all[g] || {};
    all[g][level] = (all[g][level] || 0) + 1; writeJSON('kg-done', all);
    // Recompensa: 1 sticker por nivel completado (dorado en Experto); doble si el juego es reto del día
    pendingReward = unlockSticker(level);
    if (dailyGames().indexOf(g) >= 0) {
      var dd = readJSON('kg-daily', {}); var k = dailyKey(); dd[k] = dd[k] || {};
      if (!dd[k][g]) { dd[k][g] = 1; writeJSON('kg-daily', dd); var extra = unlockSticker(level); if (extra && pendingReward) pendingReward.extra = extra; }
    }
  }
  // levelBadge(level, text?) -> etiqueta "Nivel ⭐⭐" para el HUD (devuelve el elemento)
  function levelBadge(level, text) {
    var el = document.createElement('div'); el.className = 'kg-level-badge';
    el.textContent = (text || 'Nivel') + ' ' + (LEVELS[Math.min(4, Math.max(1, level)) - 1].stars);
    return el;
  }

  window.KidsGame = {
    init: init, sound: sounds, say: say, vibrate: vibrate,
    shuffle: shuffle, rand: rand, pick: pick,
    addStar: addStar, getStars: function () { return stars; },
    celebrate: celebrate, confetti: confetti, toast: toast,
    levelPicker: levelPicker, levelBadge: levelBadge, levelDone: levelDone,
    fx: fx, hand: hand, music: music, mascot: mascotSVG, mascotTalk: mascotTalk, go: go, stickers: { all: allStickers, owned: function () { return readJSON('kg-stickers', {}); } }, dailyGames: dailyGames, loading: loading, defer: defer
  };
})();
