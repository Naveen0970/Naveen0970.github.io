/* =========================================================
   AEM PORTFOLIO — interactions (v2)
   ========================================================= */

(function () { var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear(); })();

/* theme toggle (in-memory) */
(function () {
  var btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var r = document.documentElement;
    r.setAttribute('data-theme', r.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });
})();

/* scroll progress */
(function () {
  var bar = document.getElementById('scrollProgress');
  if (!bar) return;
  function upd() { var h = document.documentElement; var max = h.scrollHeight - h.clientHeight; bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%'; }
  document.addEventListener('scroll', upd, { passive: true }); upd();
})();

/* scroll reveal */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
})();

/* hero rotator */
(function () {
  var el = document.getElementById('rotator');
  if (!el) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = 'Sling Models'; return; }
  var words = ['Sling Models', 'Dispatcher tuning', 'headless delivery', 'Core Components', 'editable templates'];
  var w = 0, c = 0, deleting = false;
  function tick() {
    var word = words[w]; el.textContent = word.substring(0, c);
    if (!deleting && c < word.length) { c++; setTimeout(tick, 70); }
    else if (!deleting && c === word.length) { deleting = true; setTimeout(tick, 1400); }
    else if (deleting && c > 0) { c--; setTimeout(tick, 35); }
    else { deleting = false; w = (w + 1) % words.length; setTimeout(tick, 350); }
  }
  tick();
})();

