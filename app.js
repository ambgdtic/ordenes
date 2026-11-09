/**
 * Módulo: Núcleo de la interfaz (sesión, API, enrutador, componentes).
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.0-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */
'use strict';

/* ---------- Formatos venezolanos ---------- */
const fmt = {
  num(n, dec = 2) {
    const v = Number(n);
    if (n === null || n === undefined || n === '' || !isFinite(v)) return '';
    const [ent, frac] = Math.abs(v).toFixed(dec).split('.');
    return (v < 0 ? '-' : '') + ent.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (frac ? ',' + frac : '');
  },
  bs(n) { const t = fmt.num(n); return t ? `${t} Bs.` : '—'; },
  usd(n) { const t = fmt.num(n); return t ? `$ ${t}` : '—'; },
  fecha(iso) { const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}/${m[2]}/${m[1]}` : ''; },
  fechaHora(iso) { const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/); return m ? `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}` : ''; },
  doc(tipo, doc) { const d = String(doc || '').replace(/\D/g, '').replace(/^0+/, ''); return d ? `${tipo || ''}-${d.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}` : ''; },
  cuenta(c) { const d = String(c || '').replace(/\D/g, ''); return d.length === 20 ? d.replace(/(\d{4})(?=\d)/g, '$1-') : String(c || ''); },
  /** Interpreta "1.234,56", "1234.56" o "1,234.56". */
  aNumero(v) {
    if (v === null || v === undefined || v === '') return null;
    if (typeof v === 'number') return v;
    let s = String(v).replace(/bs\.?|\$|\s/gi, '');
    const c = s.lastIndexOf(','); const p = s.lastIndexOf('.');
    if (c > -1 && p > -1) s = c > p ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
    else if (c > -1) s = s.split(',').length > 2 ? s.replace(/,/g, '') : s.replace(',', '.');
    else if (p > -1) { const g = s.split('.'); if (g.length > 2 || g[g.length - 1].length === 3) s = g.join(''); }
    const n = Number(s);
    return isFinite(n) ? n : null;
  },
  hoy() { const d = new Date(); const p = (x) => String(x).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; }
};
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function esc(s) {
  return String(s === null || s === undefined ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
// Respaldo si el CDN de iconos no carga: los botones nunca quedan vacíos.
const ICONOS_RESPALDO = {
  pencil: '✎', 'pencil-line': '✎', printer: '⎙', ban: '⊘', eye: '👁', 'file-signature': '✍', 'clipboard-list': '☰', 'rotate-ccw': '↺',
  x: '✕', plus: '+', save: '✓', 'file-check': '✓', 'refresh-cw': '⟳', 'chevron-left': '‹', 'chevron-right': '›', menu: '☰',
  'sun-moon': '◐', 'log-out': '⏻', 'trash-2': '🗑', 'user-plus': '+', 'file-up': '⇪', 'cloud-upload': '⇪', 'file-text': '📄', check: '✓', 'cloud-download': '⇩', history: '⟲'
};
function ico(nombre, clases = '') { return `<i data-lucide="${nombre}" data-alt="${ICONOS_RESPALDO[nombre] || ''}" class="${clases}" aria-hidden="true"></i>`; }
function $(sel, raiz = document) { return raiz.querySelector(sel); }
function $$(sel, raiz = document) { return Array.from(raiz.querySelectorAll(sel)); }
function demorar(fn, ms = 350) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
function idUnico() { return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(16).slice(2); }

/* ---------- Componentes de interfaz ---------- */
const ui = {
  iconos() { if (window.lucide && lucide.createIcons) lucide.createIcons(); },

  toast(mensaje, tipo = 'info', ms = 4500) {
    const t = document.createElement('div');
    t.className = `toast ${tipo}`;
    t.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
    t.textContent = mensaje;
    $('#toasts').appendChild(t);
    setTimeout(() => t.remove(), tipo === 'error' ? Math.max(ms, 8000) : ms);
  },

  modal({ titulo, cuerpo, pie = '', tamano = '', alCerrar }) {
    const fondo = document.createElement('div');
    fondo.className = 'fondo-modal';
    fondo.innerHTML = `<div class="modal ${tamano}" role="dialog" aria-modal="true" aria-labelledby="mt-${Date.now()}">
      <div class="modal-cab"><h2 id="mt-${Date.now()}">${titulo}</h2>
      <button class="btn btn-ico" data-cerrar aria-label="Cerrar">${ico('x')}</button></div>
      <div class="modal-cuerpo">${cuerpo}</div>${pie ? `<div class="modal-pie">${pie}</div>` : ''}</div>`;
    const previo = document.activeElement;
    document.body.appendChild(fondo);
    document.body.style.overflow = 'hidden';
    const cerrar = () => {
      fondo.remove();
      if (!$('.fondo-modal')) document.body.style.overflow = '';
      if (previo && previo.focus) previo.focus();
      if (alCerrar) alCerrar();
    };
    fondo.addEventListener('mousedown', (e) => { if (e.target === fondo) fondo.dataset.fuera = '1'; });
    fondo.addEventListener('mouseup', (e) => { if (e.target === fondo && fondo.dataset.fuera === '1') cerrar(); fondo.dataset.fuera = ''; });
    fondo.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); cerrar(); } });
    $$('[data-cerrar]', fondo).forEach((b) => b.addEventListener('click', cerrar));
    ui.iconos();
    const foco = $('input:not([type=hidden]):not([readonly]), select, textarea, button.btn-prim', fondo) || $('[data-cerrar]', fondo);
    setTimeout(() => foco && foco.focus(), 30);
    return { el: fondo, cerrar };
  },

  confirmar({ titulo, mensaje, textoBoton = 'Confirmar', peligro = false, pedirMotivo = false }) {
    return new Promise((resolver) => {
      let respondido = false;
      const m = ui.modal({
        titulo: esc(titulo),
        cuerpo: `<p>${mensaje}</p>${pedirMotivo ? `<div class="mt-3"><label class="etiqueta" for="motivo-conf">Motivo (obligatorio)</label>
          <textarea id="motivo-conf" class="campo" maxlength="500" required></textarea><p class="ayuda">Quedará registrado en la auditoría.</p></div>` : ''}`,
        pie: `<button class="btn" data-cerrar>Cancelar</button><button class="btn ${peligro ? 'btn-peligro' : 'btn-prim'}" id="btn-conf">${esc(textoBoton)}</button>`,
        alCerrar: () => { if (!respondido) resolver(null); }
      });
      $('#btn-conf', m.el).addEventListener('click', () => {
        const motivo = pedirMotivo ? $('#motivo-conf', m.el).value.trim() : true;
        if (pedirMotivo && motivo.length < 5) { $('#motivo-conf', m.el).classList.add('error'); $('#motivo-conf', m.el).focus(); return; }
        respondido = true;
        m.cerrar();
        resolver(motivo);
      });
    });
  },

  /** Muestra un documento imprimible (HTML del servidor) con acciones. */
  documento({ titulo, html, pdfUrl, generarPdf, aviso }) {
    const m = ui.modal({
      titulo: esc(titulo), tamano: 'grande',
      cuerpo: `${aviso ? `<div class="alerta alerta-aviso mb-3">${aviso}</div>` : ''}<iframe class="visor" title="${esc(titulo)}"></iframe>`,
      pie: `<span class="suave mr-auto text-xs">Tamaño carta. En la ventana de impresión elija márgenes "Predeterminados" y active "Gráficos de fondo".</span>
        ${pdfUrl ? `<a class="btn" href="${esc(pdfUrl)}" target="_blank" rel="noopener" id="lnk-pdf">${ico('file-text')} Abrir PDF en Drive</a>` : ''}
        ${generarPdf ? `<button class="btn" id="btn-gen-pdf">${ico('cloud-upload')} ${pdfUrl ? 'Regenerar' : 'Generar'} PDF en Drive</button>` : ''}
        <button class="btn btn-prim" id="btn-imprimir">${ico('printer')} Imprimir</button>`
    });
    const marco = $('iframe', m.el);
    marco.srcdoc = html;
    $('#btn-imprimir', m.el).addEventListener('click', () => { marco.contentWindow.focus(); marco.contentWindow.print(); });
    const btnPdf = $('#btn-gen-pdf', m.el);
    if (btnPdf) {
      btnPdf.addEventListener('click', async () => {
        ui.ocupado(btnPdf, true);
        try {
          const r = await generarPdf();
          ui.toast('PDF guardado en Google Drive.', 'exito');
          window.open(r.pdf_url, '_blank', 'noopener');
          m.cerrar();
        } catch (e) { ui.error(e); } finally { ui.ocupado(btnPdf, false); }
      });
    }
    return m;
  },

  ocupado(boton, si) { if (!boton) return; boton.disabled = si; boton.classList.toggle('cargando', si); },
  error(e) { console.error(e); ui.toast(e && e.message ? e.message : String(e), 'error'); },

  paginacion(total, pagina, porPagina, alCambiar) {
    const paginas = Math.max(1, Math.ceil(total / porPagina));
    const cont = document.createElement('div');
    cont.className = 'flex items-center justify-between gap-2 px-3 py-2 text-sm';
    cont.innerHTML = `<span class="suave">${fmt.num(total, 0)} registro(s) · página ${pagina} de ${paginas}</span>
      <div class="flex gap-1"><button class="btn btn-chico" data-p="${pagina - 1}" ${pagina <= 1 ? 'disabled' : ''} aria-label="Página anterior">${ico('chevron-left')}</button>
      <button class="btn btn-chico" data-p="${pagina + 1}" ${pagina >= paginas ? 'disabled' : ''} aria-label="Página siguiente">${ico('chevron-right')}</button></div>`;
    $$('[data-p]', cont).forEach((b) => b.addEventListener('click', () => alCambiar(Number(b.dataset.p))));
    return cont;
  },

  opciones(lista, seleccion, vacio) {
    return (vacio !== undefined ? `<option value="">${esc(vacio)}</option>` : '') +
      lista.map((o) => {
        const v = typeof o === 'object' ? o.valor : o;
        const t = typeof o === 'object' ? o.texto : o;
        return `<option value="${esc(v)}" ${String(v) === String(seleccion) ? 'selected' : ''}>${esc(t)}</option>`;
      }).join('');
  },

  pillCategoria(nombre) {
    if (!nombre) return '<span class="pill pill-neutro">Sin categoría</span>';
    const cat = (App.estado.catalogos.categorias || []).find((c) => c.nombre === nombre);
    return `<span class="pill pill-cat" style="background:${esc(cat ? cat.color : '#e2e8f0')}">${esc(nombre)}</span>`;
  },

  selectorPeriodo(anio, mes, conTodos = true) {
    const actual = new Date().getFullYear();
    const anios = [];
    for (let a = actual + 1; a >= 2024; a--) anios.push(a);
    return `<label class="sr-only" for="f-anio">Año</label><select id="f-anio" class="campo" style="width:auto">${ui.opciones(anios, anio, conTodos ? 'Todos los años' : undefined)}</select>
      <label class="sr-only" for="f-mes">Mes</label><select id="f-mes" class="campo" style="width:auto">${ui.opciones(MESES.map((m, i) => ({ valor: i + 1, texto: m })), mes, conTodos ? 'Todos los meses' : undefined)}</select>`;
  },

  /** Campo de beneficiario con búsqueda en el registro. alElegir recibe el beneficiario. */
  autocompletarBeneficiario(input, alElegir) {
    const cont = input.parentElement;
    cont.style.position = 'relative';
    let lista = null;
    const cerrar = () => { if (lista) { lista.remove(); lista = null; } };
    const buscar = demorar(async () => {
      const texto = input.value.trim();
      if (texto.length < 3) { cerrar(); return; }
      try {
        const r = await api('beneficiarios.buscar', { texto });
        cerrar();
        if (!r.length) return;
        lista = document.createElement('div');
        lista.className = 'autocompletar';
        lista.setAttribute('role', 'listbox');
        lista.innerHTML = r.map((b, i) => `<button type="button" role="option" data-i="${i}"><strong>${esc(b.nombre)}</strong>
          <span class="suave text-xs"> ${esc(fmt.doc(b.tipo_doc, b.documento))} · ${esc(b.cuenta || 'sin cuenta')}</span></button>`).join('');
        cont.appendChild(lista);
        $$('button', lista).forEach((b) => b.addEventListener('click', () => { alElegir(r[Number(b.dataset.i)]); cerrar(); }));
      } catch (e) { cerrar(); }
    }, 300);
    input.setAttribute('autocomplete', 'off');
    input.addEventListener('input', buscar);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && lista) { e.preventDefault(); const b = $('button', lista); if (b) b.focus(); }
      if (e.key === 'Escape') cerrar();
    });
    document.addEventListener('click', (e) => { if (!cont.contains(e.target)) cerrar(); });
  },

  validarCuenta(input, ayuda) {
    const revisar = () => {
      const d = input.value.replace(/\D/g, '');
      const bancos = App.estado.catalogos.bancos || {};
      if (!d) { ayuda.textContent = '20 dígitos. El banco se detecta solo.'; ayuda.classList.remove('error'); input.classList.remove('error'); return true; }
      if (d.length !== 20) { ayuda.textContent = `Tiene ${d.length} dígitos; deben ser 20.`; ayuda.classList.add('error'); input.classList.add('error'); return false; }
      ayuda.textContent = bancos[d.slice(0, 4)] || 'Banco no registrado en el catálogo';
      ayuda.classList.remove('error'); input.classList.remove('error');
      return true;
    };
    input.addEventListener('input', revisar);
    input.addEventListener('blur', () => { const d = input.value.replace(/\D/g, ''); if (d.length === 20) input.value = fmt.cuenta(d); });
    revisar();
    return revisar;
  }
};

/* ---------- Borradores locales (por si se va la luz o el internet) ---------- */
const borrador = {
  guardar(clave, datos) { try { localStorage.setItem('borrador:' + clave, JSON.stringify({ cuando: Date.now(), datos })); } catch (e) { /* almacenamiento lleno o bloqueado */ } },
  leer(clave) { try { const v = JSON.parse(localStorage.getItem('borrador:' + clave)); return v && Date.now() - v.cuando < 7 * 864e5 ? v.datos : null; } catch (e) { return null; } },
  borrar(clave) { try { localStorage.removeItem('borrador:' + clave); } catch (e) { /* sin acceso */ } }
};

/* ---------- Cliente de la API ---------- */
class ErrorApi extends Error {
  constructor(mensaje, codigo, detalle) { super(mensaje); this.codigo = codigo; this.detalle = detalle; }
}

async function api(accion, datos = {}, opciones = {}) {
  const idSolicitud = opciones.escritura ? idUnico() : undefined;
  const intentos = opciones.escritura ? 4 : 3;
  let ultimoError;
  for (let i = 0; i < intentos; i++) {
    if (!navigator.onLine) await esperarConexion();
    try {
      const r = await fetch(window.CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ accion, datos, token: Sesion.token(), id_solicitud: idSolicitud }),
        redirect: 'follow'
      });
      const texto = await r.text();
      let cuerpo;
      try { cuerpo = JSON.parse(texto); } catch (e) { throw new ErrorApi('El servidor respondió algo inesperado. Intente de nuevo.', 'RESPUESTA'); }
      avisoRed(false);
      if (cuerpo.ok) return cuerpo.datos;
      if (['TOKEN_INVALIDO', 'SIN_SESION'].includes(cuerpo.codigo)) {
        await Sesion.renovar();
        continue;
      }
      throw new ErrorApi(cuerpo.error, cuerpo.codigo, cuerpo.detalle);
    } catch (e) {
      if (e instanceof ErrorApi) throw e;
      ultimoError = e;
      avisoRed(true, 'Problema de conexión. Reintentando…');
      await new Promise((ok) => setTimeout(ok, [1500, 3500, 7000, 12000][i]));
    }
  }
  avisoRed(true, 'Sin conexión con el servidor. Sus datos siguen en pantalla; intente de nuevo.');
  throw new ErrorApi('No se pudo conectar con el servidor. Revise el internet e intente de nuevo.', 'RED', ultimoError && ultimoError.message);
}

function avisoRed(mostrar, texto) {
  const a = $('#aviso-red');
  if (!a) return;
  a.hidden = !mostrar;
  if (texto) a.textContent = texto;
}
function esperarConexion() {
  avisoRed(true, 'Sin internet. Esperando conexión…');
  return new Promise((ok) => window.addEventListener('online', function f() { window.removeEventListener('online', f); avisoRed(false); ok(); }));
}
window.addEventListener('offline', () => avisoRed(true, 'Sin internet. Lo que esté escribiendo se conserva en este equipo.'));
window.addEventListener('online', () => avisoRed(false));

/* ---------- Sesión con Google Identity Services ---------- */
const Sesion = (() => {
  let credencial = null;
  let esperando = null;

  function vence(token) {
    try { return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp * 1000; } catch (e) { return 0; }
  }
  function token() {
    if (window.CONFIG.TOKEN_PRUEBA) return window.CONFIG.TOKEN_PRUEBA;
    return credencial;
  }
  function guardar(t) {
    credencial = t;
    try { sessionStorage.setItem('gtoken', t); } catch (e) { /* sin almacenamiento */ }
  }
  function cargarGuardado() {
    try {
      const t = sessionStorage.getItem('gtoken');
      if (t && vence(t) - Date.now() > 120000) { credencial = t; return true; }
    } catch (e) { /* sin almacenamiento */ }
    return false;
  }
  function esperarGis() {
    return new Promise((ok, falla) => {
      let n = 0;
      const t = setInterval(() => {
        if (window.google && google.accounts && google.accounts.id) { clearInterval(t); ok(); }
        if (++n > 100) { clearInterval(t); falla(new Error('No se pudo cargar el inicio de sesión de Google. Revise el internet.')); }
      }, 100);
    });
  }
  async function iniciarGis(alObtener) {
    await esperarGis();
    google.accounts.id.initialize({
      client_id: window.CONFIG.GOOGLE_CLIENT_ID,
      callback: (r) => { guardar(r.credential); alObtener(r.credential); },
      auto_select: true,
      cancel_on_tap_outside: false,
      use_fedcm_for_prompt: true
    });
  }
  /** Pide una credencial nueva cuando la actual vence (sin perder lo que hay en pantalla). */
  function renovar() {
    if (window.CONFIG.TOKEN_PRUEBA) return Promise.reject(new ErrorApi('Token de prueba inválido.', 'SIN_SESION'));
    if (esperando) return esperando;
    try { sessionStorage.removeItem('gtoken'); } catch (e) { /* sin almacenamiento */ }
    esperando = new Promise((ok) => {
      const m = ui.modal({
        titulo: 'Su sesión venció',
        cuerpo: '<p class="mb-3">Por seguridad, confirme su cuenta para continuar. No se pierde lo que estaba haciendo.</p><div id="gis-renovar" class="flex justify-center"></div>'
      });
      iniciarGis(() => { m.cerrar(); esperando = null; ok(); }).then(() => {
        google.accounts.id.renderButton($('#gis-renovar', m.el), { theme: 'outline', size: 'large', text: 'continue_with', locale: 'es' });
        google.accounts.id.prompt();
      }).catch(ui.error);
    });
    return esperando;
  }
  function salir() {
    credencial = null;
    try { sessionStorage.removeItem('gtoken'); } catch (e) { /* sin almacenamiento */ }
    if (window.google && google.accounts && google.accounts.id) google.accounts.id.disableAutoSelect();
    location.hash = '';
    location.reload();
  }
  return { token, iniciarGis, cargarGuardado, renovar, salir };
})();

/* ---------- Aplicación ---------- */
const App = (() => {
  const estado = { usuario: null, catalogos: {}, sistema: {}, tasaHoy: null };
  const modulos = [];
  let graficos = [];

  function registrar(modulo) { modulos.push(modulo); }
  function puede(permiso) {
    const p = (estado.usuario && estado.usuario.permisos) || [];
    return p.includes('*') || p.includes(permiso);
  }

  async function iniciar() {
    if (!window.CONFIG || !window.CONFIG.API_URL || window.CONFIG.API_URL.includes('REEMPLAZAR')) {
      $('#app').innerHTML = `<div class="max-w-lg mx-auto mt-20 tarjeta p-6"><h1 class="titulo-pagina mb-2">Falta configurar</h1>
        <p>Edite <code>config.js</code> con la URL de la API (Apps Script) y el ID de cliente de Google.</p></div>`;
      return;
    }
    if (window.CONFIG.TOKEN_PRUEBA || Sesion.cargarGuardado()) return entrar();
    pantallaLogin();
  }

  function pantallaLogin(mensaje) {
    $('#app').innerHTML = `<main class="min-h-screen flex items-center justify-center p-4">
      <div class="tarjeta w-full max-w-sm p-7 text-center">
        <img src="assets/logo.jpg" alt="Alcaldía del Municipio Guanipa" class="h-20 mx-auto mb-4 rounded">
        <h1 class="text-lg font-semibold">Órdenes de Pago, Compra y Servicio</h1>
        <p class="suave text-sm mb-5">Alcaldía del Municipio Guanipa</p>
        ${mensaje ? `<div class="alerta alerta-peligro text-left mb-4">${esc(mensaje)}</div>` : ''}
        <div id="gis-boton" class="flex justify-center min-h-[44px]"></div>
        <p class="suave text-xs mt-5">Acceso solo para cuentas institucionales autorizadas por la Dirección de TI.</p>
      </div></main>`;
    Sesion.iniciarGis(() => entrar()).then(() => {
      google.accounts.id.renderButton($('#gis-boton'), { theme: document.documentElement.classList.contains('dark') ? 'filled_black' : 'outline', size: 'large', text: 'signin_with', shape: 'rectangular', locale: 'es', width: 260 });
      google.accounts.id.prompt();
    }).catch((e) => { $('#gis-boton').innerHTML = `<p class="alerta alerta-peligro">${esc(e.message)}</p>`; });
  }

  async function entrar() {
    $('#app').innerHTML = '<div class="flex items-center justify-center min-h-screen suave">Verificando acceso…</div>';
    try {
      const s = await api('sesion.iniciar');
      estado.usuario = s.usuario;
      estado.catalogos = s.catalogos;
      estado.sistema = s.sistema;
      estado.tasaHoy = s.tasa_hoy;
      armarEstructura();
      window.addEventListener('hashchange', navegar);
      navegar();
    } catch (e) {
      try { sessionStorage.removeItem('gtoken'); } catch (x) { /* sin almacenamiento */ }
      if (window.CONFIG.TOKEN_PRUEBA) { $('#app').innerHTML = `<p class="p-6">${esc(e.message)}</p>`; return; }
      pantallaLogin(e.message);
    }
  }

  function modulosVisibles() { return modulos.filter((m) => !m.permiso || puede(m.permiso)); }

  function armarEstructura() {
    const u = estado.usuario;
    const tasa = estado.tasaHoy;
    $('#app').innerHTML = `
      <div class="flex min-h-screen">
        <aside id="lateral" class="lateral w-60 shrink-0 fixed inset-y-0 left-0 z-30 -translate-x-full md:translate-x-0 md:static transition-transform flex flex-col" aria-label="Menú principal">
          <div class="flex items-center gap-3 px-4 py-4 separador" style="border-top:0;border-bottom:1px solid var(--borde)">
            <img src="assets/logo.jpg" alt="" class="h-9 w-auto rounded">
            <div class="leading-tight"><div class="font-semibold text-sm">Alcaldía de Guanipa</div><div class="suave text-xs">Órdenes · ${esc(estado.sistema.version || '')}</div></div>
          </div>
          <nav class="flex-1 p-3 flex flex-col gap-1">
            ${modulosVisibles().map((m) => `<a href="#/${m.id}" class="nav" data-mod="${m.id}">${ico(m.icono)}<span>${esc(m.titulo)}</span></a>`).join('')}
          </nav>
          <div class="p-4 marca-pie">© 2026 Soluciones AFFINITY</div>
        </aside>
        <div id="velo" class="fixed inset-0 bg-black/40 z-20 hidden md:hidden"></div>
        <div class="flex-1 min-w-0 flex flex-col">
          <header class="barra sticky top-0 z-10 flex items-center gap-2 px-3 md:px-5 h-14 no-imprimir">
            <button id="btn-menu" class="btn btn-ico md:hidden" aria-label="Abrir menú">${ico('menu')}</button>
            <div id="titulo-barra" class="font-semibold truncate"></div>
            <div class="ml-auto flex items-center gap-2">
              <span class="pill pill-info hidden sm:inline-flex" title="Tasa oficial BCV">${ico('dollar-sign', 'w-3 h-3')} BCV ${tasa ? fmt.num(tasa.tasa, 2) + ' Bs.' : 'sin tasa'}</span>
              <button id="btn-tema" class="btn btn-ico" aria-label="Cambiar tema claro/oscuro">${ico('sun-moon')}</button>
              <div class="hidden sm:block text-right leading-tight"><div class="text-sm font-semibold">${esc(u.nombre)}</div><div class="suave text-xs">${esc(u.rol_nombre)}</div></div>
              <button id="btn-salir" class="btn btn-ico" aria-label="Cerrar sesión" title="Cerrar sesión">${ico('log-out')}</button>
            </div>
          </header>
          <main id="contenido" class="flex-1 p-3 md:p-6" tabindex="-1"></main>
        </div>
      </div>`;
    const lateral = $('#lateral');
    const velo = $('#velo');
    const alternarMenu = (abrir) => { lateral.classList.toggle('-translate-x-full', !abrir); velo.classList.toggle('hidden', !abrir); };
    $('#btn-menu').addEventListener('click', () => alternarMenu(true));
    velo.addEventListener('click', () => alternarMenu(false));
    $$('a.nav', lateral).forEach((a) => a.addEventListener('click', () => alternarMenu(false)));
    $('#btn-tema').addEventListener('click', () => {
      const oscuro = document.documentElement.classList.toggle('dark');
      try { localStorage.setItem('tema', oscuro ? 'oscuro' : 'claro'); } catch (e) { /* sin almacenamiento */ }
      navegar();
    });
    $('#btn-salir').addEventListener('click', Sesion.salir);
    ui.iconos();
  }

  function parametros() {
    const [ruta, consulta] = location.hash.replace(/^#\/?/, '').split('?');
    const p = {};
    new URLSearchParams(consulta || '').forEach((v, k) => { p[k] = v; });
    return { ruta: ruta || '', p };
  }

  function navegar() {
    const { ruta, p } = parametros();
    const visibles = modulosVisibles();
    const modulo = visibles.find((m) => m.id === ruta) || visibles[0];
    if (!modulo) return;
    graficos.forEach((g) => g.destroy());
    graficos = [];
    $$('a.nav').forEach((a) => a.classList.toggle('activo', a.dataset.mod === modulo.id));
    $('#titulo-barra').textContent = modulo.titulo;
    document.title = `${modulo.titulo} · ERP Guanipa`;
    const cont = $('#contenido');
    cont.innerHTML = '<div class="suave p-6">Cargando…</div>';
    Promise.resolve(modulo.render(cont, p)).catch((e) => {
      cont.innerHTML = `<div class="alerta alerta-peligro">${esc(e.message || e)}</div>`;
      console.error(e);
    }).finally(() => ui.iconos());
  }

  function grafico(canvas, config) {
    if (!window.Chart) { canvas.replaceWith(Object.assign(document.createElement('p'), { className: 'suave text-sm', textContent: 'Gráfico no disponible sin conexión a internet.' })); return null; }
    const oscuro = document.documentElement.classList.contains('dark');
    Chart.defaults.color = oscuro ? '#9db0c0' : '#566676';
    Chart.defaults.borderColor = oscuro ? '#283946' : '#e3e8ec';
    Chart.defaults.font.family = 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
    const g = new Chart(canvas, config);
    graficos.push(g);
    return g;
  }

  return { estado, registrar, puede, iniciar, navegar, grafico };
})();
