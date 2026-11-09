/**
 * Módulo: Órdenes de Compra y Órdenes de Servicio.
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes · v1.0.0-beta
 * © 2026 Soluciones AFFINITY.
 */
'use strict';

const Ordenes = (() => {
  const MAX_ITEMS = 15;
  const r2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  const nombreTipo = (t) => (t === 'COMPRA' ? 'Orden de Compra' : 'Orden de Servicio');

  function calcular(items, ivaPct, descuento) {
    const filas = items.map((it) => {
      const cant = fmt.aNumero(it.cantidad) || 0;
      const precio = fmt.aNumero(it.precio_unitario) || 0;
      const sub = r2(cant * precio);
      const iva = it.exento ? 0 : r2(sub * ivaPct / 100);
      return { sub, iva, total: r2(sub + iva), exento: it.exento };
    });
    const subtotal = r2(filas.filter((f) => !f.exento).reduce((a, f) => a + f.sub, 0));
    const exento = r2(filas.filter((f) => f.exento).reduce((a, f) => a + f.sub, 0));
    const iva = r2(filas.reduce((a, f) => a + f.iva, 0));
    const general = r2(subtotal + iva + exento);
    const d = Math.min(Math.max(fmt.aNumero(descuento) || 0, 0), 100);
    return { filas, subtotal, exento, iva, general, final: r2(general - general * d / 100) };
  }

  async function render(cont, p) {
    const filtros = { tipo: p.tipo || '', estado: p.estado || '', anio: p.anio !== undefined ? p.anio : new Date().getFullYear(), mes: p.mes || '', texto: p.texto || '', pagina: 1, por_pagina: 50 };
    const editar = App.puede('oc.editar');
    cont.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 mb-3">
        <h1 class="titulo-pagina mr-auto">Órdenes de Compra y de Servicio</h1>
        ${editar ? `<button class="btn" data-nueva="COMPRA">${ico('shopping-cart')} Nueva orden de compra</button>
        <button class="btn btn-prim" data-nueva="SERVICIO">${ico('wrench')} Nueva orden de servicio</button>` : ''}
      </div>
      <div class="tarjeta p-3 mb-3 flex flex-wrap gap-2 items-center">
        <select id="f-tipo" class="campo" style="width:auto" aria-label="Tipo">${ui.opciones([{ valor: 'COMPRA', texto: 'Compras' }, { valor: 'SERVICIO', texto: 'Servicios' }], filtros.tipo, 'Compras y servicios')}</select>
        ${ui.selectorPeriodo(filtros.anio, filtros.mes)}
        <select id="f-estado" class="campo" style="width:auto" aria-label="Estado">${ui.opciones([{ valor: 'ACTIVA', texto: 'Activas' }, { valor: 'ANULADA', texto: 'Anuladas' }], filtros.estado, 'Todos los estados')}</select>
        <input id="f-texto" class="campo flex-1 min-w-[200px]" placeholder="Buscar proveedor, concepto, N° de proceso…" value="${esc(filtros.texto)}" aria-label="Buscar">
      </div>
      <div class="tarjeta"><div id="tabla" class="tabla-env"></div><div id="pag"></div></div>`;
    const aplicar = () => {
      Object.assign(filtros, { tipo: $('#f-tipo').value, anio: $('#f-anio').value, mes: $('#f-mes').value, estado: $('#f-estado').value, texto: $('#f-texto').value.trim(), pagina: 1 });
      cargar();
    };
    ['#f-tipo', '#f-anio', '#f-mes', '#f-estado'].forEach((s) => $(s).addEventListener('change', aplicar));
    $('#f-texto').addEventListener('input', demorar(aplicar, 450));
    $$('[data-nueva]', cont).forEach((b) => b.addEventListener('click', () => formulario({ tipo: b.dataset.nueva }, cargar)));

    async function cargar() {
      const tabla = $('#tabla');
      tabla.innerHTML = '<div class="suave p-6">Cargando…</div>';
      try {
        const r = await api('oc.listar', filtros);
        if (!r.registros.length) { tabla.innerHTML = '<div class="suave p-6">No hay órdenes con esos filtros.</div>'; $('#pag').innerHTML = ''; return; }
        tabla.innerHTML = `<table class="tabla"><thead><tr><th>Orden</th><th>Fecha</th><th>Proveedor</th><th class="hidden lg:table-cell">Concepto</th><th class="num">Total</th><th>Pagos</th><th class="text-right">Acciones</th></tr></thead><tbody>
          ${r.registros.map((o) => `<tr class="${o.estado === 'ANULADA' ? 'anulada' : ''}">
            <td class="whitespace-nowrap"><span class="pill ${o.tipo === 'COMPRA' ? 'pill-info' : 'pill-ok'}">${o.tipo === 'COMPRA' ? 'OC' : 'OS'}</span> <strong>N° ${o.numero}</strong></td>
            <td>${fmt.fecha(o.fecha)}</td>
            <td><div class="font-medium">${esc(o.beneficiario)}</div><div class="suave text-xs">${esc(fmt.doc(o.tipo_doc, o.documento))} · ${esc(o.unidad_solicitante || '')}</div></td>
            <td class="hidden lg:table-cell text-xs" style="max-width:280px">${esc((o.concepto || '').slice(0, 120))}</td>
            <td class="num whitespace-nowrap">${fmt.bs(o.total_final)}<div class="suave text-xs">${fmt.usd(o.monto_divisa)}</div></td>
            <td class="text-xs">${o.pagos.length ? 'OP ' + o.pagos.join(', ') : '<span class="suave">—</span>'}</td>
            <td class="acciones text-right whitespace-nowrap">
              ${o.estado !== 'ANULADA' && editar ? `<button class="btn btn-ico" data-acc="editar" data-id="${o.id}" title="Editar" aria-label="Editar orden ${o.numero}">${ico('pencil')}</button>` : ''}
              <button class="btn btn-ico" data-acc="ver" data-id="${o.id}" title="Ver e imprimir" aria-label="Ver orden ${o.numero}">${ico('printer')}</button>
              ${o.estado !== 'ANULADA' && App.puede('oc.anular') ? `<button class="btn btn-ico" data-acc="anular" data-id="${o.id}" title="Anular" aria-label="Anular orden ${o.numero}">${ico('ban')}</button>` : ''}
            </td></tr>`).join('')}</tbody></table>
          <div class="p-3 text-sm font-semibold">Total activo en el filtro: ${fmt.bs(r.monto_total)}</div>`;
        $('#pag').replaceChildren(ui.paginacion(r.total, r.pagina, r.por_pagina, (n) => { filtros.pagina = n; cargar(); }));
        $$('[data-acc]', tabla).forEach((b) => b.addEventListener('click', () => accion(b.dataset.acc, r.registros.find((o) => o.id === b.dataset.id), cargar)));
        ui.iconos();
      } catch (e) { tabla.innerHTML = `<div class="alerta alerta-peligro m-3">${esc(e.message)}</div>`; }
    }
    await cargar();
    if (p.desdePago && editar) {
      history.replaceState(null, '', '#/ordenes');
      const tipo = await elegirTipo();
      if (tipo) formulario(await api('oc.prellenarDesdePago', { pago_id: p.desdePago, tipo }), cargar);
    }
  }

  function elegirTipo() {
    return new Promise((ok) => {
      let elegido = null;
      const m = ui.modal({
        titulo: '¿Qué orden desea crear?',
        cuerpo: '<p class="mb-3">Se copiarán el proveedor, la fecha y el concepto del pago, y la orden quedará vinculada a él.</p><div class="flex gap-2"><button class="btn flex-1" data-t="COMPRA">Orden de compra</button><button class="btn btn-prim flex-1" data-t="SERVICIO">Orden de servicio</button></div>',
        alCerrar: () => ok(elegido)
      });
      $$('[data-t]', m.el).forEach((b) => b.addEventListener('click', () => { elegido = b.dataset.t; m.cerrar(); }));
    });
  }

  async function accion(acc, o, recargar) {
    try {
      if (acc === 'editar') return formulario((await api('oc.obtener', { id: o.id })).orden, recargar);
      if (acc === 'ver') {
        const v = await api('oc.vista', { id: o.id });
        return ui.documento({ titulo: v.titulo, html: v.html, pdfUrl: v.pdf_url, generarPdf: App.puede('oc.editar') && o.estado !== 'ANULADA' ? async () => { const r = await api('oc.pdf', { id: o.id }, { escritura: true }); recargar(); return r; } : null });
      }
      if (acc === 'anular') {
        const motivo = await ui.confirmar({ titulo: `Anular ${nombreTipo(o.tipo)} N° ${o.numero}`, mensaje: 'La orden quedará anulada (no se borra).', textoBoton: 'Anular', peligro: true, pedirMotivo: true });
        if (!motivo) return null;
        await api('oc.anular', { id: o.id, motivo }, { escritura: true });
        ui.toast('Orden anulada.', 'exito');
        return recargar();
      }
    } catch (e) { ui.error(e); }
    return null;
  }

  function formulario(orden, recargar) {
    const clave = 'oc:' + (orden.id || 'nueva-' + orden.tipo + (orden.pago_id ? '-' + orden.pago_id : ''));
    const previo = borrador.leer(clave);
    const d = Object.assign({ fecha: fmt.hoy(), tipo_pago: 'TRANSFERENCIA', condicion: 'DE CONTADO', descuento_pct: 0, items: [{}], imputacion: [], moneda: 'BOLÍVARES (Bs)', lugar_compra: App.estado.catalogos.institucion.lugar_compra }, orden, previo || {});
    const cat = App.estado.catalogos;
    const imp = [0, 1, 2].map((i) => (d.imputacion || [])[i] || {});
    const titulo = orden.id ? `${nombreTipo(d.tipo)} N° ${d.numero}` : `Nueva ${nombreTipo(d.tipo).toLowerCase()}`;
    const m = ui.modal({
      titulo, tamano: 'grande',
      cuerpo: `
        ${previo ? '<div class="alerta alerta-info mb-3">Se recuperó un borrador sin guardar.</div>' : ''}
        ${d.pago_id ? `<div class="alerta alerta-ok mb-3">Quedará vinculada al pago N° ${esc(d.pago_numero || '')}.</div>` : ''}
        <form id="form-oc" class="space-y-4" novalidate>
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div><label class="etiqueta" for="oc-fecha">Fecha</label><input id="oc-fecha" type="date" class="campo" value="${esc(d.fecha)}"></div>
            <div><label class="etiqueta" for="oc-req">N° de requisición</label><input id="oc-req" class="campo" maxlength="40" value="${esc(d.requisicion || '')}"></div>
            <div class="sm:col-span-2"><label class="etiqueta" for="oc-proc">Número de proceso</label><input id="oc-proc" class="campo" maxlength="60" value="${esc(d.numero_proceso || '')}" placeholder="AMBG-UC-CD-0000-${new Date().getFullYear()}"></div>
            <div class="sm:col-span-2"><label class="etiqueta" for="oc-ben">Proveedor o beneficiario</label><input id="oc-ben" class="campo" maxlength="200" value="${esc(d.beneficiario || '')}" placeholder="Buscar en el registro…"></div>
            <div><label class="etiqueta" for="oc-tipodoc">Tipo</label><select id="oc-tipodoc" class="campo">${ui.opciones(['J', 'G', 'V', 'E', 'P'], d.tipo_doc, '—')}</select></div>
            <div><label class="etiqueta" for="oc-doc">R.I.F. / C.I.</label><input id="oc-doc" class="campo" inputmode="numeric" value="${esc(d.documento || '')}"></div>
            <div class="sm:col-span-2"><label class="etiqueta" for="oc-unidad">Unidad solicitante</label>
              <input id="oc-unidad" class="campo" list="lista-unidades" value="${esc(d.unidad_solicitante || '')}"><datalist id="lista-unidades">${cat.unidades.map((u) => `<option value="${esc(u)}">`).join('')}</datalist></div>
            <div><label class="etiqueta" for="oc-tpago">Tipo de pago</label><input id="oc-tpago" class="campo" list="lista-tpago" value="${esc(d.tipo_pago)}"><datalist id="lista-tpago"><option value="TRANSFERENCIA"><option value="CHEQUE"><option value="EFECTIVO"></datalist></div>
            <div><label class="etiqueta" for="oc-cond">Condición</label><input id="oc-cond" class="campo" list="lista-cond" value="${esc(d.condicion)}"><datalist id="lista-cond"><option value="DE CONTADO"><option value="CRÉDITO"><option value="ANTICIPO"></datalist></div>
            <div><label class="etiqueta" for="oc-femi">Fecha de emisión</label><input id="oc-femi" type="date" class="campo" value="${esc(d.fecha_emision || d.fecha)}"></div>
            <div class="sm:col-span-3"><label class="etiqueta" for="oc-conc">Concepto</label><textarea id="oc-conc" class="campo" maxlength="1500">${esc(d.concepto || '')}</textarea></div>
          </div>
          <fieldset>
            <legend class="font-semibold mb-2">Desglose (máximo ${MAX_ITEMS} ítems)</legend>
            <div class="tabla-env"><table class="tabla"><thead><tr><th style="min-width:260px">Descripción del ítem</th><th style="width:90px">Cantidad</th><th style="width:140px">Precio unitario</th><th>Exento IVA</th><th class="num">Sub-total</th><th class="num">IVA</th><th class="num">Total</th><th></th></tr></thead>
              <tbody id="items"></tbody></table></div>
            <button type="button" class="btn btn-chico mt-2" id="add-item">${ico('plus')} Agregar ítem</button>
          </fieldset>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="lg:col-span-2 space-y-3">
              <div><label class="etiqueta" for="oc-obs">Observaciones</label><textarea id="oc-obs" class="campo" maxlength="600">${esc(d.observaciones || '')}</textarea></div>
              <details ${imp.some((l) => l.partida) ? 'open' : ''}><summary class="font-semibold cursor-pointer">Imputación presupuestaria</summary>
                <div class="flex flex-wrap gap-4 my-2">${['ORDINARIO', 'EXTRAORDINARIO', 'OTROS'].map((t) => `<label class="check"><input type="radio" name="oc-pres" value="${t}" ${d.presupuesto_tipo === t ? 'checked' : ''}><span>${t}</span></label>`).join('')}</div>
                <div class="tabla-env"><table class="tabla"><thead><tr><th>Programa</th><th></th><th>Sub-prog.</th><th>Proyecto</th><th>Obra/A.C.</th><th>Partida</th><th>Genérica</th><th>Específica</th><th>Monto</th></tr></thead><tbody>
                  ${imp.map((l, i) => `<tr>${['programa', 'programa2', 'subprograma', 'proyecto', 'obra', 'partida', 'generica', 'especifica', 'monto'].map((k) => `<td><input class="campo" data-imp="${i}" data-k="${k}" value="${esc(k === 'monto' && l[k] ? fmt.num(l[k]) : (l[k] || ''))}" aria-label="${k} línea ${i + 1}" style="min-width:${k === 'monto' ? 100 : 56}px"></td>`).join('')}</tr>`).join('')}
                </tbody></table></div>
              </details>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label class="etiqueta" for="oc-lugar">Lugar de compra</label><input id="oc-lugar" class="campo" value="${esc(d.lugar_compra || '')}"></div>
                <div><label class="etiqueta" for="oc-moneda">Tipo de moneda</label><input id="oc-moneda" class="campo" value="${esc(d.moneda || '')}"></div>
              </div>
            </div>
            <aside class="tarjeta p-4 h-fit" aria-live="polite">
              <div class="mb-2"><label class="etiqueta" for="oc-desc">Descuento (%)</label><input id="oc-desc" class="campo num" inputmode="decimal" value="${esc(d.descuento_pct || 0)}"></div>
              <div id="oc-totales"></div>
            </aside>
          </div>
        </form>`,
      pie: `<button class="btn" data-cerrar>Cerrar</button><button class="btn" id="oc-prev">${ico('eye')} Vista previa</button>
        <button class="btn" id="oc-guardar">${ico('save')} Guardar</button><button class="btn btn-prim" id="oc-pdf">${ico('file-check')} Guardar y generar PDF</button>`
    });
    const el = m.el;
    const items = (d.items && d.items.length ? d.items : [{}]).map((x) => Object.assign({}, x));

    function pintarItems() {
      $('#items', el).innerHTML = items.map((it, i) => `<tr>
        <td><input class="campo" data-it="${i}" data-k="descripcion" value="${esc(it.descripcion || '')}" maxlength="300" aria-label="Descripción ítem ${i + 1}"></td>
        <td><input class="campo num" data-it="${i}" data-k="cantidad" value="${esc(it.cantidad !== undefined ? fmt.num(it.cantidad, Number(it.cantidad) % 1 ? 2 : 0) : '1')}" inputmode="decimal" aria-label="Cantidad ítem ${i + 1}"></td>
        <td><input class="campo num" data-it="${i}" data-k="precio_unitario" value="${esc(it.precio_unitario !== undefined && it.precio_unitario !== '' ? fmt.num(fmt.aNumero(it.precio_unitario)) : '')}" inputmode="decimal" aria-label="Precio ítem ${i + 1}"></td>
        <td class="text-center"><input type="checkbox" data-it="${i}" data-k="exento" ${it.exento ? 'checked' : ''} aria-label="Exento de IVA ítem ${i + 1}"></td>
        <td class="num" data-sub="${i}"></td><td class="num" data-iva="${i}"></td><td class="num" data-tot="${i}"></td>
        <td><button type="button" class="btn btn-ico" data-quitar="${i}" aria-label="Quitar ítem ${i + 1}" ${items.length === 1 ? 'disabled' : ''}>${ico('trash-2')}</button></td></tr>`).join('');
      $$('[data-quitar]', el).forEach((b) => b.addEventListener('click', () => { leerItems(); items.splice(Number(b.dataset.quitar), 1); pintarItems(); totales(); }));
      ui.iconos();
    }
    function leerItems() {
      $$('[data-it]', el).forEach((c) => {
        const it = items[Number(c.dataset.it)];
        it[c.dataset.k] = c.type === 'checkbox' ? c.checked : (c.dataset.k === 'descripcion' ? c.value : fmt.aNumero(c.value));
      });
    }
    function leer() {
      leerItems();
      return {
        id: orden.id, tipo: d.tipo, pago_id: d.pago_id, pago_numero: d.pago_numero, numero: d.numero,
        fecha: $('#oc-fecha', el).value, requisicion: $('#oc-req', el).value, numero_proceso: $('#oc-proc', el).value,
        beneficiario: $('#oc-ben', el).value, tipo_doc: $('#oc-tipodoc', el).value, documento: $('#oc-doc', el).value,
        unidad_solicitante: $('#oc-unidad', el).value, tipo_pago: $('#oc-tpago', el).value, condicion: $('#oc-cond', el).value,
        fecha_emision: $('#oc-femi', el).value, concepto: $('#oc-conc', el).value, items: items.filter((it) => String(it.descripcion || '').trim() || it.precio_unitario),
        descuento_pct: fmt.aNumero($('#oc-desc', el).value) || 0, observaciones: $('#oc-obs', el).value,
        presupuesto_tipo: ($('input[name=oc-pres]:checked', el) || {}).value || '',
        imputacion: [0, 1, 2].map((i) => {
          const l = {};
          $$(`[data-imp="${i}"]`, el).forEach((c) => { l[c.dataset.k] = c.dataset.k === 'monto' ? fmt.aNumero(c.value) : c.value.trim(); });
          return l;
        }).filter((l) => Object.values(l).some((v) => v)),
        lugar_compra: $('#oc-lugar', el).value, moneda: $('#oc-moneda', el).value
      };
    }
    function totales() {
      const datos = leer();
      const k = calcular(items, cat.iva_pct, datos.descuento_pct);
      items.forEach((_, i) => {
        const f = k.filas[i];
        const set = (a, v) => { const c = $(`[data-${a}="${i}"]`, el); if (c) c.textContent = fmt.num(v); };
        set('sub', f.sub); set('iva', f.iva); set('tot', f.total);
      });
      const fila = (t, v, f) => `<div class="flex justify-between py-1 ${f ? 'font-semibold text-base' : ''}"><span>${t}</span><span class="num">${v}</span></div>`;
      $('#oc-totales', el).innerHTML = fila('Sub-total', fmt.bs(k.subtotal)) + fila(`IVA ${fmt.num(cat.iva_pct, 0)}%`, fmt.bs(k.iva)) + fila('Total exento', fmt.bs(k.exento)) +
        fila('Total general', fmt.bs(k.general)) + fila('Total final', fmt.bs(k.final), true);
      $('#add-item', el).disabled = items.length >= MAX_ITEMS;
      borrador.guardar(clave, datos);
    }
    pintarItems();
    totales();
    $('#form-oc', el).addEventListener('input', demorar(totales, 200));
    $('#form-oc', el).addEventListener('change', totales);
    $('#add-item', el).addEventListener('click', () => { leerItems(); if (items.length < MAX_ITEMS) items.push({ cantidad: 1 }); pintarItems(); totales(); });
    ui.autocompletarBeneficiario($('#oc-ben', el), (b) => {
      $('#oc-ben', el).value = b.nombre; $('#oc-tipodoc', el).value = b.tipo_doc; $('#oc-doc', el).value = b.documento; totales();
    });
    $('#oc-prev', el).addEventListener('click', async (ev) => {
      const btn = ev.currentTarget;
      ui.ocupado(btn, true);
      try {
        const v = await api('oc.vistaPrevia', leer());
        ui.documento({ titulo: 'Vista previa (sin guardar)', html: v.html, aviso: 'Vista previa: el número se asigna al guardar.' });
      } catch (e) { ui.error(e); } finally { ui.ocupado(btn, false); }
    });
    const guardar = async (ev, generar) => {
      const btn = ev.currentTarget;
      ui.ocupado(btn, true);
      try {
        const r = await api('oc.guardar', Object.assign(leer(), { generar_pdf: generar }), { escritura: true });
        borrador.borrar(clave);
        m.cerrar();
        ui.toast(`${nombreTipo(r.orden.tipo)} N° ${r.orden.numero} guardada${generar ? ' y PDF generado en Drive' : ''}.`, 'exito');
        if (recargar) recargar();
        ui.documento({
          titulo: `${nombreTipo(r.orden.tipo)} N° ${r.orden.numero}`, html: r.html, pdfUrl: r.pdf_url || r.orden.pdf_url,
          generarPdf: () => api('oc.pdf', { id: r.orden.id }, { escritura: true })
        });
      } catch (e) { ui.error(e); } finally { ui.ocupado(btn, false); }
    };
    $('#oc-guardar', el).addEventListener('click', (ev) => guardar(ev, false));
    $('#oc-pdf', el).addEventListener('click', (ev) => guardar(ev, true));
  }

  return { render };
})();

App.registrar({ id: 'ordenes', titulo: 'Compras y servicios', icono: 'clipboard-list', permiso: 'ver', render: Ordenes.render });