/* content tree */
(function () {
  var nodes = document.querySelectorAll('#treeSvg .tnode');
  var lines = document.querySelector('#treeSvg .tlines');
  if (!nodes.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  nodes.forEach(function (n, i) { n.style.opacity = '0'; n.style.transition = 'opacity .5s ease, transform .5s ease'; n.style.transform = 'translateY(8px)'; setTimeout(function () { n.style.opacity = '1'; n.style.transform = 'none'; }, 250 + i * 160); });
  if (lines) { lines.style.opacity = '0'; lines.style.transition = 'opacity .8s ease'; setTimeout(function () { lines.style.opacity = '1'; }, 200); }
})();

/* PAGE BUILDER */
(function () {
  var builder = document.getElementById('builder');
  if (!builder) return;
  var canvas = document.getElementById('canvas');
  var structure = document.getElementById('structureView');
  var tabPreview = document.getElementById('tabPreview');
  var tabStructure = document.getElementById('tabStructure');

  var fileInput = document.createElement('input');
  fileInput.type = 'file'; fileInput.accept = 'image/*';
  fileInput.style.position = 'absolute'; fileInput.style.left = '-9999px';
  document.body.appendChild(fileInput);
  var uploadTarget = null;

  function esc(s){ var d = document.createElement('div'); d.textContent = (s == null ? '' : s); return d.innerHTML; }
  function ce(tag, field, val, extra){ extra = extra || ''; return '<' + tag + ' class="ce ' + extra + '" contenteditable="true" spellcheck="false" data-field="' + field + '">' + esc(val) + '</' + tag + '>'; }
  function imgSlot(field, src, style){
    style = style || 'height:120px';
    if (src) return '<div class="img-slot has-img" data-img="' + field + '" style="' + style + '"><img src="' + src + '" alt=""><button class="upload-btn" data-upload="' + field + '">Replace</button></div>';
    return '<div class="img-slot" data-img="' + field + '" style="' + style + '"><span class="ph-ico">&#128247;</span><button class="upload-btn" data-upload="' + field + '">Upload image</button></div>';
  }
  function n3(fn){ return [0,1,2].map(fn).join(''); }

  var defs = {
    hero: { tag: 'myapp/components/hero', defaults: { title: 'Build once, author anywhere', text: 'A configurable hero with a headline and call to action.', cta: 'Get started' },
      render: function (d) { return '<div class="blk blk-hero">' + ce('h4','title',d.title) + ce('p','text',d.text) + ce('span','cta',d.cta,'b') + '</div>'; } },
    teaser: { tag: 'myapp/components/teaser', defaults: { title: 'Featured story', text: 'Pulls its content from a Content Fragment.', img: '' },
      render: function (d) { return '<div class="blk blk-teaser">' + imgSlot('img',d.img,'width:120px;height:84px') + '<div class="tcontent">' + ce('h4','title',d.title) + ce('p','text',d.text) + '</div></div>'; } },
    text: { tag: 'myapp/components/text', defaults: { title: 'Rich text', body: 'Click to edit this text. Authors type directly into the page, just like in AEM.' },
      render: function (d) { return '<div class="blk blk-text">' + ce('h4','title',d.title) + ce('p','body',d.body,'tbody') + '</div>'; } },
    image: { tag: 'myapp/components/image', defaults: { img: '' },
      render: function (d) { return '<div class="blk blk-image">' + imgSlot('img',d.img,'height:220px') + '</div>'; } },
    grid: { tag: 'myapp/components/cardgrid', defaults: { card0:'',card1:'',card2:'', cardlabel0:'Card one', cardlabel1:'Card two', cardlabel2:'Card three' },
      render: function (d) { return '<div class="blk blk-grid">' + n3(function(i){ return '<div class="mc">' + imgSlot('card'+i, d['card'+i], 'height:70px') + ce('div','cardlabel'+i, d['cardlabel'+i], 'mlabel') + '</div>'; }) + '</div>'; } },
    cta: { tag: 'myapp/components/cta', defaults: { title: 'Ready to talk?', cta: 'Contact me' },
      render: function (d) { return '<div class="blk blk-cta">' + ce('h4','title',d.title) + '<span class="b ce" contenteditable="true" spellcheck="false" data-field="cta">' + esc(d.cta) + '</span></div>'; } },
    carousel: { tag: 'myapp/components/carousel', defaults: { slide0:'',slide1:'',slide2:'' },
      render: function (d) { return '<div class="blk blk-carousel" data-active="0"><div class="car-track">' + n3(function(i){ return '<div class="car-slide' + (i===0?' active':'') + '">' + imgSlot('slide'+i, d['slide'+i], 'height:200px') + '</div>'; }) + '</div><button class="car-arw car-prev">&#8249;</button><button class="car-arw car-next">&#8250;</button><div class="car-dots">' + n3(function(i){ return '<span class="dot' + (i===0?' on':'') + '"></span>'; }) + '</div></div>'; } },
    accordion: { tag: 'myapp/components/accordion', defaults: { acctitle0:'What is AEM?', accbody0:'A component-based content management system from Adobe.', acctitle1:'Why components?', accbody1:'They are reusable, which means faster, safer authoring.', acctitle2:'Headless delivery?', accbody2:'Content is exposed as JSON via GraphQL for any channel.' },
      render: function (d) { return '<div class="blk blk-accordion">' + n3(function(i){ return '<div class="acc-item' + (i===0?' open':'') + '"><div class="acc-h">' + ce('span','acctitle'+i, d['acctitle'+i], 'acc-title') + '<button class="acc-chev" aria-label="Toggle">&#9662;</button></div><div class="acc-body">' + ce('div','accbody'+i, d['accbody'+i]) + '</div></div>'; }) + '</div>'; } },
    tabs: { tag: 'myapp/components/tabs', defaults: { tablabel0:'Overview', tabbody0:'This panel is fully editable — click the text to change it.', tablabel1:'Details', tabbody1:'Switch tabs to reveal each panel.', tablabel2:'Specs', tabbody2:'Click a tab label to rename it.' },
      render: function (d) { return '<div class="blk blk-tabs" data-active="0"><div class="tab-nav">' + n3(function(i){ return '<div class="tab-btn' + (i===0?' active':'') + '" data-tab="' + i + '">' + ce('span','tablabel'+i, d['tablabel'+i]) + '</div>'; }) + '</div>' + n3(function(i){ return '<div class="tab-panel' + (i===0?' active':'') + '" data-panel="' + i + '">' + ce('p','tabbody'+i, d['tabbody'+i]) + '</div>'; }) + '</div>'; } },
    button: { tag: 'myapp/components/button', defaults: { label: 'Click me' },
      render: function (d) { return '<div class="blk blk-button"><span class="demo-btn ce" contenteditable="true" spellcheck="false" data-field="label">' + esc(d.label) + '</span></div>'; } },
    quote: { tag: 'myapp/components/quote', defaults: { text: 'Authoring in AEM should feel effortless for content teams.', author: '\u2014 A happy content author' },
      render: function (d) { return '<div class="blk blk-quote"><div class="q-mark">&#10077;</div>' + ce('p','text',d.text,'q-text') + ce('div','author',d.author,'q-author') + '</div>'; } },
    video: { tag: 'myapp/components/video', defaults: { img: '', caption: 'Upload a poster image for this video block.' },
      render: function (d) { return '<div class="blk blk-video"><div class="v-wrap">' + imgSlot('img',d.img,'height:200px') + '<span class="v-play">&#9654;</span></div>' + ce('div','caption',d.caption,'v-cap') + '</div>'; } }
  };

  function clone(o){ return JSON.parse(JSON.stringify(o)); }
  var uid = 0;
  var page = [ { type:'hero', id:++uid, data: clone(defs.hero.defaults) }, { type:'teaser', id:++uid, data: clone(defs.teaser.defaults) } ];

  function render() {
    if (!page.length) { canvas.innerHTML = '<div class="canvas-empty">Empty page.\nDrag a component here,\nor click one to add it.</div>'; }
    else {
      canvas.innerHTML = page.map(function (p, i) {
        return '<div class="placed" data-id="' + p.id + '"><span class="ptag">' + defs[p.type].tag + '</span>' +
          '<div class="ptoolbar">' +
          '<button data-act="up" title="Move up" ' + (i === 0 ? 'disabled style="opacity:.35"' : '') + '>&#8593;</button>' +
          '<button data-act="down" title="Move down" ' + (i === page.length - 1 ? 'disabled style="opacity:.35"' : '') + '>&#8595;</button>' +
          '<button data-act="del" title="Remove">&#10005;</button>' +
          '</div>' + defs[p.type].render(p.data) + '</div>';
      }).join('');
    }
    renderStructure();
  }

  function renderStructure() {
    var inner = page.map(function (p) {
      var props = Object.keys(p.data).map(function (k) {
        var v = p.data[k];
        if (typeof v === 'string' && v.indexOf('data:image') === 0) return '        <span class="key">"' + k + '"</span>: <span class="str">"/content/dam/' + k + '.png"</span>';
        v = (v == null ? '' : String(v));
        if (v.length > 38) v = v.slice(0, 38) + '\u2026';
        return '        <span class="key">"' + k + '"</span>: <span class="str">"' + esc(v) + '"</span>';
      }).join(',\n');
      return '    <span class="key">' + p.type + '_' + p.id + '</span>: {\n      <span class="key">"sling:resourceType"</span>: <span class="str">"' + defs[p.type].tag + '"</span>' + (props ? ',\n' + props : '') + '\n    }';
    }).join(',\n');
    structure.innerHTML = '{\n  <span class="key">"jcr:primaryType"</span>: <span class="str">"cq:Page"</span>,\n  <span class="key">"root"</span>: {\n' + (inner ? inner + '\n' : '') + '  }\n}';
  }

  function add(type) { page.push({ type: type, id: ++uid, data: clone(defs[type].defaults) }); render(); }

  // delegated clicks
  canvas.addEventListener('click', function (e) {
    var t = e.target;
    var btn = t.closest('button[data-act]');
    if (btn) {
      var host = t.closest('.placed'); var id = +host.getAttribute('data-id');
      var idx = page.findIndex(function (p) { return p.id === id; });
      var act = btn.getAttribute('data-act');
      if (act === 'del') page.splice(idx, 1);
      else if (act === 'up' && idx > 0) { var a = page[idx-1]; page[idx-1] = page[idx]; page[idx] = a; }
      else if (act === 'down' && idx < page.length-1) { var b = page[idx+1]; page[idx+1] = page[idx]; page[idx] = b; }
      render(); return;
    }
    var up = t.closest('[data-upload]');
    if (up) { var ph = t.closest('.placed'); uploadTarget = { id: +ph.getAttribute('data-id'), field: up.getAttribute('data-upload') }; fileInput.value = ''; fileInput.click(); return; }
    var chev = t.closest('.acc-chev');
    if (chev) { chev.closest('.acc-item').classList.toggle('open'); return; }
    var accH = t.closest('.acc-h');
    if (accH && !t.closest('.ce')) { accH.parentNode.classList.toggle('open'); return; }
    var tab = t.closest('.tab-btn');
    if (tab) { var wrap = tab.closest('.blk-tabs'); var ti = tab.getAttribute('data-tab');
      wrap.querySelectorAll('.tab-btn').forEach(function (x) { x.classList.toggle('active', x === tab); });
      wrap.querySelectorAll('.tab-panel').forEach(function (pn) { pn.classList.toggle('active', pn.getAttribute('data-panel') === ti); }); return; }
    var arw = t.closest('.car-arw');
    if (arw) { var car = arw.closest('.blk-carousel'); var sl = car.querySelectorAll('.car-slide'); var dt = car.querySelectorAll('.dot');
      var cur = +car.getAttribute('data-active'); var nn = sl.length;
      cur = arw.classList.contains('car-next') ? (cur + 1) % nn : (cur - 1 + nn) % nn;
      car.setAttribute('data-active', cur);
      sl.forEach(function (s, i) { s.classList.toggle('active', i === cur); });
      dt.forEach(function (s, i) { s.classList.toggle('on', i === cur); }); return; }
  });

  // inline text edits
  canvas.addEventListener('focusout', function (e) {
    var t = e.target;
    if (t.classList && t.classList.contains('ce')) {
      var host = t.closest('.placed'); if (!host) return;
      var id = +host.getAttribute('data-id'); var field = t.getAttribute('data-field');
      var item = page.find(function (p) { return p.id === id; });
      if (item) { item.data[field] = t.innerText; renderStructure(); }
    }
  });

  // image upload
  fileInput.addEventListener('change', function () {
    var f = fileInput.files && fileInput.files[0];
    if (!f || !uploadTarget) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      var item = page.find(function (p) { return p.id === uploadTarget.id; });
      if (item) { item.data[uploadTarget.field] = ev.target.result; render(); }
      uploadTarget = null;
    };
    reader.readAsDataURL(f);
  });

  // palette: click + drag to add
  document.querySelectorAll('.palette-item').forEach(function (it) {
    var type = it.getAttribute('data-type');
    it.addEventListener('click', function () { add(type); });
    it.addEventListener('dragstart', function (e) { e.dataTransfer.setData('text/plain', type); });
  });
  canvas.addEventListener('dragover', function (e) { e.preventDefault(); canvas.classList.add('drag-over'); });
  canvas.addEventListener('dragleave', function () { canvas.classList.remove('drag-over'); });
  canvas.addEventListener('drop', function (e) { e.preventDefault(); canvas.classList.remove('drag-over'); var type = e.dataTransfer.getData('text/plain'); if (defs[type]) add(type); });

  tabPreview.addEventListener('click', function () { builder.classList.remove('show-structure'); tabPreview.classList.add('active'); tabStructure.classList.remove('active'); });
  tabStructure.addEventListener('click', function () { builder.classList.add('show-structure'); tabStructure.classList.add('active'); tabPreview.classList.remove('active'); });

  render();
})();

