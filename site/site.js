/* Fullsite · scripts compartidos por todas las páginas. Cada bloque revisa que su sección exista. */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LIVE = ((document.currentScript && document.currentScript.src) || 'site.js').replace(/site\.js(\?.*)?$/, 'connect.html');
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

  // ── Pantallas con Fullsite Connect real (la app, no una captura). La imagen queda de fondo mientras carga.
  var lives = $$('[data-live]');
  if (lives.length) {
    try { localStorage.setItem('fs-theme', 'light') } catch (e) {}
    var mount = function(el){
      var w = +el.dataset.lw || 1440, top = +el.dataset.top || 0, f = document.createElement('iframe');
      f.className = 'livef'; f.title = 'Fullsite Connect'; f.tabIndex = -1; f.setAttribute('aria-hidden', 'true'); f.setAttribute('scrolling', 'no');
      var size = function(){ var k = el.clientWidth / w; if (!k) return; f.style.width = w + 'px'; f.style.height = Math.ceil((el.clientHeight - top) / k) + 'px'; f.style.top = top + 'px'; f.style.transform = 'scale(' + k + ')' };
      f.onload = function(){ size(); setTimeout(function(){ el.classList.add('live-on') }, 500) };
      f.src = LIVE + '#' + el.dataset.live; el.appendChild(f); size(); addEventListener('resize', size); setTimeout(size, 700);
    };
    var started = false, start = function(){ if (started) return; started = true;
      lives.forEach(function(el, i){ setTimeout(function(){ mount(el) }, i * 1400) }) };
    if (document.readyState === 'complete') setTimeout(start, 300); else addEventListener('load', function(){ setTimeout(start, 300) });
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
    else if (!reduce && !$('.possplit')) setInterval(function(){ var r = term.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) tapOne() }, 1000);
    else order.forEach(function(){ tapOne() });
  }

  // ── Chat de Fullsite IA: conversación visual que se escribe sola cuando está a la vista
  var acb = $('#acb');
  if (acb) {
    var CV = EN ? [
      ["me","How is this week going?"],
      ["ai","<div class=\"srcs\"><span>Sales</span><em>+</em><span>Inventory</span><em>+</em><span>Attendance</span><em>→</em></div><span class=\"xt\">Explanation + actions</span><div class=\"cc\"><div class=\"cch\"><span class=\"lg\"><i></i>This week</span><span class=\"lg g\"><i></i>Last week</span><span class=\"seg\"><b>Chart</b><span>Table</span></span></div><svg class=\"cxc\" viewBox=\"0 0 320 146\"><path d=\"M46 122H310\" stroke=\"#eef1ef\"/><text x=\"40\" y=\"125\" text-anchor=\"end\">$0k</text><path d=\"M46 86H310\" stroke=\"#eef1ef\"/><text x=\"40\" y=\"89\" text-anchor=\"end\">$30k</text><path d=\"M46 50H310\" stroke=\"#eef1ef\"/><text x=\"40\" y=\"53\" text-anchor=\"end\">$60k</text><path d=\"M46 14H310\" stroke=\"#eef1ef\"/><text x=\"40\" y=\"17\" text-anchor=\"end\">$90k</text><path class=\"lw\" d=\"M50 63.2 C57.0 63.8 78.0 67.2 92 66.8 C106.0 66.4 120.0 62.4 134 60.8 C148.0 59.2 162.0 58.4 176 57.2 C190.0 56.0 204.0 58.2 218 53.6 C232.0 49.0 246.0 29.2 260 29.6 C274.0 30.0 295.0 51.6 302 56\" fill=\"none\" stroke=\"#71717a\" stroke-width=\"1.6\"/><path class=\"tw\" d=\"M50 59.6 C57.0 60.4 78.0 65.0 92 64.4 C106.0 63.8 120.0 58.0 134 56 C148.0 54.0 162.0 53.6 176 52.4 C190.0 51.2 204.0 54.0 218 48.8 C232.0 43.6 246.0 19.8 260 21.2 C274.0 22.6 295.0 51.2 302 57.2\" fill=\"none\" stroke=\"#10b981\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><circle class=\"dot r\" cx=\"218\" cy=\"48.8\" r=\"3.6\"/><circle class=\"dot g\" cx=\"260\" cy=\"21.2\" r=\"3.6\"/><text x=\"50\" y=\"140\" text-anchor=\"middle\">Mon</text><text x=\"92\" y=\"140\" text-anchor=\"middle\">Tue</text><text x=\"134\" y=\"140\" text-anchor=\"middle\">Wed</text><text x=\"176\" y=\"140\" text-anchor=\"middle\">Thu</text><text x=\"218\" y=\"140\" text-anchor=\"middle\">Fri</text><text x=\"260\" y=\"140\" text-anchor=\"middle\">Sat</text><text x=\"302\" y=\"140\" text-anchor=\"middle\">Sun</text></svg><div class=\"ccf\"><span>Source: your POS · paid tickets</span><span class=\"ok\">✓ Full coverage</span></div></div><div class=\"cls\"><div class=\"cl\"><span class=\"tg v\">VERIFIED</span><span>You are at <b>$412,380</b> vs. $389,020 last week (+6%).</span></div><div class=\"cl\"><span class=\"tg v\">VERIFIED</span><span>Saturday was your best day: $84,200.</span></div><div class=\"cl\"><span class=\"tg h\">HYPOTHESIS</span><span>On Friday 3 pre-checks dropped $1,240 in the afternoon. Check if they were authorized.</span></div></div>"],
      ["me","What should I do?"],
      ["ai","<div class=\"cls\"><div class=\"cl\"><span class=\"tg p\">FORECAST</span><span>Estimated week close: $468,000.</span></div><div class=\"cl\"><span class=\"tg r\">RECOMMENDATION</span><span>Review tables 12, 9 and 4 with the register ($1,240).</span></div><div class=\"cl\"><span class=\"tg r\">RECOMMENDATION</span><span>Raise the rib eye 10%: +$2,800 a month.</span></div></div><div class=\"cxa\"><span class=\"pri\">Notify manager</span><span>Save investigation</span></div>"]
    ] : [
      ["me","¿Cómo voy esta semana?"],
      ["ai","<div class=\"srcs\"><span>Ventas</span><em>+</em><span>Inventario</span><em>+</em><span>Asistencia</span><em>→</em></div><span class=\"xt\">Explicación + acciones</span><div class=\"cc\"><div class=\"cch\"><span class=\"lg\"><i></i>Esta semana</span><span class=\"lg g\"><i></i>Semana pasada</span><span class=\"seg\"><b>Gráfica</b><span>Tabla</span></span></div><svg class=\"cxc\" viewBox=\"0 0 320 146\"><path d=\"M46 122H310\" stroke=\"#eef1ef\"/><text x=\"40\" y=\"125\" text-anchor=\"end\">$0k</text><path d=\"M46 86H310\" stroke=\"#eef1ef\"/><text x=\"40\" y=\"89\" text-anchor=\"end\">$30k</text><path d=\"M46 50H310\" stroke=\"#eef1ef\"/><text x=\"40\" y=\"53\" text-anchor=\"end\">$60k</text><path d=\"M46 14H310\" stroke=\"#eef1ef\"/><text x=\"40\" y=\"17\" text-anchor=\"end\">$90k</text><path class=\"lw\" d=\"M50 63.2 C57.0 63.8 78.0 67.2 92 66.8 C106.0 66.4 120.0 62.4 134 60.8 C148.0 59.2 162.0 58.4 176 57.2 C190.0 56.0 204.0 58.2 218 53.6 C232.0 49.0 246.0 29.2 260 29.6 C274.0 30.0 295.0 51.6 302 56\" fill=\"none\" stroke=\"#71717a\" stroke-width=\"1.6\"/><path class=\"tw\" d=\"M50 59.6 C57.0 60.4 78.0 65.0 92 64.4 C106.0 63.8 120.0 58.0 134 56 C148.0 54.0 162.0 53.6 176 52.4 C190.0 51.2 204.0 54.0 218 48.8 C232.0 43.6 246.0 19.8 260 21.2 C274.0 22.6 295.0 51.2 302 57.2\" fill=\"none\" stroke=\"#10b981\" stroke-width=\"2.4\" stroke-linecap=\"round\"/><circle class=\"dot r\" cx=\"218\" cy=\"48.8\" r=\"3.6\"/><circle class=\"dot g\" cx=\"260\" cy=\"21.2\" r=\"3.6\"/><text x=\"50\" y=\"140\" text-anchor=\"middle\">Lun</text><text x=\"92\" y=\"140\" text-anchor=\"middle\">Mar</text><text x=\"134\" y=\"140\" text-anchor=\"middle\">Mié</text><text x=\"176\" y=\"140\" text-anchor=\"middle\">Jue</text><text x=\"218\" y=\"140\" text-anchor=\"middle\">Vie</text><text x=\"260\" y=\"140\" text-anchor=\"middle\">Sáb</text><text x=\"302\" y=\"140\" text-anchor=\"middle\">Dom</text></svg><div class=\"ccf\"><span>Fuente: tu POS · tickets cobrados</span><span class=\"ok\">✓ Cobertura completa</span></div></div><div class=\"cls\"><div class=\"cl\"><span class=\"tg v\">VERIFICADO</span><span>Llevas <b>$412,380</b> contra $389,020 la semana pasada (+6%).</span></div><div class=\"cl\"><span class=\"tg v\">VERIFICADO</span><span>El sábado fue tu mejor día: $84,200.</span></div><div class=\"cl\"><span class=\"tg h\">HIPÓTESIS</span><span>El viernes 3 precuentas bajaron $1,240 en la tarde. Revisa si fueron autorizadas.</span></div></div>"],
      ["me","¿Qué hago?"],
      ["ai","<div class=\"cls\"><div class=\"cl\"><span class=\"tg p\">PRONÓSTICO</span><span>Cierre de semana estimado: $468,000.</span></div><div class=\"cl\"><span class=\"tg r\">RECOMENDACIÓN</span><span>Revisa con caja las mesas 12, 9 y 4 ($1,240).</span></div><div class=\"cl\"><span class=\"tg r\">RECOMENDACIÓN</span><span>Sube 10% el Rib eye: +$2,800 al mes.</span></div></div><div class=\"cxa\"><span class=\"pri\">Avisar al gerente</span><span>Guardar investigación</span></div>"]
    ], ci = 0, busy = false;
    var bubble = function(m, html){ if (m[0] === 'me') { var e = document.createElement('div'); e.className = 'am me'; e.textContent = m[1]; return [e, e] }
      var row = document.createElement('div'); row.className = 'arow'; row.innerHTML = '<img class="mav" src="/site/img/logo-f.jpg" alt=""><div class="am ai"></div>'; var b = row.lastChild; fillC(b, html); return [row, b] };
    var fillC = function(b, html){ b.innerHTML = html; b.classList.toggle('rich', /class="(srcs|cls)"/.test(html)); if (b.parentNode) b.parentNode.classList.toggle('rich', b.classList.contains('rich'));
      $$('[data-to]', b).forEach(function(n){ var to = +n.dataset.to, s0 = Date.now(); var iv = setInterval(function(){ var k = Math.min(1, (Date.now() - s0) / 1400), v = Math.round(to * (1 - Math.pow(1 - k, 3))); n.textContent = '$' + v.toLocaleString('es-MX'); if (k >= 1) clearInterval(iv) }, 30) }) };
    var stepC = function(){ if (busy) return; if (ci >= CV.length) { busy = true; setTimeout(function(){ acb.innerHTML = ''; acb.appendChild(bubble(CV[0])[0]); acb.appendChild(bubble(CV[1], CV[1][1])[0]); ci = 2; busy = false }, 9000); return }
      var m = CV[ci++];
      if (m[0] === 'ai') { busy = true; var x = bubble(m, '<span class="dots"><i></i><i></i><i></i></span>'); acb.appendChild(x[0]); trim(); setTimeout(function(){ fillC(x[1], m[1]); setTimeout(function(){ busy = false }, 5000) }, 2400) }
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
