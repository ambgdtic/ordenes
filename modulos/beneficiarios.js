/**
 * Módulo: Registro de beneficiarios y proveedores.
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes · v1.0.0-beta
 * © 2026 Soluciones AFFINITY.
 */
'use strict';

const Beneficiarios = (() => {
  async function render(cont, p) {
    const filtros = { texto: p.texto || '', estado_cuenta: p.estado || '', pagina: 1, por_pagina: 50 };
    const editar = App.puede('beneficiarios.editar');
    cont.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 mb-3"><h1 class="titulo-pagina mr-auto">Beneficiarios y proveedores</h1>
        ${editar ? `<button class="btn btn-prim" id="btn-nuevo">${ico('user-plus')} Nuevo</button>` : ''}</div>
      <div class="tarjeta p-3 mb-3 flex flex-wrap gap-2">
        <input id="f-texto" class="campo flex-1 min-w-[220px]" placeholder="Buscar por nombre o cédula/RIF…" value="${esc(filtros.texto)}" aria-label="Buscar">
        <select id="f-estado" class="campo" style="width:auto" aria-label="Estado de la cuenta">${ui.opciones([{ valor: 'VALIDO', texto: 'Cuenta válida' }, { valor: 'PROBLEMA', texto: 'Sin cuenta o con error' }], filtros.estado_cuenta, 'Todos')}</select>
      </div>
      <div id="aviso"></div>
      <div class="tarjeta"><div id="tabla" class="tabla-env"></div><div id="pag"></div></div>`;
    const aplicar = () => { filtros.texto = $('#f-texto').value.trim(); filtros.estado_cuenta = $('#f-estado').value; filtros.pagina = 1; cargar(); };
    $('#f-texto').addEventListener('input', demorar(aplicar, 400));
    $('#f-estado').addEventListener('change', aplicar);
    if ($('#btn-nuevo')) $('#btn-nuevo').addEventListener('click', () => formulario({}, cargar));

    async function cargar() {
      const tabla = $('#tabla');
      tabla.innerHTML = '<div class="suave p-6">Cargando…</div>';
      try {
        const r = await api('beneficiarios.listar', filtros);
        $('#aviso').innerHTML = r.con_problemas && filtros.estado_cuenta !== 'PROBLEMA'
          ? `<div class="alerta alerta-aviso mb-3">${r.con_problemas} beneficiario(s) sin cuenta o con número inválido. <a href="#/beneficiarios?estado=PROBLEMA">Revisarlos</a>.</div>` : '';
        if (!r.registros.length) { tabla.innerHTML = '<div class="suave p-6">Sin resultados.</div>'; $('#pag').innerHTML = ''; return; }
        tabla.innerHTML = `<table class="tabla"><thead><tr><th>Documento</th><th>Nombre o razón social</th><th>Cuenta</th><th>Estado</th>${editar ? '<th></th>' : ''}</tr></thead><tbody>
          ${r.registros.map((b) => `<tr><td class="whitespace-nowrap">${esc(fmt.doc(b.tipo_doc, b.documento))}</td>
            <td><div class="font-medium">${esc(b.nombre)}</div>${b.alias ? `<div class="suave text-xs">También: ${esc(b.alias.split('|').join(' · '))}</div>` : ''}</td>
            <td class="whitespace-nowrap">${esc(b.cuenta || '—')}<div class="suave text-xs">${esc(b.banco || '')}</div></td>
            <td><span class="pill ${b.estado_cuenta === 'VÁLIDO' ? 'pill-ok' : 'pill-aviso'}">${esc(b.estado_cuenta)}</span></td>
            ${editar ? `<td class="text-right"><button class="btn btn-ico" data-id="${b.id}" aria-label="Editar ${esc(b.nombre)}">${ico('pencil')}</button></td>` : ''}</tr>`).join('')}
          </tbody></table>`;
        $('#pag').replaceChildren(ui.paginacion(r.total, r.pagina, r.por_pagina, (n) => { filtros.pagina = n; cargar(); }));
        $$('[data-id]', tabla).forEach((b) => b.addEventListener('click', () => formulario(r.registros.find((x) => x.id === b.dataset.id), cargar)));
        ui.iconos();
      } catch (e) { tabla.innerHTML = `<div class="alerta alerta-peligro m-3">${esc(e.message)}</div>`; }
    }
    cargar();
  }

  function formulario(b, recargar) {
    const m = ui.modal({
      titulo: b.id ? 'Editar beneficiario' : 'Nuevo beneficiario',
      cuerpo: `<form class="grid grid-cols-1 sm:grid-cols-4 gap-3" novalidate>
        <div><label class="etiqueta" for="b-tipo">Tipo</label><select id="b-tipo" class="campo">${ui.opciones(['V', 'E', 'J', 'G', 'P'], b.tipo_doc, '—')}</select></div>
        <div class="sm:col-span-3"><label class="etiqueta" for="b-doc">Cédula / RIF (solo números)</label><input id="b-doc" class="campo" inputmode="numeric" value="${esc(b.documento || '')}"></div>
        <div class="sm:col-span-4"><label class="etiqueta" for="b-nom">Nombre o razón social</label><input id="b-nom" class="campo" maxlength="200" value="${esc(b.nombre || '')}"></div>
        <div class="sm:col-span-4"><label class="etiqueta" for="b-cta">Cuenta bancaria</label><input id="b-cta" class="campo" inputmode="numeric" value="${esc(b.cuenta || '')}"><p class="ayuda" id="b-cta-ayuda"></p></div>
        <div class="sm:col-span-2"><label class="etiqueta" for="b-tel">Teléfono</label><input id="b-tel" class="campo" type="tel" value="${esc(b.telefono || '')}"></div>
        <div class="sm:col-span-2"><label class="etiqueta" for="b-mail">Correo</label><input id="b-mail" class="campo" type="email" value="${esc(b.correo || '')}"></div>
        <div class="sm:col-span-4"><label class="etiqueta" for="b-notas">Notas</label><textarea id="b-notas" class="campo" maxlength="500">${esc(b.notas || '')}</textarea></div>
        ${b.id ? `<label class="check sm:col-span-4"><input type="checkbox" id="b-activo" ${b.activo !== false ? 'checked' : ''}><span>Activo (desmarque para ocultarlo de las búsquedas; no se borra)</span></label>` : ''}
      </form>`,
      pie: '<button class="btn" data-cerrar>Cancelar</button><button class="btn btn-prim" id="b-guardar">Guardar</button>'
    });
    const el = m.el;
    const ok = ui.validarCuenta($('#b-cta', el), $('#b-cta-ayuda', el));
    $('#b-guardar', el).addEventListener('click', async (ev) => {
      const btn = ev.currentTarget;
      if (!ok()) return;
      ui.ocupado(btn, true);
      try {
        await api('beneficiarios.guardar', {
          id: b.id, tipo_doc: $('#b-tipo', el).value, documento: $('#b-doc', el).value, nombre: $('#b-nom', el).value,
          cuenta: $('#b-cta', el).value, telefono: $('#b-tel', el).value, correo: $('#b-mail', el).value, notas: $('#b-notas', el).value,
          activo: $('#b-activo', el) ? $('#b-activo', el).checked : true
        }, { escritura: true });
        m.cerrar();
        ui.toast('Beneficiario guardado.', 'exito');
        recargar();
      } catch (e) { ui.error(e); } finally { ui.ocupado(btn, false); }
    });
  }

  return { render };
})();

App.registrar({ id: 'beneficiarios', titulo: 'Beneficiarios', icono: 'users', permiso: 'ver', render: Beneficiarios.render });