/* GitHub activity */
(function () {
  var card = document.getElementById('ghCard');
  if (!card) return;
  var username = card.getAttribute('data-user');
  var avatar = document.getElementById('ghAvatar');
  var statRepos = document.getElementById('ghRepos');
  var statFollowers = document.getElementById('ghFollowers');
  var repoList = document.getElementById('ghRepoList');
  var note = document.getElementById('ghNote');
  function escapeHtml(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  if (!username || username.indexOf('[') !== -1) { note.textContent = 'Add your GitHub username to the data-user attribute on this card (in index.html) to show live repos and stats.'; return; }
  avatar.textContent = username.charAt(0).toUpperCase();
  fetch('https://api.github.com/users/' + username).then(function (r) { return r.json(); }).then(function (u) {
    if (u && typeof u.public_repos === 'number') { statRepos.textContent = u.public_repos; statFollowers.textContent = u.followers; if (u.avatar_url) avatar.innerHTML = '<img src="' + u.avatar_url + '" alt="" style="width:100%;height:100%;border-radius:14px;object-fit:cover">'; }
  }).catch(function () {});
  fetch('https://api.github.com/users/' + username + '/repos?sort=updated&per_page=4').then(function (r) { return r.json(); }).then(function (repos) {
    if (!Array.isArray(repos) || !repos.length) { note.textContent = 'No public repos found for "' + username + '".'; return; }
    repoList.innerHTML = repos.map(function (re) { return '<a class="gh-repo" href="' + re.html_url + '" target="_blank" rel="noopener"><div class="rn">' + re.name + '</div><div class="rd">' + (re.description ? escapeHtml(re.description) : 'No description') + '</div><div class="rmeta"><span>&#9733; ' + re.stargazers_count + '</span><span>' + (re.language || '\u2014') + '</span></div></a>'; }).join('');
    note.textContent = '';
  }).catch(function () { note.textContent = 'Could not reach GitHub right now.'; });
})();

/* work filters */
(function () {
  var btns = document.querySelectorAll('.filter-btn');
  if (!btns.length) return;
  var cards = document.querySelectorAll('.work-card');
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      btns.forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active');
      var f = b.getAttribute('data-filter');
      cards.forEach(function (c) { var tags = (c.getAttribute('data-tags') || '').split(' '); c.classList.toggle('hide', f !== 'all' && tags.indexOf(f) === -1); });
    });
  });
})();

