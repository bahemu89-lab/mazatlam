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
    btn('Menú 🏠', 'yellow', function () { location.href = '../index.html'; });
    o.classList.add('show');
    sounds.win(); confetti(); vibrate(80);
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
  function init(opts) {
    opts = opts || {};
    var bar = document.createElement('div');
    bar.className = 'topbar';
    var back = document.createElement('button');
    back.className = 'btn round blue'; back.textContent = '🏠'; back.setAttribute('aria-label', 'Menú');
    back.onclick = function () { sounds.tap(); location.href = '../index.html'; };
    bar.appendChild(back);
    var h = document.createElement('h1'); h.textContent = opts.title || ''; bar.appendChild(h);
    starsEl = document.createElement('div'); starsEl.className = 'stars'; starsEl.textContent = opts.showStars === false ? '' : '⭐ 0';
    bar.appendChild(starsEl);
    document.body.insertBefore(bar, document.body.firstChild);
    var game = document.querySelector('.game');
    if (!game) { game = document.createElement('div'); game.className = 'game'; document.body.appendChild(game); }
    return game;
  }


  // levelPicker({ title, onPick }) -> pantalla "Elige tu nivel" con 3 botones; llama onPick(1|2|3).
  // Recuerda el último nivel elegido por juego (localStorage) y lo marca con un anillo.
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
    o.innerHTML = '<div class="box panel"><div class="ttl">' + (opts.title || '¿Qué tan difícil?') + '</div><div class="row"></div></div>';
    var row = o.querySelector('.row');
    LEVELS.forEach(function (L) {
      var b = document.createElement('button');
      b.className = 'btn big ' + L.cls + (last === L.n ? ' last' : '');
      var sub = opts.labels && opts.labels[L.n] ? '<span class="lv-sub">' + opts.labels[L.n] + '</span>' : '';
      b.innerHTML = '<span class="lv-stars">' + L.stars + '</span><span class="lv-txt">' + L.txt + '</span>' + sub + (done[L.n] ? '<span class="lv-done">✅</span>' : '');
      b.onclick = function () {
        sounds.tap(); try { localStorage.setItem(key, String(L.n)); } catch (e) {}
        o.classList.add('hide'); setTimeout(function () { o.remove(); }, 250);
        say(L.txt); opts.onPick && opts.onPick(L.n);
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
    levelPicker: levelPicker, levelBadge: levelBadge, levelDone: levelDone
  };
})();
