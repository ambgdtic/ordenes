/**
 * Módulo: Panel de indicadores del mes.
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes · v1.0.0-beta
 * © 2026 Soluciones AFFINITY.
 */
'use strict';

App.registrar({
  id: 'panel',
  titulo: 'Panel',
  icono: 'layout-dashboard',
  permiso: 'ver',
  async render(cont, p) {
    const hoy = new Date();
    const anio = Number(p.anio) || hoy.getFullYear();
    const mes = Number(p.mes) || hoy.getMonth() + 1;
    const d = await api('panel.resumen', { anio, mes });
    const k = d.kpis;
    const tarjeta = (etiqueta, valor, extra, enlace, icono) => `
      <${enlace ? `a href="${enlace}"` : 'div'} class="tarjeta p-4 block" style="text-decoration:none;color:inherit">
        <div class="flex items-center justify-between"><span class="kpi-etiqueta">${etiqueta}</span>${ico(icono, 'w-4 h-4 suave')}</div>
        <div class="kpi-valor mt-1">${valor}</div><div class="suave text-xs mt-1">${extra || '&nbsp;'}</div>
      </${enlace ? 'a' : 'div'}>`;
    const avisos = [];
    if (k.por_completar) avisos.push(`<a href="#/pagos?estado_datos=POR_COMPLETAR&anio=${anio}&mes=${mes}">${k.por_completar} pago(s) por completar</a> antes de poder emitir su Orden de Pago.`);
    if (k.sin_tasa) avisos.push(`${k.sin_tasa} pago(s) sin tasa BCV. <a href="#/tasas">Revise las tasas</a>.`);
    if (d.beneficiarios_con_problemas) avisos.push(`<a href="#/beneficiarios?estado=PROBLEMA">${d.beneficiarios_con_problemas} beneficiario(s)</a> con cuenta faltante o inválida.`);
    if (!d.tasa_hoy || !d.tasa_hoy.exacta) avisos.push('La tasa BCV de hoy aún no está registrada; se usa la última disponible.');

    cont.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <h1 class="titulo-pagina mr-auto">Resumen de ${esc(d.periodo.nombre)}</h1>
        ${ui.selectorPeriodo(anio, mes, false)}
      </div>
      ${avisos.length ? `<div class="alerta alerta-aviso mb-4"><ul class="list-disc pl-5 space-y-1">${avisos.map((a) => `<li>${a}</li>`).join('')}</ul></div>` : ''}
      <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4" aria-label="Indicadores">
        ${tarjeta('Pagado en el mes', fmt.bs(k.total_bs), fmt.usd(k.total_usd) + ' a tasa BCV de cada día', `#/pagos?anio=${anio}&mes=${mes}`, 'banknote')}
        ${tarjeta('Pagos registrados', fmt.num(k.cantidad, 0), `${k.anuladas} anulado(s)`, `#/pagos?anio=${anio}&mes=${mes}`, 'receipt')}
        ${tarjeta('Órdenes de Pago pendientes', fmt.num(k.op_pendientes, 0), `${k.op_generadas} generada(s) · ${k.por_completar} por completar`, `#/pagos?anio=${anio}&mes=${mes}&op=PENDIENTE`, 'file-clock')}
        ${tarjeta('Tasa BCV hoy', d.tasa_hoy ? fmt.num(d.tasa_hoy.tasa, 2) + ' Bs.' : '—', d.variacion_semana !== null ? `${d.variacion_semana >= 0 ? '+' : ''}${fmt.num(d.variacion_semana, 2)}% en 7 días` : '', '#/tasas', 'trending-up')}
      </section>
      <section class="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-4">
        <div class="tarjeta p-4 lg:col-span-3"><h2 class="font-semibold mb-3">Pagos por categoría (US$)</h2><div style="height:${Math.max(220, d.por_categoria.length * 30)}px"><canvas id="g-cat" aria-label="Gráfico de pagos por categoría"></canvas></div></div>
        <div class="tarjeta p-4 lg:col-span-2"><h2 class="font-semibold mb-3">Tasa BCV últimos 30 días</h2><div style="height:240px"><canvas id="g-tasa" aria-label="Gráfico de la tasa BCV"></canvas></div></div>
      </section>
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div class="tarjeta lg:col-span-2"><div class="flex items-center p-4 pb-2"><h2 class="font-semibold">Últimos pagos</h2><a class="ml-auto text-sm" href="#/pagos">Ver todos</a></div>
          <div class="tabla-env"><table class="tabla"><thead><tr><th>N°</th><th>Fecha</th><th>Beneficiario</th><th class="num">Monto</th><th>Estado</th></tr></thead><tbody>
          ${d.ultimos.map((x) => `<tr><td>${x.numero}</td><td>${fmt.fecha(x.fecha)}</td><td>${esc(x.beneficiario || '—')}</td><td class="num">${fmt.bs(x.monto)}</td>
            <td>${x.estado_datos === 'POR_COMPLETAR' ? '<span class="pill pill-aviso">Por completar</span>' : x.op_generada ? '<span class="pill pill-ok">OP generada</span>' : '<span class="pill pill-neutro">OP pendiente</span>'}</td></tr>`).join('') || '<tr><td colspan="5" class="suave">Sin pagos en el mes.</td></tr>'}
          </tbody></table></div></div>
        <div class="tarjeta p-4"><h2 class="font-semibold mb-3">Compras y servicios del mes</h2>
          <dl class="grid grid-cols-2 gap-3 text-sm">
            <div><dt class="suave">Órdenes de compra</dt><dd class="kpi-valor">${k.ordenes_compra}</dd></div>
            <div><dt class="suave">Órdenes de servicio</dt><dd class="kpi-valor">${k.ordenes_servicio}</dd></div>
            <div class="col-span-2"><dt class="suave">Monto comprometido</dt><dd class="font-semibold">${fmt.bs(k.ordenes_total)}</dd></div>
          </dl>
          ${App.puede('oc.editar') ? '<a class="btn btn-prim w-full mt-4" href="#/ordenes">Ir a órdenes</a>' : ''}
        </div>
      </section>`;

    const recargar = () => { location.hash = `#/panel?anio=${$('#f-anio').value}&mes=${$('#f-mes').value}`; };
    $('#f-anio').addEventListener('change', recargar);
    $('#f-mes').addEventListener('change', recargar);

    if (d.por_categoria.length) {
      App.grafico($('#g-cat'), {
        type: 'bar',
        data: { labels: d.por_categoria.map((c) => c.categoria), datasets: [{ label: 'US$', data: d.por_categoria.map((c) => c.monto_usd), backgroundColor: d.por_categoria.map((c) => c.color), borderColor: '#64748b', borderWidth: 1 }] },
        options: { indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${fmt.usd(c.raw)} · ${fmt.bs(d.por_categoria[c.dataIndex].monto)} · ${d.por_categoria[c.dataIndex].cantidad} pago(s)` } } },
          scales: { x: { ticks: { callback: (v) => fmt.num(v, 0) } } } }
      });
    } else {
      $('#g-cat').replaceWith(Object.assign(document.createElement('p'), { className: 'suave text-sm', textContent: 'Sin pagos en el período.' }));
    }
    App.grafico($('#g-tasa'), {
      type: 'line',
      data: { labels: d.tasas.map((t) => fmt.fecha(t.fecha).slice(0, 5)), datasets: [{ label: 'Bs. por US$', data: d.tasas.map((t) => t.tasa), borderColor: '#1f5f4a', backgroundColor: 'rgba(31,95,74,.12)', fill: true, tension: 0.25, pointRadius: 0 }] },
      options: { maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${fmt.num(c.raw, 2)} Bs.` } } }, scales: { y: { ticks: { callback: (v) => fmt.num(v, 0) } } } }
    });
  }
});
