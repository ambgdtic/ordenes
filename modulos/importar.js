/**
 * Módulo: Importación de conciliaciones bancarias (vista previa, corrección y confirmación).
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes · v1.0.0-beta
 * © 2026 Soluciones AFFINITY.
 */
'use strict';

const Importar = (() => {
  const CLAVE_BORRADOR = 'importacion';
  const MAX_BYTES = 8 * 1024 * 1024;

  async function render(cont) {
    const pendiente = borrador.leer(CLAVE_BORRADOR);
    cont.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 mb-3"><h1 class="titulo-pagina mr-auto">Importar conciliación bancaria</h1>
        <a class="btn" href="#/pagos">${ico('arrow-left')} Volver a pagos</a></div>
      ${pendiente ? `<div class="alerta alerta-info mb-3 flex flex-wrap items-center gap-2">Hay una importación sin terminar (${pendiente.movimientos.length} movimientos).
        <button class="btn btn-chico" id="btn-recuperar">Continuarla</button><button class="btn btn-chico" id="btn-descartar">Descartar</button></div>` : ''}
      <div id="paso1" class="tarjeta p-5">
        <p class="mb-3">Suba el Excel de la conciliación tal como lo entrega el banco (columnas <strong>Fecha</strong>, <strong>Descripción</strong> y <strong>Débito</strong>).
          Cada débito se convierte en un pago con su número de Orden de Pago. Antes de guardar podrá revisar y corregir.</p>
        <div class="pestanas mb-4" role="tablist">
          <button class="pestana" role="tab" aria-selected="true" data-t="archivo">Archivo Excel / CSV</button>
          <button class="pestana" role="tab" aria-selected="false" data-t="texto">Pegar desde Excel</button>
        </div>
        <div data-panel="archivo">
          <label class="zona-archivo block" id="zona" tabindex="0">
            ${ico('file-spreadsheet', 'w-10 h-10 mx-auto mb-2 suave')}
            <span class="block font-semibold">Arrastre el archivo aquí o haga clic para elegirlo</span>
            <span class="suave text-sm">.xlsx, .xls, .ods o .csv · máximo 8 MB · el original se archiva en Drive</span>
            <input type="file" id="archivo" accept=".xlsx,.xls,.ods,.csv,.txt" class="sr-only">
          </label>
        </div>
        <div data-panel="texto" hidden>
          <label class="etiqueta" for="texto-pegado">Copie en Excel las columnas Fecha, Descripción y Débito (con el encabezado) y péguelas aquí</label>
          <textarea id="texto-pegado" class="campo" style="min-height:180px;font-family:ui-monospace,monospace"></textarea>
          <button class="btn btn-prim mt-3" id="btn-analizar-texto">${ico('scan-search')} Analizar</button>
        </div>
      </div>
      <div id="paso2" class="mt-4"></div>
      <div class="tarjeta mt-6"><div class="p-4 pb-2 font-semibold">Importaciones recientes</div><div id="historial" class="tabla-env"><div class="suave p-4">Cargando…</div></div></div>`;

    $$('.pestana', cont).forEach((t) => t.addEventListener('click', () => {
      $$('.pestana', cont).forEach((x) => x.setAttribute('aria-selected', String(x === t)));
      $$('[data-panel]', cont).forEach((p) => { p.hidden = p.dataset.panel !== t.dataset.t; });
    }));
    const zona = $('#zona');
    const input = $('#archivo');
    zona.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
    ['dragenter', 'dragover'].forEach((ev) => zona.addEventListener(ev, (e) => { e.preventDefault(); zona.classList.add('encima'); }));
    ['dragleave', 'drop'].forEach((ev) => zona.addEventListener(ev, (e) => { e.preventDefault(); zona.classList.remove('encima'); }));
    zona.addEventListener('drop', (e) => { if (e.dataTransfer.files[0]) analizarArchivo(e.dataTransfer.files[0]); });
    input.addEventListener('change', () => { if (input.files[0]) analizarArchivo(input.files[0]); });
    $('#btn-analizar-texto').addEventListener('click', async (ev) => {
      const texto = $('#texto-pegado').value.trim();
      if (!texto) { ui.toast('Pegue primero las filas de la conciliación.', 'aviso'); return; }
      const btn = ev.currentTarget;
      ui.ocupado(btn, true);
      try { mostrarVistaPrevia(await api('conciliacion.analizar', { texto })); } catch (e) { ui.error(e); } finally { ui.ocupado(btn, false); }
    });
    if (pendiente) {
      $('#btn-recuperar').addEventListener('click', () => mostrarVistaPrevia(pendiente, true));
      $('#btn-descartar').addEventListener('click', () => { borrador.borrar(CLAVE_BORRADOR); App.navegar(); });
    }
    cargarHistorial();
  }

  async function cargarHistorial() {
    try {
      const h = await api('conciliacion.historial');
      $('#historial').innerHTML = h.length ? `<table class="tabla"><thead><tr><th>Fecha</th><th>Archivo</th><th>Período</th><th class="num">Importados</th><th class="num">Monto</th><th>Por</th></tr></thead><tbody>
        ${h.map((i) => `<tr><td>${fmt.fechaHora(i.creado_en)}</td><td>${i.archivo_url ? `<a href="${esc(i.archivo_url)}" target="_blank" rel="noopener">${esc(i.archivo_nombre)}</a>` : esc(i.archivo_nombre)}</td>
          <td>${fmt.fecha(i.rango_desde)} – ${fmt.fecha(i.rango_hasta)}</td><td class="num">${i.filas_importadas}</td><td class="num">${fmt.bs(i.monto_total)}</td><td class="text-xs">${esc(i.creado_por)}</td></tr>`).join('')}</tbody></table>`
        : '<div class="suave p-4">Aún no hay importaciones.</div>';
    } catch (e) { $('#historial').innerHTML = `<div class="alerta alerta-peligro m-3">${esc(e.message)}</div>`; }
  }

  function leerBase64(archivo) {
    return new Promise((ok, falla) => {
      const lector = new FileReader();
      lector.onload = () => ok(String(lector.result).split(',')[1]);
      lector.onerror = () => falla(new Error('No se pudo leer el archivo.'));
      lector.readAsDataURL(archivo);
    });
  }

  async function analizarArchivo(archivo) {
    if (archivo.size > MAX_BYTES) { ui.toast('El archivo supera 8 MB. Divídalo por mes.', 'error'); return; }
    const zona = $('#zona');
    zona.innerHTML = `<span class="block font-semibold">Analizando ${esc(archivo.name)}…</span><span class="suave text-sm">Esto puede tardar unos segundos.</span>`;
    try {
      const base64 = await leerBase64(archivo);
      const r = await api('conciliacion.analizar', { archivo: { nombre: archivo.name, base64 } });
      mostrarVistaPrevia(r);
    } catch (e) {
      ui.error(e);
      App.navegar();
    }
  }

  function mostrarVistaPrevia(r, recuperado) {
    const cats = App.estado.catalogos.categorias.map((c) => c.nombre);
    const movs = r.movimientos.map((m) => Object.assign({ elegido: m.estado === 'NUEVO' }, m));
    const s = r.resumen;
    $('#paso1').hidden = true;
    const paso = $('#paso2');
    const guardarBorrador = () => borrador.guardar(CLAVE_BORRADOR, { archivo: r.archivo, resumen: r.resumen, movimientos: movs });
    if (!recuperado) guardarBorrador();
    const etiquetaEstado = { NUEVO: '<span class="pill pill-ok">Nuevo</span>', DUPLICADO: '<span class="pill pill-neutro">Ya importado</span>', POSIBLE_DUPLICADO: '<span class="pill pill-aviso">¿Duplicado?</span>' };
    paso.innerHTML = `
      <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 mb-3">
        ${[['Débitos leídos', s.total], ['Nuevos', s.nuevos], ['Ya importados', s.duplicados], ['Posibles duplicados', s.posibles_duplicados], ['Sin beneficiario', s.sin_beneficiario],
          ['Período', `${fmt.fecha(s.desde)} – ${fmt.fecha(s.hasta)}`], ['Próximo N° de OP', s.proximo_numero]]
          .map(([t, v]) => `<div class="tarjeta p-3"><div class="kpi-etiqueta">${t}</div><div class="font-semibold text-lg">${esc(v)}</div></div>`).join('')}
      </div>
      ${s.ignoradas ? `<p class="suave text-sm mb-2">${s.ignoradas} fila(s) sin fecha o sin débito se ignoraron (por ejemplo, la fila de totales).</p>` : ''}
      <div class="tarjeta">
        <div class="flex flex-wrap items-center gap-2 p-3">
          <label class="check"><input type="checkbox" id="todos"><span>Seleccionar todos los nuevos</span></label>
          <span class="mx-2 suave">|</span>
          <label class="sr-only" for="cat-masiva">Categoría para los seleccionados</label>
          <select id="cat-masiva" class="campo" style="width:auto;max-width:240px">${ui.opciones(cats, '', 'Categoría a seleccionados…')}</select>
          <label class="sr-only" for="desc-masiva">Descripción para los seleccionados</label>
          <input id="desc-masiva" class="campo" style="width:260px" placeholder="Descripción a seleccionados…">
          <button class="btn btn-chico" id="aplicar-masivo">Aplicar</button>
          <span class="ml-auto font-semibold" id="conteo"></span>
        </div>
        <div class="tabla-env" style="max-height:60vh"><table class="tabla"><thead><tr>
          <th><span class="sr-only">Importar</span></th><th>Fecha</th><th>Movimiento del banco</th><th>Beneficiario</th><th>Categoría</th><th>Descripción del pago</th><th class="num">Monto</th><th>Estado</th>
        </tr></thead><tbody>
        ${movs.map((m, i) => `<tr>
          <td><input type="checkbox" data-i="${i}" class="sel" ${m.elegido ? 'checked' : ''} ${m.estado === 'DUPLICADO' ? 'disabled' : ''} aria-label="Importar fila ${m.fila}"></td>
          <td class="whitespace-nowrap">${fmt.fecha(m.fecha)}</td>
          <td class="text-xs" style="max-width:220px">${esc(m.descripcion)}${m.observaciones.length ? `<div class="mt-1" style="color:var(--aviso)">${m.observaciones.map(esc).join('<br>')}</div>` : ''}</td>
          <td style="min-width:200px">${m.beneficiario_id || m.tipo_mov === 'NOMINA' ? `<div class="font-medium">${esc(m.beneficiario)}</div><div class="suave text-xs">${esc(fmt.doc(m.tipo_doc, m.documento))}${m.cuenta ? ' · ' + esc(m.cuenta) : ''}</div>`
            : `<input class="campo" data-i="${i}" data-k="beneficiario" value="${esc(m.beneficiario)}" placeholder="Nombre (${esc(fmt.doc(m.tipo_doc, m.documento) || 'sin doc.')})" aria-label="Nombre del beneficiario fila ${m.fila}">
               <input class="campo mt-1" data-i="${i}" data-k="cuenta" value="${esc(m.cuenta)}" placeholder="Cuenta 20 dígitos (opcional)" inputmode="numeric" aria-label="Cuenta fila ${m.fila}">`}</td>
          <td><select class="campo" data-i="${i}" data-k="categoria" style="min-width:170px" aria-label="Categoría fila ${m.fila}">${ui.opciones(cats, m.categoria, '—')}</select></td>
          <td><input class="campo" data-i="${i}" data-k="descripcion_pago" value="${esc(m.descripcion_pago)}" style="min-width:200px" aria-label="Descripción fila ${m.fila}"></td>
          <td class="num whitespace-nowrap">${fmt.bs(m.monto)}<div class="suave text-xs">${fmt.usd(m.monto_usd)}</div></td>
          <td>${etiquetaEstado[m.estado] || ''}</td></tr>`).join('')}
        </tbody></table></div>
        <div class="flex flex-wrap items-center gap-2 p-3 separador">
          <span class="suave text-sm mr-auto">Los datos faltantes (nombre, cuenta, descripción) también pueden completarse después en Pagos.</span>
          <button class="btn" id="btn-cancelar">Cancelar</button>
          <button class="btn btn-prim" id="btn-confirmar">${ico('check')} Importar</button>
        </div>
      </div>`;
    ui.iconos();
    const contar = () => {
      const n = movs.filter((m) => m.elegido);
      $('#conteo').textContent = `${n.length} seleccionado(s) · ${fmt.bs(n.reduce((a, m) => a + m.monto, 0))}`;
      $('#btn-confirmar').disabled = !n.length;
    };
    $$('.sel', paso).forEach((c) => c.addEventListener('change', () => { movs[c.dataset.i].elegido = c.checked; contar(); guardarBorrador(); }));
    $$('[data-k]', paso).forEach((c) => c.addEventListener('change', () => { movs[c.dataset.i][c.dataset.k] = c.value; guardarBorrador(); }));
    $('#todos').addEventListener('change', (e) => {
      movs.forEach((m, i) => { if (m.estado === 'NUEVO') { m.elegido = e.target.checked; $(`.sel[data-i="${i}"]`).checked = e.target.checked; } });
      contar(); guardarBorrador();
    });
    $('#aplicar-masivo').addEventListener('click', () => {
      const cat = $('#cat-masiva').value;
      const desc = $('#desc-masiva').value.trim();
      movs.forEach((m, i) => {
        if (!m.elegido) return;
        if (cat) { m.categoria = cat; $(`select[data-i="${i}"][data-k="categoria"]`).value = cat; }
        if (desc) { m.descripcion_pago = desc.toUpperCase(); $(`input[data-i="${i}"][data-k="descripcion_pago"]`).value = desc.toUpperCase(); }
      });
      guardarBorrador();
      ui.toast('Aplicado a los movimientos seleccionados.', 'exito');
    });
    $('#btn-cancelar').addEventListener('click', () => { borrador.borrar(CLAVE_BORRADOR); App.navegar(); });
    $('#btn-confirmar').addEventListener('click', async (ev) => {
      const elegidos = movs.filter((m) => m.elegido);
      const dudosos = elegidos.filter((m) => m.estado === 'POSIBLE_DUPLICADO').length;
      const ok = await ui.confirmar({
        titulo: 'Confirmar importación',
        mensaje: `Se registrarán <strong>${elegidos.length}</strong> pagos por <strong>${fmt.bs(elegidos.reduce((a, m) => a + m.monto, 0))}</strong>, con números de Orden de Pago desde el <strong>${s.proximo_numero}</strong>.${dudosos ? `<br><br><span style="color:var(--aviso)">Incluye ${dudosos} posible(s) duplicado(s).</span>` : ''}`,
        textoBoton: 'Importar'
      });
      if (!ok) return;
      const btn = ev.currentTarget;
      ui.ocupado(btn, true);
      try {
        const res = await api('conciliacion.confirmar', { movimientos: elegidos, archivo: r.archivo }, { escritura: true });
        borrador.borrar(CLAVE_BORRADOR);
        paso.innerHTML = `<div class="tarjeta p-6 text-center">
          ${ico('circle-check', 'w-10 h-10 mx-auto mb-2')}<h2 class="text-lg font-semibold mb-1">${res.importados} pago(s) importados</h2>
          <p class="suave mb-1">Órdenes N° ${res.desde_numero} a ${res.hasta_numero} · ${fmt.bs(res.monto_total)}</p>
          ${res.omitidos.length ? `<p class="suave text-sm mb-1">${res.omitidos.length} omitido(s) por estar ya importados o incompletos.</p>` : ''}
          <div class="flex flex-wrap justify-center gap-2 mt-4">
            ${res.por_completar ? `<a class="btn btn-prim" href="#/pagos?estado_datos=POR_COMPLETAR&anio=&mes=">Completar ${res.por_completar} pago(s)</a>` : ''}
            <a class="btn" href="#/pagos?anio=&mes=&op=PENDIENTE">Ver órdenes pendientes</a>
            <button class="btn" onclick="App.navegar()">Importar otro archivo</button></div></div>`;
        ui.iconos();
        cargarHistorial();
      } catch (e) { ui.error(e); } finally { ui.ocupado(btn, false); }
    });
    contar();
  }

  return { render };
})();

App.registrar({ id: 'importar', titulo: 'Importar conciliación', icono: 'file-up', permiso: 'pagos.importar', render: Importar.render });
