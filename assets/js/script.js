/* CoBuilt Solutions — public site
   All text, lists and pictures come from /content.json, which the admin panel (/admin) edits. */
(function () {
  'use strict';

  var app = document.getElementById('app');
  var params = new URLSearchParams(location.search);
  var isPreview = params.get('preview') === '1';
  var instant = false; // live preview updates: skip intro + count-up animations

  /* ---------- helpers ---------- */
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function url(v) { return esc(String(v || '').replace(/^javascript:/i, '')); }
  function arr(v) { return Array.isArray(v) ? v : []; }
  function digits(v) { return String(v || '').replace(/[^\d+]/g, ''); }
  function shown(sec) { return sec && sec.show !== false; }
  /* social media links (each one has its own on/off switch in the admin) */
  var SOCIAL = [["facebook", "Facebook"], ["instagram", "Instagram"], ["linkedin", "LinkedIn"], ["tiktok", "TikTok"], ["telegram", "Telegram"], ["youtube", "YouTube"], ["x", "X (Twitter)"]];
  var SOCIAL_ICONS = {"facebook": "M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V8.8c0-.5.3-.8 1-.8z", "instagram": "M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-2.3.1-3.3 1.2-3.4 3.4-.1 1.2-.1 1.6-.1 4.6s0 3.4.1 4.6c.1 2.3 1.1 3.3 3.4 3.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c2.3-.1 3.3-1.2 3.4-3.4.1-1.2.1-1.6.1-4.6s0-3.4-.1-4.6c-.1-2.3-1.2-3.3-3.4-3.4-1.2-.1-1.6-.1-4.7-.1zm0 2.9a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2zm0 1.8a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6zm5.3-3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z", "linkedin": "M4 9h4v12H4zM6 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.4 2.6 4.4 6V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4z", "tiktok": "M16.5 3c.3 2.2 1.7 3.6 3.9 3.8v3.3c-1.4.1-2.7-.3-3.9-1v6.3c0 3.5-2.6 5.9-5.9 5.9S4.7 18.9 4.7 15.6c0-3.4 2.9-6 6.4-5.6v3.4c-1.5-.4-3.1.6-3.1 2.2 0 1.4 1.1 2.5 2.5 2.5 1.5 0 2.6-1.1 2.6-2.7V3z", "telegram": "M21.4 4.2 2.9 11.4c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.1.8.7.8.5 0 .7-.2.9-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.3-1.4zM8.7 14.1l9.8-6.2c.5-.3.9-.1.5.2l-8.1 7.3-.3 3.4z", "youtube": "M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.8 15V9l5.8 3z", "x": "M17.8 3h3.3l-7.2 8.2L22.4 21h-6.6l-5.2-6.8L4.7 21H1.4l7.7-8.8L1 3h6.8l4.7 6.2zm-1.2 16h1.8L7.5 4.9H5.6z"};
  function socialLinks(c) {
    var so = c.social || {};
    if (so.show === false) return [];
    return SOCIAL.filter(function (s) { return so[s[0] + 'On'] === true && /^https?:\/\/\S+$/i.test(String(so[s[0]] || '').trim()); })
      .map(function (s) { return { key: s[0], name: s[1], href: String(so[s[0]]).trim() }; });
  }
  function socialHtml(list, cls) {
    if (!list.length) return '';
    return '<div class="social ' + (cls || '') + '">' + list.map(function (s) {
      return '<a href="' + url(s.href) + '" target="_blank" rel="noopener" aria-label="' + esc(s.name) + '" title="' + esc(s.name) + '"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"' + (s.key === 'instagram' ? ' fill-rule="evenodd"' : '') + '><path d="' + SOCIAL_ICONS[s.key] + '"></path></svg></a>';
    }).join('') + '</div>';
  }
  /* map: accepts a place name / address, "9.01, 38.76" coordinates, or a pasted Google Maps link */
  function mapTarget(p) {
    var m = String(p.map || '').trim(), addr = String(p.address || p.name || '').trim(), ll;
    if ((ll = m.match(/^\s*(-?\d{1,2}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)\s*$/))) return { q: ll[1] + ',' + ll[2], link: '' };
    if (/^https?:\/\//i.test(m)) {
      ll = m.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) || m.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || m.match(/[?&](?:q|query|ll|destination)=(-?\d+\.\d+)(?:,|%2C)(-?\d+\.\d+)/i);
      return { q: ll ? ll[1] + ',' + ll[2] : addr, link: m };
    }
    return { q: m || addr, link: '' };
  }
  var SVG_PIN = 'M12 22s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z';
  function mapEmbed(p) { var t = mapTarget(p); return t.q ? 'https://maps.google.com/maps?q=' + encodeURIComponent(t.q) + '&z=' + (/^-?\d/.test(t.q) ? 16 : 14) + '&output=embed' : ''; }
  function mapLink(p) { var t = mapTarget(p); return t.link || (t.q ? 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(t.q) : ''); }
  function head(s, side) {
    return '<div class="head reveal"><div>' +
      (s.eyebrow ? '<span class="eyebrow">' + esc(s.eyebrow) + '</span>' : '') +
      '<h2 class="h2">' + esc(s.title) + (s.highlight ? ' <em>' + esc(s.highlight) + '</em>' : '') + '</h2></div>' +
      (side && s.text ? '<p class="sub">' + esc(s.text) + '</p>' : '') + '</div>';
  }
  var ICONS = {
    truck: 'M3 17h11V7H3zM14 10h4l3 3v4h-7M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    pump: 'M4 20h6M7 20V10l10-6 3 3M17 4v6',
    pin: 'M12 22s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    lab: 'M9 3h6M10 3v6L5 19a1 1 0 0 0 1 2h12a1 1 0 0 0 1-2l-5-10V3',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
    building: 'M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1',
    gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z'
  };
  function icon(name, size) {
    return '<svg aria-hidden="true" width="' + (size || 26) + '" height="' + (size || 26) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' + (ICONS[name] || ICONS.truck) + '"></path></svg>';
  }
  var SVG = {
    arrow: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>',
    down: '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>',
    up: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"></path></svg>',
    check: '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>',
    menu: '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"></path></svg>',
    close: '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>',
    drum: '<svg class="drum" aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" style="color:var(--accent)"><circle cx="12" cy="12" r="9"></circle><path d="M12 3c3 3 3 15 0 18M3 12c3-3 15-3 18 0"></path></svg>',
    quote: '<svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" style="fill:var(--accent)"><path d="M7 7h4v4c0 3-1.5 5-4 6l-.8-1.4C7.6 14.8 8.4 13.6 8.5 12H7zM14 7h4v4c0 3-1.5 5-4 6l-.8-1.4c1.4-.8 2.2-2 2.3-3.6H14z"></path></svg>',
    phone: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"></path></svg>',
    wa: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.6-.3z"></path></svg>'
  };

  function ytId(u) {
    var m = String(u || '').match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([A-Za-z0-9_-]{11})/);
    return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(String(u || '').trim()) ? String(u).trim() : '');
  }
  SVG.play = '<svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"></path></svg>';

  /* ---------- per-device settings (phone / tablet / computer) ---------- */
  var HIDE = {
    heroLogos: '.hero .tiles', stats: '#stats', clients: '.clients', services: '#services', plant: '#plant-block', lab: '#lab-block',
    video: '#video', heroVideo: '.hero-video',
    grades: '#grades', fleet: '.fleet', testimonials: '#projects', steps: '#process', callBar: '.mbar', backToTop: '.totop', location: '#location'
  };
  var MEDIA = { phone: '(max-width:640px)', tablet: '(min-width:641px) and (max-width:1024px)', computer: '(min-width:1025px)' };
  function px(v, lo, hi) { v = Number(v); return isFinite(v) && v > 0 ? Math.min(hi, Math.max(lo, v)) + 'px' : ''; }
  function deviceStyles(c) {
    var d = c.devices || {}, css = '';
    if (!c.devices && c.statsSize) d = { computer: { numberSize: c.statsSize } };
    Object.keys(MEDIA).forEach(function (k) {
      var x = d[k]; if (!x) return;
      var vars = [], n = px(x.numberSize, 16, 160), t = px(x.titleSize, 30, 220), h = px(x.headingSize, 20, 100);
      if (n) vars.push('--stat-size:' + n); if (t) vars.push('--t1:' + t); if (h) vars.push('--h2:' + h);
      var hide = (Array.isArray(x.hide) ? x.hide : []).map(function (key) { return HIDE[key]; }).filter(Boolean);
      var extra = (Array.isArray(x.hide) && x.hide.indexOf('callBar') > -1) ? '.totop{bottom:calc(24px + env(safe-area-inset-bottom)) !important}footer .wrap{padding-bottom:40px !important}' : '';
      if (vars.length || hide.length) css += '@media ' + MEDIA[k] + '{' + (vars.length ? ':root{' + vars.join(';') + '}' : '') + (hide.length ? hide.join(',') + '{display:none !important}' : '') + extra + '}';
    });
    var tag = document.getElementById('device-style');
    if (!tag) { tag = document.createElement('style'); tag.id = 'device-style'; document.head.appendChild(tag); }
    tag.textContent = css;
  }

  /* ---------- render ---------- */
  function render(c) {
    var b = c.brand || {}, h = c.hero || {}, ct = c.contact || {}, f = c.footer || {};
    var root = document.documentElement.style;
    if (b.accent) root.setProperty('--accent', b.accent);
    function abs(p) { try { return new URL(String(p), location.href).href.replace(/"/g, '%22'); } catch (e) { return ''; } }
    if (b.background) root.setProperty('--bg-img', 'url("' + abs(b.background) + '")');
    if (b.letterTexture) root.setProperty('--letter-img', 'url("' + abs(b.letterTexture) + '")');
    if (c.meta && c.meta.title) document.title = c.meta.title;
    var sameAs = socialLinks(c).map(function (x) { return x.href; }), ldTag = document.getElementById('ld-social');
    if (sameAs.length) {
      if (!ldTag) { ldTag = document.createElement('script'); ldTag.type = 'application/ld+json'; ldTag.id = 'ld-social'; document.head.appendChild(ldTag); }
      ldTag.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'CoBuilt Solutions', url: location.origin + '/', sameAs: sameAs });
    } else if (ldTag) ldTag.remove();
    if (c.meta && c.meta.description) { var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', c.meta.description); }
    deviceStyles(c);
    var phone1 = arr(ct.phones)[0] || '';
    var clients = arr(c.clients && c.clients.items);
    var nav = [];
    if (shown(c.services)) nav.push(['#services', 'Services']);
    if (shown(c.plant) || shown(c.lab)) nav.push(['#plant', 'Plant & Lab']);
    if (shown(c.grades)) nav.push(['#grades', 'Mix grades']);
    if (shown(c.testimonials)) nav.push(['#projects', 'Projects']);
    if (shown(c.location) && arr((c.location || {}).places).length) nav.push(['#location', 'Location']);

    var html = '';
    if (isPreview && window.parent === window) html += '<div class="preview-bar">Preview — not published yet. Close this tab to keep editing.</div>';

    /* header */
    var soc = socialLinks(c), ph0 = arr(ct.phones)[0];
    if (soc.length) html += '<div class="topbar"><div class="wrap tb"><div class="tbinfo">' +
      (ph0 ? '<a href="tel:' + digits(ph0) + '">' + SVG.phone + esc(ph0) + '</a>' : '') + (ct.email ? '<a href="mailto:' + esc(ct.email) + '">' + esc(ct.email) + '</a>' : '') +
      '</div>' + socialHtml(soc, 'in-top') + '</div></div>';
    html += '<header class="top"><div class="wrap hdr">' +
      '<a class="brand" href="#top"><img src="' + url(b.mark) + '" alt="' + esc(b.name) + ' Solutions"><span>' + esc(b.name) + '</span></a>' +
      '<nav class="nav" aria-label="Main">' + nav.map(function (n) { return '<a class="link" href="' + n[0] + '">' + esc(n[1]) + '</a>'; }).join('') +
      '<a class="btn btn-primary" href="#quote">Get a quote</a>' +
      '<button type="button" class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mnav">' + SVG.menu + '</button></nav></div>' +
      '<nav class="mnav" id="mnav" aria-label="Mobile">' + nav.map(function (n) { return '<a href="' + n[0] + '">' + esc(n[1]) + '</a>'; }).join('') + '<a class="mcta" href="#quote">Get a quote →</a>' + (soc.length ? '<div class="msocial"><span>' + esc((c.social || {}).title || 'Follow us') + '</span>' + socialHtml(soc) + '</div>' : '') + '</nav></header>';

    /* hero */
    var heroLogos = h.showLogos === false ? [] : clients.slice(0, h.logoCount || 6);
    var isPhone = window.matchMedia && matchMedia('(max-width:640px)').matches;
    var bgv = h.backgroundVideo && (!isPhone || h.videoOnPhones) ? '<video class="hero-video" data-src="' + url(h.backgroundVideo) + '" muted loop playsinline preload="none" aria-hidden="true"></video>' : '';
    html += '<section class="hero' + (bgv ? ' has-video' : '') + '" id="top">' + bgv + '<div class="vignette"></div><div class="spot"></div><div class="hero-in">' +
      '<div class="par" data-par="-14,-10"><img class="hero-logo" src="' + url(b.logo) + '" alt="' + esc(b.name) + ' Solutions" width="686" height="720"></div>' +
      '<h1 class="par" data-par="8,6"><span class="concrete l1">' + esc(h.line1) + '</span><span class="concrete l2">' + esc(h.line2) + '</span></h1>' +
      '<span class="rule" aria-hidden="true"></span>' +
      (h.text ? '<p class="lead">' + esc(h.text) + '</p>' : '') +
      '<div class="cta"><a class="btn btn-primary btn-lg" href="#quote">' + esc(h.buttonText || 'Request a quote') + SVG.arrow + '</a>' +
      (phone1 ? '<a class="btn btn-ghost btn-lg" href="tel:' + digits(phone1) + '" style="text-transform:none">' + esc(phone1) + '</a>' : '') + '</div>' +
      (heroLogos.length ? '<div class="tiles">' + heroLogos.map(function (l, i) {
        return '<span class="tile" style="animation-delay:' + (1.25 + i * 0.08).toFixed(2) + 's"><img src="' + url(l.image) + '" alt="' + esc(l.name) + '" loading="lazy"></span>';
      }).join('') + '</div>' : '') +
      '<a href="#stats" class="cue" aria-label="Scroll down">' + SVG.down + '</a></div></section>';

    /* stats */
    var stats = arr(c.stats);
    if (stats.length) {
      html += '<section class="stats" id="stats" aria-label="Key figures"><div class="wrap">' + stats.map(function (s) {
        var n = Number(s.value);
        var val = isFinite(n) ? '<span data-count="' + n + '">0</span>' : esc(s.value);
        return '<div class="stat"><b>' + val + esc(s.suffix) + '</b><span>' + esc(s.label) + '</span></div>';
      }).join('') + '</div></section>';
    }

    /* clients marquee */
    if (clients.length) {
      var tiles = clients.map(function (l) { return '<span class="tile"><img src="' + url(l.image) + '" alt="' + esc(l.name) + '" loading="lazy"></span>'; }).join('');
      html += '<section class="clients" aria-label="Clients and partners"><span class="label">' + esc(c.clients.title) + '</span>' +
        '<div class="marquee"><div class="track">' + tiles + tiles.replace(/alt="[^"]*"/g, 'alt="" aria-hidden="true"') + '</div></div></section>';
    }

    /* services */
    var sv = c.services;
    if (shown(sv)) {
      html += '<section class="sec" id="services"><div class="wrap">' + head(sv, true) + '<div class="grid">' + arr(sv.items).map(function (it) {
        return '<article class="card reveal"><div class="ic">' + icon(it.icon) + '</div><h3>' + esc(it.title) + '</h3><p>' + esc(it.text) + '</p></article>';
      }).join('') + '</div></div></section>';
    }

    /* video */
    var vd = c.video;
    if (shown(vd)) {
      var yid = vd.source === 'youtube' ? ytId(vd.youtube) : '';
      var hasFile = vd.source === 'file' && vd.file;
      if (yid || hasFile) {
        var poster = vd.poster || '';
        if (yid && (!poster || /assets\/img\/plant\.(jpg|webp)$/.test(poster))) poster = 'https://i.ytimg.com/vi/' + yid + '/hqdefault.jpg';
        html += '<section class="sec" id="video"><div class="wrap">' + head(vd, true) +
          '<div class="vbox reveal" data-yt="' + esc(yid) + '" data-file="' + (hasFile ? url(vd.file) : '') + '">' +
          '<button type="button" class="vplay" aria-label="Play video: ' + esc((vd.title || '') + ' ' + (vd.highlight || '')) + '">' +
          (poster ? '<img src="' + url(poster) + '" alt="" loading="lazy" data-fallback="' + url(vd.poster || 'assets/img/plant.jpg') + '">' : '') + '<span class="vbtn">' + SVG.play + '</span></button></div></div></section>';
      }
    }

    /* plant + lab */
    var pl = c.plant, lb = c.lab;
    if (shown(pl) || shown(lb)) {
      html += '<section class="sec panel" id="plant"><div class="wrap" style="display:flex;flex-direction:column;gap:96px">';
      if (shown(pl)) {
        html += '<div class="split" id="plant-block"><div class="zoom reveal" style="height:460px"><img src="' + url(pl.image) + '" alt="' + esc(pl.title + ' ' + (pl.highlight || '')) + '" loading="lazy" style="object-position:30% center">' +
          (pl.badgeValue ? '<div class="badge">' + SVG.drum + '<div><b>' + esc(pl.badgeValue) + '</b><span>' + esc(pl.badgeLabel) + '</span></div></div>' : '') + '</div>' +
          '<div class="txt reveal"><span class="eyebrow">' + esc(pl.eyebrow) + '</span><h2 class="h2">' + esc(pl.title) + ' <em>' + esc(pl.highlight) + '</em></h2><p class="sub">' + esc(pl.text) + '</p>' +
          '<ul class="checks">' + arr(pl.features).map(function (x) { return '<li><i>' + SVG.check + '</i>' + esc(x) + '</li>'; }).join('') + '</ul></div></div>';
      }
      if (shown(lb)) {
        html += '<div class="split rev" id="lab-block"><div class="txt reveal"><span class="eyebrow">' + esc(lb.eyebrow) + '</span><h2 class="h2">' + esc(lb.title) + ' <em>' + esc(lb.highlight) + '</em></h2><p class="sub">' + esc(lb.text) + '</p>' +
          '<div class="mats">' + arr(lb.materials).map(function (m) { return '<div><b>' + esc(m.name) + '</b><span>' + esc(m.note) + '</span></div>'; }).join('') + '</div></div>' +
          '<div class="zoom reveal" style="height:520px"><img src="' + url(lb.image) + '" alt="' + esc(lb.eyebrow) + '" loading="lazy"></div></div>';
      }
      html += '</div></section>';
    }

    /* grades */
    var gr = c.grades;
    if (shown(gr)) {
      html += '<section class="sec" id="grades"><div class="wrap">' +
        '<div class="head reveal"><div><span class="eyebrow">' + esc(gr.eyebrow) + '</span><h2 class="h2">' + esc(gr.title) + ' <em>' + esc(gr.highlight) + '</em></h2>' + (gr.text ? '<p class="sub" style="max-width:680px">' + esc(gr.text) + '</p>' : '') + '</div></div>' +
        '<div class="table-box reveal"><table><thead><tr><th scope="col">Grade</th><th scope="col">Strength</th><th scope="col">Typical use</th><th scope="col" style="text-align:right">Price / m³</th><th scope="col"><span class="sr">Action</span></th></tr></thead><tbody>' +
        arr(gr.items).map(function (g) {
          return '<tr class="row"><td class="g">' + esc(g.name) + '</td><td class="s">' + esc(g.strength) + '</td><td class="u">' + esc(g.use) + '</td><td class="p">' + esc(g.price) + '</td>' +
            '<td class="a"><a class="row-link" href="#quote" data-grade="' + esc(g.name) + '">Get quote →</a></td></tr>';
        }).join('') + '</tbody></table></div>' +
        (arr(gr.testedBy).length ? '<div class="tested reveal"><b>' + esc(gr.testedByTitle) + '</b>' + arr(gr.testedBy).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' : '') +
        '</div></section>';
    }

    /* fleet */
    var fl = c.fleet;
    if (shown(fl)) {
      html += '<section class="fleet" aria-label="' + esc(fl.eyebrow) + '"><div class="zoom"><img src="' + url(fl.image) + '" alt="' + esc(fl.eyebrow) + '" loading="lazy" style="object-position:center 35%"></div><div class="ov"></div>' +
        '<div class="wrap reveal"><span class="eyebrow">' + esc(fl.eyebrow) + '</span><h2 class="h2">' + esc(fl.title) + ' <em>' + esc(fl.highlight) + '</em></h2><p class="sub">' + esc(fl.text) + '</p></div></section>';
    }

    /* testimonials */
    var ts = c.testimonials;
    if (shown(ts)) {
      html += '<section class="sec" id="projects"><div class="wrap">' + head(ts, true) + '<div class="grid swipe">' + arr(ts.items).map(function (t) {
        return '<figure class="card quote reveal">' + SVG.quote + '<blockquote>' + esc(t.quote) + '</blockquote><figcaption><b>' + esc(t.who) + '</b><span>' + esc(t.project) + '</span></figcaption></figure>';
      }).join('') + '</div></div></section>';
    }

    /* steps */
    var sp = c.steps;
    if (shown(sp)) {
      html += '<section class="sec panel" id="process"><div class="wrap">' + head(sp, false) + '<ol class="steps">' + arr(sp.items).map(function (s, i) {
        return '<li class="reveal"><span class="n">' + String(i + 1).padStart(2, '0') + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></li>';
      }).join('') + '</ol></div></section>';
    }

    /* contact + quote form */
    var grades = arr(ct.formGrades).length ? arr(ct.formGrades) : ['C25', 'C30', 'Other'];
    html += '<section class="sec" id="quote"><div class="wrap contact">' +
      '<div class="txt reveal"><span class="eyebrow">' + esc(ct.eyebrow) + '</span><h2 class="h2 big" style="color:var(--accent)">' + esc(ct.title) + '</h2>' +
      (ct.text ? '<p class="sub">' + esc(ct.text) + '</p>' : '') +
      '<div class="phones">' + arr(ct.phones).map(function (p) { return '<a href="tel:' + digits(p) + '">' + esc(p) + '</a>'; }).join('') + '</div>' +
      '<div class="cinfo">' + (ct.email ? '<a href="mailto:' + esc(ct.email) + '">' + esc(ct.email) + '</a>' : '') + (ct.address ? '<span>' + esc(ct.address) + '</span>' : '') + '</div></div>' +
      '<form class="quote-form reveal" id="qform" novalidate>' +
      '<div class="f2"><label class="f">Full name<input name="name" type="text" autocomplete="name" placeholder="Your name"></label>' +
      '<label class="f">Phone<input name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="+251 …" required></label></div>' +
      '<fieldset><legend>Concrete grade</legend><div class="chips">' + grades.map(function (g, i) {
        return '<button type="button" class="chip" data-chip="' + esc(g) + '" aria-pressed="' + (i === Math.min(2, grades.length - 1) ? 'true' : 'false') + '">' + esc(g) + '</button>';
      }).join('') + '</div></fieldset>' +
      '<div class="f2"><label class="f">Volume (m³)<input name="volume" type="number" min="1" inputmode="numeric" placeholder="e.g. 30"></label>' +
      '<label class="f">Pour date<input name="date" type="date"></label></div>' +
      '<label class="f">Site location<input name="site" type="text" placeholder="Sub-city, woreda or landmark"></label>' +
      '<label class="check"><input name="pump" type="checkbox"> I also need a concrete pump</label>' +
      '<p class="err" id="qerr" role="alert"></p>' +
      '<div class="send">' + (ct.whatsapp ? '<button type="submit" class="btn btn-primary btn-lg" data-via="wa">' + SVG.wa + 'Send on WhatsApp</button>' : '') +
      (ct.email ? '<button type="submit" class="btn btn-ghost btn-lg" data-via="mail" style="text-transform:none">Send by email</button>' : '') + '</div>' +
      '<p class="note">Your request opens in WhatsApp or your email app, ready to send.</p></form></div></section>';

    /* location */
    var lc = c.location;
    if (shown(lc) && arr(lc.places).length) {
      html += '<section class="sec" id="location"><div class="wrap">' + head(lc, true) + '<div class="locs">' + arr(lc.places).map(function (p) {
        var src = mapEmbed(p), go = mapLink(p);
        return '<article class="loc reveal"><div class="map">' + (src ? '<iframe src="' + url(src) + '" title="Map: ' + esc(p.name) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>' : '') + '</div>' +
          '<div class="lbody"><span class="lpin"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' + SVG_PIN + '"></path></svg></span>' +
          '<div><h3>' + esc(p.name) + '</h3>' + (p.address ? '<p>' + esc(p.address) + '</p>' : '') + (p.note ? '<p class="lnote">' + esc(p.note) + '</p>' : '') + '</div>' +
          (go ? '<a class="btn btn-ghost" href="' + url(go) + '" target="_blank" rel="noopener">Get directions' + SVG.arrow + '</a>' : '') + '</div></article>';
      }).join('') + '</div></div></section>';
    }

    /* footer */
    html += '<footer class="foot"><div class="wrap"><div class="fgrid"><div><img src="' + url(b.logo) + '" alt="' + esc(b.name) + ' Solutions" style="width:96px;height:auto">' +
      '<p class="ftag">' + esc(f.tagline) + ' <b>' + esc(f.taglineBold) + '</b></p></div>' +
      '<div class="fcols"><div><h4>Company</h4>' + nav.map(function (n) { return '<a href="' + n[0] + '">' + esc(n[1]) + '</a>'; }).join('') + '</div>' +
      '<div><h4>Contact</h4>' + arr(ct.phones).map(function (p) { return '<a href="tel:' + digits(p) + '">' + esc(p) + '</a>'; }).join('') +
      (ct.email ? '<a href="mailto:' + esc(ct.email) + '">' + esc(ct.email) + '</a>' : '') + (ct.address ? '<span>' + esc(ct.address) + '</span>' : '') + '</div></div></div>' +
      '<div class="fbot"><span>' + esc(f.copyright) + '</span><span><em>' + esc(f.website) + '</em>' + (f.tin ? ' · ' + esc(f.tin) : '') + '</span></div></div></footer>';

    /* floating */
    html += '<a href="#top" class="totop hide" id="totop" aria-label="Back to top">' + SVG.up + '</a>' +
      '<div class="mbar away">' + (phone1 ? '<a class="call" href="tel:' + digits(phone1) + '">' + SVG.phone + 'Call now</a>' : '') + '<a class="q" href="#quote">Get a quote</a></div>' +
      '<div class="toast" id="toast" role="status"></div>';

    app.innerHTML = html;
    app.querySelectorAll('img').forEach(function (im) {
      im.addEventListener('error', function () {
        var src = im.getAttribute('src') || '';
        if (/\.(jpe?g|png)$/i.test(src) && !im.dataset.tried) { im.dataset.tried = '1'; im.src = src.replace(/\.(jpe?g|png)$/i, '.webp'); }
      });
    });
    wire(c);
  }

  /* ---------- interactions ---------- */
  function wire(c) {
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    // mobile menu
    var burger = document.getElementById('burger'), mnav = document.getElementById('mnav');
    function setMenu(open) {
      mnav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      burger.innerHTML = open ? SVG.close : SVG.menu;
    }
    burger.addEventListener('click', function () { setMenu(!mnav.classList.contains('open')); });
    mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    window.addEventListener('resize', function () { if (innerWidth > 860) setMenu(false); });

    // hero spotlight + parallax (mouse only)
    var hero = document.querySelector('.hero'), pars = hero.querySelectorAll('[data-par]'), raf = 0;
    if (!reduce) {
      hero.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        var r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          hero.classList.add('hovering');
          hero.style.setProperty('--sx', (x * 100).toFixed(1) + '%');
          hero.style.setProperty('--sy', (y * 100).toFixed(1) + '%');
          pars.forEach(function (p) {
            var k = p.getAttribute('data-par').split(',');
            p.style.transform = 'translate3d(' + ((x * 2 - 1) * k[0]).toFixed(1) + 'px,' + ((y * 2 - 1) * k[1]).toFixed(1) + 'px,0)';
          });
        });
      });
      hero.addEventListener('pointerleave', function () {
        hero.classList.remove('hovering');
        pars.forEach(function (p) { p.style.transform = ''; });
      });
    }

    // stagger: number each animated item within its row so they appear one after another
    document.querySelectorAll('.reveal, .stat').forEach(function (el) {
      var sib = Array.prototype.filter.call(el.parentNode.children, function (x) { return x.classList.contains('reveal') || x.classList.contains('stat'); });
      if (sib.length > 1) el.style.setProperty('--i', Math.min(sib.indexOf(el), 6));
    });
    document.querySelectorAll('.table-box tr.row').forEach(function (tr, i) { tr.style.setProperty('--r', Math.min(i, 10)); });

    // glow that follows the mouse on cards + slightly magnetic orange buttons (mouse only)
    if (!reduce && matchMedia('(hover:hover)').matches) {
      document.querySelectorAll('.card, .loc').forEach(function (cd) {
        cd.addEventListener('pointermove', function (e) {
          var r = cd.getBoundingClientRect();
          cd.style.setProperty('--mx', (e.clientX - r.left) + 'px'); cd.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
      });
      document.querySelectorAll('.btn-primary').forEach(function (bt) {
        bt.addEventListener('pointermove', function (e) {
          if (e.pointerType !== 'mouse') return;
          var r = bt.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
          bt.style.translate = (x * 8).toFixed(1) + 'px ' + (y * 6).toFixed(1) + 'px';
        });
        bt.addEventListener('pointerleave', function () { bt.style.translate = ''; });
      });
    }

    // reveal on scroll + count-up
    var reveals = document.querySelectorAll('.reveal, .stat');
    var counters = document.querySelectorAll('[data-count]');
    function countUp(el) {
      var target = Number(el.getAttribute('data-count')), start = null;
      if (reduce || instant) { el.textContent = target.toLocaleString('en-US'); return; }
      function step(t) {
        if (!start) start = t;
        var p = Math.min(1, (t - start) / 1800), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          if (en.target.hasAttribute('data-count')) countUp(en.target); else en.target.classList.add('in');
          io.unobserve(en.target);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      // photos start fully covered (curtain), so watch their row instead of the photo itself
      var zio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.querySelectorAll(':scope > .zoom.reveal').forEach(function (z) { z.classList.add('in'); });
          zio.unobserve(en.target);
        });
      }, { threshold: 0.12 });
      if (instant) reveals.forEach(function (el) { el.classList.add('in'); });
      else reveals.forEach(function (el) {
        if (el.classList.contains('zoom') && el.parentNode !== document.body) zio.observe(el.parentNode); else io.observe(el);
      });
      counters.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('in'); });
      counters.forEach(countUp);
    }

    // video: load only when the visitor presses play (keeps the page fast)
    document.querySelectorAll('.vplay img[data-fallback]').forEach(function (im) {
      im.addEventListener('error', function () { var fb = im.getAttribute('data-fallback'); im.removeAttribute('data-fallback'); if (fb && im.getAttribute('src') !== fb) im.src = fb; else im.style.display = 'none'; });
    });
    document.querySelectorAll('.vbox').forEach(function (box) {
      var btn = box.querySelector('.vplay'); if (!btn) return;
      btn.addEventListener('click', function () {
        var yid = box.getAttribute('data-yt'), file = box.getAttribute('data-file');
        if (yid) box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + yid + '?autoplay=1&rel=0&playsinline=1" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
        else if (file) { box.innerHTML = '<video src="' + file + '" controls autoplay playsinline></video>'; }
      });
    });
    var hv = document.querySelector('.hero-video');
    if (hv && !reduce) {
      // start the background video only after everything else has loaded, so it never slows the page
      var startVideo = function () {
        var conn = navigator.connection || {};
        if (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '')) { hv.remove(); return; }
        hv.addEventListener('canplay', function () { hv.classList.add('ready'); hv.play().catch(function () {}); }, { once: true });
        hv.addEventListener('error', function () { hv.remove(); }, { once: true });
        hv.preload = 'auto'; hv.src = hv.getAttribute('data-src');
      };
      if (document.readyState === 'complete') setTimeout(startVideo, instant ? 0 : 600);
      else window.addEventListener('load', function () { setTimeout(startVideo, 600); }, { once: true });
    }

    // back to top visibility
    var totop = document.getElementById('totop'), mbar = app.querySelector('.mbar'), hero = app.querySelector('.hero'), ticking = false;
    function onScroll() {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        totop.classList.toggle('hide', scrollY < 500);
        // bottom Call / Quote bar: hidden on the first screen (hero), shown once the visitor scrolls past it
        if (mbar) mbar.classList.toggle('away', !hero || hero.getBoundingClientRect().bottom > innerHeight * 0.25);
        ticking = false;
      });
    }
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll, { passive: true }); onScroll();

    // grade chips + table links
    var form = document.getElementById('qform');
    var chips = form.querySelectorAll('[data-chip]');
    function pick(name) {
      var match = null;
      chips.forEach(function (ch) { if (ch.getAttribute('data-chip') === name) match = ch; });
      if (!match) chips.forEach(function (ch) { if (/other/i.test(ch.getAttribute('data-chip'))) match = ch; });
      chips.forEach(function (ch) { ch.setAttribute('aria-pressed', ch === match ? 'true' : 'false'); });
    }
    chips.forEach(function (ch) { ch.addEventListener('click', function () { pick(ch.getAttribute('data-chip')); }); });
    document.querySelectorAll('[data-grade]').forEach(function (a) {
      a.addEventListener('click', function () { pick(a.getAttribute('data-grade')); toast('Grade ' + a.getAttribute('data-grade') + ' selected'); });
    });

    // send via WhatsApp / email
    var via = 'wa';
    form.querySelectorAll('[data-via]').forEach(function (b) { b.addEventListener('click', function () { via = b.getAttribute('data-via'); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form), err = document.getElementById('qerr');
      var phone = String(d.get('phone') || '').trim();
      if (phone.replace(/\D/g, '').length < 9) { err.textContent = 'Please enter your phone number so we can call you back.'; form.phone.focus(); return; }
      err.textContent = '';
      var grade = (form.querySelector('[aria-pressed="true"]') || {}).textContent || '';
      var lines = [
        'Concrete quote request',
        'Name: ' + (d.get('name') || '-'),
        'Phone: ' + phone,
        'Grade: ' + grade,
        'Volume: ' + (d.get('volume') ? d.get('volume') + ' m³' : '-'),
        'Pour date: ' + (d.get('date') || '-'),
        'Site: ' + (d.get('site') || '-'),
        'Pump needed: ' + (d.get('pump') ? 'Yes' : 'No')
      ].join('\n');
      if (via === 'mail' && c.contact.email) {
        location.href = 'mailto:' + c.contact.email + '?subject=' + encodeURIComponent('Concrete quote request: ' + grade) + '&body=' + encodeURIComponent(lines);
      } else {
        var n = String(c.contact.whatsapp || '').replace(/\D/g, '');
        window.open('https://wa.me/' + n + '?text=' + encodeURIComponent(lines), '_blank', 'noopener');
      }
      toast('Opening ' + (via === 'mail' ? 'your email app' : 'WhatsApp') + '…');
    });
  }

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  function done() { var l = document.getElementById('loader'); if (l) l.classList.add('done'); }
  function fail() {
    app.innerHTML = '<div style="padding:80px 24px;text-align:center"><h1 style="font-family:Oswald,sans-serif">CoBuilt Solutions</h1><p style="color:#A1A1AA;margin-top:12px">The page could not load. Please refresh, or call +251 911 246 502.</p></div>';
    done();
  }

  /* ---------- boot ---------- */
  var host = isPreview ? (window.parent !== window ? window.parent : window.opener) : null;
  if (host) {
    var keepY = 0;
    window.addEventListener('message', function (e) {
      if (e.origin !== location.origin || !e.data || e.data.type !== 'cobuilt-preview') return;
      keepY = window.scrollY; instant = !!e.data.keepScroll;
      document.documentElement.classList.toggle('no-intro', instant);
      try { render(e.data.content); } catch (x) { console.error(x); fail(); }
      if (e.data.keepScroll) window.scrollTo(0, keepY);
      done();
    });
    host.postMessage({ type: 'cobuilt-preview-ready' }, location.origin);
  } else {
    fetch('content.json?v=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (c) { render(c); done(); })
      .catch(function (x) { console.error(x); fail(); });
  }
})();
