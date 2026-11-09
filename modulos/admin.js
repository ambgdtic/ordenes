/**
 * Módulo: Administración (estado, configuración, usuarios, auditoría y migración).
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes · v1.0.0-beta
 * © 2026 Soluciones AFFINITY.
 */
'use strict';

const Admin = (() => {
  const ROLES = { ADMIN: 'Administrador', TESORERIA: 'Tesorería', COMPRAS: 'Compras', CONSULTA: 'Consulta' };
  const PESTANAS = [['sistema', 'Sistema'], ['config', 'Configuración'], ['usuarios', 'Usuarios'], ['auditoria', 'Auditoría'], ['migracion', 'Migración']];

  async function render(cont, p) {
    const actual = PESTANAS.some(([k]) => k === p.tab) ? p.tab : 'sistema';
    cont.innerHTML = `<h1 class="titulo-pagina mb-3">Administración</h1>
      <div class="pestanas mb-4" role="tablist">${PESTANAS.map(([k, t]) => `<a class="pestana" role="tab" aria-selected="${k === actual}" href="#/admin?tab=${k}" style="text-decoration:none">${t}</a>`).join('')}</div>
      <div id="panel-admin"></div>`;
    const panel = $('#panel-admin');
    await ({ sistema, config: configuracion, usuarios, auditoria, migracion })[actual](panel);
    ui.iconos();
  }

  async function sistema(panel) {
    const e = await api('admin.estado');
    const sync = e.ultima_sincronizacion_tasa;
    panel.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="tarjeta p-4 space-y-2">
          <h2 class="font-semibold">Recursos</h2>
          <p><a href="${esc(e.base_datos_url)}" target="_blank" rel="noopener">${ico('sheet', 'inline w-4 h-4')} Base de datos (Google Sheets)</a></p>
          <p><a href="${esc(e.carpeta_url)}" target="_blank" rel="noopener">${ico('folder', 'inline w-4 h-4')} Carpeta de documentos (Drive)</a></p>
          <p class="text-sm">Versión <strong>${esc(e.version)}</strong> · ID de cliente Google: ${e.client_id_configurado ? '<span class="pill pill-ok">configurado</span>' : '<span class="pill pill-peligro">falta</span>'}</p>
          <p class="text-sm">Disparadores: ${e.disparadores.length ? e.disparadores.map((d) => `<span class="pill pill-neutro">${esc(d)}</span>`).join(' ') : '<span class="pill pill-peligro">ninguno</span>'}</p>
        </div>
        <div class="tarjeta p-4 space-y-2">
          <h2 class="font-semibold">Mantenimiento</h2>
          <p class="text-sm">Última tasa BCV: ${sync ? `${fmt.fechaHora(sync.cuando)} · ${sync.ok ? '<span class="pill pill-ok">correcta</span>' : `<span class="pill pill-peligro">error</span> ${esc(sync.error)}`}` : 'sin registro'}</p>
          <p class="text-sm">Último respaldo: ${e.ultimo_respaldo ? `<a href="${esc(e.ultimo_respaldo.url)}" target="_blank" rel="noopener">${fmt.fechaHora(e.ultimo_respaldo.cuando)}</a>` : 'ninguno'}</p>
          <button class="btn" id="btn-respaldo">${ico('database-backup')} Respaldar ahora</button>
          <p class="suave text-xs">El respaldo diario se crea a las 23:00 en la carpeta "Respaldos". Guarde periódicamente una copia fuera de esta cuenta.</p>
        </div>
        <div class="tarjeta p-4 md:col-span-2"><h2 class="font-semibold mb-2">Registros por tabla</h2>
          <div class="flex flex-wrap gap-2">${Object.keys(e.conteos).map((k) => `<span class="pill pill-info">${esc(k)}: ${fmt.num(e.conteos[k], 0)}</span>`).join('')}</div>
          <p class="text-sm mt-3">Próximos números: OP <strong>${e.correlativos.op}</strong> · OC <strong>${e.correlativos.oc}</strong> · OS <strong>${e.correlativos.os}</strong></p></div>
      </div>`;
    $('#btn-respaldo').addEventListener('click', async (ev) => {
      const btn = ev.currentTarget;
      ui.ocupado(btn, true);
      try { await api('admin.respaldar', {}, { escritura: true }); ui.toast('Respaldo creado en Drive.', 'exito'); App.navegar(); } catch (x) { ui.error(x); } finally { ui.ocupado(btn, false); }
    });
  }

  /* ---------- Configuración ---------- */
  async function configuracion(panel) {
    const lista = await api('admin.config');
    const valor = (k) => (lista.find((c) => c.clave === k) || {}).valor;
    const seccion = (clave, titulo, cuerpo, ayuda) => `<form class="tarjeta p-4" data-clave="${clave}" novalidate>
      <h2 class="font-semibold mb-1">${titulo}</h2>${ayuda ? `<p class="suave text-sm mb-3">${ayuda}</p>` : '<div class="mb-2"></div>'}${cuerpo}
      <div class="mt-3 text-right"><button class="btn btn-prim btn-chico" type="submit">Guardar</button></div></form>`;
    const inst = valor('institucion');
    const deb = valor('cuenta_debito');
    const cor = valor('correlativos');
    const campo = (id, et, v, extra = '') => `<div><label class="etiqueta" for="${id}">${et}</label><input id="${id}" class="campo" value="${esc(v === null || v === undefined ? '' : v)}" ${extra}></div>`;
    panel.innerHTML = `<div class="alerta alerta-info mb-3">Los porcentajes de retención, la alícuota de IVA y los firmantes dependen de normas y decisiones de Administración, Hacienda y Despacho: valide cada cambio con el área responsable.</div>
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-3">
      ${seccion('correlativos', 'Próximos números', `<div class="grid grid-cols-3 gap-3">${campo('cor-op', 'Orden de pago', cor.op, 'inputmode="numeric"')}${campo('cor-oc', 'Orden de compra', cor.oc, 'inputmode="numeric"')}${campo('cor-os', 'Orden de servicio', cor.os, 'inputmode="numeric"')}</div>`, 'No pueden ser menores o iguales al último número ya usado.')}
      ${seccion('cuenta_debito', 'Cuenta de débito de la Alcaldía', `<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">${campo('deb-tipo', 'Tipo de pago', deb.tipo_pago)}${campo('deb-banco', 'Banco', deb.banco)}${campo('deb-num', 'Número de cuenta', deb.numero, 'inputmode="numeric"')}</div>`)}
      ${seccion('firmas_op', 'Firmantes de la Orden de Pago', valor('firmas_op').map((f, i) => `<div class="grid grid-cols-2 gap-2 mb-2">${campo(`fop-c${i}`, `Cargo ${i + 1}`, f.cargo)}${campo(`fop-n${i}`, 'Nombre', f.nombre)}</div>`).join(''))}
      ${seccion('firmas_oc', 'Casillas de firma de Orden de Compra/Servicio', `<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">${valor('firmas_oc').map((f, i) => campo(`foc-${i}`, `Casilla ${i + 1}`, f)).join('')}</div>`)}
      ${seccion('retenciones', 'Retenciones fiscales', `<div class="tabla-env"><table class="tabla"><thead><tr><th>Nombre en la orden</th><th>%</th><th>Se calcula sobre</th></tr></thead><tbody>
        ${valor('retenciones').map((r, i) => `<tr><td><input class="campo" id="ret-n${i}" value="${esc(r.nombre)}" aria-label="Nombre retención ${i + 1}"></td>
          <td>${r.fila_titulo ? '—' : `<input class="campo num" id="ret-p${i}" value="${esc(fmt.num(r.porcentaje, r.porcentaje % 1 ? 2 : 0))}" style="width:80px" aria-label="Porcentaje ${esc(r.nombre)}">`}</td>
          <td>${r.fila_titulo ? '—' : `<select class="campo" id="ret-b${i}" aria-label="Base ${esc(r.nombre)}">${ui.opciones([{ valor: 'BASE', texto: 'Base imponible' }, { valor: 'IVA', texto: 'IVA' }, { valor: 'TOTAL', texto: 'Total con IVA' }], r.base)}</select>`}</td></tr>`).join('')}
        </tbody></table></div>`, 'El orden de las filas es el de la plantilla impresa.')}
      ${seccion('iva_pct', 'IVA', `<div class="w-40">${campo('iva', 'Alícuota (%)', valor('iva_pct'), 'inputmode="decimal"')}</div>`)}
      ${seccion('categorias', 'Categorías de pago', `<div id="cats" class="space-y-2">${valor('categorias').map((c, i) => `<div class="flex gap-2"><input type="color" id="cat-c${i}" value="${esc(c.color)}" aria-label="Color" style="width:44px;height:36px"><input class="campo" id="cat-n${i}" value="${esc(c.nombre)}" aria-label="Categoría ${i + 1}"></div>`).join('')}</div>
        <button type="button" class="btn btn-chico mt-2" id="cat-mas">${ico('plus')} Agregar</button>`, 'No se pueden eliminar categorías que ya tienen pagos.')}
      ${seccion('unidades', 'Unidades solicitantes', `<textarea id="unidades" class="campo" style="min-height:160px" aria-label="Unidades, una por línea">${esc(valor('unidades').join('\n'))}</textarea>`, 'Una por línea.')}
      ${seccion('institucion', 'Datos del membrete', `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${['pais', 'estado', 'nombre', 'rif', 'ciudad', 'lugar_compra', 'pie', 'telefono'].map((k) => campo(`inst-${k}`, k.replace('_', ' '), inst[k])).join('')}</div>`)}
      ${seccion('beneficiario_nomina', 'Nombre para movimientos de nómina', campo('nomina', 'Beneficiario', valor('beneficiario_nomina')))}
      ${seccion('tolerancia_diferencia', 'Tolerancia de diferencia en la OP', `<div class="w-40">${campo('tol', 'Bs.', valor('tolerancia_diferencia'), 'inputmode="decimal"')}</div>`, 'Diferencia aceptada entre lo pagado y el neto calculado antes de mostrar aviso.')}
      </div>`;
    let nCats = valor('categorias').length;
    $('#cat-mas').addEventListener('click', () => {
      $('#cats').insertAdjacentHTML('beforeend', `<div class="flex gap-2"><input type="color" id="cat-c${nCats}" value="#e2e8f0" aria-label="Color" style="width:44px;height:36px"><input class="campo" id="cat-n${nCats}" aria-label="Categoría nueva"></div>`);
      nCats++;
    });
    const lectores = {
      correlativos: () => ({ op: Number($('#cor-op').value), oc: Number($('#cor-oc').value), os: Number($('#cor-os').value) }),
      cuenta_debito: () => ({ tipo_pago: $('#deb-tipo').value, banco: $('#deb-banco').value, numero: $('#deb-num').value }),
      firmas_op: () => [0, 1, 2, 3].map((i) => ({ cargo: $(`#fop-c${i}`).value, nombre: $(`#fop-n${i}`).value })),
      firmas_oc: () => [0, 1, 2, 3, 4, 5].map((i) => $(`#foc-${i}`).value),
      retenciones: () => valor('retenciones').map((r, i) => Object.assign({}, r, { nombre: $(`#ret-n${i}`).value, porcentaje: r.fila_titulo ? null : fmt.aNumero($(`#ret-p${i}`).value), base: r.fila_titulo ? r.base : $(`#ret-b${i}`).value })),
      iva_pct: () => fmt.aNumero($('#iva').value),
      categorias: () => Array.from({ length: nCats }, (_, i) => ({ nombre: ($(`#cat-n${i}`) || {}).value || '', color: ($(`#cat-c${i}`) || {}).value })).filter((c) => c.nombre.trim()),
      unidades: () => $('#unidades').value.split('\n').map((x) => x.trim()).filter(Boolean),
      institucion: () => { const o = {}; ['pais', 'estado', 'nombre', 'rif', 'ciudad', 'lugar_compra', 'pie', 'telefono'].forEach((k) => { o[k] = $(`#inst-${k}`).value; }); return o; },
      beneficiario_nomina: () => $('#nomina').value,
      tolerancia_diferencia: () => fmt.aNumero($('#tol').value)
    };
    $$('form[data-clave]', panel).forEach((f) => f.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const btn = $('button[type=submit]', f);
      ui.ocupado(btn, true);
      try {
        await api('admin.guardarConfig', { clave: f.dataset.clave, valor: lectores[f.dataset.clave]() }, { escritura: true });
        ui.toast('Configuración guardada. Los usuarios la verán al recargar.', 'exito');
      } catch (e) { ui.error(e); } finally { ui.ocupado(btn, false); }
    }));
  }

  /* ---------- Usuarios ---------- */
  async function usuarios(panel) {
    const lista = await api('admin.usuarios');
    panel.innerHTML = `<div class="flex mb-3"><p class="suave text-sm mr-auto">Solo las cuentas registradas aquí pueden entrar. Los usuarios no se borran: se desactivan.</p>
      <button class="btn btn-prim" id="u-nuevo">${ico('user-plus')} Nuevo usuario</button></div>
      <div class="tarjeta tabla-env"><table class="tabla"><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Dirección</th><th>Último acceso</th><th>Estado</th><th></th></tr></thead><tbody>
      ${lista.map((u) => `<tr><td class="font-medium">${esc(u.nombre)}</td><td>${esc(u.email)}</td><td>${esc(u.rol_nombre)}</td><td class="text-xs">${esc(u.direccion)}</td>
        <td class="text-xs">${fmt.fechaHora(u.ultimo_acceso) || '—'}</td><td>${u.activo ? '<span class="pill pill-ok">Activo</span>' : '<span class="pill pill-neutro">Inactivo</span>'}</td>
        <td><button class="btn btn-ico" data-id="${u.id}" aria-label="Editar ${esc(u.nombre)}">${ico('pencil')}</button></td></tr>`).join('')}
      </tbody></table></div>
      <div class="tarjeta p-4 mt-3 text-sm"><h2 class="font-semibold mb-1">Qué puede hacer cada rol</h2><ul class="list-disc pl-5 space-y-1">
        <li><strong>Administrador:</strong> todo, incluida configuración, usuarios, reactivar órdenes y corregir fecha/monto de pagos.</li>
        <li><strong>Tesorería:</strong> importar conciliaciones, completar pagos, generar y anular órdenes de pago, beneficiarios y tasas.</li>
        <li><strong>Compras:</strong> crear, editar y anular órdenes de compra y servicio; beneficiarios.</li>
        <li><strong>Consulta:</strong> ver e imprimir.</li></ul></div>`;
    const abrir = (u) => {
      const m = ui.modal({
        titulo: u.id ? 'Editar usuario' : 'Nuevo usuario',
        cuerpo: `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="sm:col-span-2"><label class="etiqueta" for="u-email">Correo de Google</label><input id="u-email" type="email" class="campo" value="${esc(u.email || '')}"></div>
          <div><label class="etiqueta" for="u-nombre">Nombre</label><input id="u-nombre" class="campo" value="${esc(u.nombre || '')}"></div>
          <div><label class="etiqueta" for="u-rol">Rol</label><select id="u-rol" class="campo">${ui.opciones(Object.keys(ROLES).map((k) => ({ valor: k, texto: ROLES[k] })), u.rol || 'CONSULTA')}</select></div>
          <div class="sm:col-span-2"><label class="etiqueta" for="u-dir">Dirección</label><input id="u-dir" class="campo" list="dirs" value="${esc(u.direccion || '')}"><datalist id="dirs">${App.estado.catalogos.unidades.map((x) => `<option value="${esc(x)}">`).join('')}</datalist></div>
          <label class="check sm:col-span-2"><input type="checkbox" id="u-activo" ${u.activo !== false ? 'checked' : ''}><span>Activo</span></label></div>`,
        pie: '<button class="btn" data-cerrar>Cancelar</button><button class="btn btn-prim" id="u-ok">Guardar</button>'
      });
      $('#u-ok', m.el).addEventListener('click', async (ev) => {
        const btn = ev.currentTarget;
        ui.ocupado(btn, true);
        try {
          await api('admin.guardarUsuario', { id: u.id, email: $('#u-email', m.el).value, nombre: $('#u-nombre', m.el).value, rol: $('#u-rol', m.el).value, direccion: $('#u-dir', m.el).value, activo: $('#u-activo', m.el).checked }, { escritura: true });
          m.cerrar(); ui.toast('Usuario guardado.', 'exito'); App.navegar();
        } catch (e) { ui.error(e); } finally { ui.ocupado(btn, false); }
      });
    };
    $('#u-nuevo').addEventListener('click', () => abrir({}));
    $$('[data-id]', panel).forEach((b) => b.addEventListener('click', () => abrir(lista.find((u) => u.id === b.dataset.id))));
  }

  /* ---------- Auditoría ---------- */
  async function auditoria(panel) {
    const f = { texto: '', modulo: '', pagina: 1 };
    panel.innerHTML = `<div class="tarjeta p-3 mb-3 flex flex-wrap gap-2">
        <select id="a-mod" class="campo" style="width:auto" aria-label="Módulo">${ui.opciones(['PAGOS', 'ORDEN_PAGO', 'ORDEN_COMPRA', 'CONCILIACION', 'BENEFICIARIOS', 'TASAS', 'ADMIN', 'SISTEMA'], '', 'Todos los módulos')}</select>
        <input id="a-txt" class="campo flex-1 min-w-[200px]" placeholder="Buscar usuario, acción, número…" aria-label="Buscar en auditoría"></div>
      <div class="tarjeta"><div id="a-tabla" class="tabla-env"></div><div id="a-pag"></div></div>`;
    const cargar = async () => {
      const r = await api('admin.auditoria', f);
      $('#a-tabla').innerHTML = `<table class="tabla"><thead><tr><th>Fecha y hora</th><th>Usuario</th><th>Módulo</th><th>Acción</th><th>Detalle</th></tr></thead><tbody>
        ${r.registros.map((a) => `<tr><td class="whitespace-nowrap">${fmt.fechaHora(a.fecha_hora)}</td><td class="text-xs">${esc(a.usuario)}</td><td>${esc(a.modulo)}</td><td>${esc(a.accion)}</td>
          <td><details><summary class="cursor-pointer text-xs suave">ver</summary><pre class="text-xs whitespace-pre-wrap" style="max-width:520px">${esc(JSON.stringify(a.detalle, null, 1))}</pre></details></td></tr>`).join('') || '<tr><td colspan="5" class="suave">Sin registros.</td></tr>'}</tbody></table>`;
      $('#a-pag').replaceChildren(ui.paginacion(r.total, r.pagina, r.por_pagina, (n) => { f.pagina = n; cargar().catch(ui.error); }));
      ui.iconos();
    };
    $('#a-mod').addEventListener('change', () => { f.modulo = $('#a-mod').value; f.pagina = 1; cargar().catch(ui.error); });
    $('#a-txt').addEventListener('input', demorar(() => { f.texto = $('#a-txt').value; f.pagina = 1; cargar().catch(ui.error); }, 400));
    await cargar();
  }

  /* ---------- Migración ---------- */
  function migracion(panel) {
    panel.innerHTML = `<div class="tarjeta p-5 max-w-3xl">
      <h2 class="font-semibold mb-1">Traer datos de la hoja de cálculo anterior</h2>
      <p class="suave text-sm mb-3">Lee las pestañas <code>Pagos_*</code>, la de beneficiarios (encabezado "Nombre o Razón Social") y <code>Tasa_BCV</code>. La hoja anterior no se modifica.
        Puede ejecutarse varias veces: solo agrega lo que falta (por número de orden, documento o fecha). Primero use "Simular".</p>
      <label class="etiqueta" for="m-id">Enlace o ID de la hoja anterior</label>
      <input id="m-id" class="campo mb-3" placeholder="https://docs.google.com/spreadsheets/d/…/edit">
      <div class="flex gap-2"><button class="btn" id="m-sim">${ico('flask-conical')} Simular</button><button class="btn btn-prim" id="m-run" disabled>${ico('import')} Migrar</button></div>
      <div id="m-res" class="mt-4"></div></div>`;
    const mostrar = (r) => {
      $('#m-res').innerHTML = `<div class="alerta ${r.simulacion ? 'alerta-info' : 'alerta-ok'}"><strong>${r.simulacion ? 'Simulación' : 'Migración completada'}</strong>
        <ul class="list-disc pl-5 mt-1"><li>Pestañas leídas: ${esc(r.hojas_leidas.join(', ') || 'ninguna')}</li>
        <li>Pagos encontrados: ${r.pagos_encontrados} · nuevos: <strong>${r.pagos_nuevos}</strong></li>
        <li>Beneficiarios nuevos: <strong>${r.beneficiarios_nuevos}</strong></li>
        <li>Tasas encontradas: ${r.tasas_encontradas} · nuevas: <strong>${r.tasas_nuevas}</strong></li>
        ${r.proximo_numero_op ? `<li>Próximo número de OP: <strong>${r.proximo_numero_op}</strong></li>` : ''}</ul></div>`;
    };
    $('#m-sim').addEventListener('click', async (ev) => {
      const btn = ev.currentTarget;
      ui.ocupado(btn, true);
      try { const r = await api('admin.migrar', { spreadsheet_id: $('#m-id').value, simular: true }); mostrar(r); $('#m-run').disabled = false; } catch (e) { ui.error(e); } finally { ui.ocupado(btn, false); }
    });
    $('#m-run').addEventListener('click', async (ev) => {
      const btn = ev.currentTarget;
      const ok = await ui.confirmar({ titulo: 'Confirmar migración', mensaje: 'Se agregarán al sistema los registros indicados en la simulación.', textoBoton: 'Migrar' });
      if (!ok) return;
      ui.ocupado(btn, true);
      try { mostrar(await api('admin.migrar', { spreadsheet_id: $('#m-id').value }, { escritura: true })); } catch (e) { ui.error(e); } finally { ui.ocupado(btn, false); }
    });
  }

  return { render };
})();

App.registrar({ id: 'admin', titulo: 'Administración', icono: 'settings', permiso: 'admin', render: Admin.render });
