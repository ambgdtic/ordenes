/**
 * Módulo: Pagos realizados y Órdenes de Pago.
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes · v1.0.0-beta
 * © 2026 Soluciones AFFINITY.
 */
'use strict';

const Pagos = (() => {
  const r2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

  /** Mismo cálculo que el servidor (calcularOrdenPago) para mostrar el resultado al instante. */
  function calcularOP(entrada, retenciones, ivaPct, pagado) {
    const base = r2(fmt.aNumero(entrada.base_imponible) || 0);
    const iva = r2(base * Number(ivaPct) / 100);
    const total = r2(base + iva);
    const bases = { BASE: base, IVA: iva, TOTAL: total, NINGUNA: 0 };
    const filas = retenciones.map((r) => {
      const sel = base > 0 && entrada.retenciones.includes(r.codigo) && Number(r.porcentaje) > 0;
      return Object.assign({}, r, { seleccionada: sel, valor_procesar: sel ? bases[r.base] : null, valor_retencion: sel ? r2(bases[r.base] * r.porcentaje / 100) : null });
    });
    const totalRet = r2(filas.reduce((s, f) => s + (f.valor_retencion || 0), 0));
    const filaIva = filas.find((f) => f.codigo === 'IVA');
    const empresa = base > 0 ? r2(total - totalRet) : null;
    return {
      base, iva, total, filas, totalRet, empresa,
      restanteIva: base > 0 ? (filaIva && filaIva.seleccionada ? r2(iva - filaIva.valor_retencion) : 0) : null,
      diferencia: base > 0 ? r2(pagado - empresa) : null
    };
  }

  function estadoPill(p) {
    if (p.estado === 'ANULADA') return '<span class="pill pill-peligro">Anulada</span>';
    if (p.estado_datos === 'POR_COMPLETAR') return '<span class="pill pill-aviso">Por completar</span>';
    if (p.op_generada) return '<span class="pill pill-ok">OP generada</span>';
    return '<span class="pill pill-neutro">OP pendiente</span>';
  }

  /* ---------- Lista ---------- */
  async function render(cont, p) {
    const hoy = new Date();
    const filtros = {
      anio: p.anio !== undefined ? p.anio : hoy.getFullYear(),
      mes: p.mes !== undefined ? p.mes : (p.anio !== undefined ? '' : hoy.getMonth() + 1),
      estado_datos: p.estado_datos || '', op: p.op || '', estado: p.estado || '', categoria: p.categoria || '',
      texto: p.texto || '', pagina: Number(p.pagina) || 1, por_pagina: 50
    };
    const cats = App.estado.catalogos.categorias.map((c) => c.nombre);
    cont.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 mb-3">
        <h1 class="titulo-pagina mr-auto">Pagos y Órdenes de Pago</h1>
        ${App.puede('pagos.importar') ? `<a class="btn" href="#/importar">${ico('file-up')} Importar conciliación</a>` : ''}
        ${App.puede('pagos.editar') ? `<button class="btn btn-prim" id="btn-nuevo">${ico('plus')} Pago manual</button>` : ''}
      </div>
      <div class="tarjeta p-3 mb-3 flex flex-wrap gap-2 items-center">
        ${ui.selectorPeriodo(filtros.anio, filtros.mes)}
        <select id="f-datos" class="campo" style="width:auto" aria-label="Estado de los datos">${ui.opciones([{ valor: 'POR_COMPLETAR', texto: 'Por completar' }, { valor: 'COMPLETO', texto: 'Completos' }], filtros.estado_datos, 'Datos: todos')}</select>
        <select id="f-op" class="campo" style="width:auto" aria-label="Orden de pago">${ui.opciones([{ valor: 'PENDIENTE', texto: 'OP pendiente' }, { valor: 'GENERADA', texto: 'OP generada' }], filtros.op, 'OP: todas')}</select>
        <select id="f-estado" class="campo" style="width:auto" aria-label="Estado">${ui.opciones([{ valor: 'ACTIVA', texto: 'Activas' }, { valor: 'ANULADA', texto: 'Anuladas' }], filtros.estado, 'Estado: todos')}</select>
        <select id="f-cat" class="campo" style="width:auto;max-width:220px" aria-label="Categoría">${ui.opciones(cats, filtros.categoria, 'Todas las categorías')}</select>
        <div class="relative flex-1 min-w-[200px]"><label class="sr-only" for="f-texto">Buscar</label>
          <input id="f-texto" class="campo" placeholder="Buscar N°, beneficiario, cédula/RIF, descripción…" value="${esc(filtros.texto)}"></div>
      </div>
      <div id="resumen" class="flex flex-wrap gap-2 mb-3"></div>
      <div class="tarjeta"><div id="tabla" class="tabla-env"><div class="suave p-6">Cargando…</div></div><div id="pag"></div></div>`;

    const aplicar = (cambios = {}) => {
      const f = Object.assign({}, filtros, {
        anio: $('#f-anio').value, mes: $('#f-mes').value, estado_datos: $('#f-datos').value, op: $('#f-op').value,
        estado: $('#f-estado').value, categoria: $('#f-cat').value, texto: $('#f-texto').value.trim(), pagina: 1
      }, cambios);
      const q = new URLSearchParams();
      Object.keys(f).forEach((k) => { if (k !== 'por_pagina') q.set(k, f[k]); });
      history.replaceState(null, '', '#/pagos?' + q.toString());
      Object.assign(filtros, f);
      cargar();
    };
    ['#f-anio', '#f-mes', '#f-datos', '#f-op', '#f-estado', '#f-cat'].forEach((s) => $(s).addEventListener('change', () => aplicar()));
    $('#f-texto').addEventListener('input', demorar(() => aplicar(), 450));
    if ($('#btn-nuevo')) $('#btn-nuevo').addEventListener('click', () => editarPago(null, cargar));

    async function cargar() {
      const tabla = $('#tabla');
      tabla.innerHTML = '<div class="suave p-6">Cargando…</div>';
      try {
        const r = await api('pagos.listar', filtros);
        $('#resumen').innerHTML = `
          <span class="pill pill-info">Total: ${fmt.bs(r.totales.monto)} · ${fmt.usd(r.totales.monto_usd)}</span>
          <span class="pill pill-aviso">${r.totales.por_completar} por completar</span>
          <span class="pill pill-neutro">${r.totales.op_pendientes} OP pendientes</span>
          ${r.totales.anuladas ? `<span class="pill pill-peligro">${r.totales.anuladas} anuladas</span>` : ''}`;
        if (!r.registros.length) { tabla.innerHTML = '<div class="suave p-6">No hay pagos con esos filtros.</div>'; $('#pag').innerHTML = ''; return; }
        tabla.innerHTML = `<table class="tabla"><thead><tr><th>N°</th><th class="hidden md:table-cell">Fecha</th><th>Beneficiario</th><th class="hidden lg:table-cell">Categoría</th>
          <th class="num">Monto</th><th class="hidden md:table-cell">Estado</th><th class="hidden md:table-cell text-right">Acciones</th></tr></thead><tbody>
          ${r.registros.map((x) => `<tr class="${x.estado === 'ANULADA' ? 'anulada' : ''}">
            <td class="font-semibold">${x.numero}</td>
            <td class="hidden md:table-cell whitespace-nowrap">${fmt.fecha(x.fecha)}</td>
            <td><div class="font-medium">${esc(x.beneficiario || '— sin beneficiario —')}</div>
              <div class="suave text-xs">${esc(fmt.doc(x.tipo_doc, x.documento))} ${x.descripcion ? '· ' + esc(x.descripcion.slice(0, 70)) : ''}</div>
              <div class="md:hidden mt-1 flex flex-wrap items-center gap-1"><span class="suave text-xs">${fmt.fecha(x.fecha)}</span> ${estadoPill(x)}</div>
              <div class="md:hidden acciones mt-1">${acciones(x)}</div></td>
            <td class="hidden lg:table-cell">${ui.pillCategoria(x.categoria)}</td>
            <td class="num whitespace-nowrap">${fmt.bs(x.monto)}<div class="suave text-xs">${fmt.usd(x.monto_usd)}</div></td>
            <td class="hidden md:table-cell">${estadoPill(x)}</td>
            <td class="hidden md:table-cell acciones text-right whitespace-nowrap">${acciones(x)}</td></tr>`).join('')}
          </tbody></table>`;
        $('#pag').replaceChildren(ui.paginacion(r.total, r.pagina, r.por_pagina, (n) => { filtros.pagina = n; cargar(); }));
        $$('[data-acc]', tabla).forEach((b) => b.addEventListener('click', () => ejecutar(b.dataset.acc, r.registros.find((x) => x.id === b.dataset.id), cargar)));
        ui.iconos();
      } catch (e) { tabla.innerHTML = `<div class="alerta alerta-peligro m-3">${esc(e.message)}</div>`; }
    }
    cargar();
  }

  function acciones(x) {
    const b = (acc, icono, titulo) => `<button class="btn btn-ico" data-acc="${acc}" data-id="${x.id}" title="${titulo}" aria-label="${titulo} N° ${x.numero}">${ico(icono)}</button>`;
    if (x.estado === 'ANULADA') return b('ver', 'eye', 'Ver orden') + (App.puede('admin') ? b('reactivar', 'rotate-ccw', 'Reactivar') : '');
    let h = '';
    if (App.puede('pagos.editar')) h += b('editar', x.estado_datos === 'POR_COMPLETAR' ? 'pencil-line' : 'pencil', x.estado_datos === 'POR_COMPLETAR' ? 'Completar datos' : 'Editar pago');
    if (App.puede('op.generar')) h += b('op', 'file-signature', 'Orden de pago (factura y retenciones)');
    h += b('ver', 'printer', 'Ver e imprimir');
    if (App.puede('oc.editar')) h += b('oc', 'clipboard-list', 'Crear orden de compra/servicio');
    if (App.puede('op.anular')) h += b('anular', 'ban', 'Anular');
    return h;
  }

  async function ejecutar(accion, x, recargar) {
    try {
      if (accion === 'editar') return editarPago(x.id, recargar);
      if (accion === 'op') return ordenPago(x.id, recargar);
      if (accion === 'ver') return verOrden(x.id, recargar);
      if (accion === 'oc') { location.hash = `#/ordenes?desdePago=${x.id}`; return null; }
      if (accion === 'anular') {
        const motivo = await ui.confirmar({ titulo: `Anular Orden de Pago N° ${x.numero}`, mensaje: 'La orden quedará anulada (no se borra). Podrá reactivarla un administrador.', textoBoton: 'Anular', peligro: true, pedirMotivo: true });
        if (!motivo) return null;
        await api('pagos.anular', { id: x.id, motivo }, { escritura: true });
        ui.toast(`Orden N° ${x.numero} anulada.`, 'exito');
        return recargar();
      }
      if (accion === 'reactivar') {
        const motivo = await ui.confirmar({ titulo: `Reactivar Orden N° ${x.numero}`, mensaje: 'La orden volverá a estar activa.', textoBoton: 'Reactivar', pedirMotivo: true });
        if (!motivo) return null;
        await api('pagos.reactivar', { id: x.id, motivo }, { escritura: true });
        ui.toast(`Orden N° ${x.numero} reactivada.`, 'exito');
        return recargar();
      }
    } catch (e) { ui.error(e); }
    return null;
  }

  /* ---------- Editar / completar / pago manual ---------- */
  async function editarPago(id, recargar) {
    const datos = id ? await api('pagos.obtener', { id }) : { pago: { fecha: fmt.hoy() }, faltan: [] };
    const p = datos.pago;
    const esAdmin = App.puede('admin');
    const nuevo = !id;
    const cats = App.estado.catalogos.categorias.map((c) => c.nombre);
    const m = ui.modal({
      titulo: nuevo ? 'Registrar pago manual' : `Pago N° ${p.numero}`,
      tamano: 'mediano',
      cuerpo: `
        ${!nuevo && datos.faltan.length ? `<div class="alerta alerta-aviso mb-3">Falta: ${esc(datos.faltan.join(', '))}.</div>` : ''}
        ${p.referencia_banco ? `<p class="suave text-xs mb-3">Banco: ${esc(p.referencia_banco)}</p>` : ''}
        <form id="form-pago" class="grid grid-cols-1 sm:grid-cols-6 gap-3" novalidate>
          <div class="sm:col-span-2"><label class="etiqueta" for="p-fecha">Fecha del pago</label>
            <input id="p-fecha" type="date" class="campo" value="${esc(p.fecha || '')}" ${nuevo || esAdmin ? '' : 'readonly'} required></div>
          <div class="sm:col-span-2"><label class="etiqueta" for="p-monto">Monto pagado (Bs.)</label>
            <input id="p-monto" class="campo num" inputmode="decimal" value="${p.monto ? esc(fmt.num(p.monto)) : ''}" ${nuevo || esAdmin ? '' : 'readonly'} required></div>
          <div class="sm:col-span-2"><label class="etiqueta" for="p-numero">N° de orden</label>
            <input id="p-numero" class="campo" inputmode="numeric" value="${esc(p.numero || '')}" ${nuevo && esAdmin ? 'placeholder="Automático"' : 'readonly'}></div>
          <div class="sm:col-span-6"><label class="etiqueta" for="p-ben">Beneficiario o proveedor</label>
            <input id="p-ben" class="campo" value="${esc(p.beneficiario || '')}" placeholder="Escriba nombre o cédula/RIF para buscar en el registro" maxlength="200"></div>
          <div class="sm:col-span-1"><label class="etiqueta" for="p-tipo">Tipo</label>
            <select id="p-tipo" class="campo">${ui.opciones(['V', 'E', 'J', 'G', 'P'], p.tipo_doc, '—')}</select></div>
          <div class="sm:col-span-2"><label class="etiqueta" for="p-doc">Cédula / RIF</label>
            <input id="p-doc" class="campo" inputmode="numeric" value="${esc(p.documento || '')}"></div>
          <div class="sm:col-span-3"><label class="etiqueta" for="p-cuenta">Cuenta bancaria del beneficiario</label>
            <input id="p-cuenta" class="campo" inputmode="numeric" value="${esc(p.cuenta || '')}" placeholder="0102-0000-0000-0000-0000"><p id="p-cuenta-ayuda" class="ayuda"></p></div>
          <div class="sm:col-span-3"><label class="etiqueta" for="p-cat">Categoría</label>
            <select id="p-cat" class="campo">${ui.opciones(cats, p.categoria, 'Seleccione…')}</select></div>
          <div class="sm:col-span-3 flex items-end"><p class="suave text-sm">${p.tasa_bcv ? `Tasa BCV ${fmt.num(p.tasa_bcv, 2)} · ${fmt.usd(p.monto_usd)}` : 'La tasa BCV se asigna según la fecha.'}</p></div>
          <div class="sm:col-span-6"><label class="etiqueta" for="p-desc">Descripción / motivo del pago</label>
            <textarea id="p-desc" class="campo" maxlength="1000">${esc(p.descripcion || '')}</textarea></div>
        </form>`,
      pie: `<button class="btn" data-cerrar>Cancelar</button>
        ${!nuevo && App.puede('pagos.editar') ? `<button class="btn" id="btn-tasa" title="Recalcular la tasa BCV según la fecha">${ico('refresh-cw')} Tasa</button>` : ''}
        <button class="btn btn-prim" id="btn-guardar">${ico('save')} Guardar</button>`
    });
    const el = m.el;
    const revisarCuenta = ui.validarCuenta($('#p-cuenta', el), $('#p-cuenta-ayuda', el));
    ui.autocompletarBeneficiario($('#p-ben', el), (b) => {
      $('#p-ben', el).value = b.nombre;
      $('#p-tipo', el).value = b.tipo_doc;
      $('#p-doc', el).value = b.documento;
      if (b.cuenta && !$('#p-cuenta', el).value) $('#p-cuenta', el).value = b.cuenta;
      if (b.categoria_sugerida && !$('#p-cat', el).value) $('#p-cat', el).value = b.categoria_sugerida;
      revisarCuenta();
    });
    if ($('#btn-tasa', el)) {
      $('#btn-tasa', el).addEventListener('click', async (ev) => {
        const btn = ev.currentTarget;
        ui.ocupado(btn, true);
        try { const r = await api('pagos.recalcularTasa', { id }, { escritura: true }); ui.toast(`Tasa aplicada: ${fmt.num(r.tasa_bcv, 2)} Bs. (${fmt.usd(r.monto_usd)})`, 'exito'); } catch (e) { ui.error(e); } finally { ui.ocupado(btn, false); }
      });
    }
    $('#btn-guardar', el).addEventListener('click', async (ev) => {
      if (!revisarCuenta()) { $('#p-cuenta', el).focus(); return; }
      const datosForm = {
        id, beneficiario: $('#p-ben', el).value, tipo_doc: $('#p-tipo', el).value, documento: $('#p-doc', el).value,
        cuenta: $('#p-cuenta', el).value, categoria: $('#p-cat', el).value, descripcion: $('#p-desc', el).value
      };
      if (nuevo || esAdmin) { datosForm.fecha = $('#p-fecha', el).value; datosForm.monto = fmt.aNumero($('#p-monto', el).value); }
      if (nuevo && $('#p-numero', el).value.trim()) datosForm.numero = Number($('#p-numero', el).value);
      const btn = ev.currentTarget;
      ui.ocupado(btn, true);
      try {
        const r = await api(nuevo ? 'pagos.crear' : 'pagos.guardar', datosForm, { escritura: true });
        m.cerrar();
        ui.toast(r.faltan.length ? `Guardado. Aún falta: ${r.faltan.join(', ')}.` : `Pago N° ${r.pago.numero} completo. Ya puede generar la Orden de Pago.`, r.faltan.length ? 'aviso' : 'exito');
        if (r.op_desactualizada) ui.toast('Esta orden ya tenía PDF. Regenérelo para que refleje los cambios.', 'aviso', 8000);
        if (recargar) recargar();
      } catch (e) { ui.error(e); } finally { ui.ocupado(btn, false); }
    });
  }

  /* ---------- Orden de Pago: factura, retenciones, imputación ---------- */
  async function ordenPago(id, recargar) {
    const { pago: p, faltan, orden_vinculada: ov } = await api('pagos.obtener', { id });
    const cat = App.estado.catalogos;
    const guardado = borrador.leer('op:' + id);
    const inicial = guardado || {
      factura: p.op_factura || '', base_imponible: p.op_base_imponible ? fmt.num(p.op_base_imponible) : '',
      retenciones: p.op_retenciones || [], contrato: p.op_contrato || '', orden_compra_id: p.orden_compra_id || '',
      imputacion: p.op_imputacion || { fecha: '', lineas: [] }
    };
    let ordenes = [];
    try { ordenes = (await api('oc.listar', { texto: p.documento || p.beneficiario || '', estado: 'ACTIVA', por_pagina: 50 })).registros; } catch (e) { ordenes = []; }
    if (ov && !ordenes.some((o) => o.id === ov.id)) ordenes.unshift(Object.assign({}, ov, { beneficiario: p.beneficiario }));
    const lineas = [0, 1, 2].map((i) => (inicial.imputacion.lineas || [])[i] || {});
    const campoLinea = (i, k, ph, w) => `<input class="campo" data-l="${i}" data-k="${k}" value="${esc(lineas[i][k] || '')}" placeholder="${ph}" aria-label="${ph} línea ${i + 1}" style="min-width:${w || 52}px">`;
    const m = ui.modal({
      titulo: `Orden de Pago N° ${p.numero} · ${esc(p.beneficiario || '')}`,
      tamano: 'grande',
      cuerpo: `
        ${faltan.length ? `<div class="alerta alerta-aviso mb-3">Antes de generar el PDF complete: ${esc(faltan.join(', '))}.</div>` : ''}
        ${guardado ? '<div class="alerta alerta-info mb-3">Se recuperó un borrador sin guardar de esta orden.</div>' : ''}
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <form id="form-op" class="lg:col-span-3 space-y-4" novalidate>
            <fieldset class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <legend class="font-semibold mb-2">Factura</legend>
              <div><label class="etiqueta" for="op-fac">N° de factura</label><input id="op-fac" class="campo" maxlength="40" value="${esc(inicial.factura)}"></div>
              <div><label class="etiqueta" for="op-base">Base imponible (Bs.)</label><input id="op-base" class="campo num" inputmode="decimal" value="${esc(inicial.base_imponible)}" placeholder="Vacío si no hay factura"></div>
              <div><label class="etiqueta">IVA</label><input class="campo" readonly value="${fmt.num(cat.iva_pct, 0)}%"></div>
            </fieldset>
            <fieldset>
              <legend class="font-semibold mb-2">Retenciones aplicables</legend>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                ${cat.retenciones.filter((r) => !r.fila_titulo).map((r) => `<label class="check"><input type="checkbox" value="${r.codigo}" ${inicial.retenciones.includes(r.codigo) ? 'checked' : ''}>
                  <span>${esc(r.nombre)} <span class="suave text-xs">(${fmt.num(r.porcentaje, r.porcentaje % 1 ? 2 : 0)}% de ${({ BASE: 'la base', IVA: 'el IVA', TOTAL: 'el total' })[r.base] || r.base})</span></span></label>`).join('')}
              </div>
            </fieldset>
            <fieldset class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <legend class="font-semibold mb-2">Contrato y orden de compra/servicio</legend>
              <div><label class="etiqueta" for="op-con">Contrato N°</label><input id="op-con" class="campo" maxlength="60" value="${esc(inicial.contrato)}"></div>
              <div><label class="etiqueta" for="op-oc">Orden de compra/servicio vinculada</label>
                <select id="op-oc" class="campo">${ui.opciones(ordenes.map((o) => ({ valor: o.id, texto: `${o.tipo === 'COMPRA' ? 'OC' : 'OS'} N° ${o.numero} · ${fmt.bs(o.total_final)}` })), inicial.orden_compra_id, 'Ninguna')}</select></div>
            </fieldset>
            <details ${(inicial.imputacion.lineas || []).some((l) => l.partida) ? 'open' : ''}>
              <summary class="font-semibold cursor-pointer">Imputación presupuestaria (opcional)</summary>
              <div class="mt-2 mb-2 w-48"><label class="etiqueta" for="op-fimp">Fecha de imputación</label><input id="op-fimp" type="date" class="campo" value="${esc(inicial.imputacion.fecha || '')}"></div>
              <div class="tabla-env"><table class="tabla"><thead><tr><th>Sector</th><th>Prog</th><th>Act.</th><th>Partida</th><th>Gen.</th><th>Esp.</th><th>Sub-esp.</th><th>Total</th><th>Período</th></tr></thead><tbody>
                ${[0, 1, 2].map((i) => `<tr>${['sector', 'programa', 'actividad', 'partida', 'generica', 'especifica', 'subespecifica'].map((k) => `<td>${campoLinea(i, k, k.slice(0, 4))}</td>`).join('')}
                  <td>${campoLinea(i, 'total', 'Bs.', 90)}</td><td>${campoLinea(i, 'periodo', 'Período', 80)}</td></tr>`).join('')}
              </tbody></table></div>
            </details>
          </form>
          <aside class="lg:col-span-2"><div class="tarjeta p-4 sticky top-2" id="op-calculo" aria-live="polite"></div></aside>
        </div>`,
      pie: `<button class="btn" data-cerrar>Cerrar</button>
        <button class="btn" id="op-guardar">${ico('save')} Guardar</button>
        <button class="btn btn-prim" id="op-pdf" ${faltan.length ? 'disabled title="Complete los datos del pago primero"' : ''}>${ico('file-check')} Guardar y generar PDF</button>`
    });
    const el = m.el;
    const leer = () => ({
      id, factura: $('#op-fac', el).value.trim(), base_imponible: fmt.aNumero($('#op-base', el).value),
      retenciones: $$('#form-op input[type=checkbox]:checked', el).map((c) => c.value),
      contrato: $('#op-con', el).value.trim(), orden_compra_id: $('#op-oc', el).value,
      imputacion: {
        fecha: $('#op-fimp', el).value,
        lineas: [0, 1, 2].map((i) => {
          const l = {};
          $$(`[data-l="${i}"]`, el).forEach((c) => { l[c.dataset.k] = c.dataset.k === 'total' ? fmt.aNumero(c.value) : c.value.trim(); });
          return l;
        }).filter((l) => Object.values(l).some((v) => v))
      }
    });
    const pintar = () => {
      const d = leer();
      borrador.guardar('op:' + id, Object.assign({}, d, { base_imponible: $('#op-base', el).value }));
      const k = calcularOP({ base_imponible: d.base_imponible, retenciones: d.retenciones }, cat.retenciones, cat.iva_pct, p.monto);
      const tol = Number(cat.tolerancia_diferencia) || 1;
      const fila = (t, v, fuerte) => `<div class="flex justify-between py-1 ${fuerte ? 'font-semibold' : ''}"><span>${t}</span><span class="num">${v}</span></div>`;
      $('#op-calculo', el).innerHTML = `
        <h3 class="font-semibold mb-2">Desglose</h3>
        ${fila('Monto pagado (banco)', fmt.bs(p.monto), true)}
        <div class="separador my-2"></div>
        ${k.base > 0 ? `${fila('Sub-total', fmt.bs(k.base))}${fila(`IVA ${fmt.num(cat.iva_pct, 0)}%`, fmt.bs(k.iva))}${fila('Total factura', fmt.bs(k.total), true)}
          <div class="separador my-2"></div>
          ${k.filas.filter((f) => f.seleccionada).map((f) => fila(`− ${esc(f.nombre)}`, fmt.bs(f.valor_retencion))).join('') || '<p class="suave text-sm">Sin retenciones.</p>'}
          ${fila('Total retenciones', fmt.bs(k.totalRet), true)}
          ${fila('Monto a pagar a la empresa', fmt.bs(k.empresa), true)}
          ${fila('Monto restante del IVA', fmt.bs(k.restanteIva))}
          ${Math.abs(k.diferencia) > tol ? `<div class="alerta alerta-aviso mt-2">El neto calculado difiere de lo pagado en ${fmt.bs(k.diferencia)}. Revise la base o las retenciones.</div>` : '<div class="alerta alerta-ok mt-2">El neto calculado coincide con lo pagado.</div>'}`
          : '<p class="suave text-sm">Sin factura: la orden se emite por el monto pagado (ayudas, subvenciones, nómina, etc.).</p>'}
        <p class="suave text-xs mt-3">Tasa BCV ${p.tasa_bcv ? fmt.num(p.tasa_bcv, 2) : '—'} · ${fmt.usd(p.monto_usd)}</p>`;
    };
    $('#form-op', el).addEventListener('input', demorar(pintar, 150));
    $('#form-op', el).addEventListener('change', pintar);
    pintar();
    const guardar = async (ev, generar) => {
      const btn = ev.currentTarget;
      ui.ocupado(btn, true);
      try {
        const r = await api('op.guardar', Object.assign(leer(), { generar_pdf: generar }), { escritura: true });
        borrador.borrar('op:' + id);
        m.cerrar();
        if (recargar) recargar();
        if (generar) ui.toast(`Orden N° ${p.numero} generada y guardada en Drive.`, 'exito');
        else ui.toast('Datos de la orden guardados.', 'exito');
        ui.documento({ titulo: `Orden de Pago N° ${p.numero}`, html: r.html, pdfUrl: r.pdf_url || r.pago.op_pdf_url, generarPdf: App.puede('op.generar') && !faltan.length ? () => api('op.pdf', { id }, { escritura: true }) : null });
      } catch (e) { ui.error(e); } finally { ui.ocupado(btn, false); }
    };
    $('#op-guardar', el).addEventListener('click', (ev) => guardar(ev, false));
    $('#op-pdf', el).addEventListener('click', (ev) => guardar(ev, true));
  }

  async function verOrden(id, recargar) {
    try {
      const v = await api('op.vista', { id });
      ui.documento({
        titulo: v.titulo, html: v.html, pdfUrl: v.pdf_url,
        aviso: v.faltan.length ? `Datos incompletos: ${esc(v.faltan.join(', '))}. No imprima hasta completarlos.` : '',
        generarPdf: App.puede('op.generar') && !v.faltan.length ? async () => { const r = await api('op.pdf', { id }, { escritura: true }); if (recargar) recargar(); return r; } : null
      });
    } catch (e) { ui.error(e); }
  }

  return { render, editarPago, ordenPago, verOrden, calcularOP };
})();

App.registrar({ id: 'pagos', titulo: 'Pagos y OP', icono: 'receipt', permiso: 'ver', render: Pagos.render });
