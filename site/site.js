/* Fullsite · scripts compartidos por todas las páginas. Cada bloque revisa que su sección exista. */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EN = document.documentElement.lang === 'en';
  var $ = function(s){ return document.querySelector(s) }, $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)) };
  function money(n){ return '$' + n.toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits:2}) }

  // ── Escalado de dispositivos: en pantallas chicas se reducen como una imagen, no se reacomodan
  function fit(){ $$('.fit').forEach(function(f){ var w = +f.dataset.w, inn = f.firstElementChild; inn.style.width = w + 'px';
    var k = Math.min(1, f.clientWidth / w); inn.style.transform = 'scale(' + k + ')'; inn.style.marginLeft = Math.max(0, (f.clientWidth - w) / 2) + 'px'; f.style.height = Math.ceil(inn.offsetHeight * k) + 'px' }) }
  fit(); addEventListener('resize', fit); addEventListener('load', fit); setTimeout(fit, 600);

  // ── Mac del héroe: la tapa se entreabre al cargar y termina de abrirse con el scroll
  var mac = $('#mac'), hstage = $('.hstage');
  if (mac) {
    if (reduce) { mac.classList.add('open'); hstage && hstage.classList.add('on') }
    else {
      mac.classList.add('scr');
      // Cerrada a ~55° cuando la Mac asoma abajo; abierta del todo cuando su borde llega al 20% superior
      var oCur = 1, oTgt = 1, oRaf = 0, MAXO = .66;
      var oCalc = function(){ var r = (hstage || mac).getBoundingClientRect(), vh = innerHeight;
        oTgt = MAXO * Math.max(0, Math.min(1, (r.top - vh * .2) / (vh * .65))) };
      var oTick = function(){ oCur += (oTgt - oCur) * .1; if (Math.abs(oTgt - oCur) < .002) oCur = oTgt;
        mac.style.setProperty('--o', oCur.toFixed(4)); oRaf = oCur !== oTgt ? requestAnimationFrame(oTick) : 0 };
      var oGo = function(){ oCalc(); if (oTgt < .22 && !mac.classList.contains('lit')) setTimeout(heroLit, 350); if (oRaf) cancelAnimationFrame(oRaf); oRaf = requestAnimationFrame(oTick) };
      addEventListener('scroll', oGo, {passive:true}); addEventListener('resize', oGo);
      setTimeout(function(){ hstage && hstage.classList.add('on'); oGo(); heroLive() }, 250);
    }
  }
  function heroLit(){
    if (mac.classList.contains('lit')) return; mac.classList.add('lit');
    var mt = $('#mtoast'); if (!mt) return;
    var TT = EN ? [['r','Pre-check dropped','Table 12 · 1 min ago','−$380'],['a','Unauthorized comp','Register 2 · 6:40 pm','−$310'],['g','Best hour of the month','8 to 9 pm','+18%']]
                : [['r','Precuenta cancelada','Mesa 12 · hace 1 min','−$380'],['a','Cortesía sin autorizar','Caja 2 · 6:40 pm','−$310'],['g','Mejor hora del mes','8 a 9 pm','+18%']];
    var ti = 0, showT = function(){ var d = TT[ti++ % TT.length]; mt.className = 'mtoast ' + d[0];
      mt.innerHTML = '<span class="dot"></span><span class="tx"><small>' + (EN ? 'Fullsite AI · now' : 'Fullsite IA · ahora') + '</small><b>' + d[1] + '</b><em>' + d[2] + '</em></span><strong>' + d[3] + '</strong>';
      void mt.offsetWidth; mt.classList.add('in'); setTimeout(function(){ mt.classList.remove('in') }, 4200) };
    setTimeout(showT, 900); setInterval(showT, 5600);
  }
  function heroLive(){
    var push = $('#push'); if (!push) return;
    var PP = EN ? [['Heads up','3 pre-checks dropped $1,240 this afternoon. Want to see which tables?'],['Good pace 🔥','You are 12% above a normal Saturday at this hour.'],['Z report ready','Everything balanced to the cent. You can close.']]
                : [['Ojo','3 precuentas bajaron $1,240 hoy en la tarde. ¿Te digo qué mesas?'],['Buen ritmo 🔥','Vas 12% arriba de un sábado normal a esta hora.'],['Corte Z listo','Todo cuadró al centavo. Ya puedes cerrar.']];
    var pi = 0, showP = function(){ var d = PP[pi++ % PP.length];
      push.innerHTML = '<img src="/site/img/logo-f.jpg" alt=""><span><small><b>FULLSITE</b>' + (EN ? 'now' : 'ahora') + '</small><b>' + d[0] + '</b>' + d[1] + '</span>';
      push.classList.remove('in'); void push.offsetWidth; push.classList.add('in'); setTimeout(function(){ push.classList.remove('in') }, 4600) };
    setTimeout(function(){ showP(); setInterval(showP, 6400) }, 3200);
  }

  // ── Panel de Connect: alertas que llegan y venta que sube
  var alerts = $('#alerts');
  if (alerts) {
    var lista = EN ? [['var(--red)','Pre-check dropped','Table 12 · 4:05 pm','−$380','var(--red)'],['var(--amber)','Unauthorized comp','Register · 6:40 pm','−$310','var(--amber)'],['var(--g-2)','Best hour of the month','8 to 9 pm','+18%','var(--g)'],['var(--red)','Void after pre-check','Table 9 · 8:12 pm','−$285','var(--red)'],['var(--blue)','Table open 2 h','Patio 3','check','var(--blue)']] : [['var(--red)','Precuenta bajó','Mesa 12 · 16:05','−$380','var(--red)'],['var(--amber)','Cortesía sin autorizar','Caja · 18:40','−$310','var(--amber)'],['var(--g-2)','Mejor hora del mes','20:00 a 21:00','+18%','var(--g)'],['var(--red)','Borrado tras precuenta','Mesa 9 · 20:12','−$285','var(--red)'],['var(--blue)','Mesa abierta 2 h','Terraza 3','revisar','var(--blue)']], ai = 0;
    var addA = function(){ var d = lista[ai++ % lista.length], el = document.createElement('div'); el.className = 'al'; el.innerHTML = '<i style="background:' + d[0] + '"></i><span><b>' + d[1] + '</b><small>' + d[2] + '</small></span><em style="color:' + d[4] + '">' + d[3] + '</em>'; alerts.insertBefore(el, alerts.firstChild); while (alerts.children.length > 4) alerts.lastChild.remove() };
    addA(); addA(); addA(); addA(); if (!reduce) setInterval(addA, 3800);
  }
  var venta = 41960, kv = $('#kv'), mv = $('#mv');
  if ((kv || mv) && !reduce) setInterval(function(){ venta += Math.round(120 + Math.random() * 420); var t = '$' + venta.toLocaleString('es-MX'); if (kv) kv.textContent = t; if (mv) mv.textContent = t }, 2400);

  // ── Marquesina continua
  var mq = $('#mq'); if (mq) mq.innerHTML += mq.innerHTML;

  // ── "Cómo funciona": barras de Detecta, puntos de Conecta y pasos fijos
  var db = $('#detbars');
  if (db) { var h = ''; for (var i = 0; i < 30; i++) { if (i === 22) continue; var v = 70 + Math.round(Math.sin(i * 1.7) * 22 + Math.cos(i * .6) * 14); h += '<rect x="' + (i * 17.4 + 2) + '" y="' + (210 - v - 40) + '" width="12" height="' + (v + 40) + '" rx="3"/>' } db.innerHTML = h }
  var fd = $('#flowdots'), dots = [];
  if (fd) $$('.hub .ln path').forEach(function(p, i, all){ var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('r', '3.5'); c.setAttribute('class', 'dot'); fd.appendChild(c); c._p = p; c._o = i / all.length; dots.push(c) });
  var steps = $$('.st'), panes = $$('.pane'), cur = -1;
  function setStep(n){ if (n === cur) return; cur = n; steps.forEach(function(s, i){ s.classList.toggle('on', i === n) }); panes.forEach(function(p, i){ p.classList.toggle('on', i === n) });
    var todos = $$('.todo'); if (n === 3) todos.forEach(function(t, i){ setTimeout(function(){ if (cur === 3) t.classList.add('ok') }, 400 + i * 450) }); else todos.forEach(function(t, i){ if (i) t.classList.remove('ok') }) }
  if (dots.length) {
    if (!reduce) { var t0 = performance.now(); (function loop(t){ if (cur === 0) dots.forEach(function(c){ var L = c._p.getTotalLength(), k = ((t - t0) / 2600 + c._o) % 1, pt = c._p.getPointAtLength(L * k); c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y) }); requestAnimationFrame(loop) })(t0) }
    else dots.forEach(function(c){ var pt = c._p.getPointAtLength(c._p.getTotalLength() / 2); c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y) });
  }

  // ── Caja → cocina: la terminal toca productos, envía y la orden aparece en la pantalla de cocina
  var ptiles = $('#ptiles');
  if (ptiles) {
    var PT = EN ? [['Americano',48,'#a8703a'],['Cappuccino',75,'#a8703a'],['Lemonade',55,'#3b82f6'],['Sparkling water',40,'#3b82f6'],['Chilaquiles',165,'#f59e0b'],['Enchiladas',185,'#2e9e5b'],['Steak tacos',210,'#2e9e5b'],['Burger',195,'#2e9e5b'],['Salad',150,'#2e9e5b'],['Chocolate cake',95,'#ec4899'],['Beer',60,'#8b5cf6'],['Mezcal',120,'#8b5cf6']] : [['Café americano',48,'#a8703a'],['Capuchino',75,'#a8703a'],['Limonada',55,'#3b82f6'],['Agua mineral',40,'#3b82f6'],['Chilaquiles',165,'#f59e0b'],['Enchiladas',185,'#2e9e5b'],['Tacos de arrachera',210,'#2e9e5b'],['Hamburguesa',195,'#2e9e5b'],['Ensalada',150,'#2e9e5b'],['Pastel de chocolate',95,'#ec4899'],['Cerveza',60,'#8b5cf6'],['Mezcal',120,'#8b5cf6']];
    var plines = $('#plines'), ptot = $('#ptot'), pamt = $('#pamt'), psend = $('#psend'), pk = $('#pk'), term = $('#term'), kgrid = $('#kgrid');
    ptiles.innerHTML = PT.map(function(p, i){ return '<span class="tl" style="--c:' + p[2] + ';animation-delay:' + (i * 40) + 'ms">' + p[0] + '<small>$' + p[1] + '</small></span>' }).join('');
    var tls = $$('#ptiles .tl'), orders = [[0, 4, 6, 2], [7, 10, 10, 9], [1, 5, 8, 3]], oc = 0, order = orders[0], oi = 0, total = 0, mesas = [12, 7, 3], picked = [];
    var KT = EN ? [['Table 4','3 min',['2 Steak tacos','1 Lemonade'],''],['Bar','1 min',['3 Mezcal','1 Beer'],''],['Table 9','11 min',['1 Burger','1 Salad'],'l']] : [['Mesa 4','3 min',['2 Tacos de arrachera','1 Limonada'],''],['Barra','1 min',['3 Mezcal','1 Cerveza'],''],['Mesa 9','11 min',['1 Hamburguesa','1 Ensalada'],'l']];
    var kt = function(d, isNew){ return '<div class="kt2 ' + d[3] + (isNew ? ' new' : '') + '"><b>' + d[0] + '<span>' + d[1] + '</span></b><div>' + d[2].join('<br>') + '</div></div>' };
    if (kgrid) kgrid.innerHTML = KT.map(function(d){ return kt(d) }).join('');
    var tapOne = function(){
      if (oi === 99) return;
      if (oi >= order.length) {
        psend.classList.remove('pulse2'); void psend.offsetWidth; psend.classList.add('pulse2'); if (pk) pk.classList.add('on');
        if (kgrid) { var cnt = {}; picked.forEach(function(n){ cnt[n] = (cnt[n] || 0) + 1 }); kgrid.insertAdjacentHTML('afterbegin', kt([(EN ? 'Table ' : 'Mesa ') + mesas[oc % 3], EN ? 'now' : 'ahora', Object.keys(cnt).map(function(n){ return cnt[n] + ' ' + n }), ''], true)); while (kgrid.children.length > 6) kgrid.lastChild.remove(); setTimeout(function(){ var n = kgrid.querySelector('.new'); if (n) n.classList.remove('new') }, 2600) }
        setTimeout(function(){ if (pk) pk.classList.remove('on'); plines.innerHTML = ''; total = 0; ptot.textContent = pamt.textContent = money(0); oi = 0; picked = []; oc++; order = orders[oc % orders.length] }, 2000); oi = 99; return }
      if (oi === 99) return;
      var k = order[oi++], p = PT[k], t = tls[k]; t.classList.add('tap'); setTimeout(function(){ t.classList.remove('tap') }, 180); picked.push(p[0]);
      var el = document.createElement('div'); el.className = 'ln2'; el.innerHTML = '<span class="q">1</span><span>' + p[0] + '</span><span class="p">' + money(p[1]) + '</span>'; plines.appendChild(el);
      total += p[1]; ptot.textContent = pamt.textContent = money(total);
    };
    var story = $('#posstory');
    if (story) {
      var sOrder = [0, 4, 6, 2], sKey = '', sN = 0, steps3 = $$('.pst-s', story), sbar = $('#pstbar'), sai = $('#pstai');
      var sTicket = function(){ return kgrid && kgrid.querySelector('.st') };
      var sRender = function(){
        var r = story.getBoundingClientRect(), span = story.offsetHeight - innerHeight, p = Math.max(0, Math.min(1, -r.top / Math.max(1, span)));
        if (reduce) p = 1;
        var n = 0; for (var i = 0; i < 4; i++) if (p >= .06 + i * .08) n = i + 1;
        var sent = p >= .44, ready = p >= .74, st = p < .4 ? 0 : p < .72 ? 1 : 2;
        if (sbar) sbar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
        steps3.forEach(function(x, i){ x.classList.toggle('on', i === st); x.classList.toggle('done', i < st) });
        var key = n + '|' + sent + '|' + ready; if (key === sKey) return; sKey = key;
        if (n !== sN) { if (n > sN) { var t = tls[sOrder[n - 1]]; t.classList.add('tap'); setTimeout(function(){ t.classList.remove('tap') }, 220) }
          plines.innerHTML = ''; total = 0;
          sOrder.slice(0, n).forEach(function(k){ var p2 = PT[k], el = document.createElement('div'); el.className = 'ln2'; el.innerHTML = '<span class="q">1</span><span>' + p2[0] + '</span><span class="p">' + money(p2[1]) + '</span>'; plines.appendChild(el); total += p2[1] });
          ptot.textContent = pamt.textContent = money(total); sN = n }
        var tk = sTicket();
        if (sent && !tk && kgrid) { psend.classList.remove('pulse2'); void psend.offsetWidth; psend.classList.add('pulse2'); if (pk) pk.classList.add('on');
          kgrid.insertAdjacentHTML('afterbegin', kt([(EN ? 'Table ' : 'Mesa ') + 12, EN ? 'now' : 'ahora', sOrder.map(function(k){ return '1 ' + PT[k][0] }), 'st'], true)); tk = sTicket() }
        if (!sent && tk) { kgrid.removeChild(tk); tk = null; if (pk) pk.classList.remove('on') }
        if (tk) { tk.classList.toggle('ok', ready); tk.classList.toggle('new', !ready); tk.querySelector('b span').textContent = ready ? (EN ? '✓ Ready · 6 min' : '✓ Lista · 6 min') : (EN ? 'now' : 'ahora') }
        if (sai) sai.classList.toggle('in', ready);
      };
      addEventListener('scroll', sRender, {passive:true}); addEventListener('resize', sRender); sRender();
    }
    else if (!reduce) setInterval(function(){ var r = term.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) tapOne() }, 1000);
    else order.forEach(function(){ tapOne() });
  }

  // ── Chat de Fullsite IA: conversación visual que se escribe sola cuando está a la vista
  var acb = $('#acb');
  if (acb) {
    var CV = EN ? [
      ['me','How is this week going?'],
      ['ai','You are <b>6% above</b> last week. Saturday was your best day.<div class="alrt" style="margin:10px 0 0">⚠ Heads up: 3 pre-checks dropped <b>&nbsp;$1,240&nbsp;</b> on Friday afternoon.</div><div class="lg2"><span><i></i>This week</span><span><i class="d"></i>Last week</span></div><svg class="mchart" viewBox="0 0 280 110" preserveAspectRatio="none"><g stroke="#e6eae7"><path d="M0 20H280M0 55H280M0 90H280"/></g><defs><linearGradient id="cga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#10b981" stop-opacity=".28"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></linearGradient></defs><path class="ar3" d="M2 78 C30 74 40 66 42 64 S70 70 82 62 S110 50 122 52 S150 44 162 40 S190 30 202 28 S230 20 240 18 V96 H2Z" fill="url(#cga)"/><path class="ln2" d="M2 82 C30 80 40 74 42 72 S70 76 82 70 S110 62 122 64 S150 58 162 54 S190 48 202 46 S230 42 240 40" fill="none" stroke="#a1a1aa" stroke-width="1.6" stroke-dasharray="4 5"/><path class="ln" d="M2 78 C30 74 40 66 42 64 S70 70 82 62 S110 50 122 52 S150 44 162 40 S190 30 202 28 S230 20 240 18" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round"/><circle class="fri2" cx="162" cy="40" r="4" fill="none" stroke="#ef4444" stroke-width="1.5"/><circle class="fri" cx="162" cy="40" r="4" fill="#ef4444"/><circle class="ring" cx="240" cy="18" r="4.5" fill="none" stroke="#10b981" stroke-width="1.5"/><circle cx="240" cy="18" r="4.5" fill="#10b981" class="pt"/><text x="2" y="106" class="axis">Mon</text><text x="42" y="106" class="axis">Tue</text><text x="82" y="106" class="axis">Wed</text><text x="122" y="106" class="axis">Thu</text><text x="162" y="106" class="axis">Fri</text><text x="202" y="106" class="axis">Sat</text><text x="242" y="106" class="axis">Sun</text></svg>'],
      ['me','What should I do?'],
      ['ai','Here is what I would do today:<ul class="todo2"><li><i>1</i>Review tables 12, 9 and 4 with the register<em>$1,240</em></li><li><i>2</i>Raise the rib eye 10%<em>+$2,800/mo</em></li></ul><div class="qr"><span>Notify manager</span><span>See details</span></div>']
    ] : [
      ['me','¿Cómo voy esta semana?'],
      ['ai','Vas <b>6% arriba</b> de la semana pasada. El sábado fue tu mejor día.<div class="alrt" style="margin:10px 0 0">⚠ Ojo: 3 precuentas bajaron <b>&nbsp;$1,240&nbsp;</b> el viernes en la tarde.</div><div class="lg2"><span><i></i>Esta semana</span><span><i class="d"></i>Semana pasada</span></div><svg class="mchart" viewBox="0 0 280 110" preserveAspectRatio="none"><g stroke="#e6eae7"><path d="M0 20H280M0 55H280M0 90H280"/></g><defs><linearGradient id="cga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#10b981" stop-opacity=".28"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></linearGradient></defs><path class="ar3" d="M2 78 C30 74 40 66 42 64 S70 70 82 62 S110 50 122 52 S150 44 162 40 S190 30 202 28 S230 20 240 18 V96 H2Z" fill="url(#cga)"/><path class="ln2" d="M2 82 C30 80 40 74 42 72 S70 76 82 70 S110 62 122 64 S150 58 162 54 S190 48 202 46 S230 42 240 40" fill="none" stroke="#a1a1aa" stroke-width="1.6" stroke-dasharray="4 5"/><path class="ln" d="M2 78 C30 74 40 66 42 64 S70 70 82 62 S110 50 122 52 S150 44 162 40 S190 30 202 28 S230 20 240 18" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round"/><circle class="fri2" cx="162" cy="40" r="4" fill="none" stroke="#ef4444" stroke-width="1.5"/><circle class="fri" cx="162" cy="40" r="4" fill="#ef4444"/><circle class="ring" cx="240" cy="18" r="4.5" fill="none" stroke="#10b981" stroke-width="1.5"/><circle cx="240" cy="18" r="4.5" fill="#10b981" class="pt"/><text x="2" y="106" class="axis">Lun</text><text x="42" y="106" class="axis">Mar</text><text x="82" y="106" class="axis">Mié</text><text x="122" y="106" class="axis">Jue</text><text x="162" y="106" class="axis">Vie</text><text x="202" y="106" class="axis">Sáb</text><text x="242" y="106" class="axis">Dom</text></svg>'],
      ['me','¿Qué hago?'],
      ['ai','Esto haría hoy:<ul class="todo2"><li><i>1</i>Revisar con caja las mesas 12, 9 y 4<em>$1,240</em></li><li><i>2</i>Subir 10% el Rib eye<em>+$2,800/mes</em></li></ul><div class="qr"><span>Avisar al gerente</span><span>Ver detalle</span></div>']
    ], ci = 0, busy = false;
    var bubble = function(m, html){ if (m[0] === 'me') { var e = document.createElement('div'); e.className = 'am me'; e.textContent = m[1]; return [e, e] }
      var row = document.createElement('div'); row.className = 'arow'; row.innerHTML = '<img class="mav" src="/site/img/logo-f.jpg" alt=""><div class="am ai"></div>'; var b = row.lastChild; b.innerHTML = html; return [row, b] };
    var stepC = function(){ if (busy) return; if (ci >= CV.length) { busy = true; setTimeout(function(){ acb.innerHTML = ''; ci = 0; busy = false; stepC() }, 9000); return }
      var m = CV[ci++];
      if (m[0] === 'ai') { busy = true; var x = bubble(m, '<span class="dots"><i></i><i></i><i></i></span>'); acb.appendChild(x[0]); trim(); setTimeout(function(){ x[1].innerHTML = m[1]; setTimeout(function(){ busy = false }, 5000) }, 2400) }
      else { acb.appendChild(bubble(m)[0]); trim() } };
    var trim = function(){ while (acb.children.length > 4) acb.removeChild(acb.firstChild) };
    if (reduce) CV.forEach(function(m){ acb.appendChild(bubble(m, m[1])[0]) });
    else { acb.appendChild(bubble(CV[0])[0]); acb.appendChild(bubble(CV[1], CV[1][1])[0]); ci = 2; setInterval(function(){ var r = acb.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) stepC() }, 2200) }
  }

  // ── Preguntas que se escriben solas (banda de IA)
  var rq = $('#rq');
  if (rq && !reduce) {
    var RQ = EN ? ['Where is my money going?','Why was Tuesday down?','Which server sells the most?','Which dish should I reprice?','What will I sell on Saturday?','Did my Z report add up?'] : ['¿Dónde se me va el dinero?','¿Por qué bajé el martes?','¿Qué mesero vende más?','¿Qué platillo conviene subir?','¿Cuánto voy a vender el sábado?','¿Me cuadró el corte Z?'];
    var qi = 0, ch = RQ[0].length, del = false;
    setInterval(function(){ var q = RQ[qi]; if (!del) { if (ch < q.length) ch++; else { del = 'wait'; setTimeout(function(){ del = true }, 1800); } } else if (del === true) { if (ch > 0) ch--; else { del = false; qi = (qi + 1) % RQ.length } } rq.textContent = RQ[qi].slice(0, ch) }, 55);
  }

  // ── Menú hamburguesa
  var burger = $('#burger'), mnav = $('#mnav');
  if (burger && mnav) {
    var setMenu = function(open){ burger.setAttribute('aria-expanded', open); mnav.hidden = !open; document.body.classList.toggle('menu-open', open) };
    burger.addEventListener('click', function(){ setMenu(mnav.hidden) });
    $$('a', mnav).forEach(function(a){ a.addEventListener('click', function(){ setMenu(false) }) });
    addEventListener('keydown', function(e){ if (e.key === 'Escape') setMenu(false) });
  }

  // ── Calculadora "Haz la cuenta" (ilustrativa)
  var cr = $('#cr');
  if (cr) {
    var pct = 2, fmt = function(n){ return '$' + Math.round(n).toLocaleString('es-MX') };
    var calc = function(){ var v = +cr.value; $('#cv').textContent = fmt(v); $('#cp').textContent = pct + '%'; $('#cm').textContent = fmt(v * pct / 100); $('#ca').textContent = fmt(v * pct / 100 * 12) };
    cr.addEventListener('input', calc);
    $$('.pcts button').forEach(function(btn){ btn.addEventListener('click', function(){ pct = +btn.dataset.p; $$('.pcts button').forEach(function(x){ x.classList.toggle('on', x === btn) }); calc() }) });
    calc();
  }

  // ── Títulos de sección: las palabras suben una tras otra al entrar en pantalla
  var wrs = [];
  if (!reduce) $$('main h2').forEach(function(h){
    if (h.closest('.hero') || h.closest('.aichat')) return;
    var i = 0, mk = function(){ var o = document.createElement('span'), n = document.createElement('span'); o.className = 'w2'; n.style.setProperty('--i', i++); o.appendChild(n); return [o, n] };
    var wrap = function(node){ Array.prototype.slice.call(node.childNodes).forEach(function(c){
      if (c.nodeType === 3) { var fr = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(function(w){ if (!w) return; if (/^\s+$/.test(w)) { fr.appendChild(document.createTextNode(w)); return } var x = mk(); x[1].textContent = w; fr.appendChild(x[0]) });
        node.replaceChild(fr, c) }
      else if (c.nodeType === 1) { var cs = getComputedStyle(c); if (/text/.test(cs.webkitBackgroundClip || cs.backgroundClip || '')) { var x = mk(); node.replaceChild(x[0], c); x[1].appendChild(c) } else wrap(c) } }) };
    wrap(h); h.classList.add('wr'); wrs.push(h) });
  var wrCheck = function(){ wrs = wrs.filter(function(h){ if (h.getBoundingClientRect().top < innerHeight * .88) { h.classList.add('in'); return false } return true }) };
  addEventListener('scroll', wrCheck, {passive:true}); wrCheck(); setTimeout(function(){ wrs.forEach(function(h){ h.classList.add('in') }) }, 20000);

  // ── Botones magnéticos: siguen un poco al cursor (solo con mouse)
  if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) $$('.btn-g, .btn-dark, .hero .btn').forEach(function(b){
    b.classList.add('mag');
    b.addEventListener('mousemove', function(e){ var r = b.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      b.style.transform = 'translate(' + (x * .18).toFixed(1) + 'px,' + (y * .3).toFixed(1) + 'px)'; b.style.setProperty('--mx', (e.clientX - r.left) + 'px'); b.style.setProperty('--my', (e.clientY - r.top) + 'px') });
    b.addEventListener('mouseleave', function(){ b.style.transform = '' });
  });

  // ── Scroll: nav, aparición, contadores, pasos
  var heroDk = $('.hero.dk'), hd = $('#hd'), pend = $$('.rv, .sp3'), cnt = $$('[data-count]');
  if (reduce) pend.forEach(function(el){ el.classList.add('in') });
  function onScroll(){
    var y = scrollY, H = innerHeight;
    var stick = $('#stick'), endS = $('.end2'); if (stick) { var nearEnd = endS && endS.getBoundingClientRect().top < H; stick.classList.toggle('on', y > H * .7 && !nearEnd && !document.body.classList.contains('menu-open')) }
    if (hd) { hd.classList.toggle('sc', y > 10); if (heroDk) hd.classList.toggle('ondk', y < heroDk.offsetHeight - 70) }
    if (!reduce) {
      pend = pend.filter(function(el){ if (el.getBoundingClientRect().top < H * .9) { el.classList.add('in'); return false } return true });
      cnt = cnt.filter(function(el){ if (el.getBoundingClientRect().top > H * .85) return true; var to = +el.dataset.count, pre = el.dataset.pre || '', suf = el.dataset.suf || '', s0 = Date.now();
        var iv = setInterval(function(){ var k = Math.min(1, (Date.now() - s0) / 1600), v = Math.round(to * (1 - Math.pow(1 - k, 4))); el.textContent = pre + v.toLocaleString('es-MX') + suf; if (k >= 1) clearInterval(iv) }, 30); return false });
    }
    if (steps.length) { var best = 0, bd = 1e9; steps.forEach(function(s, i){ var b = s.getBoundingClientRect(), d = Math.abs(b.top + b.height / 2 - H / 2); if (d < bd) { bd = d; best = i } }); setStep(best) }
  }
  addEventListener('scroll', onScroll, {passive:true}); addEventListener('resize', onScroll); onScroll();
  if (!reduce) setTimeout(function(){ pend.forEach(function(el){ el.classList.add('in') }) }, 20000);
})();
