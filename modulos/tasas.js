/**
 * Módulo: Tasa oficial BCV (consulta, sincronización, carga manual e histórico).
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes · v1.0.0-beta
 * © 2026 Soluciones AFFINITY.
 */
'use strict';

const Tasas = (() => {
  const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diaSemana = (iso) => { const [a, m, d] = iso.split('-').map(Number); return DIAS[new Date(a, m - 1, d).getDay()]; };
  const FUENTES = { RELLENO: 'Fin de semana / feriado', MANUAL: 'Carga manual', IMPORTACION: 'Histórico', MIGRACION: 'Sistema anterior', BCV_TODAY: 'API bcv.today', BCV_TODAY_CDN: 'bcv.today (espejo)', HISTORICO_API: 'Histórico bcv.today', DOLARAPI: 'API dolarapi', BCV_WEB: 'Web del BCV' };

  async function render(cont) {
    const r = await api('tasas.listar', { dias: 90 });
    const editar = App.puede('tasas.editar');
    const s = r.ultima_sincronizacion;
    cont.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 mb-3"><h1 class="titulo-pagina mr-auto">Tasa oficial BCV</h1>
        ${editar ? `<button class="btn" id="btn-hist-api">${ico('cloud-download')} Descargar histórico BCV</button><button class="btn" id="btn-hist">${ico('history')} Importar archivo</button><button class="btn" id="btn-manual">${ico('pencil')} Cargar tasa</button>
        <button class="btn btn-prim" id="btn-sync">${ico('refresh-cw')} Sincronizar ahora</button>` : ''}</div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div class="tarjeta p-4"><div class="kpi-etiqueta">Tasa aplicable hoy</div><div class="kpi-valor">${r.hoy ? fmt.num(r.hoy.tasa, 2) + ' Bs.' : '—'}</div>
          <div class="suave text-xs">${r.hoy ? (r.hoy.exacta ? 'Registrada para hoy' : `Última disponible: ${fmt.fecha(r.hoy.fecha)}`) : 'No hay tasas registradas'}</div></div>
        <div class="tarjeta p-4"><div class="kpi-etiqueta">Última sincronización automática</div>
          <div class="font-semibold mt-1">${s ? fmt.fechaHora(s.cuando) : 'Nunca'}</div>
          <div class="text-xs ${s && !s.ok ? '' : 'suave'}" style="${s && !s.ok ? 'color:var(--peligro)' : ''}">${s ? (s.ok ? `${esc(FUENTES[s.fuente] || s.fuente)} · fecha valor ${fmt.fecha(s.fecha)}` : esc(s.error)) : 'Se ejecuta a las 6:00 y 17:00'}</div></div>
        <div class="tarjeta p-4"><div class="kpi-etiqueta">Consultar una fecha</div>
          <div class="flex gap-2 mt-1"><input type="date" id="c-fecha" class="campo" aria-label="Fecha a consultar"><button class="btn" id="btn-consultar">Ver</button></div>
          <div id="c-res" class="text-sm mt-1"></div></div>
      </div>
      <p class="suave text-sm mb-3">Histórico: ${r.total} días (${fmt.fecha(r.desde)} – ${fmt.fecha(r.hasta)}). Los fines de semana y feriados toman la última tasa publicada, porque también hay pagos esos días.</p>
      <div class="tarjeta p-4 mb-3"><div style="height:240px"><canvas id="g-tasas" aria-label="Gráfico de la tasa BCV"></canvas></div></div>
      <div class="tarjeta tabla-env"><table class="tabla"><thead><tr><th>Fecha</th><th>Día</th><th class="num">Bs. por US$</th><th>Origen</th></tr></thead><tbody>
        ${r.tasas.map((t) => `<tr><td>${fmt.fecha(t.fecha)}</td><td>${diaSemana(t.fecha)}</td><td class="num font-medium">${fmt.num(t.tasa, 4)}</td>
          <td><span class="pill ${t.fuente === 'RELLENO' ? 'pill-neutro' : t.fuente === 'MANUAL' ? 'pill-aviso' : 'pill-info'}">${esc(FUENTES[t.fuente] || t.fuente)}</span></td></tr>`).join('')}
      </tbody></table></div>`;
    const orden = r.tasas.slice().reverse();
    App.grafico($('#g-tasas'), {
      type: 'line',
      data: { labels: orden.map((t) => fmt.fecha(t.fecha).slice(0, 5)), datasets: [{ label: 'Bs. por US$', data: orden.map((t) => t.tasa), borderColor: '#1f5f4a', backgroundColor: 'rgba(31,95,74,.12)', fill: true, tension: .2, pointRadius: 0 }] },
      options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: (v) => fmt.num(v, 0) } } } }
    });
    $('#btn-consultar').addEventListener('click', async () => {
      const f = $('#c-fecha').value;
      if (!f) return;
      try {
        const t = await api('tasas.consultar', { fecha: f });
        $('#c-res').innerHTML = t ? `<strong>${fmt.num(t.tasa, 4)} Bs.</strong> ${t.exacta ? '' : `<span class="suave">(de ${fmt.fecha(t.fecha)})</span>`}` : '<span class="suave">Sin tasa para esa fecha.</span>';
      } catch (e) { ui.error(e); }
    });
    if (!editar) return;
    $('#btn-sync').addEventListener('click', async (ev) => {
      const btn = ev.currentTarget;
      ui.ocupado(btn, true);
      try {
        const x = await api('tasas.sincronizar', {}, { escritura: true });
        ui.toast(`Tasa ${fmt.num(x.tasa, 4)} Bs. (fecha valor ${fmt.fecha(x.fecha)}) desde ${FUENTES[x.fuente] || x.fuente}. ${x.relleno.creadas} día(s) rellenados${x.recuperacion && x.recuperacion.recuperadas ? `, ${x.recuperacion.recuperadas} día(s) hábiles recuperados` : ''}, ${x.pagos_actualizados} registro(s) actualizados.`, 'exito', 8000);
        App.navegar();
      } catch (e) { ui.error(e); } finally { ui.ocupado(btn, false); }
    });
    $('#btn-hist-api').addEventListener('click', async (ev) => {
      const btn = ev.currentTarget;
      const ok = await ui.confirmar({ titulo: 'Descargar histórico de bcv.today', mensaje: 'Se agregan las fechas que falten (hasta 5 años) y se reemplazan los días rellenados. Las tasas cargadas a mano o importadas no se modifican.', textoBoton: 'Descargar' });
      if (!ok) return;
      ui.ocupado(btn, true);
      try {
        const x = await api('tasas.importarHistoricoApi', {}, { escritura: true });
        ui.toast(`Histórico ${fmt.fecha(x.desde)} – ${fmt.fecha(x.hasta)}: ${x.creadas} días nuevos, ${x.reemplazadas} reemplazados, ${x.relleno.creadas} rellenados.`, 'exito', 9000);
        App.navegar();
      } catch (e) { ui.error(e); } finally { ui.ocupado(btn, false); }
    });
    $('#btn-manual').addEventListener('click', () => {
      const m = ui.modal({
        titulo: 'Cargar tasa manualmente',
        cuerpo: `<p class="suave text-sm mb-3">Use esta opción si la sincronización falla. Reemplaza el valor de esa fecha y los días siguientes sin tasa propia.</p>
          <div class="grid grid-cols-2 gap-3"><div><label class="etiqueta" for="m-fecha">Fecha valor</label><input type="date" id="m-fecha" class="campo" value="${fmt.hoy()}"></div>
          <div><label class="etiqueta" for="m-tasa">Bs. por US$</label><input id="m-tasa" class="campo num" inputmode="decimal" placeholder="0,0000"></div></div>`,
        pie: '<button class="btn" data-cerrar>Cancelar</button><button class="btn btn-prim" id="m-ok">Guardar</button>'
      });
      $('#m-ok', m.el).addEventListener('click', async (ev) => {
        const btn = ev.currentTarget;
        ui.ocupado(btn, true);
        try {
          await api('tasas.guardarManual', { fecha: $('#m-fecha', m.el).value, tasa: $('#m-tasa', m.el).value }, { escritura: true });
          m.cerrar(); ui.toast('Tasa guardada.', 'exito'); App.navegar();
        } catch (e) { ui.error(e); } finally { ui.ocupado(btn, false); }
      });
    });
    $('#btn-hist').addEventListener('click', () => {
      const m = ui.modal({
        titulo: 'Importar histórico de tasas', tamano: 'mediano',
        cuerpo: `<p class="suave text-sm mb-2">Pegue líneas con fecha y monto (por ejemplo <code>9/11/2026 Bs897,54</code> o <code>09/11/2026;897,54</code>) o elija un archivo .csv/.txt. Las fechas que ya existen no se modifican salvo que marque la casilla.</p>
          <input type="file" id="h-archivo" accept=".csv,.txt" class="mb-2" aria-label="Archivo de tasas">
          <textarea id="h-texto" class="campo" style="min-height:220px;font-family:ui-monospace,monospace" aria-label="Tasas a importar"></textarea>
          <label class="check mt-2"><input type="checkbox" id="h-sobre"><span>Sobrescribir tasas existentes con estos valores</span></label>`,
        pie: '<button class="btn" data-cerrar>Cancelar</button><button class="btn btn-prim" id="h-ok">Importar</button>'
      });
      $('#h-archivo', m.el).addEventListener('change', (e) => { const f = e.target.files[0]; if (f) f.text().then((t) => { $('#h-texto', m.el).value = t; }); });
      $('#h-ok', m.el).addEventListener('click', async (ev) => {
        const btn = ev.currentTarget;
        ui.ocupado(btn, true);
        try {
          const x = await api('tasas.importarTexto', { texto: $('#h-texto', m.el).value, sobrescribir: $('#h-sobre', m.el).checked }, { escritura: true });
          m.cerrar();
          ui.toast(`Leídas ${x.leidas}: ${x.creadas} nuevas, ${x.actualizadas} actualizadas, ${x.relleno.creadas} días rellenados.${x.errores.length ? `\n${x.errores.length} línea(s) no se pudieron leer.` : ''}`, x.errores.length ? 'aviso' : 'exito', 9000);
          App.navegar();
        } catch (e) { ui.error(e); } finally { ui.ocupado(btn, false); }
      });
    });
  }
  return { render };
})();

App.registrar({ id: 'tasas', titulo: 'Tasa BCV', icono: 'trending-up', permiso: 'ver', render: Tasas.render });