/* contact form */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;
  var status = document.getElementById('formStatus');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var action = form.getAttribute('action') || '';
    if (action.indexOf('[') !== -1 || !action) { status.className = 'form-status err'; status.textContent = 'Setup: create a free form at formspree.io and paste its URL into the form action.'; return; }
    status.className = 'form-status'; status.textContent = 'Sending\u2026';
    fetch(action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { if (r.ok) { status.className = 'form-status ok'; status.textContent = 'Thanks \u2014 your message was sent.'; form.reset(); } else { status.className = 'form-status err'; status.textContent = 'Something went wrong. Email me directly instead.'; } })
      .catch(function () { status.className = 'form-status err'; status.textContent = 'Network error. Email me directly instead.'; });
  });
})();

/* command palette */
(function () {
  var overlay = document.getElementById('cmdk');
  if (!overlay) return;
  var input = document.getElementById('cmdkInput');
  var list = document.getElementById('cmdkList');
  var items = [
    { label: 'Go to Page Builder', icon: '\u25A6', act: function () { jump('#playground'); } },
    { label: 'Go to About', icon: '\u25C6', act: function () { jump('#about'); } },
    { label: 'Go to Skills', icon: '\u2726', act: function () { jump('#skills'); } },
    { label: 'Go to Experience', icon: '\u276F', act: function () { jump('#experience'); } },
    { label: 'Go to Work', icon: '\u25A4', act: function () { jump('#work'); } },
    { label: 'View GitHub activity', icon: '\u2387', act: function () { jump('#github'); } },
    { label: 'Contact me', icon: '\u2709', act: function () { jump('#contact'); } },
    { label: 'Toggle light / dark theme', icon: '\u25D0', act: function () { var b = document.getElementById('themeToggle'); if (b) b.click(); } }
  ];
  var active = 0;
  function jump(sel) { close(); var t = document.querySelector(sel); if (t) t.scrollIntoView({ behavior: 'smooth' }); }
  function open() { overlay.classList.add('open'); input.value = ''; renderList(''); setTimeout(function(){ input.focus(); }, 30); }
  function close() { overlay.classList.remove('open'); }
  function renderList(q) {
    var f = items.filter(function (it) { return it.label.toLowerCase().indexOf(q.toLowerCase()) !== -1; });
    active = 0;
    list.innerHTML = f.map(function (it, i) { return '<div class="cmdk-item' + (i === 0 ? ' active' : '') + '" data-i="' + items.indexOf(it) + '"><span class="ci">' + it.icon + '</span>' + it.label + '<span class="hint">\u21B5</span></div>'; }).join('') || '<div class="cmdk-item">No matches</div>';
  }
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); overlay.classList.contains('open') ? close() : open(); return; }
    if (!overlay.classList.contains('open')) return;
    var rows = list.querySelectorAll('.cmdk-item[data-i]');
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, rows.length - 1); paint(rows); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); paint(rows); }
    else if (e.key === 'Enter') { e.preventDefault(); if (rows[active]) items[+rows[active].getAttribute('data-i')].act(); }
  });
  function paint(rows) { rows.forEach(function (r, i) { r.classList.toggle('active', i === active); }); }
  input.addEventListener('input', function () { renderList(input.value); });
  list.addEventListener('click', function (e) { var row = e.target.closest('.cmdk-item[data-i]'); if (row) items[+row.getAttribute('data-i')].act(); });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  var trigger = document.getElementById('cmdkTrigger'); if (trigger) trigger.addEventListener('click', open);
})();

/* metric counters */
(function () {
  var metrics = document.querySelectorAll('[data-count]');
  if (!metrics.length || !('IntersectionObserver' in window)) { metrics.forEach(function (m) { m.textContent = m.getAttribute('data-count') + (m.getAttribute('data-suffix') || ''); }); return; }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, target = parseFloat(el.getAttribute('data-count')), suffix = el.getAttribute('data-suffix') || '';
      var dec = (target % 1 !== 0) ? 1 : 0;
      if (reduce) { el.textContent = target.toFixed(dec) + suffix; io.unobserve(el); return; }
      var dur = 1100, t0 = null;
      function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / dur, 1); var eased = 1 - Math.pow(1 - p, 3); el.textContent = (target * eased).toFixed(dec) + suffix; if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step); io.unobserve(el);
    });
  }, { threshold: 0.5 });
  metrics.forEach(function (m) { io.observe(m); });
})();
