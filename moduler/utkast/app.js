/* Röstlabbet – modulprogrammet (utkast). Meny, flikar, filmdelar, övningar, egna anteckningar
   och "klar"-markering. Allt sparas bara i besökarens webbläsare (localStorage). */
(function () {
  'use strict';
  var NS = 'rl-prog-';
  function las(k) { try { return localStorage.getItem(NS + k); } catch (e) { return null; } }
  function skriv(k, v) { try { localStorage.setItem(NS + k, v); } catch (e) {} }

  /* --- mobilmenyn --- */
  var body = document.body;
  var knapp = document.getElementById('menyknapp');
  function meny(oppen) {
    body.classList.toggle('meny-oppen', oppen);
    if (knapp) knapp.setAttribute('aria-expanded', oppen ? 'true' : 'false');
  }
  document.addEventListener('click', function (ev) {
    if (ev.target.closest('#menyknapp')) meny(true);
    else if (ev.target.closest('.menystang, .menyskugga')) meny(false);
  });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') meny(false); });

  /* --- klara moduler i sidomenyn --- */
  [].forEach.call(document.querySelectorAll('.sidomeny li[data-m]'), function (li) {
    if (las('klar-' + li.getAttribute('data-m')) === '1') li.classList.add('klar');
  });

  /* --- flikar --- */
  var flikar = [].slice.call(document.querySelectorAll('.flikar [role="tab"]'));
  function visaFlik(id, fokus) {
    flikar.forEach(function (f) {
      var vald = f.id === id;
      f.setAttribute('aria-selected', vald ? 'true' : 'false');
      f.tabIndex = vald ? 0 : -1;
      document.getElementById(f.getAttribute('aria-controls')).hidden = !vald;
      if (vald && fokus) f.focus();
    });
  }
  document.addEventListener('click', function (ev) {
    var f = ev.target.closest('.flikar [role="tab"]');
    if (f) { visaFlik(f.id); return; }
    var till = ev.target.closest('[data-till]');
    if (till) {
      visaFlik(till.getAttribute('data-till'));
      var ar = document.querySelector('.arbetsrad');
      if (ar && window.innerWidth <= 900) ar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  /* --- Förstå: filmdelar --- */
  var video = document.getElementById('film');
  var delar = [].slice.call(document.querySelectorAll('.delar button'));
  var modul = body.getAttribute('data-modul') || 'x';
  function valjDel(btn, spela) {
    delar.forEach(function (b) { b.setAttribute('aria-current', b === btn ? 'true' : 'false'); });
    if (!video) return;
    video.src = btn.getAttribute('data-src');
    video.poster = btn.getAttribute('data-poster') || '';
    if (spela) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
  }
  delar.forEach(function (b, i) {
    if (las(modul + '-sett-' + i) === '1') b.parentNode.classList.add('sett');
    b.addEventListener('click', function () { valjDel(b, true); });
  });
  if (video && delar.length) {
    video.addEventListener('ended', function () {
      var i = delar.findIndex(function (b) { return b.getAttribute('aria-current') === 'true'; });
      if (i < 0) return;
      skriv(modul + '-sett-' + i, '1');
      delar[i].parentNode.classList.add('sett');
      if (i === delar.length - 1) { var e = document.getElementById('efterfilmen'); if (e) e.hidden = false; }
      else valjDel(delar[i + 1], false);
    });
  }

  /* --- Öva: bockar --- */
  [].forEach.call(document.querySelectorAll('.ovning input[type="checkbox"]'), function (c) {
    var k = modul + '-ova-' + c.id;
    c.checked = las(k) === '1';
    c.addEventListener('change', function () { skriv(k, c.checked ? '1' : '0'); });
  });
  /* Ljudet läggs i Bunny Stream när Monica spelat in. Tills dess säger knappen det. */
  document.addEventListener('click', function (ev) {
    var s = ev.target.closest('[data-snart]');
    if (!s) return;
    ev.preventDefault();
    alert(s.classList.contains('spela') ? 'Här spelas övningen när Monica spelat in den.' : 'Den här modulen kommer snart.');
  });

  /* --- Lyssna: egna anteckningar --- */
  [].forEach.call(document.querySelectorAll('.fragor textarea'), function (t) {
    var k = modul + '-not-' + t.id;
    t.value = las(k) || '';
    var info = document.getElementById('sparat');
    var tim;
    t.addEventListener('input', function () {
      skriv(k, t.value);
      if (!info) return;
      info.textContent = 'Sparat i den här webbläsaren.';
      clearTimeout(tim); tim = setTimeout(function () { info.textContent = ''; }, 2000);
    });
  });

  /* --- markera modulen som klar --- */
  var klar = document.getElementById('klarknapp');
  if (klar) {
    var satt = function (ar) {
      klar.classList.toggle('ar-klar', ar);
      klar.textContent = ar ? '✓ Modulen är klar' : 'Markera som klar';
      var li = document.querySelector('.sidomeny li[data-m="' + modul + '"]');
      if (li) li.classList.toggle('klar', ar);
    };
    satt(las('klar-' + modul) === '1');
    klar.addEventListener('click', function () {
      var ar = las('klar-' + modul) !== '1';
      skriv('klar-' + modul, ar ? '1' : '0');
      satt(ar);
    });
  }

  /* --- övningsbanken: filter --- */
  var lista = document.getElementById('banklista');
  if (lista) {
    var rader = [].slice.call(lista.children);
    var raknare = document.getElementById('bankraknare');
    var tom = document.getElementById('banktom');
    var valt = { tema: 'alla', tid: 'alla' };
    var mala = function () {
      var kvar = 0;
      rader.forEach(function (li) {
        var med = (valt.tema === 'alla' || li.getAttribute('data-tema') === valt.tema) &&
                  (valt.tid === 'alla' || li.getAttribute('data-tid') === valt.tid);
        li.hidden = !med;
        if (med) kvar++;
      });
      raknare.textContent = kvar === rader.length ? rader.length + ' övningar' : kvar + ' av ' + rader.length + ' övningar';
      tom.hidden = kvar > 0;
    };
    document.addEventListener('click', function (ev) {
      var k = ev.target.closest('.bankfilter button');
      if (!k) return;
      var sort = k.hasAttribute('data-tema') ? 'tema' : 'tid';
      valt[sort] = k.getAttribute('data-' + sort);
      [].forEach.call(document.querySelectorAll('.bankfilter button[data-' + sort + ']'), function (a) {
        a.setAttribute('aria-pressed', a === k ? 'true' : 'false');
      });
      mala();
    });
    mala();
  }
}());
