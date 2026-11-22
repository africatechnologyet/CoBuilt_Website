/* CoBuilt Admin — edits /content.json and pictures, then publishes them to GitHub.
   Render redeploys the site automatically after each publish (about 1–2 minutes). */
(function () {
  'use strict';

  /* ================= what can be edited ================= */
  var ICON_OPTIONS = [['truck', 'Truck'], ['pump', 'Pump'], ['pin', 'Location pin'], ['lab', 'Lab flask'], ['shield', 'Shield'], ['clock', 'Clock'], ['building', 'Building'], ['gear', 'Gear']];
  var T = function (k, l, h) { return { k: k, t: 'text', l: l, h: h }; };
  var TA = function (k, l, h) { return { k: k, t: 'textarea', l: l, h: h }; };
  var IMG = function (k, l, kind, h) { return { k: k, t: 'image', l: l, kind: kind || 'photo', h: h }; };
  var SHOW = { k: 'show', t: 'show' };
  var HEAD = [T('eyebrow', 'Small label above title'), T('title', 'Title (white part)'), T('highlight', 'Title (orange part)')];

  var SECTIONS = [
    { key: 'hero', label: 'Top of page', desc: 'The big "READY MIX CONCRETE" area visitors see first.', fields: [
      T('line1', 'Big title — line 1'), T('line2', 'Big title — line 2'), TA('text', 'Intro text'), T('buttonText', 'Main button text'),
      { k: 'showLogos', t: 'bool', l: 'Show client logos under the buttons' }, { k: 'logoCount', t: 'number', l: 'How many client logos to show there', h: 'The first logos from "Client logos" are used.' }] },
    { key: 'stats', label: 'Key figures', desc: 'The numbers that count up under the top section.',
      extra: [{ k: 'statsSize', t: 'range', l: 'Number size', min: 24, max: 96, step: 2, unit: 'px', def: 42, h: 'Drag to make the numbers bigger or smaller. On phones they shrink automatically if needed to fit.' }],
      list: { add: 'Add figure', title: 'Figure', fields: [
      { k: 'value', t: 'number', l: 'Number' }, T('suffix', 'After the number', 'e.g. " m³/h", "+" — include a space if needed'), T('label', 'Label')] } },
    { key: 'clients', label: 'Client logos', desc: 'Logos on white tiles that scroll across the page. Upload a PNG or JPG of each logo.', fields: [
      T('title', 'Heading'),
      { k: 'items', t: 'list', add: 'Add logo', title: 'Logo', fields: [T('name', 'Company name'), IMG('image', 'Logo', 'logo')] }] },
    { key: 'services', label: 'Services', desc: 'The "We are what you need" cards.', fields: [SHOW].concat(HEAD, [TA('text', 'Text beside the title'),
      { k: 'items', t: 'list', add: 'Add service', title: 'Service', fields: [{ k: 'icon', t: 'select', l: 'Icon', options: ICON_OPTIONS }, T('title', 'Title'), TA('text', 'Description')] }]) },
    { key: 'plant', label: 'Batching plant', desc: 'Plant photo, the floating badge and the feature checklist.', fields: [SHOW].concat(HEAD, [TA('text', 'Text'), IMG('image', 'Plant photo'),
      T('badgeValue', 'Badge — big text', 'e.g. 1,500 m³ / day. Leave empty to hide the badge.'), T('badgeLabel', 'Badge — small text'),
      { k: 'features', t: 'strings', l: 'Feature checklist', add: 'Add feature' }]) },
    { key: 'lab', label: 'Laboratory', desc: 'Lab text, photo and the materials list.', fields: [SHOW].concat(HEAD, [TA('text', 'Text'), IMG('image', 'Photo'),
      { k: 'materials', t: 'list', add: 'Add material', title: 'Material', fields: [T('name', 'Material (orange)'), T('note', 'Description')] }]) },
    { key: 'grades', label: 'Mix grades & prices', desc: 'The price table. Each row has a "Get quote" link that pre-selects the grade in the form.', fields: [SHOW].concat(HEAD, [TA('text', 'Text under the title'),
      { k: 'items', t: 'list', add: 'Add grade', title: 'Grade', fields: [T('name', 'Grade', 'e.g. C30'), T('strength', 'Strength', 'e.g. 30 MPa'), T('use', 'Typical use'), T('price', 'Price / m³', 'e.g. 8,500 ETB or On request')] },
      T('testedByTitle', '"Tested by" heading'), { k: 'testedBy', t: 'strings', l: 'Testing laboratories', add: 'Add laboratory' }]) },
    { key: 'fleet', label: 'Truck banner', desc: 'The full-width photo with the fleet message.', fields: [SHOW].concat(HEAD, [TA('text', 'Text'), IMG('image', 'Banner photo', 'wide')]) },
    { key: 'testimonials', label: 'Testimonials', desc: 'Quotes from your clients.', fields: [SHOW].concat(HEAD, [TA('text', 'Text beside the title'),
      { k: 'items', t: 'list', add: 'Add testimonial', title: 'Testimonial', fields: [TA('quote', 'Quote'), T('who', 'Company / person'), T('project', 'Project')] }]) },
    { key: 'steps', label: 'How it works', desc: 'Numbered steps. Numbers are added automatically.', fields: [SHOW].concat(HEAD, [
      { k: 'items', t: 'list', add: 'Add step', title: 'Step', fields: [T('title', 'Title'), TA('text', 'Text')] }]) },
    { key: 'contact', label: 'Contact & quote form', desc: 'Phone numbers, email and where quote requests are sent.', fields: [
      T('eyebrow', 'Small label'), T('title', 'Title'), TA('text', 'Text'),
      { k: 'phones', t: 'strings', l: 'Phone numbers', add: 'Add phone', h: 'The first number is used for the "Call now" buttons.' },
      T('email', 'Email', 'Quote requests can be sent here by email.'), T('address', 'Address'),
      T('whatsapp', 'WhatsApp number for quote requests', 'Include the country code, e.g. +251 911 246 502. Leave empty to hide the WhatsApp button.'),
      { k: 'formGrades', t: 'strings', l: 'Grade buttons in the form', add: 'Add grade button' }] },
    { key: 'footer', label: 'Footer', desc: 'Bottom of the page.', fields: [T('tagline', 'Tagline (orange)'), T('taglineBold', 'Tagline (white, bold)'), T('website', 'Website text'), T('tin', 'TIN / registration'), T('copyright', 'Copyright line')] },
    { key: 'brand', label: 'Logo, colour & background', desc: 'Your logos, accent colour and the concrete textures.', fields: [
      T('name', 'Short company name', 'Shown next to the small logo in the header.'), { k: 'accent', t: 'color', l: 'Accent colour' },
      IMG('logo', 'Main logo', 'logo', 'Transparent PNG works best.'), IMG('mark', 'Small logo icon (header)', 'logo'),
      IMG('background', 'Concrete background', 'bg', 'A large, dark texture photo.'), IMG('letterTexture', 'Texture inside the big title', 'bg', 'A light grey concrete texture.')] },
    { key: 'meta', label: 'Google & sharing', desc: 'What Google and WhatsApp/Telegram link previews show.', fields: [T('title', 'Page title'), TA('description', 'Description', 'About 150 characters.')] }
  ];

  /* ================= state ================= */
  var S = { token: '', repo: '', branch: 'main', content: null, published: '', pending: {}, current: 'hero', dirty: false };
  var $ = function (id) { return document.getElementById(id); };
  var LS = { auth: 'cobuilt_admin_auth', draft: 'cobuilt_admin_draft' };

  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (k === 'text') e.textContent = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else if (v === true) e.setAttribute(k, '');
      else if (v !== false && v != null) e.setAttribute(k, v);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function b64encodeUtf8(str) { return btoa(unescape(encodeURIComponent(str))); }
  function b64decodeUtf8(b64) { return decodeURIComponent(escape(atob(b64.replace(/\s/g, '')))); }
  var toastT;
  function toast(msg, kind) {
    var t = $('toast'); t.textContent = msg; t.className = 'toast show ' + (kind || '');
    clearTimeout(toastT); toastT = setTimeout(function () { t.className = 'toast'; }, 3200);
  }
  function dialog(title, text, actions) {
    $('dlgTitle').textContent = title; $('dlgText').textContent = text;
    var a = $('dlgActs'); a.innerHTML = '';
    actions.forEach(function (x) {
      a.appendChild(el('button', { class: 'btn ' + (x.cls || ''), text: x.label, onclick: function () { close(); if (x.fn) x.fn(); } }));
    });
    $('overlay').classList.add('on');
    function close() { $('overlay').classList.remove('on'); }
    return close;
  }

  /* ================= GitHub ================= */
  function gh(path, opts) {
    opts = opts || {};
    return fetch('https://api.github.com/repos/' + S.repo + path, {
      method: opts.method || 'GET',
      headers: { 'Authorization': 'Bearer ' + S.token, 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      cache: 'no-store'
    }).then(function (r) {
      return r.text().then(function (t) {
        var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) { /* ignore */ }
        if (!r.ok) { var err = new Error((j && j.message) || ('GitHub error ' + r.status)); err.status = r.status; throw err; }
        return j;
      });
    });
  }
  function friendly(e) {
    if (e.status === 401) return 'This access key is not valid or has expired. Create a new one (SETUP-GUIDE step 3).';
    if (e.status === 403) return 'This access key cannot change the website. Give it "Contents: Read and write" permission.';
    if (e.status === 404) return 'Repository or branch not found. Check the repository name, and that the key has access to it.';
    if (e.status === 409 || e.status === 422) return 'The website changed while you were editing. Reload the admin and try again.';
    if (!navigator.onLine) return 'You are offline. Check your internet connection.';
    return e.message || 'Something went wrong.';
  }

  function signIn() {
    S.token = $('token').value.trim(); S.repo = $('repo').value.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, ''); S.branch = $('branch').value.trim() || 'main';
    var msg = $('loginMsg'); msg.className = 'msg'; msg.textContent = 'Checking…';
    if (!S.token) { msg.className = 'msg bad'; msg.textContent = 'Paste your GitHub access key first.'; return; }
    $('signin').disabled = true;
    gh('').then(function (repo) {
      if (repo.permissions && repo.permissions.push === false) { var e = new Error(''); e.status = 403; throw e; }
      return loadContent();
    }).then(function () {
      if ($('remember').checked) { try { localStorage.setItem(LS.auth, JSON.stringify({ token: S.token, repo: S.repo, branch: S.branch })); } catch (e) { /* ignore */ } }
      else { sessionStorage.setItem(LS.auth, JSON.stringify({ token: S.token, repo: S.repo, branch: S.branch })); }
      $('login').style.display = 'none'; $('app').classList.add('on');
      restoreDraft(); renderNav(); renderSection();
    }).catch(function (e) {
      msg.className = 'msg bad'; msg.textContent = friendly(e);
    }).then(function () { $('signin').disabled = false; });
  }

  function loadContent() {
    return gh('/contents/content.json?ref=' + encodeURIComponent(S.branch)).then(function (f) {
      S.content = JSON.parse(b64decodeUtf8(f.content));
      S.published = JSON.stringify(S.content);
    });
  }

  function publish() {
    var btn = $('publishBtn');
    if (!S.dirty) { toast('Nothing new to publish.'); return; }
    btn.disabled = true; btn.innerHTML = '<span class="spin"></span> Publishing…';
    var head, baseTree, files = [];
    Object.keys(S.pending).forEach(function (p) {
      if (JSON.stringify(S.content).indexOf('"' + p + '"') >= 0) files.push({ path: p, b64: S.pending[p].b64 });
    });
    files.push({ path: 'content.json', b64: b64encodeUtf8(JSON.stringify(S.content, null, 2) + '\n') });
    gh('/git/ref/heads/' + encodeURIComponent(S.branch)).then(function (ref) {
      head = ref.object.sha;
      return gh('/git/commits/' + head);
    }).then(function (commit) {
      baseTree = commit.tree.sha;
      return files.reduce(function (p, f) {
        return p.then(function (acc) {
          return gh('/git/blobs', { method: 'POST', body: { content: f.b64, encoding: 'base64' } }).then(function (b) { acc.push({ path: f.path, mode: '100644', type: 'blob', sha: b.sha }); return acc; });
        });
      }, Promise.resolve([]));
    }).then(function (tree) {
      return gh('/git/trees', { method: 'POST', body: { base_tree: baseTree, tree: tree } });
    }).then(function (tree) {
      var n = files.length - 1;
      return gh('/git/commits', { method: 'POST', body: { message: 'Update website from admin' + (n ? ' (' + n + ' new picture' + (n > 1 ? 's' : '') + ')' : ''), tree: tree.sha, parents: [head] } });
    }).then(function (commit) {
      return gh('/git/refs/heads/' + encodeURIComponent(S.branch), { method: 'PATCH', body: { sha: commit.sha } });
    }).then(function () {
      S.pending = {}; S.published = JSON.stringify(S.content); setDirty(false); clearDraft();
      dialog('Published!', 'Your changes are saved. The live website updates in about 1–2 minutes (Render rebuilds it automatically).', [
        { label: 'Close' }, { label: 'View website', cls: 'primary', fn: function () { window.open('/', '_blank', 'noopener'); } }]);
    }).catch(function (e) {
      toast(friendly(e), 'bad');
    }).then(function () { btn.disabled = false; btn.textContent = 'Publish'; renderSection(); });
  }

  /* ================= drafts ================= */
  function saveDraft() {
    try { localStorage.setItem(LS.draft, JSON.stringify({ repo: S.repo, base: S.published, content: S.content, pending: S.pending })); }
    catch (e) {
      try { localStorage.setItem(LS.draft, JSON.stringify({ repo: S.repo, base: S.published, content: S.content, pending: {} })); } catch (x) { /* ignore */ }
    }
  }
  function clearDraft() { try { localStorage.removeItem(LS.draft); } catch (e) { /* ignore */ } }
  function restoreDraft() {
    var d; try { d = JSON.parse(localStorage.getItem(LS.draft) || 'null'); } catch (e) { d = null; }
    if (!d || d.repo !== S.repo || JSON.stringify(d.content) === S.published) return;
    dialog('Unpublished changes found', 'You have changes from an earlier visit that were not published yet. Keep working on them?', [
      { label: 'Discard them', cls: 'danger', fn: clearDraft },
      { label: 'Keep my changes', cls: 'primary', fn: function () {
        S.content = d.content; S.pending = d.pending || {};
        var missing = 0;
        walkImages(S.content, function (obj, key) { var p = obj[key]; if (/^assets\/img\/uploads\//.test(p) && !S.pending[p] && d.base.indexOf('"' + p + '"') < 0) missing++; });
        if (missing) toast(missing + ' new picture(s) could not be kept in the draft. Please choose them again before publishing.', 'bad');
        setDirty(true); renderNav(); renderSection();
        if (d.base !== S.published) toast('Note: the website was changed somewhere else since this draft.', 'bad');
      } }]);
  }
  function walkImages(o, fn) {
    if (!o || typeof o !== 'object') return;
    Object.keys(o).forEach(function (k) { if (typeof o[k] === 'string' && /^assets\/img\//.test(o[k])) fn(o, k); else walkImages(o[k], fn); });
  }

  function setDirty(v) {
    S.dirty = v;
    $('dot').className = 'dot' + (v ? ' dirty' : '');
    $('statusText').textContent = v ? 'Unpublished changes' : 'All changes published';
  }
  var draftT;
  function changed() {
    setDirty(JSON.stringify(S.content) !== S.published);
    clearTimeout(draftT); draftT = setTimeout(saveDraft, 400);
  }

  /* ================= pictures ================= */
  var MAX = { photo: 2400, wide: 2600, bg: 2600, logo: 800 };
  function processImage(file, kind) {
    return new Promise(function (resolve, reject) {
      if (!/^image\//.test(file.type)) { reject(new Error('Please choose a picture file (JPG or PNG).')); return; }
      var r = new FileReader();
      r.onerror = function () { reject(new Error('Could not read the picture.')); };
      r.onload = function () {
        var img = new Image();
        img.onerror = function () { reject(new Error('This picture format is not supported. Use JPG or PNG.')); };
        img.onload = function () {
          var max = MAX[kind] || 2400, w = img.naturalWidth, h = img.naturalHeight, s = Math.min(1, max / Math.max(w, h));
          var cw = Math.round(w * s), ch = Math.round(h * s), cv = document.createElement('canvas');
          cv.width = cw; cv.height = ch;
          var cx = cv.getContext('2d'); cx.imageSmoothingQuality = 'high';
          var png = kind === 'logo';
          if (!png) { cx.fillStyle = '#000'; cx.fillRect(0, 0, cw, ch); }
          cx.drawImage(img, 0, 0, cw, ch);
          var dataUrl = png ? cv.toDataURL('image/png') : cv.toDataURL('image/jpeg', 0.86);
          resolve({ dataUrl: dataUrl, b64: dataUrl.split(',')[1], ext: png ? 'png' : 'jpg', w: cw, h: ch });
        };
        img.src = r.result;
      };
      r.readAsDataURL(file);
    });
  }
  function slug(s) { return String(s || 'image').toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'image'; }
  function imgSrc(p) { return S.pending[p] ? S.pending[p].dataUrl : (p ? '/' + p : ''); }

  /* ================= form rendering ================= */
  function renderNav() {
    var side = $('side'); side.innerHTML = '';
    SECTIONS.forEach(function (s) {
      var data = S.content[s.key], off = data && data.show === false;
      side.appendChild(el('button', { class: s.key === S.current ? 'on' : '', onclick: function () { S.current = s.key; renderNav(); renderSection(); window.scrollTo(0, 0); } },
        [el('span', { text: s.label }), off ? el('span', { class: 'tag off', text: 'Hidden' }) : null]));
    });
  }

  function renderSection() {
    var s = SECTIONS.filter(function (x) { return x.key === S.current; })[0];
    var main = $('main'); main.innerHTML = '';
    var sel = el('select', { 'aria-label': 'Choose section', onchange: function () { S.current = sel.value; renderNav(); renderSection(); } });
    SECTIONS.forEach(function (x) { var o = el('option', { value: x.key, text: x.label }); if (x.key === S.current) o.selected = true; sel.appendChild(o); });
    main.appendChild(el('div', { class: 'mob-nav' }, [el('label', { class: 'lbl', text: 'Section' }), sel]));
    main.appendChild(el('h2', { text: s.label }));
    main.appendChild(el('p', { class: 'desc', text: s.desc }));
    if (s.extra) s.extra.forEach(function (f) { main.appendChild(field(S.content, f)); });
    if (s.list) {
      if (!Array.isArray(S.content[s.key])) S.content[s.key] = [];
      main.appendChild(listField(S.content, s.key, s.list));
    } else {
      if (!S.content[s.key] || typeof S.content[s.key] !== 'object') S.content[s.key] = {};
      s.fields.forEach(function (f) { main.appendChild(field(S.content[s.key], f)); });
    }
  }

  function field(obj, f) {
    var id = 'f' + Math.random().toString(36).slice(2, 9);
    if (f.t === 'show') {
      var cb = el('input', { type: 'checkbox', id: id });
      cb.checked = obj.show !== false;
      cb.addEventListener('change', function () { obj.show = cb.checked; changed(); renderNav(); });
      return el('label', { class: 'toggle', for: id }, [cb, el('span', { text: 'Show this section on the website' })]);
    }
    if (f.t === 'bool') {
      var c2 = el('input', { type: 'checkbox', id: id });
      c2.checked = obj[f.k] !== false;
      c2.addEventListener('change', function () { obj[f.k] = c2.checked; changed(); });
      return el('label', { class: 'toggle', for: id }, [c2, el('span', { text: f.l })]);
    }
    var wrap = el('div', { class: 'field' });
    var lab = el('label', { class: 'lbl', for: id, text: f.l });
    if (f.t === 'text' || f.t === 'number') {
      var inp = el('input', { id: id, type: f.t === 'number' ? 'number' : 'text', inputmode: f.t === 'number' ? 'decimal' : null });
      inp.value = obj[f.k] == null ? '' : obj[f.k];
      inp.addEventListener('input', function () { obj[f.k] = f.t === 'number' ? (inp.value === '' ? 0 : Number(inp.value)) : inp.value; changed(); });
      wrap.append(lab, inp);
    } else if (f.t === 'range') {
      var cur = obj[f.k] == null ? f.def : Number(obj[f.k]);
      var rg = el('input', { id: id, type: 'range', min: f.min, max: f.max, step: f.step || 1, style: 'flex:1;accent-color:var(--accent);min-height:44px' });
      var out = el('b', { style: 'min-width:64px;text-align:right;font-size:15px' });
      var demo = el('div', { text: '1,500', style: 'font-family:Oswald,sans-serif;font-weight:600;color:#fff;line-height:1.1;margin-top:10px;padding:14px 18px;border-left:3px solid var(--accent);background:var(--panel);border-radius:0 8px 8px 0;overflow:hidden;white-space:nowrap' });
      function upd() { out.textContent = rg.value + (f.unit || ''); demo.style.fontSize = rg.value + 'px'; }
      rg.value = cur; upd();
      rg.addEventListener('input', function () { obj[f.k] = Number(rg.value); upd(); changed(); });
      var reset = el('button', { class: 'btn sm', type: 'button', text: 'Reset', onclick: function () { rg.value = f.def; obj[f.k] = f.def; upd(); changed(); } });
      wrap.append(lab, el('div', { class: 'color' }, [rg, out, reset]), demo);
    } else if (f.t === 'textarea') {
      var ta = el('textarea', { id: id }); ta.value = obj[f.k] || '';
      ta.addEventListener('input', function () { obj[f.k] = ta.value; changed(); });
      wrap.append(lab, ta);
    } else if (f.t === 'select') {
      var se = el('select', { id: id });
      f.options.forEach(function (o) { var op = el('option', { value: o[0], text: o[1] }); if (obj[f.k] === o[0]) op.selected = true; se.appendChild(op); });
      se.addEventListener('change', function () { obj[f.k] = se.value; changed(); });
      wrap.append(lab, se);
    } else if (f.t === 'color') {
      var col = el('input', { id: id, type: 'color' }), hex = el('input', { type: 'text', 'aria-label': f.l + ' code' });
      col.value = obj[f.k] || '#F06E22'; hex.value = col.value;
      col.addEventListener('input', function () { hex.value = col.value; obj[f.k] = col.value; changed(); });
      hex.addEventListener('change', function () { if (/^#[0-9a-f]{6}$/i.test(hex.value)) { col.value = hex.value; obj[f.k] = hex.value; changed(); } else hex.value = col.value; });
      wrap.append(lab, el('div', { class: 'color' }, [col, hex]));
    } else if (f.t === 'image') {
      wrap.append(lab, imageField(obj, f, id));
    } else if (f.t === 'list') {
      if (!Array.isArray(obj[f.k])) obj[f.k] = [];
      wrap.append(el('span', { class: 'lbl', text: f.title + 's' }), listField(obj, f.k, f));
    } else if (f.t === 'strings') {
      if (!Array.isArray(obj[f.k])) obj[f.k] = [];
      wrap.append(el('span', { class: 'lbl', text: f.l }), stringsField(obj[f.k], f));
    }
    if (f.h) wrap.appendChild(el('p', { class: 'hint', text: f.h }));
    return wrap;
  }

  function imageField(obj, f, id) {
    var box = el('div', { class: 'img' });
    var thumb = el('div', { class: 'thumb' + (f.kind === 'logo' ? ' light' : ''), role: 'img', 'aria-label': 'Current picture' });
    var input = el('input', { id: id, type: 'file', accept: 'image/png,image/jpeg,image/webp', style: 'display:none' });
    var path = el('div', { class: 'path' });
    function show() {
      var p = obj[f.k];
      thumb.style.backgroundImage = p ? 'url("' + imgSrc(p) + '")' : 'none';
      thumb.innerHTML = S.pending[p] ? '<span class="new">NEW</span>' : '';
      path.textContent = p ? (S.pending[p] ? 'New picture — will upload when you publish (' + S.pending[p].w + '×' + S.pending[p].h + ')' : p) : 'No picture';
    }
    function take(file) {
      if (!file) return;
      toast('Preparing picture…');
      processImage(file, f.kind).then(function (r) {
        var p = 'assets/img/uploads/' + Date.now().toString(36) + '-' + slug(file.name) + '.' + r.ext;
        S.pending[p] = r; obj[f.k] = p; show(); changed(); toast('Picture ready. Press Publish to put it on the website.', 'ok');
      }).catch(function (e) { toast(e.message, 'bad'); });
    }
    input.addEventListener('change', function () { take(input.files[0]); input.value = ''; });
    box.addEventListener('dragover', function (e) { e.preventDefault(); box.classList.add('drop'); });
    box.addEventListener('dragleave', function () { box.classList.remove('drop'); });
    box.addEventListener('drop', function (e) { e.preventDefault(); box.classList.remove('drop'); take(e.dataTransfer.files[0]); });
    show();
    box.append(thumb, el('div', { class: 'act' }, [
      el('button', { class: 'btn', type: 'button', text: 'Replace picture', onclick: function () { input.click(); } }),
      path, el('p', { class: 'hint', style: 'margin:0', text: 'Or drag a picture here. Large photos are resized automatically.' }), input]));
    return box;
  }

  function listField(parent, key, def) {
    var arr = parent[key], box = el('div');
    var list = el('div', { class: 'list' });
    function draw() {
      list.innerHTML = '';
      arr.forEach(function (item, i) {
        var card = el('div', { class: 'item' });
        var title = def.title + ' ' + (i + 1) + (item.title || item.name || item.label ? ' — ' + (item.title || item.name || item.label) : '');
        card.appendChild(el('div', { class: 'ih' }, [
          el('b', { text: title }),
          el('button', { class: 'btn sm icon', type: 'button', 'aria-label': 'Move up', text: '↑', disabled: i === 0, onclick: function () { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); changed(); draw(); } }),
          el('button', { class: 'btn sm icon', type: 'button', 'aria-label': 'Move down', text: '↓', disabled: i === arr.length - 1, onclick: function () { arr.splice(i + 1, 0, arr.splice(i, 1)[0]); changed(); draw(); } }),
          el('button', { class: 'btn sm danger', type: 'button', text: 'Remove', onclick: function () {
            dialog('Remove this ' + def.title.toLowerCase() + '?', title, [{ label: 'Cancel' }, { label: 'Remove', cls: 'primary', fn: function () { arr.splice(i, 1); changed(); draw(); } }]);
          } })]));
        def.fields.forEach(function (f) { card.appendChild(field(item, f)); });
        list.appendChild(card);
      });
    }
    draw();
    box.append(list, el('button', { class: 'btn add', type: 'button', text: '+ ' + def.add, onclick: function () {
      var blank = {}; def.fields.forEach(function (f) { blank[f.k] = f.t === 'number' ? 0 : f.t === 'select' ? f.options[0][0] : ''; });
      arr.push(blank); changed(); draw();
      var last = list.lastElementChild; if (last) { last.scrollIntoView({ behavior: 'smooth', block: 'center' }); var i = last.querySelector('input,textarea'); if (i) setTimeout(function () { i.focus(); }, 300); }
    } }));
    return box;
  }

  function stringsField(arr, def) {
    var box = el('div'), list = el('div', { class: 'list', style: 'gap:8px' });
    function draw() {
      list.innerHTML = '';
      arr.forEach(function (v, i) {
        var inp = el('input', { type: 'text', 'aria-label': def.l + ' ' + (i + 1) }); inp.value = v;
        inp.addEventListener('input', function () { arr[i] = inp.value; changed(); });
        list.appendChild(el('div', { class: 'str' }, [inp,
          el('button', { class: 'btn sm icon', type: 'button', 'aria-label': 'Move up', text: '↑', disabled: i === 0, onclick: function () { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); changed(); draw(); } }),
          el('button', { class: 'btn sm icon danger', type: 'button', 'aria-label': 'Remove', text: '✕', onclick: function () { arr.splice(i, 1); changed(); draw(); } })]));
      });
    }
    draw();
    box.append(list, el('button', { class: 'btn add', type: 'button', text: '+ ' + def.add, onclick: function () { arr.push(''); changed(); draw(); var l = list.lastElementChild; if (l) l.querySelector('input').focus(); } }));
    return box;
  }

  /* ================= preview ================= */
  function preview() {
    var c = clone(S.content);
    walkImages(c, function (o, k) { if (S.pending[o[k]]) o[k] = S.pending[o[k]].dataUrl; });
    var w = window.open('/?preview=1', 'cobuilt-preview');
    if (!w) { toast('Your browser blocked the preview window. Allow pop-ups for this site.', 'bad'); return; }
    function onMsg(e) {
      if (e.origin !== location.origin || !e.data || e.data.type !== 'cobuilt-preview-ready' || e.source !== w) return;
      w.postMessage({ type: 'cobuilt-preview', content: c }, location.origin);
    }
    window.addEventListener('message', onMsg);
  }

  /* ================= more menu ================= */
  function more() {
    var url = 'https://github.com/' + S.repo + '/commits/' + encodeURIComponent(S.branch);
    dialog('More options', 'Every publish is saved in GitHub history, so earlier versions can always be restored.', [
      { label: 'Discard unpublished changes', cls: 'danger', fn: function () {
        dialog('Discard changes?', 'This removes everything you changed since the last publish.', [{ label: 'Cancel' }, { label: 'Discard', cls: 'primary', fn: function () {
          S.content = JSON.parse(S.published); S.pending = {}; clearDraft(); setDirty(false); renderNav(); renderSection(); toast('Changes discarded.');
        } }]);
      } },
      { label: 'Publish history', fn: function () { window.open(url, '_blank', 'noopener'); } },
      { label: 'Sign out', fn: function () {
        try { localStorage.removeItem(LS.auth); sessionStorage.removeItem(LS.auth); } catch (e) { /* ignore */ }
        location.reload();
      } },
      { label: 'Close', cls: 'primary' }]);
  }

  /* ================= boot ================= */
  $('signin').addEventListener('click', signIn);
  $('token').addEventListener('keydown', function (e) { if (e.key === 'Enter') signIn(); });
  $('publishBtn').addEventListener('click', publish);
  $('previewBtn').addEventListener('click', preview);
  $('moreBtn').addEventListener('click', more);
  $('overlay').addEventListener('click', function (e) { if (e.target === $('overlay')) $('overlay').classList.remove('on'); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') $('overlay').classList.remove('on');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && $('app').classList.contains('on')) { e.preventDefault(); publish(); }
  });
  window.addEventListener('beforeunload', function (e) { if (S.dirty) { saveDraft(); e.preventDefault(); e.returnValue = ''; } });

  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(LS.auth) || sessionStorage.getItem(LS.auth) || 'null'); } catch (e) { saved = null; }
  if (saved && saved.token) {
    $('token').value = saved.token; $('repo').value = saved.repo || $('repo').value; $('branch').value = saved.branch || 'main';
    signIn();
  }
})();
