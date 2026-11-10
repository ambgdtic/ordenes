/**
 * Módulo: Actualizador. Descarga el código publicado en GitHub, reemplaza el proyecto
 * (conserva este archivo y DatosLocales) y publica una versión nueva en la misma URL /exec.
 * Requiere: activar "API de Google Apps Script" en https://script.google.com/home/usersettings,
 * vincular el script a un proyecto estándar de Google Cloud y habilitar allí "Apps Script API".
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.2-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

const ORIGEN_CODIGO = 'https://raw.githubusercontent.com/ambgdtic/ordenes/main/apps-script/';
// Se conservan los archivos cuyo nombre contenga estas palabras (p. ej. "99_DatosLocales").
const ARCHIVOS_PROPIOS = /Actualizador|DatosLocales/i;

/** Ejecute esta función para instalar o actualizar el sistema desde GitHub. */
function actualizarDesdeGitHub() {
  const codigo = descargarDeGitHub('Codigo.gs');
  const manifiesto = descargarDeGitHub('appsscript.json');
  JSON.parse(manifiesto);
  const actual = llamarApiScript('/content');
  const conservar = (actual.files || []).filter((f) => f.type === 'SERVER_JS' && ARCHIVOS_PROPIOS.test(f.name));
  const archivos = conservar.concat([
    { name: 'Codigo', type: 'SERVER_JS', source: codigo },
    { name: 'appsscript', type: 'JSON', source: manifiesto }
  ]);
  llamarApiScript('/content', 'put', { files: archivos });
  const version = llamarApiScript('/versions', 'post', { description: 'Actualización ' + new Date().toISOString() });
  const url = publicarVersion(version.versionNumber);
  const mensaje = '✅ Código actualizado (versión ' + version.versionNumber + '). Archivos: ' +
    archivos.map((f) => f.name).join(', ') + '\nURL de la API: ' + url;
  console.log(mensaje);
  return mensaje;
}

function llamarApiScript(ruta, metodo, cuerpo) {
  const opciones = {
    method: metodo || 'get',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true
  };
  if (cuerpo) {
    opciones.contentType = 'application/json';
    opciones.payload = JSON.stringify(cuerpo);
  }
  const r = UrlFetchApp.fetch('https://script.googleapis.com/v1/projects/' + ScriptApp.getScriptId() + ruta, opciones);
  const texto = r.getContentText();
  if (r.getResponseCode() >= 300) {
    if (/has not been used|is disabled|SERVICE_DISABLED|User has not enabled/i.test(texto)) {
      throw new Error('Google indica que la API de Apps Script no está habilitada para el proyecto de Cloud de este script. Vincule el script a su proyecto de Google Cloud (Configuración del proyecto → Cambiar proyecto) y habilite "Apps Script API" en ese proyecto. Detalle: ' + texto.substring(0, 300));
    }
    throw new Error('API de Apps Script ' + r.getResponseCode() + ': ' + texto.substring(0, 400));
  }
  return texto ? JSON.parse(texto) : {};
}

function descargarDeGitHub(nombre) {
  const r = UrlFetchApp.fetch(ORIGEN_CODIGO + nombre + '?v=' + Date.now(), { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) throw new Error('No se pudo descargar ' + nombre + ' de GitHub (código ' + r.getResponseCode() + ').');
  return r.getContentText();
}

function publicarVersion(numero) {
  const props = PropertiesService.getScriptProperties();
  const config = { scriptId: ScriptApp.getScriptId(), versionNumber: numero, manifestFileName: 'appsscript', description: 'ERP Guanipa - Órdenes' };
  let id = props.getProperty('DEPLOYMENT_ID');
  let implementacion;
  if (id) {
    try {
      implementacion = llamarApiScript('/deployments/' + id, 'put', { deploymentConfig: config });
    } catch (e) {
      console.warn('No se pudo actualizar la implementación guardada; se crea otra: ' + e.message);
      id = '';
    }
  }
  if (!id) {
    implementacion = llamarApiScript('/deployments', 'post', config);
    props.setProperty('DEPLOYMENT_ID', implementacion.deploymentId);
  }
  const web = (implementacion.entryPoints || []).find((p) => p.entryPointType === 'WEB_APP');
  const url = web && web.webApp ? web.webApp.url : '';
  if (url) props.setProperty('URL_API', url);
  return url || '(revise Implementar → Administrar implementaciones)';
}
