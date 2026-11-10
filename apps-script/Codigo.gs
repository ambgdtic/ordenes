/* ===================== 00_Config.gs ===================== */
/**
 * Módulo: Configuración general y catálogos base
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes (Pago, Compra y Servicio)
 * Versión: 1.0.2-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

const APP = {
  nombre: 'ERP Guanipa · Órdenes',
  version: '1.0.7-beta',
  zona: 'America/Caracas',
  nombreLibro: 'ERP Guanipa - Base de Datos',
  nombreCarpetaRaiz: 'ERP Guanipa - Documentos'
};

// ID de cliente OAuth (público). La propiedad del script GOOGLE_CLIENT_ID, si existe, tiene prioridad.
const GOOGLE_CLIENT_ID_PREDETERMINADO = '3906052684-d0ed8n08oecuqdcfoaj25s46523fa1d6.apps.googleusercontent.com';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
  'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const CATEGORIA_NOMINA = 'Pagos de Nómina';

const CATEGORIAS_BASE = [
  { nombre: 'Ayudas Económicas', color: '#ffcdd2' },
  { nombre: 'Servicios Públicos, Infraestructura y Obras', color: '#fff9c4' },
  { nombre: 'Servicios Profesionales', color: '#fff9c4' },
  { nombre: 'Suministros', color: '#bbdefb' },
  { nombre: 'Tecnología', color: '#bbdefb' },
  { nombre: 'Dozavos', color: '#ffe0b2' },
  { nombre: 'Créditos Adicionales', color: '#ffe0b2' },
  { nombre: 'Subvenciones', color: '#ffe0b2' },
  { nombre: CATEGORIA_NOMINA, color: '#ffe0b2' },
  { nombre: 'Honorarios Profesionales', color: '#ffe0b2' },
  { nombre: 'Comunicación, Publicidad y Logística', color: '#c8e6c9' },
  { nombre: 'Viáticos, Transporte y Representación', color: '#b2ebf2' },
  { nombre: 'Correcciones Puntuales', color: '#e1bee7' }
];

const BANCOS = {
  '0102': 'BANCO DE VENEZUELA',
  '0104': 'BANCO VENEZOLANO DE CREDITO',
  '0105': 'BANCO MERCANTIL',
  '0108': 'BANCO PROVINCIAL',
  '0114': 'BANCARIBE',
  '0115': 'BANCO EXTERIOR',
  '0128': 'BANCO CARONI',
  '0134': 'BANESCO',
  '0137': 'BANCO SOFITASA',
  '0138': 'BANCO PLAZA',
  '0146': 'BANGENTE',
  '0151': 'BFC BANCO FONDO COMUN',
  '0156': '100% BANCO',
  '0157': 'DELSUR BANCO UNIVERSAL',
  '0163': 'BANCO DEL TESORO',
  '0166': 'BANCO AGRICOLA DE VENEZUELA',
  '0168': 'BANCRECER',
  '0169': 'BANCO MIBANCO',
  '0171': 'BANCO ACTIVO',
  '0172': 'BANCAMIGA',
  '0173': 'BANCO INTERNACIONAL DE DESARROLLO',
  '0174': 'BANPLUS',
  '0175': 'BANCO BICENTENARIO',
  '0177': 'BANFANB',
  '0178': 'N58 BANCO DIGITAL',
  '0191': 'BANCO NACIONAL DE CREDITO (BNC)'
};

const ROLES = {
  ADMIN: { nombre: 'Administrador', permisos: ['*'] },
  TESORERIA: {
    nombre: 'Tesorería',
    permisos: ['ver', 'pagos.editar', 'pagos.importar', 'op.generar', 'op.anular',
      'beneficiarios.editar', 'tasas.editar']
  },
  COMPRAS: {
    nombre: 'Compras',
    permisos: ['ver', 'oc.editar', 'oc.anular', 'beneficiarios.editar']
  },
  CONSULTA: { nombre: 'Consulta', permisos: ['ver'] }
};

// Porcentajes y bases tomados de la plantilla vigente. Validar con Administración y Hacienda.
const RETENCIONES_BASE = [
  { codigo: 'ANTICIPO', nombre: 'ANTICIPO', porcentaje: null, base: 'NINGUNA', fila_titulo: true },
  { codigo: 'FIEL_CUMPLIMIENTO', nombre: '10% RETENCIÓN FIEL CUMPLIMIENTO', porcentaje: 10, base: 'BASE' },
  { codigo: 'LABORAL', nombre: '5% RETENCIÓN LABORAL', porcentaje: 5, base: 'BASE' },
  { codigo: 'IVA', nombre: 'I.V.A', porcentaje: 75, base: 'IVA' },
  { codigo: 'ISLR', nombre: 'I.S.L.R.', porcentaje: 2, base: 'BASE' },
  { codigo: 'MUNICIPAL', nombre: 'RETENCIÓN IMPUESTO MUNICIPAL', porcentaje: 2, base: 'BASE' },
  { codigo: 'TIMBRE', nombre: 'TIMBRE FISCAL', porcentaje: 0.1, base: 'BASE' },
  { codigo: 'FONDO_NEGRO', nombre: 'FONDO NEGRO PRIMERO', porcentaje: 3, base: 'TOTAL' },
  { codigo: 'SUBSIDIO_ALIMENTICIO', nombre: 'FONDO  SUBSIDIO ALIMENTICIO', porcentaje: 0.5, base: 'BASE' },
  { codigo: 'FONDO_UNICO', nombre: 'FONDO ÚNICO MUNICIPAL', porcentaje: 1, base: 'BASE' }
];

const UNIDADES_BASE = [
  'DESPACHO DEL ALCALDE', 'DIRECCIÓN GENERAL', 'TALENTO HUMANO', 'COMPRAS', 'CONTABILIDAD',
  'ADMINISTRACIÓN', 'TESORERÍA', 'PRESUPUESTO', 'HACIENDA', 'TECNOLOGÍAS DE LA INFORMACIÓN'
];

// Los datos sensibles (cuenta bancaria, firmantes) no van aquí: viven en 99_DatosLocales.gs, fuera de git.
const CONFIG_BASE = {
  institucion: {
    descripcion: 'Datos del membrete',
    valor: {
      pais: 'REPÚBLICA BOLIVARIANA DE VENEZUELA',
      estado: 'ESTADO ANZOÁTEGUI',
      nombre: 'ALCALDÍA DEL MUNICIPIO GUANIPA',
      rif: 'G-200003740',
      ciudad: 'SAN JOSÉ DE GUANIPA',
      lugar_compra: 'ALCALDÍA DEL MUNICIPIO BOLIVARIANO GUANIPA',
      pie: 'Dirección: Alcaldía del Municipio Guanipa, Av. Fernández Padilla. Edificio Municipal.',
      telefono: 'Telf. (0283)2551202'
    }
  },
  cuenta_debito: {
    descripcion: 'Cuenta de la Alcaldía desde la que se realizan los pagos',
    valor: { tipo_pago: 'TRANSFERENCIA BANCARIA', banco: '', numero: '' }
  },
  firmas_op: {
    descripcion: 'Firmantes de la Orden de Pago (en el orden de la plantilla)',
    valor: [
      { cargo: 'JEFA DEL AREA DE TESORERÍA', nombre: '' },
      { cargo: 'DIRECTORA DE PRESUPUESTO', nombre: '' },
      { cargo: 'DIRECTORA DE GESTIÓN ADMINISTRATIVA Y FINANCIERA', nombre: '' },
      { cargo: 'ALCALDE', nombre: '' }
    ]
  },
  firmas_oc: {
    descripcion: 'Casillas de firma de la Orden de Compra/Servicio',
    valor: ['CONTROL INTERNO', 'JEFE DE COMPRAS', 'PRESUPUESTO', 'ADMINISTRACIÓN', 'ALCALDE', 'PROVEEDOR']
  },
  iva_pct: { descripcion: 'Alícuota general de IVA (%)', valor: 16 },
  retenciones: { descripcion: 'Retenciones de la Orden de Pago', valor: RETENCIONES_BASE },
  categorias: { descripcion: 'Categorías de pago', valor: CATEGORIAS_BASE },
  unidades: { descripcion: 'Unidades solicitantes', valor: UNIDADES_BASE },
  correlativos: {
    descripcion: 'Próximo número a asignar por tipo de documento',
    valor: { op: 1, oc: 1, os: 1 }
  },
  beneficiario_nomina: {
    descripcion: 'Nombre que se asigna a los movimientos de nómina de la conciliación',
    valor: 'PAGO DE NÓMINA'
  },
  tolerancia_diferencia: {
    descripcion: 'Diferencia máxima (Bs.) aceptada entre lo pagado y el neto calculado de la OP',
    valor: 1
  },
  umbral_fondo_negro: {
    descripcion: 'Total de factura (Bs.) a partir del cual se aplica automáticamente el Fondo Negro Primero',
    valor: 100000
  }
};

/** Categorías que por defecto no llevan factura (pagos a particulares, transferencias entre entes). */
const CATEGORIAS_SIN_FACTURA = ['Ayudas Económicas', 'Dozavos', 'Créditos Adicionales', 'Subvenciones', CATEGORIA_NOMINA, 'Correcciones Puntuales'];

/** Orden de las retenciones en el formulario: las más usadas primero. La impresión respeta la plantilla. */
const ORDEN_RETENCIONES_FORMULARIO = ['IVA', 'ISLR', 'TIMBRE', 'MUNICIPAL'];
const CODIGO_FONDO_NEGRO = 'FONDO_NEGRO';

/** Valor inicial de un parámetro: base del código, sustituido por 99_DatosLocales.gs si existe. */
function valorConfigInicial(clave) {
  const locales = typeof DATOS_LOCALES !== 'undefined' ? DATOS_LOCALES : {};
  if (locales[clave] !== undefined) return JSON.parse(JSON.stringify(locales[clave]));
  return CONFIG_BASE[clave] ? JSON.parse(JSON.stringify(CONFIG_BASE[clave].valor)) : null;
}


/* ===================== 01_Utilidades.gs ===================== */
/**
 * Módulo: Utilidades (formatos venezolanos, fechas, documentos, cuentas)
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.2-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

class ErrorApp extends Error {
  constructor(mensaje, codigo, detalle) {
    super(mensaje);
    this.name = 'ErrorApp';
    this.codigo = codigo || 'ERROR';
    this.detalle = detalle || null;
  }
}

function redondear2(n) {
  const v = Number(n);
  if (!isFinite(v)) return 0;
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

/** Convierte textos con formato venezolano o estadounidense a número. */
function aNumero(valor) {
  if (valor === null || valor === undefined || valor === '') return null;
  if (typeof valor === 'number') return isFinite(valor) ? valor : null;
  let s = String(valor).replace(/bs\.?|us\$|\$|\s/gi, '').trim();
  if (!s) return null;
  const negativo = /^\(.*\)$/.test(s) || s.startsWith('-');
  s = s.replace(/[()\-+]/g, '');
  const ultComa = s.lastIndexOf(',');
  const ultPunto = s.lastIndexOf('.');
  if (ultComa > -1 && ultPunto > -1) {
    const decimal = ultComa > ultPunto ? ',' : '.';
    const miles = decimal === ',' ? '.' : ',';
    s = s.split(miles).join('').replace(decimal, '.');
  } else if (ultComa > -1) {
    // Una sola coma se toma como decimal (formato venezolano); varias comas son separadores de miles.
    const grupos = s.split(',');
    s = grupos.length > 2 ? grupos.join('') : s.replace(',', '.');
  } else if (ultPunto > -1) {
    const grupos = s.split('.');
    const esMiles = grupos.length > 2 || (grupos[grupos.length - 1].length === 3);
    if (esMiles) s = grupos.join('');
  }
  const n = Number(s);
  if (!isFinite(n)) return null;
  return negativo ? -n : n;
}

function formatearFecha(fecha, patron) {
  return Utilities.formatDate(fecha, APP.zona, patron);
}

function hoyISO() {
  return formatearFecha(new Date(), 'yyyy-MM-dd');
}

function ahoraISO() {
  return formatearFecha(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
}

function esFechaISO(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));
}

/** Acepta Date, serial de Excel, dd/mm/aaaa, d/m/aa, aaaa-mm-dd. Devuelve 'aaaa-mm-dd' o ''. */
function aFechaISO(valor) {
  if (valor === null || valor === undefined || valor === '') return '';
  if (Object.prototype.toString.call(valor) === '[object Date]') {
    return isNaN(valor.getTime()) ? '' : formatearFecha(valor, 'yyyy-MM-dd');
  }
  if (typeof valor === 'number') {
    if (valor > 20000 && valor < 80000) {
      const ms = Math.round((valor - 25569) * 86400 * 1000);
      const d = new Date(ms);
      const p = (n) => String(n).padStart(2, '0');
      return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`;
    }
    return '';
  }
  const s = String(valor).trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return componerFecha(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
  if (m) {
    let anio = +m[3];
    if (anio < 100) anio += 2000;
    return componerFecha(anio, +m[2], +m[1]);
  }
  return '';
}

function componerFecha(anio, mes, dia) {
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return '';
  const d = new Date(Date.UTC(anio, mes - 1, dia));
  if (d.getUTCMonth() !== mes - 1) return '';
  return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

function sumarDias(fechaISO, dias) {
  const [a, m, d] = fechaISO.split('-').map(Number);
  const f = new Date(Date.UTC(a, m - 1, d + dias));
  return `${f.getUTCFullYear()}-${String(f.getUTCMonth() + 1).padStart(2, '0')}-${String(f.getUTCDate()).padStart(2, '0')}`;
}

/** 'aaaa-mm-dd' → 'dd/mm/aaaa' (o 'd/m/aaaa' si sinCeros). */
function fechaVE(fechaISO, sinCeros) {
  if (!esFechaISO(fechaISO)) return '';
  const [a, m, d] = fechaISO.split('-');
  return sinCeros ? `${+d}/${+m}/${a}` : `${d}/${m}/${a}`;
}

function formatoNumeroVE(n, decimales) {
  const dec = decimales === undefined ? 2 : decimales;
  const v = Number(n);
  if (!isFinite(v)) return '';
  const negativo = v < 0;
  const fijo = Math.abs(v).toFixed(dec);
  const [entero, fraccion] = fijo.split('.');
  const conMiles = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (negativo ? '-' : '') + conMiles + (fraccion ? ',' + fraccion : '');
}

/** Formato para mensajes: 1.250,50 Bs. */
function formatoBs(n) {
  return formatoNumeroVE(n, 2) + ' Bs.';
}

/** Formato de las plantillas impresas: Bs10.263.128,30 */
function formatoBsPlantilla(n) {
  if (n === null || n === undefined || n === '') return '';
  return 'Bs' + formatoNumeroVE(n, 2);
}

function formatoUsdPlantilla(n) {
  if (n === null || n === undefined || n === '') return '';
  return '$' + formatoNumeroVE(n, 2);
}

/** Nombre o razón social en mayúsculas con comas uniformes ("EMPRESA ,C.A" → "EMPRESA, C.A"). */
function normalizarNombre(s) {
  return mayusculas(s).replace(/\s*,\s*/g, ', ').replace(/\s+\./g, '.').replace(/,\s*$/, '').trim();
}

function normalizarTexto(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toUpperCase().replace(/\s+/g, ' ').trim();
}

function mayusculas(s) {
  return String(s || '').replace(/\s+/g, ' ').trim().toUpperCase();
}

/** Deja solo dígitos y quita ceros a la izquierda (para buscar y comparar). */
function limpiarDocumento(doc) {
  const d = String(doc === null || doc === undefined ? '' : doc).replace(/\D/g, '').replace(/^0+/, '');
  return d;
}

function normalizarTipoDoc(tipo) {
  const t = String(tipo || '').trim().toUpperCase().charAt(0);
  return ['V', 'E', 'J', 'G', 'P', 'C'].indexOf(t) > -1 ? t : '';
}

function esRif(tipo) {
  return ['J', 'G', 'C'].indexOf(normalizarTipoDoc(tipo)) > -1;
}

/** Valor de la letra para el dígito verificador del RIF (SENIAT). C no tiene valor conocido: no se calcula. */
const VALOR_LETRA_RIF = { V: 1, E: 2, J: 3, P: 4, G: 5 };
const PESOS_RIF = [3, 2, 7, 6, 5, 4, 3, 2];

/** Dígito verificador del RIF a partir de la letra y los 8 dígitos (módulo 11). Null si no aplica. */
function digitoVerificadorRif(tipo, cuerpo) {
  const t = normalizarTipoDoc(tipo);
  const d = soloDigitos(cuerpo);
  if (!VALOR_LETRA_RIF[t] || !d || d.length > 8) return null;
  const ocho = ('00000000' + d).slice(-8);
  const suma = VALOR_LETRA_RIF[t] * 4 + PESOS_RIF.reduce((s, peso, i) => s + Number(ocho.charAt(i)) * peso, 0);
  const resto = 11 - (suma % 11);
  return resto >= 10 ? 0 : resto;
}

/** Cuerpo (8 dígitos, con ceros a la izquierda) y dígito verificador de un RIF. */
function partesRif(doc) {
  let d = soloDigitos(doc);
  while (d.length > 9 && d.charAt(0) === '0') d = d.substring(1);
  if (d.length === 9) return { cuerpo: d.substring(0, 8), dv: d.charAt(8) };
  if (!d || d.length > 9) return { cuerpo: d, dv: null };
  return { cuerpo: ('00000000' + d).slice(-8), dv: null };
}

/**
 * Agrega el dígito verificador a un RIF que llega sin él (el BDV y muchos listados lo omiten,
 * y al escribirlo como número se pierden los ceros de la izquierda). Si ya tiene 9 dígitos no se toca.
 */
function completarRif(tipo, doc) {
  const d = normalizarDocumento(tipo, doc);
  if (!esRif(tipo) || !d || d.length >= 9 || d.length < 6) return d;
  const dv = digitoVerificadorRif(tipo, d);
  return dv === null ? d : ('00000000' + d).slice(-8) + dv;
}

/** Forma de guardar: la cédula sin ceros a la izquierda; el RIF conserva sus 9 dígitos (con dígito verificador). */
function normalizarDocumento(tipo, doc) {
  let d = soloDigitos(doc);
  if (esRif(tipo)) {
    while (d.length > 9 && d.charAt(0) === '0') d = d.substring(1);
    return d;
  }
  return d.replace(/^0+/, '');
}

/** Reglas: cédula V/E de 6 a 8 dígitos; RIF J/G/C de 9 dígitos con dígito verificador correcto; pasaporte de 5 a 12. */
function estadoDocumento(tipo, doc) {
  const t = normalizarTipoDoc(tipo);
  const d = normalizarDocumento(t, doc);
  if (!d || !Number(d)) return 'INCOMPLETO (SIN DOCUMENTO)';
  if (!t) return 'ERROR (FALTA EL TIPO V/E/J/G)';
  if (t === 'V' || t === 'E') return d.length >= 6 && d.length <= 8 ? 'VÁLIDO' : `ERROR (CÉDULA DE ${d.length} DÍG.: DEBE TENER 6 A 8)`;
  if (esRif(t)) {
    if (d.length === 9) {
      const dv = digitoVerificadorRif(t, d.substring(0, 8));
      return dv === null || String(dv) === d.charAt(8) ? 'VÁLIDO' : `ERROR (DÍGITO VERIFICADOR ${d.charAt(8)}: DEBERÍA SER ${dv})`;
    }
    if (d.length >= 6 && d.length <= 8) {
      const dv = digitoVerificadorRif(t, d);
      return `ERROR (RIF DE ${d.length} DÍG.: FALTA EL DÍGITO VERIFICADOR${dv === null ? '' : ', SERÍA ' + dv})`;
    }
    return `ERROR (RIF DE ${d.length} DÍG.: DEBE TENER 9)`;
  }
  return d.length >= 5 && d.length <= 12 ? 'VÁLIDO' : `ERROR (PASAPORTE DE ${d.length} DÍG.)`;
}

/** Número comparable: el RIF por su cuerpo de 8 dígitos (sin verificador); la cédula sin ceros. */
function nucleoDocumento(tipo, doc) {
  return esRif(tipo) ? partesRif(doc).cuerpo.replace(/^0+/, '') : limpiarDocumento(doc);
}

/**
 * Compara documentos tolerando que el banco envíe el RIF sin dígito verificador (8 dígitos),
 * sin ceros a la izquierda, o con un verificador distinto (el registro puede tenerlo mal).
 */
function mismoDocumento(tipoA, docA, tipoB, docB) {
  const a = limpiarDocumento(docA);
  const b = limpiarDocumento(docB);
  if (!a || !b) return false;
  if (a === b) return true;
  if (!esRif(tipoA) && !esRif(tipoB)) return false;
  return partesRif(docA).cuerpo.replace(/^0+/, '') === partesRif(docB).cuerpo.replace(/^0+/, '');
}

/** Clave para comparar documentos en mapas: el RIF se compara sin dígito verificador. */
function claveDocumento(tipo, doc) {
  const t = normalizarTipoDoc(tipo);
  return t + nucleoDocumento(t, doc);
}

/** Distancia de edición con transposición de vecinos (Damerau restringida). */
function distanciaEdicion(a, b) {
  const m = a.length;
  const n = b.length;
  const d = [];
  for (let i = 0; i <= m; i++) { d[i] = [i]; }
  for (let j = 0; j <= n; j++) { d[0][j] = j; }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const costo = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + costo);
      if (i > 1 && j > 1 && a.charAt(i - 1) === b.charAt(j - 2) && a.charAt(i - 2) === b.charAt(j - 1)) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[m][n];
}

function subcadenaComunMayor(a, b) {
  let mayor = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      let k = 0;
      while (i + k < a.length && j + k < b.length && a.charAt(i + k) === b.charAt(j + k)) k++;
      if (k > mayor) mayor = k;
    }
  }
  return mayor;
}

/**
 * ¿Parece el mismo documento con un error de tipeo? Devuelve el motivo o null.
 * Ej.: V-3186420 y V-31864205 (falta el último dígito) → sugerencia.
 */
function parecidoDocumento(tipoA, docA, tipoB, docB) {
  const a = nucleoDocumento(tipoA, docA);
  const b = nucleoDocumento(tipoB, docB);
  if (!a || !b || a === b || Math.min(a.length, b.length) < 6) return null;
  const distancia = distanciaEdicion(a, b);
  if (distancia === 1) {
    if (a.length !== b.length) return 'le falta o sobra un dígito';
    const iguales = a.split('').sort().join('') === b.split('').sort().join('');
    return iguales ? 'tiene dos dígitos invertidos' : 'tiene un dígito distinto';
  }
  const comun = subcadenaComunMayor(a, b);
  if (comun >= 7 && Math.abs(a.length - b.length) <= 1) return `coinciden ${comun} dígitos seguidos`;
  return null;
}

function documentoConPuntos(doc, tipo) {
  const d = tipo && esRif(tipo) ? normalizarDocumento(tipo, doc) : limpiarDocumento(doc);
  if (!d) return '';
  if (tipo && esRif(tipo) && d.length === 9) return `${d.substring(0, 8)}-${d.substring(8)}`;
  return d.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function soloDigitos(s) {
  return String(s === null || s === undefined ? '' : s).replace(/\D/g, '');
}

function formatearCuenta(cuenta) {
  const d = soloDigitos(cuenta);
  if (d.length === 20) return d.replace(/(\d{4})(?=\d)/g, '$1-');
  return String(cuenta || '').trim();
}

function estadoCuenta(cuenta) {
  const d = soloDigitos(cuenta);
  if (!d) return 'INCOMPLETO (SIN CUENTA)';
  if (d.length !== 20) return `ERROR (LONGITUD ${d.length} DÍG.)`;
  if (!BANCOS[d.substring(0, 4)]) return `ERROR (BANCO ${d.substring(0, 4)} NO EXISTE)`;
  return 'VÁLIDO';
}

function cuentaValida(cuenta) {
  const d = soloDigitos(cuenta);
  return d.length === 20 && !!BANCOS[d.substring(0, 4)];
}

function codigoBanco(cuenta) {
  const d = soloDigitos(cuenta);
  return d.length >= 4 ? d.substring(0, 4) : '';
}

function nombreBanco(codigoOCuenta) {
  const cod = String(codigoOCuenta || '').length > 4 ? codigoBanco(codigoOCuenta) : String(codigoOCuenta || '');
  if (!cod) return '';
  return BANCOS[cod] || 'BANCO NO REGISTRADO';
}

function uuid() {
  return Utilities.getUuid();
}

function hashTexto(texto) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(texto), Utilities.Charset.UTF_8);
  return bytes.map((b) => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');
}

function escaparHtml(s) {
  return String(s === null || s === undefined ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function textoSeguro(valor, max) {
  const s = String(valor === null || valor === undefined ? '' : valor).trim();
  return max ? s.substring(0, max) : s;
}

function copiar(obj) {
  return JSON.parse(JSON.stringify(obj));
}


/* ===================== 02_Db.gs ===================== */
/**
 * Módulo: Capa de datos (db.*). Toda la lógica pasa por aquí; nadie llama a SpreadsheetApp directo.
 * Al migrar a PostgreSQL solo se reescribe este archivo manteniendo la misma interfaz.
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.7-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

// Tipos: t texto, n número, f fecha (aaaa-mm-dd), b booleano, j JSON. Tercer valor: formato numérico.
const ESQUEMA = {
  Config: [['clave', 't'], ['valor', 'j'], ['descripcion', 't']],
  Usuarios: [['email', 't'], ['nombre', 't'], ['rol', 't'], ['direccion', 't'], ['activo', 'b'], ['ultimo_acceso', 't']],
  Tasas: [['fecha', 'f'], ['tasa', 'n', '#,##0.0000'], ['fuente', 't']],
  Beneficiarios: [
    ['tipo_doc', 't'], ['documento', 't'], ['nombre', 't'], ['cuenta', 't'], ['banco_codigo', 't'],
    ['banco', 't'], ['estado_cuenta', 't'], ['alias', 't'], ['telefono', 't'], ['correo', 't'],
    ['activo', 'b'], ['notas', 't']
  ],
  Pagos: [
    ['numero', 'n', '0'], ['fecha', 'f'], ['beneficiario_id', 't'], ['beneficiario', 't'], ['tipo_doc', 't'],
    ['documento', 't'], ['monto', 'n'], ['categoria', 't'], ['descripcion', 't'], ['cuenta', 't'],
    ['banco_codigo', 't'], ['banco', 't'], ['tasa_bcv', 'n', '#,##0.0000'], ['monto_usd', 'n'],
    ['estado', 't'], ['estado_datos', 't'], ['origen', 't'], ['clave_conciliacion', 't'],
    ['referencia_banco', 't'], ['lote', 't'], ['importacion_id', 't'],
    ['op_factura', 't'], ['op_base_imponible', 'n'], ['op_iva_pct', 'n'], ['op_retenciones', 'j'],
    ['op_calculo', 'j'], ['op_contrato', 't'], ['orden_compra_id', 't'], ['op_imputacion', 'j'],
    ['op_generada', 'b'], ['op_pdf_id', 't'], ['op_pdf_url', 't'], ['op_generada_en', 't'],
    ['op_generada_por', 't'], ['op_version', 'n', '0'],
    ['op_con_factura', 'b'], ['op_borrador_en', 't'],
    ['motivo_anulacion', 't'], ['anulado_por', 't'], ['anulado_en', 't']
  ],
  OrdenesCompra: [
    ['tipo', 't'], ['numero', 'n', '0'], ['fecha', 'f'], ['requisicion', 't'], ['beneficiario_id', 't'],
    ['beneficiario', 't'], ['tipo_doc', 't'], ['documento', 't'], ['numero_proceso', 't'],
    ['unidad_solicitante', 't'], ['tipo_pago', 't'], ['condicion', 't'], ['fecha_emision', 'f'],
    ['concepto', 't'], ['items', 'j'], ['iva_pct', 'n'], ['subtotal', 'n'], ['total_iva', 'n'],
    ['total_exento', 'n'], ['total_general', 'n'], ['descuento_pct', 'n'], ['total_final', 'n'],
    ['observaciones', 't'], ['presupuesto_tipo', 't'], ['imputacion', 'j'], ['lugar_compra', 't'],
    ['moneda', 't'], ['tasa_bcv', 'n', '#,##0.0000'], ['monto_divisa', 'n'], ['elaborado_por', 't'],
    ['estado', 't'], ['pdf_id', 't'], ['pdf_url', 't'], ['pdf_version', 'n', '0'],
    ['motivo_anulacion', 't'], ['anulado_por', 't'], ['anulado_en', 't']
  ],
  Importaciones: [
    ['archivo_nombre', 't'], ['archivo_id', 't'], ['archivo_url', 't'], ['filas_total', 'n', '0'],
    ['filas_importadas', 'n', '0'], ['duplicadas', 'n', '0'], ['monto_total', 'n'],
    ['rango_desde', 'f'], ['rango_hasta', 'f']
  ],
  Auditoria: [
    ['fecha_hora', 't'], ['usuario', 't'], ['modulo', 't'], ['accion', 't'], ['registro_id', 't'], ['detalle', 'j']
  ]
};

const COLUMNAS_AUDITORIA = [['creado_en', 't'], ['creado_por', 't'], ['actualizado_en', 't'], ['actualizado_por', 't']];

/** Tablas que viven siempre en la base de producción, aunque el entorno de pruebas esté activo. */
const TABLAS_COMUNES = ['Usuarios', 'Tasas'];
const ENTORNO_PRODUCCION = 'PRODUCCION';
const ENTORNO_PRUEBAS = 'PRUEBAS';

const db = (() => {
  let entorno = null;
  const libros = {};
  const memo = {};
  const cabeceras = {};
  let profundidadBloqueo = 0;

  function entornoActivo() {
    if (entorno) return entorno;
    const props = PropertiesService.getScriptProperties();
    entorno = props.getProperty('ENTORNO') === ENTORNO_PRUEBAS && props.getProperty('DB_ID_PRUEBAS') ? ENTORNO_PRUEBAS : ENTORNO_PRODUCCION;
    return entorno;
  }

  function abrir(nombreEntorno) {
    if (libros[nombreEntorno]) return libros[nombreEntorno];
    const clave = nombreEntorno === ENTORNO_PRUEBAS ? 'DB_ID_PRUEBAS' : 'DB_ID';
    const id = PropertiesService.getScriptProperties().getProperty(clave);
    if (!id) {
      if (nombreEntorno === ENTORNO_PRUEBAS) throw new ErrorApp('El entorno de pruebas no existe. Créelo desde Administración › Entorno.', 'SIN_ENTORNO');
      throw new ErrorApp('El sistema no está instalado. Ejecute la función instalar() en el editor de Apps Script.', 'NO_INSTALADO');
    }
    libros[nombreEntorno] = SpreadsheetApp.openById(id);
    return libros[nombreEntorno];
  }

  function entornoDeTabla(tabla) {
    return TABLAS_COMUNES.indexOf(tabla) > -1 ? ENTORNO_PRODUCCION : entornoActivo();
  }

  function libro(tabla) {
    return abrir(tabla ? entornoDeTabla(tabla) : entornoActivo());
  }

  function olvidarPropias() {
    Object.keys(memo).concat(Object.keys(cabeceras)).forEach((k) => {
      if (TABLAS_COMUNES.indexOf(k) === -1) { delete memo[k]; delete cabeceras[k]; }
    });
  }

  /** Olvida entorno y libros abiertos (equivale a empezar una ejecución nueva). */
  function olvidarEntorno() {
    entorno = null;
    Object.keys(libros).forEach((k) => delete libros[k]);
    Object.keys(memo).forEach((k) => delete memo[k]);
    Object.keys(cabeceras).forEach((k) => delete cabeceras[k]);
  }

  /** Cambia el entorno solo para esta ejecución (no toca la propiedad ENTORNO). */
  function usarEntorno(nombre) {
    entorno = nombre === ENTORNO_PRUEBAS ? ENTORNO_PRUEBAS : ENTORNO_PRODUCCION;
    olvidarPropias();
  }

  function usarLibro(ss, nombreEntorno) {
    const e = nombreEntorno || ENTORNO_PRODUCCION;
    libros[e] = ss;
    if (e === ENTORNO_PRODUCCION) { Object.keys(memo).forEach((k) => delete memo[k]); Object.keys(cabeceras).forEach((k) => delete cabeceras[k]); }
    else olvidarPropias();
  }

  function definicion(tabla) {
    const campos = ESQUEMA[tabla];
    if (!campos) throw new ErrorApp(`Tabla desconocida: ${tabla}`, 'TABLA');
    return [['id', 't']].concat(campos, COLUMNAS_AUDITORIA);
  }

  function tipos(tabla) {
    const mapa = {};
    definicion(tabla).forEach(([n, t, f]) => { mapa[n] = { tipo: t, formato: f }; });
    return mapa;
  }

  function formatoColumna(def) {
    if (!def) return '@';
    if (def.tipo === 'n') return def.formato || '#,##0.00';
    if (def.tipo === 'b') return 'General';
    return '@';
  }

  function hoja(tabla) {
    const ss = libro(tabla);
    let h = ss.getSheetByName(tabla);
    if (!h) h = crearHoja(ss, tabla);
    if (!cabeceras[tabla]) cabeceras[tabla] = asegurarColumnas(h, tabla);
    return h;
  }

  function crearHoja(ss, tabla) {
    const h = ss.insertSheet(tabla);
    const cols = definicion(tabla).map((c) => c[0]);
    if (h.getMaxColumns() < cols.length) h.insertColumnsAfter(h.getMaxColumns(), cols.length - h.getMaxColumns());
    h.getRange(1, 1, 1, cols.length).setValues([cols])
      .setFontWeight('bold').setBackground('#2f5e4e').setFontColor('#ffffff');
    h.setFrozenRows(1);
    return h;
  }

  function asegurarColumnas(h, tabla) {
    const ultimaCol = Math.max(h.getLastColumn(), 1);
    let encabezado = h.getRange(1, 1, 1, ultimaCol).getValues()[0].map((v) => String(v).trim());
    const faltantes = definicion(tabla).map((c) => c[0]).filter((c) => encabezado.indexOf(c) === -1);
    if (faltantes.length) {
      const inicio = encabezado.filter(Boolean).length + 1;
      if (h.getMaxColumns() < inicio + faltantes.length - 1) {
        h.insertColumnsAfter(h.getMaxColumns(), inicio + faltantes.length - 1 - h.getMaxColumns());
      }
      h.getRange(1, inicio, 1, faltantes.length).setValues([faltantes])
        .setFontWeight('bold').setBackground('#2f5e4e').setFontColor('#ffffff');
      encabezado = encabezado.filter(Boolean).concat(faltantes);
    }
    return encabezado.filter(Boolean);
  }

  function leerCelda(valor, def) {
    if (!def) return valor;
    switch (def.tipo) {
      case 'n': return valor === '' || valor === null ? null : Number(valor);
      case 'b': return valor === true || String(valor).toUpperCase() === 'TRUE' || String(valor).toUpperCase() === 'SI';
      case 'f': return aFechaISO(valor);
      case 'j':
        if (valor === '' || valor === null) return null;
        try { return JSON.parse(valor); } catch (e) { return null; }
      default:
        if (Object.prototype.toString.call(valor) === '[object Date]') return formatearFecha(valor, "yyyy-MM-dd'T'HH:mm:ss");
        return valor === null || valor === undefined ? '' : String(valor);
    }
  }

  function escribirCelda(valor, def) {
    if (!def) return valor === undefined ? '' : valor;
    if (valor === null || valor === undefined) return '';
    switch (def.tipo) {
      case 'n': { const n = Number(valor); return isFinite(n) && valor !== '' ? n : ''; }
      case 'b': return valor === true;
      case 'j': return JSON.stringify(valor);
      default: return String(valor);
    }
  }

  function leer(tabla) {
    if (memo[tabla]) return memo[tabla];
    const h = hoja(tabla);
    const enc = cabeceras[tabla];
    const defs = tipos(tabla);
    const ultima = h.getLastRow();
    const filas = ultima > 1 ? h.getRange(2, 1, ultima - 1, enc.length).getValues() : [];
    memo[tabla] = filas
      .map((fila, i) => {
        const obj = { _fila: i + 2, _crudo: fila };
        enc.forEach((col, c) => { obj[col] = leerCelda(fila[c], defs[col]); });
        return obj;
      })
      .filter((o) => o.id);
    return memo[tabla];
  }

  function aFila(tabla, obj) {
    const enc = cabeceras[tabla];
    const defs = tipos(tabla);
    return enc.map((col, c) => {
      if (defs[col]) return escribirCelda(obj[col], defs[col]);
      return obj._crudo ? obj._crudo[c] : '';
    });
  }

  function formatosFila(tabla) {
    const defs = tipos(tabla);
    return cabeceras[tabla].map((col) => formatoColumna(defs[col]));
  }

  function asegurarFilas(h, hasta) {
    const max = h.getMaxRows();
    if (hasta > max) h.insertRowsAfter(max, hasta - max + 50);
  }

  function sello(usuario) {
    return { cuando: ahoraISO(), quien: usuario || 'sistema' };
  }

  function insertarLote(tabla, objetos, usuario) {
    if (!objetos.length) return [];
    const h = hoja(tabla);
    const datos = leer(tabla);
    const s = sello(usuario);
    const nuevos = objetos.map((o) => Object.assign({}, o, {
      id: o.id || uuid(),
      creado_en: s.cuando, creado_por: s.quien, actualizado_en: s.cuando, actualizado_por: s.quien
    }));
    const inicio = Math.max(h.getLastRow(), 1) + 1;
    asegurarFilas(h, inicio + nuevos.length - 1);
    const formatos = formatosFila(tabla);
    const rango = h.getRange(inicio, 1, nuevos.length, cabeceras[tabla].length);
    rango.setNumberFormats(nuevos.map(() => formatos));
    const filas = nuevos.map((o) => aFila(tabla, o));
    rango.setValues(filas);
    nuevos.forEach((o, i) => { o._fila = inicio + i; o._crudo = filas[i]; datos.push(o); });
    return nuevos;
  }

  function insertar(tabla, objeto, usuario) {
    return insertarLote(tabla, [objeto], usuario)[0];
  }

  function porId(tabla, id) {
    if (!id) return null;
    return leer(tabla).find((o) => o.id === id) || null;
  }

  function buscar(tabla, criterio) {
    return leer(tabla).filter(criterio);
  }

  function primero(tabla, criterio) {
    return leer(tabla).find(criterio) || null;
  }

  function actualizar(tabla, id, cambios, usuario) {
    return actualizarLote(tabla, [{ id, cambios }], usuario)[0];
  }

  function actualizarLote(tabla, lista, usuario) {
    if (!lista.length) return [];
    const h = hoja(tabla);
    const s = sello(usuario);
    const formatos = formatosFila(tabla);
    const resultado = lista.map(({ id, cambios }) => {
      const actual = porId(tabla, id);
      if (!actual) throw new ErrorApp(`Registro no encontrado en ${tabla}.`, 'NO_ENCONTRADO', id);
      const antes = limpiar(actual);
      const limpios = Object.assign({}, cambios);
      ['id', 'creado_en', 'creado_por', '_fila', '_crudo'].forEach((k) => delete limpios[k]);
      Object.assign(actual, limpios, { actualizado_en: s.cuando, actualizado_por: s.quien });
      return { actual, antes };
    });
    resultado.sort((a, b) => a.actual._fila - b.actual._fila);
    let i = 0;
    while (i < resultado.length) {
      let j = i;
      while (j + 1 < resultado.length && resultado[j + 1].actual._fila === resultado[j].actual._fila + 1) j++;
      const bloque = resultado.slice(i, j + 1);
      const filas = bloque.map((r) => aFila(tabla, r.actual));
      const rango = h.getRange(bloque[0].actual._fila, 1, bloque.length, cabeceras[tabla].length);
      rango.setNumberFormats(bloque.map(() => formatos));
      rango.setValues(filas);
      bloque.forEach((r, k) => { r.actual._crudo = filas[k]; });
      i = j + 1;
    }
    return resultado.map((r) => ({ antes: r.antes, despues: limpiar(r.actual) }));
  }

  function limpiar(obj) {
    if (!obj) return obj;
    const copia = {};
    Object.keys(obj).forEach((k) => { if (k.charAt(0) !== '_') copia[k] = obj[k]; });
    return copia;
  }

  function conBloqueo(fn) {
    const bloqueo = LockService.getScriptLock();
    if (profundidadBloqueo === 0 && !bloqueo.tryLock(30000)) {
      throw new ErrorApp('El sistema está ocupado procesando otra operación. Intente de nuevo en unos segundos.', 'OCUPADO');
    }
    profundidadBloqueo++;
    try {
      return fn();
    } finally {
      profundidadBloqueo--;
      if (profundidadBloqueo === 0) {
        SpreadsheetApp.flush();
        bloqueo.releaseLock();
      }
    }
  }

  function olvidar(tabla) {
    if (tabla) delete memo[tabla]; else Object.keys(memo).forEach((k) => delete memo[k]);
  }

  function prepararTablas() {
    Object.keys(ESQUEMA).forEach((t) => hoja(t));
  }

  function idLibro() {
    return libro().getId();
  }

  return {
    leer, porId, buscar, primero, insertar, insertarLote, actualizar, actualizarLote,
    limpiar, conBloqueo, olvidar, prepararTablas, idLibro, usarLibro, usarEntorno, olvidarEntorno,
    entorno: entornoActivo, libroDeTabla: libro
  };
})();

/* ---------- Configuración clave/valor con caché ---------- */

const config = (() => {
  let local = null;
  let entornoLocal = null;
  const claveCache = () => 'cfg_v1_' + db.entorno();

  function todo() {
    if (local && entornoLocal === db.entorno()) return local;
    entornoLocal = db.entorno();
    const cache = CacheService.getScriptCache();
    const guardado = cache.get(claveCache());
    if (guardado) {
      local = JSON.parse(guardado);
      return local;
    }
    const resultado = {};
    Object.keys(CONFIG_BASE).forEach((k) => { resultado[k] = valorConfigInicial(k); });
    db.leer('Config').forEach((r) => { if (r.clave) resultado[r.clave] = r.valor; });
    local = resultado;
    const texto = JSON.stringify(resultado);
    if (texto.length < 90000) cache.put(claveCache(), texto, 600);
    return local;
  }

  function obtener(clave) {
    return todo()[clave];
  }

  function guardar(clave, valor, usuario) {
    const existente = db.primero('Config', (r) => r.clave === clave);
    const descripcion = CONFIG_BASE[clave] ? CONFIG_BASE[clave].descripcion : '';
    if (existente) db.actualizar('Config', existente.id, { valor }, usuario);
    else db.insertar('Config', { clave, valor, descripcion }, usuario);
    invalidar();
  }

  function invalidar() {
    local = null;
    CacheService.getScriptCache().remove(claveCache());
  }

  /** Reserva números consecutivos; debe llamarse dentro de db.conBloqueo. */
  function reservarCorrelativo(tipo, cantidad, usuario) {
    invalidar();
    db.olvidar('Config');
    const correlativos = Object.assign({ op: 1, oc: 1, os: 1 }, obtener('correlativos'));
    const inicio = Number(correlativos[tipo]) || 1;
    correlativos[tipo] = inicio + (cantidad || 1);
    guardar('correlativos', correlativos, usuario);
    return inicio;
  }

  return { todo, obtener, guardar, invalidar, reservarCorrelativo };
})();


/* ===================== 03_Auth.gs ===================== */
/**
 * Módulo: Autenticación (Google Identity Services) y permisos por rol.
 * El navegador envía el ID token de Google; aquí se verifica contra Google y contra la tabla Usuarios.
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.2-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

const EMISORES_GOOGLE = ['accounts.google.com', 'https://accounts.google.com'];

function propiedad(clave) {
  return PropertiesService.getScriptProperties().getProperty(clave) || '';
}

function verificarTokenGoogle(token) {
  if (!token || typeof token !== 'string' || token.length < 20) {
    throw new ErrorApp('Debe iniciar sesión con su cuenta de Google.', 'SIN_SESION');
  }
  const cache = CacheService.getScriptCache();
  const claveCache = 'tk_' + hashTexto(token).substring(0, 40);
  const enCache = cache.get(claveCache);
  if (enCache) return enCache;

  const clienteId = propiedad('GOOGLE_CLIENT_ID') || GOOGLE_CLIENT_ID_PREDETERMINADO;
  if (!clienteId) throw new ErrorApp('Falta configurar GOOGLE_CLIENT_ID en las propiedades del script.', 'CONFIGURACION');

  const respuesta = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(token),
    { muteHttpExceptions: true });
  if (respuesta.getResponseCode() !== 200) {
    throw new ErrorApp('Su sesión venció. Inicie sesión de nuevo.', 'TOKEN_INVALIDO');
  }
  const info = JSON.parse(respuesta.getContentText());
  const restante = Number(info.exp) - Math.floor(Date.now() / 1000);
  if (info.aud !== clienteId) throw new ErrorApp('El token no corresponde a esta aplicación.', 'TOKEN_INVALIDO');
  if (EMISORES_GOOGLE.indexOf(info.iss) === -1) throw new ErrorApp('Emisor de token no válido.', 'TOKEN_INVALIDO');
  if (String(info.email_verified) !== 'true') throw new ErrorApp('El correo de la cuenta no está verificado.', 'TOKEN_INVALIDO');
  if (!(restante > 0)) throw new ErrorApp('Su sesión venció. Inicie sesión de nuevo.', 'TOKEN_INVALIDO');

  const email = String(info.email).toLowerCase();
  cache.put(claveCache, email, Math.min(restante, 21600));
  return email;
}

function usuarioPorEmail(email) {
  const correo = String(email || '').toLowerCase().trim();
  return db.primero('Usuarios', (u) => String(u.email).toLowerCase() === correo) || null;
}

function autenticar(token) {
  const email = verificarTokenGoogle(token);
  const usuario = usuarioPorEmail(email);
  if (!usuario || !usuario.activo) {
    throw new ErrorApp(`La cuenta ${email} no tiene acceso al sistema. Solicítelo a la Dirección de Tecnologías de la Información.`, 'NO_AUTORIZADO');
  }
  return usuario;
}

function permisosDeRol(rol) {
  return ROLES[rol] ? ROLES[rol].permisos : [];
}

function tienePermiso(usuario, permiso) {
  if (!permiso || permiso === 'publico') return true;
  const permisos = permisosDeRol(usuario.rol);
  return permisos.indexOf('*') > -1 || permisos.indexOf(permiso) > -1;
}

function exigirPermiso(usuario, permiso) {
  if (!tienePermiso(usuario, permiso)) {
    throw new ErrorApp('No tiene permiso para realizar esta acción.', 'SIN_PERMISO', permiso);
  }
}

/* ---------- Auditoría ---------- */

function auditar(usuario, modulo, accion, registroId, detalle) {
  try {
    db.insertar('Auditoria', {
      fecha_hora: ahoraISO(),
      usuario: usuario && usuario.email ? usuario.email : String(usuario || 'sistema'),
      modulo, accion,
      registro_id: registroId || '',
      detalle: recortarDetalle(detalle)
    }, usuario && usuario.email ? usuario.email : 'sistema');
  } catch (e) {
    console.error('No se pudo registrar la auditoría', e && e.stack);
  }
}

/** Guarda solo los campos que cambiaron para que el log sea legible. */
function diferencias(antes, despues) {
  const cambios = {};
  const ignorar = ['actualizado_en', 'actualizado_por'];
  Object.keys(despues || {}).forEach((k) => {
    if (ignorar.indexOf(k) > -1) return;
    const a = JSON.stringify(antes ? antes[k] : undefined);
    const d = JSON.stringify(despues[k]);
    if (a !== d) cambios[k] = { antes: antes ? antes[k] : null, despues: despues[k] };
  });
  return cambios;
}

function recortarDetalle(detalle) {
  if (detalle === undefined || detalle === null) return null;
  const texto = JSON.stringify(detalle);
  return texto.length > 40000 ? { resumen: texto.substring(0, 40000) + '…' } : detalle;
}


/* ===================== 05_Api.gs ===================== */
/**
 * Módulo: API (punto de entrada web). Recibe {accion, datos, token} por POST y responde JSON.
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.7-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

function rutasApi() {
  return {
    'sesion.iniciar': { fn: sesionIniciar, permiso: 'ver' },
    'panel.resumen': { fn: panelResumen, permiso: 'ver' },

    'pagos.listar': { fn: pagosListar, permiso: 'ver' },
    'pagos.obtener': { fn: pagosObtener, permiso: 'ver' },
    'pagos.guardar': { fn: pagosGuardar, permiso: 'pagos.editar', escritura: true },
    'pagos.crear': { fn: pagosCrear, permiso: 'pagos.editar', escritura: true },
    'pagos.anular': { fn: pagosAnular, permiso: 'op.anular', escritura: true },
    'pagos.reactivar': { fn: pagosReactivar, permiso: 'admin', escritura: true },
    'pagos.recalcularTasa': { fn: pagosRecalcularTasa, permiso: 'pagos.editar', escritura: true },

    'conciliacion.analizar': { fn: conciliacionAnalizar, permiso: 'pagos.importar' },
    'conciliacion.confirmar': { fn: conciliacionConfirmar, permiso: 'pagos.importar', escritura: true },
    'conciliacion.historial': { fn: conciliacionHistorial, permiso: 'ver' },
    'conciliacion.ejemplo': { fn: conciliacionEjemplo, permiso: 'pagos.importar' },

    'op.calcular': { fn: opCalcular, permiso: 'ver' },
    'op.guardar': { fn: opGuardar, permiso: 'op.generar', escritura: true },
    'op.vista': { fn: opVista, permiso: 'ver' },
    'op.pdf': { fn: opPdf, permiso: 'op.generar', escritura: true },

    'oc.listar': { fn: ocListar, permiso: 'ver' },
    'oc.obtener': { fn: ocObtener, permiso: 'ver' },
    'oc.prellenarDesdePago': { fn: ocPrellenarDesdePago, permiso: 'ver' },
    'oc.guardar': { fn: ocGuardar, permiso: 'oc.editar', escritura: true },
    'oc.anular': { fn: ocAnular, permiso: 'oc.anular', escritura: true },
    'oc.vista': { fn: ocVista, permiso: 'ver' },
    'oc.vistaPrevia': { fn: ocVistaPrevia, permiso: 'ver' },
    'oc.pdf': { fn: ocPdf, permiso: 'oc.editar', escritura: true },

    'beneficiarios.listar': { fn: beneficiariosListar, permiso: 'ver' },
    'beneficiarios.buscar': { fn: beneficiariosBuscar, permiso: 'ver' },
    'beneficiarios.guardar': { fn: beneficiariosGuardar, permiso: 'beneficiarios.editar', escritura: true },
    'beneficiarios.detalle': { fn: beneficiariosDetalle, permiso: 'ver' },
    'beneficiarios.importar': { fn: beneficiariosImportar, permiso: 'beneficiarios.editar', escritura: true },

    'tasas.listar': { fn: tasasListar, permiso: 'ver' },
    'tasas.consultar': { fn: tasasConsultar, permiso: 'ver' },
    'tasas.sincronizar': { fn: tasasSincronizar, permiso: 'tasas.editar', escritura: true },
    'tasas.guardarManual': { fn: tasasGuardarManual, permiso: 'tasas.editar', escritura: true },
    'tasas.importarTexto': { fn: tasasImportarTexto, permiso: 'tasas.editar', escritura: true },
    'tasas.importarHistoricoApi': { fn: tasasImportarHistoricoApi, permiso: 'tasas.editar', escritura: true },

    'admin.config': { fn: adminConfig, permiso: 'admin' },
    'admin.guardarConfig': { fn: adminGuardarConfig, permiso: 'admin', escritura: true },
    'admin.usuarios': { fn: adminUsuarios, permiso: 'admin' },
    'admin.guardarUsuario': { fn: adminGuardarUsuario, permiso: 'admin', escritura: true },
    'admin.auditoria': { fn: adminAuditoria, permiso: 'admin' },
    'admin.estado': { fn: adminEstado, permiso: 'admin' },
    'admin.migrar': { fn: adminMigrar, permiso: 'admin', escritura: true },
    'admin.respaldar': { fn: adminRespaldar, permiso: 'admin', escritura: true },

    'entorno.estado': { fn: entornoEstadoApi, permiso: 'admin' },
    'entorno.crear': { fn: entornoCrearApi, permiso: 'admin', escritura: true },
    'entorno.cambiar': { fn: entornoCambiarApi, permiso: 'admin', escritura: true },
    'entorno.eliminar': { fn: entornoEliminarApi, permiso: 'admin', escritura: true }
  };
}

function doGet() {
  return respuestaJson({ ok: true, sistema: APP.nombre, version: APP.version, hora: ahoraISO() });
}

function doPost(e) {
  const inicio = Date.now();
  let accion = '';
  try {
    const cuerpo = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    accion = String(cuerpo.accion || '');
    const resultado = ejecutarAccion(accion, cuerpo.datos || {}, cuerpo.token, cuerpo.id_solicitud);
    return respuestaJson({ ok: true, datos: resultado, ms: Date.now() - inicio });
  } catch (error) {
    return respuestaJson(respuestaError(error, accion));
  }
}

function ejecutarAccion(accion, datos, token, idSolicitud) {
  const ruta = rutasApi()[accion];
  if (!ruta) throw new ErrorApp(`Acción no reconocida: ${accion}`, 'ACCION');
  instalarSiFalta(token);
  const usuario = autenticar(token);
  exigirPermiso(usuario, ruta.permiso);

  if (ruta.escritura && idSolicitud) {
    const previa = CacheService.getScriptCache().get('req_' + idSolicitud);
    if (previa) return JSON.parse(previa);
  }
  const resultado = ruta.fn(datos, usuario);
  if (ruta.escritura && idSolicitud) {
    const texto = JSON.stringify(resultado === undefined ? null : resultado);
    if (texto.length < 90000) CacheService.getScriptCache().put('req_' + idSolicitud, texto, 21600);
  }
  return resultado === undefined ? null : resultado;
}

/** Primera entrada: si la base de datos no existe y quien entra es el dueño del script, se instala sola. */
function instalarSiFalta(token) {
  if (PropertiesService.getScriptProperties().getProperty('DB_ID')) return;
  const email = verificarTokenGoogle(token);
  const dueno = String(Session.getEffectiveUser().getEmail() || '').toLowerCase();
  if (!dueno || email !== dueno) {
    throw new ErrorApp('El sistema aún no está instalado. La cuenta dueña debe entrar primero.', 'NO_INSTALADO');
  }
  const bloqueo = LockService.getScriptLock();
  if (!bloqueo.tryLock(60000)) throw new ErrorApp('La instalación está en curso. Espere un minuto y recargue.', 'OCUPADO');
  try {
    if (!PropertiesService.getScriptProperties().getProperty('DB_ID')) instalar();
  } finally {
    bloqueo.releaseLock();
  }
}

function respuestaError(error, accion) {
  const esApp = error && error.name === 'ErrorApp';
  console.error(`[API] ${accion}: ${error && error.message}`, error && error.stack);
  return {
    ok: false,
    codigo: esApp ? error.codigo : 'ERROR_INTERNO',
    error: esApp ? error.message : 'Ocurrió un error inesperado. Si persiste, informe a TI con la hora del error.',
    detalle: esApp ? error.detalle : String(error && error.message)
  };
}

function respuestaJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function sesionIniciar(datos, usuario) {
  db.actualizar('Usuarios', usuario.id, { ultimo_acceso: ahoraISO() }, usuario.email);
  const cfg = config.todo();
  return {
    usuario: {
      email: usuario.email, nombre: usuario.nombre, rol: usuario.rol,
      rol_nombre: ROLES[usuario.rol] ? ROLES[usuario.rol].nombre : usuario.rol,
      direccion: usuario.direccion, permisos: permisosDeRol(usuario.rol)
    },
    sistema: { nombre: APP.nombre, version: APP.version, entorno: db.entorno() },
    catalogos: {
      categorias: cfg.categorias,
      unidades: cfg.unidades,
      retenciones: cfg.retenciones,
      iva_pct: cfg.iva_pct,
      bancos: BANCOS,
      firmas_oc: cfg.firmas_oc,
      institucion: cfg.institucion,
      tolerancia_diferencia: toleranciaCuadreOP(),
      umbral_fondo_negro: umbralFondoNegro(),
      categorias_sin_factura: CATEGORIAS_SIN_FACTURA,
      orden_retenciones: ORDEN_RETENCIONES_FORMULARIO
    },
    tasa_hoy: tasaParaFecha(hoyISO())
  };
}


/* ===================== 10_Tasas.gs ===================== */
/**
 * Módulo: Tasa oficial BCV (Bs. por USD). Sincronización diaria con respaldo manual.
 * Regla: todos los días del calendario tienen tasa; fines de semana y feriados heredan la última publicada.
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.2-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

const FUENTE_RELLENO = 'RELLENO';
const FUENTE_HISTORICO_API = 'HISTORICO_API';
// bcv.today publica en GitHub Pages; jsDelivr es su espejo oficial por si GitHub Pages no responde.
const BCV_TODAY_RAICES = ['https://bcv.today/api/v1', 'https://cdn.jsdelivr.net/gh/grupoclip/bcv-api/api/v1'];
const CLAVE_CACHE_TASAS = 'tasas_mapa_v1';

function leerEntradaBcvToday(e) {
  if (!e || typeof e !== 'object') return { tasa: NaN, fecha: '' };
  return { tasa: Number(e.USD !== undefined ? e.USD : e.usd), fecha: aFechaISO(e.effective_date || e.date), fecha_calendario: aFechaISO(e.date) };
}

const PROVEEDORES_TASA = [
  {
    nombre: 'BCV_TODAY',
    url: BCV_TODAY_RAICES[0] + '/rate.json',
    leer: (texto) => leerEntradaBcvToday(JSON.parse(texto))
  },
  {
    nombre: 'BCV_TODAY_CDN',
    url: BCV_TODAY_RAICES[1] + '/rate.json',
    leer: (texto) => leerEntradaBcvToday(JSON.parse(texto))
  },
  {
    nombre: 'DOLARAPI',
    url: 'https://ve.dolarapi.com/v1/dolares/oficial',
    leer: (texto) => {
      const j = JSON.parse(texto);
      const fecha = j.fechaActualizacion ? formatearFecha(new Date(j.fechaActualizacion), 'yyyy-MM-dd') : '';
      return { tasa: Number(j.promedio), fecha };
    }
  },
  {
    nombre: 'BCV_WEB',
    url: 'https://www.bcv.org.ve/',
    opciones: { validateHttpsCertificates: false },
    leer: (texto) => {
      const bloque = texto.match(/id="dolar"[\s\S]*?<strong>\s*([\d.,]+)\s*<\/strong>/i);
      const fecha = texto.match(/Fecha Valor:[\s\S]*?content="(\d{4}-\d{2}-\d{2})/i);
      return { tasa: bloque ? aNumero(bloque[1]) : NaN, fecha: fecha ? fecha[1] : '' };
    }
  }
];

/* ---------- Lectura ---------- */

let memoTasas = null;

function mapaTasas() {
  if (memoTasas) return memoTasas.mapa;
  const cache = CacheService.getScriptCache();
  const guardado = cache.get(CLAVE_CACHE_TASAS);
  let mapa;
  if (guardado) {
    mapa = JSON.parse(guardado);
  } else {
    mapa = {};
    db.leer('Tasas').forEach((t) => { if (t.fecha && t.tasa > 0) mapa[t.fecha] = t.tasa; });
    const texto = JSON.stringify(mapa);
    if (texto.length < 95000) cache.put(CLAVE_CACHE_TASAS, texto, 1800);
  }
  memoTasas = { mapa, fechas: Object.keys(mapa).sort() };
  return mapa;
}

function invalidarCacheTasas() {
  memoTasas = null;
  CacheService.getScriptCache().remove(CLAVE_CACHE_TASAS);
}

/** Tasa exacta del día o, si falta, la última anterior. Devuelve {fecha, tasa, exacta} o null. */
function tasaParaFecha(fechaISO) {
  if (!esFechaISO(fechaISO)) return null;
  const mapa = mapaTasas();
  if (mapa[fechaISO]) return { fecha: fechaISO, tasa: mapa[fechaISO], exacta: true };
  const fechas = memoTasas.fechas;
  let bajo = 0;
  let alto = fechas.length - 1;
  let encontrada = -1;
  while (bajo <= alto) {
    const medio = (bajo + alto) >> 1;
    if (fechas[medio] < fechaISO) { encontrada = medio; bajo = medio + 1; } else { alto = medio - 1; }
  }
  if (encontrada < 0) return null;
  const f = fechas[encontrada];
  return { fecha: f, tasa: mapa[f], exacta: false };
}

/* ---------- Escritura ---------- */

function guardarTasa(fecha, tasa, fuente, usuario) {
  if (!esFechaISO(fecha)) throw new ErrorApp('Fecha de tasa inválida.', 'VALIDACION');
  const valor = Number(tasa);
  if (!(valor > 0)) throw new ErrorApp('El monto de la tasa debe ser mayor que cero.', 'VALIDACION');
  const existente = db.primero('Tasas', (t) => t.fecha === fecha);
  if (existente) {
    const mismaTasa = Math.abs(existente.tasa - valor) < 0.00005;
    const puedeReemplazar = existente.fuente === FUENTE_RELLENO || fuente === 'MANUAL' || !mismaTasa;
    if (mismaTasa && existente.fuente === fuente) return { accion: 'sin_cambios', fecha, tasa: valor };
    if (!puedeReemplazar) return { accion: 'sin_cambios', fecha, tasa: valor };
    db.actualizar('Tasas', existente.id, { tasa: valor, fuente }, usuario);
    return { accion: 'actualizada', fecha, tasa: valor, anterior: existente.tasa };
  }
  db.insertar('Tasas', { fecha, tasa: valor, fuente }, usuario);
  return { accion: 'creada', fecha, tasa: valor };
}

/** Crea los días faltantes (fines de semana, feriados) con la última tasa publicada. */
function rellenarHuecosTasas(hasta, usuario) {
  const todas = db.leer('Tasas').filter((t) => esFechaISO(t.fecha) && t.tasa > 0);
  if (!todas.length) return { creadas: 0, corregidas: 0 };
  const porFecha = {};
  todas.forEach((t) => { porFecha[t.fecha] = t; });
  const fechas = Object.keys(porFecha).sort();
  const limite = [hasta || hoyISO(), fechas[fechas.length - 1]].sort()[1];
  const nuevas = [];
  const correcciones = [];
  let ultima = null;
  for (let f = fechas[0]; f <= limite; f = sumarDias(f, 1)) {
    const registro = porFecha[f];
    if (registro && registro.fuente !== FUENTE_RELLENO) {
      ultima = registro.tasa;
    } else if (registro && ultima !== null && Math.abs(registro.tasa - ultima) > 0.00005) {
      correcciones.push({ id: registro.id, cambios: { tasa: ultima } });
    } else if (!registro && ultima !== null) {
      nuevas.push({ fecha: f, tasa: ultima, fuente: FUENTE_RELLENO });
    }
  }
  db.insertarLote('Tasas', nuevas, usuario);
  db.actualizarLote('Tasas', correcciones, usuario);
  return { creadas: nuevas.length, corregidas: correcciones.length };
}

function consultarProveedoresTasa() {
  const errores = [];
  for (let i = 0; i < PROVEEDORES_TASA.length; i++) {
    const p = PROVEEDORES_TASA[i];
    try {
      const opciones = Object.assign({
        muteHttpExceptions: true,
        headers: { 'User-Agent': 'ERP-Guanipa/1.0', Accept: 'application/json,text/html', 'Cache-Control': 'no-cache' }
      }, p.opciones || {});
      const r = UrlFetchApp.fetch(p.url, opciones);
      if (r.getResponseCode() !== 200) throw new Error('HTTP ' + r.getResponseCode());
      const dato = p.leer(r.getContentText());
      if (!(dato.tasa > 0) || !esFechaISO(dato.fecha)) throw new Error('Respuesta sin tasa o fecha válida');
      return Object.assign(dato, { fuente: p.nombre, errores });
    } catch (e) {
      errores.push(`${p.nombre}: ${e.message}`);
      console.warn(`Proveedor de tasa ${p.nombre} falló: ${e.message}`);
    }
  }
  throw new ErrorApp('No se pudo obtener la tasa BCV de ninguna fuente. Cárguela manualmente.', 'TASA_SIN_FUENTE', errores);
}

/** GET JSON sin caché. Devuelve {codigo, datos} y nunca lanza por códigos HTTP. */
function obtenerJsonSinCache(url) {
  const sep = url.indexOf('?') > -1 ? '&' : '?';
  const r = UrlFetchApp.fetch(url + sep + '_=' + Date.now(), {
    muteHttpExceptions: true,
    headers: { 'User-Agent': 'ERP-Guanipa/1.0', Accept: 'application/json', 'Cache-Control': 'no-cache' }
  });
  const codigo = r.getResponseCode();
  if (codigo !== 200) return { codigo, datos: null };
  try { return { codigo, datos: JSON.parse(r.getContentText()) }; } catch (e) { return { codigo: 500, datos: null }; }
}

/** Busca en bcv.today; si la fuente principal falla prueba el espejo de jsDelivr. */
function obtenerBcvToday(ruta) {
  for (let i = 0; i < BCV_TODAY_RAICES.length; i++) {
    try {
      const r = obtenerJsonSinCache(BCV_TODAY_RAICES[i] + ruta);
      if (r.codigo === 200 && r.datos) return r;
      if (r.codigo === 404) return r;
    } catch (e) {
      console.warn(`bcv.today ${ruta} (${BCV_TODAY_RAICES[i]}): ${e.message}`);
    }
  }
  return { codigo: 0, datos: null };
}

function entradasHistoricoBcvToday(datos) {
  let lista = Array.isArray(datos) ? datos : null;
  if (!lista && datos && typeof datos === 'object') {
    const clave = Object.keys(datos).find((k) => Array.isArray(datos[k]));
    lista = clave ? datos[clave] : null;
  }
  const porFecha = {};
  (lista || []).forEach((e) => {
    const x = leerEntradaBcvToday(e);
    if (esFechaISO(x.fecha) && x.tasa > 0) porFecha[x.fecha] = x.tasa;
  });
  return porFecha;
}

/** Inserta fechas faltantes y reemplaza días rellenados. Nunca toca cargas manuales ni importadas. Usar dentro de un bloqueo. */
function aplicarTasasExternas(porFecha, fuente, quien) {
  const existentes = {};
  db.leer('Tasas').forEach((t) => { existentes[t.fecha] = t; });
  const nuevas = [];
  const cambios = [];
  Object.keys(porFecha).sort().forEach((f) => {
    const e = existentes[f];
    if (!e) nuevas.push({ fecha: f, tasa: porFecha[f], fuente });
    else if (e.fuente === FUENTE_RELLENO) cambios.push({ id: e.id, cambios: { tasa: porFecha[f], fuente } });
  });
  db.insertarLote('Tasas', nuevas, quien);
  db.actualizarLote('Tasas', cambios, quien);
  return { creadas: nuevas.length, reemplazadas: cambios.length };
}

/** Descarga history.json de bcv.today (hasta 1830 días) y completa la tabla de tasas. */
function importarHistoricoBcvToday(usuario) {
  const quien = usuario && usuario.email ? usuario.email : String(usuario || 'sistema');
  const r = obtenerBcvToday('/history.json');
  if (!r.datos) throw new ErrorApp(`No se pudo descargar el histórico de bcv.today (${r.codigo ? 'código ' + r.codigo : 'sin conexión'}).`, 'TASA_SIN_FUENTE');
  const porFecha = entradasHistoricoBcvToday(r.datos);
  const total = Object.keys(porFecha).length;
  if (!total) throw new ErrorApp('El histórico de bcv.today llegó vacío o con un formato desconocido.', 'TASA_FORMATO');
  return db.conBloqueo(() => {
    const aplicado = aplicarTasasExternas(porFecha, FUENTE_HISTORICO_API, quien);
    const relleno = rellenarHuecosTasas(hoyISO(), quien);
    invalidarCacheTasas();
    const pagos = completarTasasPendientes(quien);
    const fechas = Object.keys(porFecha).sort();
    const resumen = Object.assign({ recibidas: total, desde: fechas[0], hasta: fechas[fechas.length - 1], relleno, pagos_actualizados: pagos }, aplicado);
    auditar(usuario || 'sistema', 'TASAS', 'IMPORTAR_HISTORICO_API', '', resumen);
    return resumen;
  });
}

/**
 * Revisa los últimos días hábiles que quedaron rellenados (la tasa no se publicó a tiempo o falló la red)
 * y pide a bcv.today el valor de esa fecha. Solo acepta el dato si su fecha valor es exactamente ese día,
 * así un feriado conserva la tasa anterior. Usar dentro de un bloqueo.
 */
function recuperarDiasHabilesDesdeApi(dias, quien) {
  const hoy = hoyISO();
  const porFecha = {};
  db.leer('Tasas').forEach((t) => { porFecha[t.fecha] = t; });
  const encontrados = {};
  let consultas = 0;
  for (let i = 1; i <= dias && consultas < 10; i++) {
    const f = sumarDias(hoy, -i);
    const dia = new Date(f + 'T12:00:00Z').getUTCDay();
    if (dia === 0 || dia === 6) continue;
    const t = porFecha[f];
    if (t && t.fuente !== FUENTE_RELLENO) continue;
    consultas++;
    const r = obtenerBcvToday(`/history/${f}.json`);
    const x = leerEntradaBcvToday(r.datos);
    if (r.datos && x.tasa > 0 && x.fecha === f) encontrados[f] = x.tasa;
  }
  if (!Object.keys(encontrados).length) return { consultadas: consultas, recuperadas: 0 };
  const aplicado = aplicarTasasExternas(encontrados, FUENTE_HISTORICO_API, quien);
  rellenarHuecosTasas(hoy, quien);
  return { consultadas: consultas, recuperadas: aplicado.creadas + aplicado.reemplazadas };
}

/** Disparador diario (y acción manual). Guarda la tasa, rellena huecos y completa pagos sin tasa. */
function sincronizarTasaBCV(usuario) {
  const quien = usuario && usuario.email ? usuario.email : 'sistema';
  const props = PropertiesService.getScriptProperties();
  try {
    const dato = consultarProveedoresTasa();
    const resultado = db.conBloqueo(() => {
      const guardado = guardarTasa(dato.fecha, dato.tasa, dato.fuente, quien);
      let recuperacion = { consultadas: 0, recuperadas: 0 };
      try { recuperacion = recuperarDiasHabilesDesdeApi(10, quien); } catch (e) { console.warn('Recuperación de días hábiles: ' + e.message); }
      const relleno = rellenarHuecosTasas(hoyISO(), quien);
      invalidarCacheTasas();
      const pagos = completarTasasPendientes(quien);
      return { guardado, relleno, recuperacion, pagos_actualizados: pagos };
    });
    props.setProperty('TASA_ULTIMA_SYNC', JSON.stringify({ ok: true, cuando: ahoraISO(), fuente: dato.fuente, fecha: dato.fecha, tasa: dato.tasa }));
    auditar(usuario || 'sistema', 'TASAS', 'SINCRONIZAR', dato.fecha, Object.assign({ fuente: dato.fuente }, resultado));
    return Object.assign({ fuente: dato.fuente, fecha: dato.fecha, tasa: dato.tasa, avisos: dato.errores }, resultado);
  } catch (e) {
    props.setProperty('TASA_ULTIMA_SYNC', JSON.stringify({ ok: false, cuando: ahoraISO(), error: e.message }));
    auditar(usuario || 'sistema', 'TASAS', 'ERROR_SINCRONIZAR', '', { error: e.message, detalle: e.detalle || null });
    throw e;
  }
}

/** Para el disparador de tiempo (no recibe usuario). */
function disparadorTasaBCV() {
  try {
    sincronizarTasaBCV(null);
  } catch (e) {
    console.error('Disparador de tasa BCV falló: ' + e.message);
  }
  // Las tasas son comunes; los pagos sin tasa del otro entorno también se completan.
  const otro = db.entorno() === ENTORNO_PRUEBAS ? ENTORNO_PRODUCCION : ENTORNO_PRUEBAS;
  if (otro === ENTORNO_PRUEBAS && !PropertiesService.getScriptProperties().getProperty('DB_ID_PRUEBAS')) return;
  try {
    db.usarEntorno(otro);
    db.conBloqueo(() => completarTasasPendientes('sistema'));
  } catch (e) {
    console.error(`Completar tasas en ${otro} falló: ${e.message}`);
  }
}

/** Asigna tasa y monto en USD a pagos y órdenes que se registraron antes de tener la tasa del día. */
function completarTasasPendientes(quien) {
  invalidarCacheTasas();
  const cambiosPagos = [];
  db.leer('Pagos').forEach((p) => {
    if (p.tasa_bcv > 0 || !p.fecha) return;
    const t = tasaParaFecha(p.fecha);
    if (t) cambiosPagos.push({ id: p.id, cambios: { tasa_bcv: t.tasa, monto_usd: redondear2(p.monto / t.tasa) } });
  });
  db.actualizarLote('Pagos', cambiosPagos, quien);
  const cambiosOrdenes = [];
  db.leer('OrdenesCompra').forEach((o) => {
    if (o.tasa_bcv > 0 || !o.fecha) return;
    const t = tasaParaFecha(o.fecha);
    if (t) cambiosOrdenes.push({ id: o.id, cambios: { tasa_bcv: t.tasa, monto_divisa: redondear2((o.total_final || 0) / t.tasa) } });
  });
  db.actualizarLote('OrdenesCompra', cambiosOrdenes, quien);
  return cambiosPagos.length + cambiosOrdenes.length;
}

/* ---------- Importación de histórico ---------- */

/** Acepta líneas como "9/11/2026 Bs897,54", "09/11/2026;897,54", "2026-11-09,897.54". */
function interpretarTextoTasas(texto) {
  const filas = [];
  const errores = [];
  String(texto || '').split(/\r?\n/).forEach((linea, i) => {
    const l = linea.trim();
    if (!l) return;
    const fechaTxt = (l.match(/\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}/) || [])[0];
    if (!fechaTxt) {
      if (i > 0) errores.push(`Línea ${i + 1}: sin fecha`);
      return;
    }
    const resto = l.replace(fechaTxt, ' ').replace(/[;\t|]/g, ' ');
    const numTxt = (resto.match(/-?[\d][\d.,]*/) || [])[0];
    const fecha = aFechaISO(fechaTxt);
    const tasa = aNumero(numTxt);
    if (!fecha || !(tasa > 0)) {
      errores.push(`Línea ${i + 1}: "${l.substring(0, 40)}" no se pudo leer`);
      return;
    }
    const fuente = /RELLENO/i.test(l) ? FUENTE_RELLENO : 'IMPORTACION';
    filas.push({ fecha, tasa, fuente });
  });
  return { filas, errores };
}

/* ---------- Acciones de la API ---------- */

function tasasListar(datos) {
  const dias = Math.min(Number(datos.dias) || 60, 1000);
  const todas = db.leer('Tasas').filter((t) => esFechaISO(t.fecha)).map(db.limpiar)
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  const ultimaSync = propiedad('TASA_ULTIMA_SYNC');
  return {
    tasas: todas.slice(0, dias),
    total: todas.length,
    desde: todas.length ? todas[todas.length - 1].fecha : null,
    hasta: todas.length ? todas[0].fecha : null,
    hoy: tasaParaFecha(hoyISO()),
    ultima_sincronizacion: ultimaSync ? JSON.parse(ultimaSync) : null
  };
}

function tasasConsultar(datos) {
  return tasaParaFecha(aFechaISO(datos.fecha));
}

function tasasSincronizar(datos, usuario) {
  return sincronizarTasaBCV(usuario);
}

function tasasGuardarManual(datos, usuario) {
  const fecha = aFechaISO(datos.fecha);
  const tasa = aNumero(datos.tasa);
  return db.conBloqueo(() => {
    const r = guardarTasa(fecha, tasa, 'MANUAL', usuario.email);
    const relleno = rellenarHuecosTasas(hoyISO(), usuario.email);
    invalidarCacheTasas();
    const pagos = completarTasasPendientes(usuario.email);
    auditar(usuario, 'TASAS', 'CARGA_MANUAL', fecha, Object.assign({}, r, { relleno }));
    return Object.assign(r, { relleno, pagos_actualizados: pagos });
  });
}

function tasasImportarTexto(datos, usuario) {
  const { filas, errores } = interpretarTextoTasas(datos.texto);
  if (!filas.length) throw new ErrorApp('No se encontró ninguna línea con fecha y tasa.', 'VALIDACION', errores.slice(0, 20));
  return db.conBloqueo(() => {
    const existentes = {};
    db.leer('Tasas').forEach((t) => { existentes[t.fecha] = t; });
    const nuevas = [];
    const cambios = [];
    filas.forEach((f) => {
      const e = existentes[f.fecha];
      if (!e) { nuevas.push(f); existentes[f.fecha] = f; return; }
      const reemplazable = e.fuente === FUENTE_RELLENO || datos.sobrescribir === true;
      if (reemplazable && e.id && Math.abs(e.tasa - f.tasa) > 0.00005) cambios.push({ id: e.id, cambios: { tasa: f.tasa, fuente: f.fuente } });
    });
    db.insertarLote('Tasas', nuevas, usuario.email);
    db.actualizarLote('Tasas', cambios, usuario.email);
    const relleno = rellenarHuecosTasas(hoyISO(), usuario.email);
    invalidarCacheTasas();
    const pagos = completarTasasPendientes(usuario.email);
    const resumen = { leidas: filas.length, creadas: nuevas.length, actualizadas: cambios.length, relleno, pagos_actualizados: pagos, errores: errores.slice(0, 30) };
    auditar(usuario, 'TASAS', 'IMPORTAR_HISTORICO', '', resumen);
    return resumen;
  });
}

function tasasImportarHistoricoApi(datos, usuario) {
  return importarHistoricoBcvToday(usuario);
}


/* ===================== 11_Beneficiarios.gs ===================== */
/**
 * Módulo: Beneficiarios y proveedores. Un registro por tipo + número de documento.
 * Reglas: cédula V/E de 6 a 8 dígitos, RIF J/G/C de 9 dígitos, cuenta de 20 dígitos de un banco existente.
 * Los datos con errores se guardan marcados (vienen de migraciones y conciliaciones) y salen primero en la lista.
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.7-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

function claveBeneficiario(tipo, documento) {
  return normalizarTipoDoc(tipo) + limpiarDocumento(documento);
}

/** Lista de problemas de datos del beneficiario (vacía si todo está bien). */
function problemasBeneficiario(b) {
  const lista = [];
  const doc = estadoDocumento(b.tipo_doc, b.documento);
  const cta = estadoCuenta(b.cuenta);
  if (doc !== 'VÁLIDO') lista.push('Documento: ' + doc.replace(/^ERROR \(|^INCOMPLETO \(|\)$/g, '').toLowerCase());
  if (cta !== 'VÁLIDO') lista.push('Cuenta: ' + cta.replace(/^ERROR \(|^INCOMPLETO \(|\)$/g, '').toLowerCase());
  return lista;
}

/**
 * Busca por tipo + documento. Tolera RIF con o sin dígito verificador y, si el tipo no viene
 * (o viene una letra no estándar), busca solo por número cuando hay un único candidato.
 */
function buscarBeneficiario(tipo, documento) {
  if (!limpiarDocumento(documento)) return null;
  const t = normalizarTipoDoc(tipo);
  const lista = db.leer('Beneficiarios');
  const mismoTipo = lista.filter((b) => b.tipo_doc === t && mismoDocumento(t, documento, b.tipo_doc, b.documento));
  if (mismoTipo.length) {
    const exacto = mismoTipo.find((b) => limpiarDocumento(b.documento) === limpiarDocumento(documento));
    return exacto || mismoTipo[0];
  }
  const porNumero = lista.filter((b) => mismoDocumento(t || b.tipo_doc, documento, b.tipo_doc, b.documento));
  return porNumero.length === 1 ? porNumero[0] : null;
}

function validarBeneficiario(datos) {
  const tipo = normalizarTipoDoc(datos.tipo_doc);
  const documento = normalizarDocumento(tipo, datos.documento);
  const nombre = normalizarNombre(datos.nombre);
  if (!tipo) throw new ErrorApp('Seleccione el tipo de documento (V, E, J, G o P).', 'VALIDACION');
  if (!documento) throw new ErrorApp('Indique el número de cédula o RIF.', 'VALIDACION');
  if (nombre.length < 3) throw new ErrorApp('Indique el nombre o razón social.', 'VALIDACION');
  const cuentaDigitos = soloDigitos(datos.cuenta);
  return {
    tipo_doc: tipo,
    documento,
    nombre,
    cuenta: cuentaDigitos.length === 20 ? formatearCuenta(cuentaDigitos) : cuentaDigitos,
    banco_codigo: codigoBanco(cuentaDigitos),
    banco: cuentaDigitos ? nombreBanco(cuentaDigitos) : '',
    estado_cuenta: estadoCuenta(cuentaDigitos),
    telefono: textoSeguro(datos.telefono, 40),
    correo: textoSeguro(datos.correo, 120).toLowerCase(),
    notas: textoSeguro(datos.notas, 500)
  };
}

/** Crea o actualiza el beneficiario a partir de un pago. No pisa datos válidos con datos peores. */
function sincronizarBeneficiarioDesdePago(pago, usuario) {
  const tipo = normalizarTipoDoc(pago.tipo_doc);
  const doc = normalizarDocumento(tipo, pago.documento);
  const nombre = normalizarNombre(pago.beneficiario);
  if (!tipo || !doc || nombre.length < 3) return null;
  const cuenta = soloDigitos(pago.cuenta);
  const porId = pago.beneficiario_id ? db.porId('Beneficiarios', pago.beneficiario_id) : null;
  const existente = porId || buscarBeneficiario(tipo, doc);
  if (!existente) {
    return db.insertar('Beneficiarios', {
      tipo_doc: tipo, documento: doc, nombre,
      cuenta: cuenta.length === 20 ? formatearCuenta(cuenta) : cuenta,
      banco_codigo: codigoBanco(cuenta), banco: cuenta ? nombreBanco(cuenta) : '',
      estado_cuenta: estadoCuenta(cuenta), alias: '', activo: true
    }, usuario);
  }
  const cambios = {};
  if (cuentaValida(cuenta) && soloDigitos(existente.cuenta) !== cuenta) {
    Object.assign(cambios, { cuenta: formatearCuenta(cuenta), banco_codigo: codigoBanco(cuenta), banco: nombreBanco(cuenta), estado_cuenta: 'VÁLIDO' });
  }
  if (estadoDocumento(tipo, doc) === 'VÁLIDO' && estadoDocumento(existente.tipo_doc, existente.documento) !== 'VÁLIDO') {
    cambios.documento = doc;
  }
  if (nombre && normalizarTexto(existente.nombre) !== normalizarTexto(nombre)) {
    const alias = String(existente.alias || '').split('|').filter(Boolean);
    if (alias.indexOf(nombre) === -1 && alias.length < 10) cambios.alias = alias.concat(nombre).join('|');
  }
  if (Object.keys(cambios).length) db.actualizar('Beneficiarios', existente.id, cambios, usuario);
  return existente;
}

let memoCategorias = null;

/** Última categoría usada para ese documento: evita reclasificar a mano al mismo proveedor. */
function categoriaSugerida(tipo, documento) {
  const doc = limpiarDocumento(documento);
  if (!doc) return '';
  if (!memoCategorias) {
    memoCategorias = {};
    const fechas = {};
    db.leer('Pagos').forEach((p) => {
      if (!p.categoria || p.estado === 'ANULADA') return;
      const d = soloDigitos(p.documento);
      const claves = [limpiarDocumento(d)];
      if (esRif(p.tipo_doc) && d.length === 9) claves.push(limpiarDocumento(d.substring(0, 8)));
      claves.forEach((k) => {
        if (!k) return;
        if (!fechas[k] || p.fecha >= fechas[k]) { fechas[k] = p.fecha; memoCategorias[k] = p.categoria; }
      });
    });
  }
  const d = soloDigitos(documento);
  return memoCategorias[doc] || (esRif(tipo) && d.length === 9 ? memoCategorias[limpiarDocumento(d.substring(0, 8))] || '' : '');
}

function pagosDeBeneficiario(b) {
  return db.leer('Pagos').filter((p) => p.beneficiario_id === b.id || mismoDocumento(p.tipo_doc, p.documento, b.tipo_doc, b.documento));
}

function conProblemas(b) {
  return Object.assign(db.limpiar(b), {
    estado_documento: estadoDocumento(b.tipo_doc, b.documento),
    estado_cuenta: estadoCuenta(b.cuenta),
    banco: soloDigitos(b.cuenta).length >= 4 ? nombreBanco(b.cuenta) : '',
    problemas: problemasBeneficiario(b)
  });
}

/* ---------- API ---------- */

function beneficiariosListar(datos) {
  const texto = normalizarTexto(datos.texto);
  const estado = datos.estado_cuenta || datos.estado || '';
  const pagina = Math.max(1, Number(datos.pagina) || 1);
  const porPagina = Math.min(Math.max(10, Number(datos.por_pagina) || 50), 200);
  const activos = db.leer('Beneficiarios').filter((b) => b.activo !== false).map(conProblemas);
  let lista = activos;
  if (texto) {
    const digitos = texto.replace(/\D/g, '').replace(/^0+/, '');
    lista = lista.filter((b) => normalizarTexto(b.nombre + ' ' + b.alias).indexOf(texto) > -1 ||
      (digitos && limpiarDocumento(b.documento).indexOf(digitos) > -1));
  }
  if (estado === 'VALIDO') lista = lista.filter((b) => !b.problemas.length);
  if (estado === 'PROBLEMA') lista = lista.filter((b) => b.problemas.length);
  // Los registros con errores van primero para que se corrijan antes de usarlos.
  lista.sort((a, b) => (b.problemas.length > 0) - (a.problemas.length > 0) || String(a.nombre).localeCompare(String(b.nombre), 'es'));
  return {
    total: lista.length, pagina, por_pagina: porPagina,
    registros: lista.slice((pagina - 1) * porPagina, pagina * porPagina),
    con_problemas: activos.filter((b) => b.problemas.length).length
  };
}

function beneficiariosBuscar(datos) {
  const texto = normalizarTexto(datos.texto);
  const activos = db.leer('Beneficiarios').filter((b) => b.activo !== false);
  const sugerir = (b) => Object.assign(conProblemas(b), { categoria_sugerida: categoriaSugerida(b.tipo_doc, b.documento) });
  if (!texto) {
    // Sin texto: los más pagados, para elegir rápido en el pago manual.
    const usos = {};
    db.leer('Pagos').forEach((p) => { if (p.beneficiario_id && p.estado !== ESTADO_ANULADA) usos[p.beneficiario_id] = (usos[p.beneficiario_id] || 0) + 1; });
    return activos.slice().sort((a, b) => (usos[b.id] || 0) - (usos[a.id] || 0) || String(a.nombre).localeCompare(String(b.nombre), 'es'))
      .slice(0, 12).map(sugerir);
  }
  if (texto.length < 2) return [];
  const digitos = texto.replace(/\D/g, '').replace(/^0+/, '');
  return activos
    .filter((b) => normalizarTexto(b.nombre + ' ' + b.alias).indexOf(texto) > -1 ||
      (digitos.length >= 3 && limpiarDocumento(b.documento).indexOf(digitos) === 0))
    .slice(0, 12)
    .map(sugerir);
}

function beneficiariosGuardar(datos, usuario) {
  const limpio = validarBeneficiario(datos);
  return db.conBloqueo(() => {
    const duplicado = db.primero('Beneficiarios', (b) => b.tipo_doc === limpio.tipo_doc &&
      mismoDocumento(b.tipo_doc, b.documento, limpio.tipo_doc, limpio.documento) && b.id !== datos.id);
    if (duplicado) throw new ErrorApp(`Ya existe un beneficiario con el documento ${limpio.tipo_doc}-${documentoConPuntos(limpio.documento, limpio.tipo_doc)}: ${duplicado.nombre}.`, 'DUPLICADO');
    let guardado;
    if (datos.id) {
      const r = db.actualizar('Beneficiarios', datos.id, Object.assign(limpio, { activo: datos.activo !== false }), usuario.email);
      auditar(usuario, 'BENEFICIARIOS', 'EDITAR', datos.id, diferencias(r.antes, r.despues));
      guardado = db.porId('Beneficiarios', datos.id);
    } else {
      guardado = db.insertar('Beneficiarios', Object.assign(limpio, { alias: '', activo: true }), usuario.email);
      auditar(usuario, 'BENEFICIARIOS', 'CREAR', guardado.id, db.limpiar(guardado));
    }
    const resultado = conProblemas(guardado);
    resultado.avisos = resultado.problemas;
    return resultado;
  });
}

/** Ficha del beneficiario: cuánto se le ha pagado, por qué conceptos y con qué frecuencia. */
function beneficiariosDetalle(datos) {
  const b = db.porId('Beneficiarios', datos.id);
  if (!b) throw new ErrorApp('No se encontró el beneficiario.', 'NO_ENCONTRADO');
  const pagos = pagosDeBeneficiario(b).filter((p) => p.estado !== ESTADO_ANULADA)
    .sort((x, y) => (x.fecha < y.fecha ? -1 : x.fecha > y.fecha ? 1 : (x.numero || 0) - (y.numero || 0)));
  const total = redondear2(pagos.reduce((s, p) => s + (p.monto || 0), 0));
  const totalUsd = redondear2(pagos.reduce((s, p) => s + (p.monto_usd || 0), 0));
  const porCategoria = {};
  const porMes = {};
  pagos.forEach((p) => {
    const c = p.categoria || 'Sin categoría';
    const rc = porCategoria[c] = porCategoria[c] || { categoria: c, cantidad: 0, monto: 0, monto_usd: 0 };
    rc.cantidad++; rc.monto += p.monto || 0; rc.monto_usd += p.monto_usd || 0;
    const m = String(p.fecha).substring(0, 7);
    const rm = porMes[m] = porMes[m] || { mes: m, cantidad: 0, monto: 0, monto_usd: 0 };
    rm.cantidad++; rm.monto += p.monto || 0; rm.monto_usd += p.monto_usd || 0;
  });
  let diasEntrePagos = null;
  if (pagos.length > 1) {
    const ms = (f) => new Date(f + 'T12:00:00Z').getTime();
    diasEntrePagos = Math.round((ms(pagos[pagos.length - 1].fecha) - ms(pagos[0].fecha)) / 864e5 / (pagos.length - 1));
  }
  const ordenes = db.leer('OrdenesCompra').filter((o) => o.estado !== ESTADO_ANULADA &&
    (o.beneficiario_id === b.id || mismoDocumento(o.tipo_doc, o.documento, b.tipo_doc, b.documento)));
  const redondear = (o) => Object.assign(o, { monto: redondear2(o.monto), monto_usd: redondear2(o.monto_usd) });
  return {
    beneficiario: conProblemas(b),
    resumen: {
      total_bs: total, total_usd: totalUsd, cantidad: pagos.length,
      promedio_bs: pagos.length ? redondear2(total / pagos.length) : 0,
      promedio_usd: pagos.length ? redondear2(totalUsd / pagos.length) : 0,
      primer_pago: pagos.length ? pagos[0].fecha : null,
      ultimo_pago: pagos.length ? pagos[pagos.length - 1].fecha : null,
      dias_entre_pagos: diasEntrePagos,
      op_generadas: pagos.filter((p) => p.op_generada === true).length,
      ordenes_compra_servicio: ordenes.length,
      monto_ordenes: redondear2(ordenes.reduce((s, o) => s + (o.total_final || 0), 0))
    },
    por_categoria: Object.keys(porCategoria).map((k) => redondear(porCategoria[k])).sort((x, y) => y.monto - x.monto),
    por_mes: Object.keys(porMes).sort().map((k) => redondear(porMes[k])),
    ultimos_pagos: pagos.slice(-20).reverse().map(resumenPago)
  };
}

/* ---------- Importar un listado de beneficiarios (Excel, CSV o texto pegado) ---------- */

function columnasListadoBeneficiarios(filas) {
  for (let i = 0; i < Math.min(filas.length, 15); i++) {
    const enc = filas[i].map((c) => normalizarTexto(c));
    const col = {
      tipo: indiceColumna(enc, [/^TIPO( DE)?( DOC| DOCUMENTO)?$/, /^TIPO/, /^V ?\/ ?[EJG]/]),
      documento: indiceColumna(enc, [/DOCUMENTO/, /CEDULA|RIF|C\.I/]),
      nombre: indiceColumna(enc, [/NOMBRE|RAZON SOCIAL|BENEFICIARIO/]),
      cuenta: indiceColumna(enc, [/CUENTA/])
    };
    if (col.documento > -1 && col.nombre > -1) return Object.assign(col, { fila: i });
  }
  return null;
}

function leerListadoBeneficiarios(datos) {
  let filas;
  if (datos.archivo && datos.archivo.base64) filas = leerArchivoConciliacion(datos.archivo).filas;
  else if (datos.texto) filas = textoAFilas(datos.texto);
  else throw new ErrorApp('Adjunte el archivo del listado o pegue sus filas.', 'VALIDACION');
  const col = columnasListadoBeneficiarios(filas);
  if (!col) throw new ErrorApp('No se encontraron las columnas del listado. Se necesitan al menos "Documento" (cédula/RIF) y "Nombre o Razón Social".', 'VALIDACION');
  const validos = [];
  const omitidos = [];
  let rifCompletados = 0;
  filas.slice(col.fila + 1).forEach((f, i) => {
    const fila = col.fila + i + 2;
    const crudo = String(f[col.documento] === undefined ? '' : f[col.documento]).trim();
    const nombre = normalizarNombre(f[col.nombre]);
    if (!crudo && !nombre) return;
    const conLetra = crudo.match(/^\s*([VEJGPC])\s*-?\s*\d/i);
    const letra = conLetra ? conLetra[1] : '';
    const tipo = normalizarTipoDoc(col.tipo > -1 && f[col.tipo] ? f[col.tipo] : letra);
    const normal = normalizarDocumento(tipo, crudo);
    const documento = completarRif(tipo, crudo);
    if (!tipo || !documento || !Number(documento) || nombre.length < 3) {
      omitidos.push({ fila, nombre: nombre || '(sin nombre)', documento: crudo, motivo: !tipo ? 'Sin tipo de documento' : (!Number(documento) ? 'Sin cédula/RIF' : 'Sin nombre') });
      return;
    }
    if (documento !== normal) rifCompletados++;
    validos.push({ tipo_doc: tipo, documento, nombre, cuenta: col.cuenta > -1 ? soloDigitos(f[col.cuenta]) : '' });
  });
  return { validos, omitidos, rifCompletados, filasLeidas: validos.length + omitidos.length };
}

function beneficiariosImportar(datos, usuario) {
  const leido = leerListadoBeneficiarios(datos);
  const consolidados = consolidarBeneficiarios(leido.validos);
  return db.conBloqueo(() => {
    const existentes = {};
    db.leer('Beneficiarios').forEach((b) => { existentes[claveDocumento(b.tipo_doc, b.documento)] = b; });
    const nuevos = [];
    const actualizaciones = [];
    consolidados.forEach((b) => {
      const previo = existentes[claveDocumento(b.tipo_doc, b.documento)];
      if (!previo) { nuevos.push(Object.assign(b, { notas: 'Importado del listado de beneficiarios' })); return; }
      const cambios = {};
      if (cuentaValida(b.cuenta) && !cuentaValida(previo.cuenta)) {
        Object.assign(cambios, { cuenta: b.cuenta, banco_codigo: b.banco_codigo, banco: b.banco, estado_cuenta: 'VÁLIDO' });
      }
      if (estadoDocumento(b.tipo_doc, b.documento) === 'VÁLIDO' && estadoDocumento(previo.tipo_doc, previo.documento) !== 'VÁLIDO') {
        cambios.documento = b.documento;
      }
      const alias = String(previo.alias || '').split('|').filter(Boolean);
      [b.nombre].concat(String(b.alias || '').split('|')).filter(Boolean).forEach((n) => {
        if (normalizarTexto(n) !== normalizarTexto(previo.nombre) && alias.indexOf(n) === -1 && alias.length < 10) alias.push(n);
      });
      if (alias.join('|') !== String(previo.alias || '')) cambios.alias = alias.join('|');
      if (Object.keys(cambios).length) actualizaciones.push({ id: previo.id, cambios });
    });
    const resumen = {
      simulacion: datos.simular === true,
      filas_leidas: leido.filasLeidas,
      documentos_unicos: consolidados.length,
      nuevos: nuevos.length,
      actualizados: actualizaciones.length,
      sin_cambios: consolidados.length - nuevos.length - actualizaciones.length,
      rif_completados: leido.rifCompletados,
      nuevos_con_errores: nuevos.filter((b) => problemasBeneficiario(b).length).length,
      omitidos: leido.omitidos.slice(0, 100),
      total_omitidos: leido.omitidos.length
    };
    if (datos.simular === true) return resumen;
    db.insertarLote('Beneficiarios', nuevos, usuario.email);
    if (actualizaciones.length) db.actualizarLote('Beneficiarios', actualizaciones, usuario.email);
    auditar(usuario, 'BENEFICIARIOS', 'IMPORTAR', '', Object.assign({ archivo: (datos.archivo && datos.archivo.nombre) || 'texto' }, resumen, { omitidos: resumen.total_omitidos }));
    return resumen;
  });
}


/* ===================== 12_Pagos.gs ===================== */
/**
 * Módulo: Pagos realizados (base de cada Orden de Pago; el número del pago es el número de la OP).
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.2-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

const ESTADO_ACTIVA = 'ACTIVA';
const ESTADO_ANULADA = 'ANULADA';

function faltantesPago(p) {
  const faltan = [];
  if (!esFechaISO(p.fecha)) faltan.push('fecha');
  if (!(Number(p.monto) > 0)) faltan.push('monto');
  if (!String(p.beneficiario || '').trim()) faltan.push('beneficiario');
  if (!p.categoria) faltan.push('categoría');
  if (!String(p.descripcion || '').trim()) faltan.push('descripción');
  if (p.categoria !== CATEGORIA_NOMINA) {
    if (!normalizarTipoDoc(p.tipo_doc) || !limpiarDocumento(p.documento)) faltan.push('documento');
    if (!cuentaValida(p.cuenta)) faltan.push('cuenta de 20 dígitos');
  }
  return faltan;
}

function estadoDatosPago(p) {
  return faltantesPago(p).length ? 'POR_COMPLETAR' : 'COMPLETO';
}

function camposCalculadosPago(p) {
  const cuenta = soloDigitos(p.cuenta);
  const t = tasaParaFecha(p.fecha);
  const tasa = p.tasa_bcv > 0 ? p.tasa_bcv : (t ? t.tasa : null);
  return {
    cuenta: cuenta ? formatearCuenta(cuenta) : '',
    banco_codigo: cuenta ? codigoBanco(cuenta) : (p.banco_codigo || ''),
    banco: cuenta ? nombreBanco(cuenta) : (p.banco_codigo ? nombreBanco(p.banco_codigo) : ''),
    tasa_bcv: tasa,
    monto_usd: tasa ? redondear2(p.monto / tasa) : null,
    estado_datos: estadoDatosPago(p)
  };
}

function resumenPago(p) {
  return {
    id: p.id, numero: p.numero, fecha: p.fecha, beneficiario: p.beneficiario, tipo_doc: p.tipo_doc,
    documento: p.documento, monto: p.monto, monto_usd: p.monto_usd, tasa_bcv: p.tasa_bcv,
    categoria: p.categoria, descripcion: p.descripcion, cuenta: p.cuenta, banco: p.banco,
    estado: p.estado, estado_datos: p.estado_datos, origen: p.origen, op_generada: p.op_generada === true,
    op_pdf_url: p.op_pdf_url, orden_compra_id: p.orden_compra_id,
    op_borrador: esBorradorOP(p), op_descuadre: descuadreOP(p)
  };
}

/** La orden tiene datos guardados (factura, retenciones…) pero todavía no se generó. */
function esBorradorOP(p) {
  return p.op_generada !== true && p.estado !== ESTADO_ANULADA && !!p.op_borrador_en;
}

/** Diferencia entre el neto calculado y lo pagado (0 si no hay factura o no hay cálculo). */
function descuadreOP(p) {
  const c = p.op_calculo;
  if (!c || !c.tiene_factura || c.diferencia === null || c.diferencia === undefined) return 0;
  return Math.abs(c.diferencia) > toleranciaCuadreOP() ? c.diferencia : 0;
}

function filtrarPagos(datos) {
  const anio = Number(datos.anio) || 0;
  const mes = Number(datos.mes) || 0;
  const texto = normalizarTexto(datos.texto);
  const digitos = texto.replace(/\D/g, '').replace(/^0+/, '');
  return db.leer('Pagos').filter((p) => {
    if (anio && String(p.fecha).substring(0, 4) !== String(anio)) return false;
    if (mes && Number(String(p.fecha).substring(5, 7)) !== mes) return false;
    if (datos.categoria && p.categoria !== datos.categoria) return false;
    if (datos.estado && p.estado !== datos.estado) return false;
    if (datos.estado_datos && p.estado_datos !== datos.estado_datos) return false;
    if (datos.op === 'GENERADA' && p.op_generada !== true) return false;
    if (datos.op === 'PENDIENTE' && (p.op_generada === true || p.estado === ESTADO_ANULADA)) return false;
    if (datos.op === 'BORRADOR' && !esBorradorOP(p)) return false;
    if (datos.desde && p.fecha < datos.desde) return false;
    if (datos.hasta && p.fecha > datos.hasta) return false;
    if (texto) {
      const enTexto = normalizarTexto(`${p.beneficiario} ${p.descripcion} ${p.referencia_banco}`).indexOf(texto) > -1;
      const enNumero = digitos && (String(p.numero) === digitos || limpiarDocumento(p.documento).indexOf(digitos) > -1);
      if (!enTexto && !enNumero) return false;
    }
    return true;
  });
}

/* ---------- API ---------- */

function pagosListar(datos) {
  const pagina = Math.max(1, Number(datos.pagina) || 1);
  const porPagina = Math.min(Math.max(10, Number(datos.por_pagina) || 50), 200);
  const lista = filtrarPagos(datos).sort((a, b) => (b.numero || 0) - (a.numero || 0));
  const activos = lista.filter((p) => p.estado !== ESTADO_ANULADA);
  return {
    total: lista.length,
    pagina, por_pagina: porPagina,
    totales: {
      monto: redondear2(activos.reduce((s, p) => s + (p.monto || 0), 0)),
      monto_usd: redondear2(activos.reduce((s, p) => s + (p.monto_usd || 0), 0)),
      por_completar: lista.filter((p) => p.estado_datos === 'POR_COMPLETAR' && p.estado !== ESTADO_ANULADA).length,
      op_pendientes: activos.filter((p) => p.op_generada !== true).length,
      op_borradores: activos.filter(esBorradorOP).length,
      anuladas: lista.length - activos.length
    },
    registros: lista.slice((pagina - 1) * porPagina, pagina * porPagina).map(resumenPago)
  };
}

function pagosObtener(datos) {
  const p = db.porId('Pagos', datos.id);
  if (!p) throw new ErrorApp('No se encontró el pago.', 'NO_ENCONTRADO');
  const oc = p.orden_compra_id ? db.porId('OrdenesCompra', p.orden_compra_id) : null;
  return {
    pago: db.limpiar(p),
    faltan: faltantesPago(p),
    orden_vinculada: oc ? { id: oc.id, tipo: oc.tipo, numero: oc.numero, total_final: oc.total_final, estado: oc.estado } : null,
    beneficiario_registrado: buscarBeneficiario(p.tipo_doc, p.documento) ? true : false,
    tasa: tasaParaFecha(p.fecha)
  };
}

function normalizarEntradaPago(datos, esAdmin) {
  const normalizadores = {
    beneficiario: (v) => normalizarNombre(v).substring(0, 200),
    tipo_doc: normalizarTipoDoc,
    documento: (v) => normalizarDocumento(datos.tipo_doc, v),
    categoria: (v) => textoSeguro(v, 120),
    descripcion: (v) => mayusculas(v).substring(0, 1000),
    cuenta: soloDigitos
  };
  const limpio = {};
  Object.keys(normalizadores).forEach((k) => {
    if (datos[k] !== undefined) limpio[k] = normalizadores[k](datos[k]);
  });
  const categorias = (config.obtener('categorias') || []).map((c) => c.nombre);
  if (limpio.categoria && categorias.indexOf(limpio.categoria) === -1) {
    throw new ErrorApp(`La categoría "${limpio.categoria}" no existe en el catálogo.`, 'VALIDACION');
  }
  if (limpio.cuenta && limpio.cuenta.length !== 20) {
    throw new ErrorApp(`El número de cuenta debe tener 20 dígitos (tiene ${limpio.cuenta.length}).`, 'VALIDACION');
  }
  if (esAdmin) {
    if (datos.fecha !== undefined) limpio.fecha = aFechaISO(datos.fecha);
    if (datos.monto !== undefined && datos.monto !== null && datos.monto !== '') limpio.monto = redondear2(aNumero(datos.monto));
    if (limpio.fecha === '') throw new ErrorApp('La fecha no es válida.', 'VALIDACION');
    if (limpio.monto !== undefined && !(limpio.monto > 0)) throw new ErrorApp('El monto debe ser mayor que cero.', 'VALIDACION');
  }
  return limpio;
}

function pagosGuardar(datos, usuario) {
  const esAdmin = tienePermiso(usuario, 'admin');
  return db.conBloqueo(() => {
    const actual = db.porId('Pagos', datos.id);
    if (!actual) throw new ErrorApp('No se encontró el pago.', 'NO_ENCONTRADO');
    if (actual.estado === ESTADO_ANULADA) throw new ErrorApp('El pago está anulado. Reactívelo antes de editarlo.', 'ESTADO');
    const cambios = normalizarEntradaPago(datos, esAdmin);
    // El monto de un pago importado viene del banco: no se edita (si está mal, se anula el pago).
    if (cambios.monto !== undefined && actual.origen !== 'MANUAL' && cambios.monto !== redondear2(actual.monto)) {
      throw new ErrorApp('El monto viene de la conciliación bancaria y no se puede modificar. Si el pago está mal, anúlelo.', 'VALIDACION');
    }
    if (actual.origen !== 'MANUAL') delete cambios.monto;
    const fusion = Object.assign({}, actual, cambios);
    if (cambios.fecha && cambios.fecha !== actual.fecha) fusion.tasa_bcv = null;
    Object.assign(cambios, camposCalculadosPago(fusion));
    const ben = sincronizarBeneficiarioDesdePago(fusion, usuario.email);
    if (ben) cambios.beneficiario_id = ben.id;
    const r = db.actualizar('Pagos', actual.id, cambios, usuario.email);
    auditar(usuario, 'PAGOS', 'EDITAR', actual.id, Object.assign({ numero: actual.numero }, diferencias(r.antes, r.despues)));
    return { pago: r.despues, faltan: faltantesPago(r.despues), op_desactualizada: actual.op_generada === true };
  });
}

function pagosCrear(datos, usuario) {
  const entrada = normalizarEntradaPago(datos, true);
  if (!entrada.fecha) throw new ErrorApp('Indique la fecha del pago.', 'VALIDACION');
  if (!(entrada.monto > 0)) throw new ErrorApp('Indique el monto pagado.', 'VALIDACION');
  return db.conBloqueo(() => {
    let numero = Number(datos.numero) || 0;
    if (numero) {
      if (db.primero('Pagos', (p) => Number(p.numero) === numero)) throw new ErrorApp(`El número ${numero} ya está asignado a otro pago.`, 'DUPLICADO');
      const cor = config.obtener('correlativos') || {};
      if (numero >= (Number(cor.op) || 1)) config.guardar('correlativos', Object.assign({}, cor, { op: numero + 1 }), usuario.email);
    } else {
      numero = config.reservarCorrelativo('op', 1, usuario.email);
    }
    const base = Object.assign({ numero, estado: ESTADO_ACTIVA, origen: 'MANUAL', op_generada: false, op_version: 0 }, entrada);
    Object.assign(base, camposCalculadosPago(base));
    const ben = sincronizarBeneficiarioDesdePago(base, usuario.email);
    if (ben) base.beneficiario_id = ben.id;
    const nuevo = db.insertar('Pagos', base, usuario.email);
    auditar(usuario, 'PAGOS', 'CREAR_MANUAL', nuevo.id, resumenPago(nuevo));
    return { pago: db.limpiar(nuevo), faltan: faltantesPago(nuevo) };
  });
}

function pagosAnular(datos, usuario) {
  const motivo = textoSeguro(datos.motivo, 500);
  if (motivo.length < 5) throw new ErrorApp('Indique el motivo de la anulación (mínimo 5 caracteres).', 'VALIDACION');
  return db.conBloqueo(() => {
    const p = db.porId('Pagos', datos.id);
    if (!p) throw new ErrorApp('No se encontró el pago.', 'NO_ENCONTRADO');
    if (p.estado === ESTADO_ANULADA) throw new ErrorApp('La orden ya estaba anulada.', 'ESTADO');
    const r = db.actualizar('Pagos', p.id, {
      estado: ESTADO_ANULADA, motivo_anulacion: motivo, anulado_por: usuario.email, anulado_en: ahoraISO()
    }, usuario.email);
    auditar(usuario, 'PAGOS', 'ANULAR', p.id, { numero: p.numero, motivo });
    return r.despues;
  });
}

function pagosReactivar(datos, usuario) {
  const motivo = textoSeguro(datos.motivo, 500);
  if (motivo.length < 5) throw new ErrorApp('Indique el motivo de la reactivación.', 'VALIDACION');
  return db.conBloqueo(() => {
    const p = db.porId('Pagos', datos.id);
    if (!p) throw new ErrorApp('No se encontró el pago.', 'NO_ENCONTRADO');
    if (p.estado !== ESTADO_ANULADA) throw new ErrorApp('La orden no está anulada.', 'ESTADO');
    const anterior = { motivo: p.motivo_anulacion, por: p.anulado_por, en: p.anulado_en };
    const r = db.actualizar('Pagos', p.id, { estado: ESTADO_ACTIVA, motivo_anulacion: '', anulado_por: '', anulado_en: '' }, usuario.email);
    auditar(usuario, 'PAGOS', 'REACTIVAR', p.id, { numero: p.numero, motivo, anulacion_previa: anterior });
    return r.despues;
  });
}

function pagosRecalcularTasa(datos, usuario) {
  return db.conBloqueo(() => {
    const p = db.porId('Pagos', datos.id);
    if (!p) throw new ErrorApp('No se encontró el pago.', 'NO_ENCONTRADO');
    const t = tasaParaFecha(p.fecha);
    if (!t) throw new ErrorApp('No hay tasa BCV registrada para esa fecha ni para días anteriores.', 'SIN_TASA');
    const r = db.actualizar('Pagos', p.id, { tasa_bcv: t.tasa, monto_usd: redondear2(p.monto / t.tasa) }, usuario.email);
    auditar(usuario, 'PAGOS', 'RECALCULAR_TASA', p.id, diferencias(r.antes, r.despues));
    return r.despues;
  });
}


/* ===================== 13_Conciliacion.gs ===================== */
/**
 * Módulo: Importación de conciliaciones bancarias (Excel, CSV o texto pegado).
 * Cada débito se convierte en un pago con número de Orden de Pago correlativo.
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.2-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

const MAX_MOVIMIENTOS_IMPORTACION = 600;

/* ---------- Lectura de archivos ---------- */

function mimePorExtension(ext) {
  return {
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xls: 'application/vnd.ms-excel',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    csv: 'text/csv',
    txt: 'text/plain'
  }[ext] || 'application/octet-stream';
}

function textoAFilas(texto) {
  const lineas = String(texto || '').replace(/^\uFEFF/, '').replace(/\r/g, '').split('\n').filter((l) => l.trim());
  if (!lineas.length) return [];
  const muestra = lineas.slice(0, 5).join('\n');
  const separador = muestra.indexOf('\t') > -1 ? '\t' : (muestra.split(';').length > muestra.split(',').length ? ';' : null);
  if (separador) return lineas.map((l) => l.split(separador).map((c) => c.trim()));
  return Utilities.parseCsv(lineas.join('\n'));
}

/** El archivo convertido se lee aquí directamente: es un insumo temporal, no una tabla del sistema. */
function leerArchivoConciliacion(archivo) {
  const nombre = textoSeguro(archivo.nombre, 150) || 'conciliacion.xlsx';
  const ext = (nombre.split('.').pop() || '').toLowerCase();
  if (['xlsx', 'xls', 'ods', 'csv', 'txt'].indexOf(ext) === -1) {
    throw new ErrorApp('Formato no soportado. Use Excel (.xlsx, .xls), .ods o .csv.', 'VALIDACION');
  }
  const blob = Utilities.newBlob(Utilities.base64Decode(archivo.base64), mimePorExtension(ext), nombre);
  const carpeta = carpetaDocumentos('IMPORTACIONES', hoyISO());
  const marca = formatearFecha(new Date(), 'yyyyMMdd_HHmmss');
  const original = carpeta.createFile(blob.copyBlob().setName(`${marca}_${nombre}`));
  let filas;
  if (ext === 'csv' || ext === 'txt') {
    filas = textoAFilas(blob.getDataAsString('UTF-8'));
  } else {
    const temporal = Drive.Files.create(
      { name: `tmp_${marca}_${nombre}`, mimeType: 'application/vnd.google-apps.spreadsheet', parents: [carpeta.getId()] },
      blob
    );
    try {
      const hojas = SpreadsheetApp.openById(temporal.id).getSheets();
      filas = [];
      for (let i = 0; i < hojas.length; i++) {
        const valores = hojas[i].getDataRange().getValues();
        if (detectarColumnasConciliacion(valores)) { filas = valores; break; }
        if (!filas.length) filas = valores;
      }
    } finally {
      DriveApp.getFileById(temporal.id).setTrashed(true);
    }
  }
  return { filas, archivo: { id: original.getId(), url: original.getUrl(), nombre } };
}

/* ---------- Interpretación ---------- */

function detectarColumnasConciliacion(filas) {
  const limite = Math.min(filas.length, 25);
  for (let i = 0; i < limite; i++) {
    const norm = (filas[i] || []).map((c) => normalizarTexto(c));
    const fecha = norm.findIndex((c) => /^FECHA/.test(c));
    const desc = norm.findIndex((c) => /DESCRIP|CONCEPTO|DETALLE/.test(c));
    let monto = norm.findIndex((c) => /DEBITO|CARGO|EGRESO|RETIRO/.test(c));
    if (monto === -1) monto = norm.findIndex((c) => /^MONTO|^IMPORTE/.test(c));
    const ref = norm.findIndex((c) => /REFERENCIA|^REF\.?$/.test(c));
    if (fecha > -1 && desc > -1 && monto > -1) return { inicio: i + 1, fecha, desc, monto, ref };
  }
  for (let i = 0; i < limite; i++) {
    const fila = filas[i] || [];
    const fecha = fila.findIndex((c) => aFechaISO(c) !== '' && !(typeof c === 'number' && c < 20000));
    const desc = fila.findIndex((c, k) => k > fecha && typeof c === 'string' && /[A-Za-z]{3}/.test(c) && c.length > 8);
    let monto = -1;
    for (let k = fila.length - 1; k > desc; k--) { if (aNumero(fila[k]) > 0) { monto = k; break; } }
    if (fecha > -1 && desc > -1 && monto > -1) return { inicio: i, fecha, desc, monto, ref: -1 };
  }
  return null;
}

/**
 * Formatos vistos en el Banco de Venezuela:
 *   PAGO A PROVEEDORES BDV J030000001 LOTE 00500001   (letra + 9 dígitos con ceros)
 *   PAGO A PROVEEDORES BDV M020000009 LOTE 00500002   (letra no estándar: se busca solo por número)
 *   PAGO A PROVEEDORES BDV 012345678 LOTE 00500003    (sin letra: se busca solo por número)
 *   PAGO A PROVEEDORES OTROS BANCOS 0174 J400000029   (código del banco destino + RIF con dígito verificador)
 *   PAGO DE NOMINA
 */
/** El BDV rellena a 9 dígitos con ceros a la izquierda y no incluye el dígito verificador del RIF. */
function documentoBdv(tipo, digitos) {
  const d = soloDigitos(digitos);
  const sinRelleno = d.length === 9 && d.charAt(0) === '0' ? d.substring(1) : d;
  // El BDV rellena con un cero y omite el dígito verificador del RIF: se calcula.
  return esRif(tipo) ? completarRif(tipo, sinRelleno) : limpiarDocumento(sinRelleno);
}

function interpretarDescripcionBancaria(descripcion) {
  const d = normalizarTexto(descripcion);
  const vacio = { tipo_mov: 'OTRO', banco_codigo: '', tipo_doc: '', documento: '', lote: '' };
  let m = d.match(/OTROS BANCOS\s+(\d{4})\s+([A-Z])?[- ]?(\d{5,10})\b/);
  if (m) return { tipo_mov: 'PROVEEDOR', banco_codigo: m[1], tipo_doc: normalizarTipoDoc(m[2]), documento: completarRif(m[2], m[3]), lote: '' };
  m = d.match(/\bBDV\s+([A-Z])?[- ]?(\d{5,10})\b(?:.*?\bLOTE\s*(\d+))?/);
  if (m) return { tipo_mov: 'PROVEEDOR', banco_codigo: '0102', tipo_doc: normalizarTipoDoc(m[1]), documento: documentoBdv(m[1], m[2]), lote: m[3] || '' };
  if (/NOMINA/.test(d)) return Object.assign({}, vacio, { tipo_mov: 'NOMINA' });
  m = d.match(/\b([VEJGP])[- ]?(\d{6,10})\b/);
  if (m) return { tipo_mov: 'PROVEEDOR', banco_codigo: '', tipo_doc: m[1], documento: completarRif(m[1], m[2]), lote: '' };
  return vacio;
}

function claveMovimiento(fecha, descripcion, monto, ocurrencia) {
  return hashTexto(`${fecha}|${normalizarTexto(descripcion)}|${Number(monto).toFixed(2)}|${ocurrencia}`).substring(0, 32);
}

function extraerMovimientos(filas) {
  const cols = detectarColumnasConciliacion(filas);
  if (!cols) throw new ErrorApp('No se reconocieron las columnas. El archivo debe tener Fecha, Descripción y Débito (o Monto).', 'FORMATO');
  const vistos = {};
  const movimientos = [];
  let ignoradas = 0;
  for (let i = cols.inicio; i < filas.length; i++) {
    const fila = filas[i] || [];
    const fecha = aFechaISO(fila[cols.fecha]);
    const descripcion = String(fila[cols.desc] === undefined ? '' : fila[cols.desc]).replace(/\s+/g, ' ').trim();
    const monto = redondear2(aNumero(fila[cols.monto]));
    if (!fecha || !descripcion || !(monto > 0)) { if (fila.some((c) => c !== '' && c !== null)) ignoradas++; continue; }
    const base = `${fecha}|${normalizarTexto(descripcion)}|${monto.toFixed(2)}`;
    vistos[base] = (vistos[base] || 0) + 1;
    movimientos.push({
      fila: i + 1, fecha, descripcion, monto,
      referencia: cols.ref > -1 ? String(fila[cols.ref] || '') : '',
      ocurrencia: vistos[base]
    });
  }
  return { movimientos, ignoradas };
}

function enriquecerMovimiento(mov, contexto) {
  const info = interpretarDescripcionBancaria(mov.descripcion);
  const clave = claveMovimiento(mov.fecha, mov.descripcion, mov.monto, mov.ocurrencia);
  const r = Object.assign({}, mov, info, {
    clave, estado: 'NUEVO', observaciones: [], beneficiario: '', beneficiario_id: '', cuenta: '',
    categoria: '', descripcion_pago: '', sugerencias: []
  });
  if (contexto.claves[clave]) {
    r.estado = 'DUPLICADO';
    r.observaciones.push(`Ya importado como pago N° ${contexto.claves[clave]}`);
  }
  if (info.tipo_mov === 'NOMINA') {
    r.beneficiario = contexto.nombreNomina;
    r.categoria = CATEGORIA_NOMINA;
    r.descripcion_pago = 'PAGO DE NÓMINA';
  } else if (info.documento) {
    const ben = buscarBeneficiario(info.tipo_doc, info.documento);
    if (ben) {
      r.beneficiario = ben.nombre;
      r.beneficiario_id = ben.id;
      r.tipo_doc = ben.tipo_doc;
      r.documento = ben.documento;
      const bancoCuenta = codigoBanco(ben.cuenta);
      if (cuentaValida(ben.cuenta) && (!info.banco_codigo || info.banco_codigo === bancoCuenta)) {
        r.cuenta = ben.cuenta;
      } else if (cuentaValida(ben.cuenta)) {
        r.observaciones.push(`La cuenta registrada es de ${nombreBanco(bancoCuenta)}; el pago fue a ${nombreBanco(info.banco_codigo)}`);
      } else {
        r.observaciones.push('Beneficiario sin cuenta válida registrada');
      }
      r.categoria = categoriaSugerida(ben.tipo_doc, ben.documento);
    } else {
      r.sugerencias = sugerirBeneficiarios(info.tipo_doc, info.documento, contexto.beneficiarios);
      r.observaciones.push(r.sugerencias.length
        ? `Documento no registrado. ¿Es ${r.sugerencias[0].nombre}? (${r.sugerencias[0].motivo})`
        : 'Beneficiario nuevo: complete nombre y cuenta');
    }
  } else {
    r.observaciones.push('No se identificó el documento del beneficiario');
  }
  if (r.estado === 'NUEVO' && info.documento) {
    const parecido = contexto.porFechaMonto[`${mov.fecha}|${mov.monto.toFixed(2)}`];
    if (parecido && parecido.some((p) => mismoDocumento(p.tipo_doc, p.documento, info.tipo_doc, info.documento) || !p.documento)) {
      r.estado = 'POSIBLE_DUPLICADO';
      r.observaciones.push(`Ya existe un pago del ${fechaVE(mov.fecha)} por el mismo monto (N° ${parecido.map((p) => p.numero).join(', ')})`);
    }
  }
  const t = tasaParaFecha(mov.fecha);
  r.tasa_bcv = t ? t.tasa : null;
  r.monto_usd = t ? redondear2(mov.monto / t.tasa) : null;
  if (!t) r.observaciones.push('Sin tasa BCV para esa fecha: se completará al sincronizar');
  return r;
}

function contextoImportacion() {
  const claves = {};
  const porFechaMonto = {};
  db.leer('Pagos').forEach((p) => {
    if (p.clave_conciliacion) claves[p.clave_conciliacion] = p.numero;
    if (p.estado === ESTADO_ANULADA) return;
    const k = `${p.fecha}|${Number(p.monto).toFixed(2)}`;
    (porFechaMonto[k] = porFechaMonto[k] || []).push({ numero: p.numero, tipo_doc: p.tipo_doc, documento: p.documento });
  });
  return {
    claves, porFechaMonto, nombreNomina: config.obtener('beneficiario_nomina') || 'PAGO DE NÓMINA',
    beneficiarios: db.leer('Beneficiarios').filter((b) => b.activo !== false)
  };
}

/** Registrados cuyo documento se parece al del banco (error de tipeo en uno de los dos). Máximo 3. */
function sugerirBeneficiarios(tipo, documento, lista) {
  const grupo = (t) => (esRif(t) ? 'RIF' : 'CEDULA');
  return (lista || [])
    .filter((b) => !tipo || grupo(b.tipo_doc) === grupo(tipo))
    .map((b) => ({
      b, motivo: parecidoDocumento(tipo || b.tipo_doc, documento, b.tipo_doc, b.documento),
      comun: subcadenaComunMayor(nucleoDocumento(tipo || b.tipo_doc, documento), nucleoDocumento(b.tipo_doc, b.documento))
    }))
    .filter((x) => x.motivo)
    // Primero los que comparten la secuencia más larga de dígitos.
    .sort((x, y) => (y.comun - x.comun) || ((x.b.tipo_doc === tipo ? 0 : 1) - (y.b.tipo_doc === tipo ? 0 : 1)))
    .slice(0, 3)
    .map((x) => ({
      id: x.b.id, nombre: x.b.nombre, tipo_doc: x.b.tipo_doc, documento: x.b.documento,
      cuenta: cuentaValida(x.b.cuenta) ? x.b.cuenta : '', motivo: x.motivo,
      categoria: categoriaSugerida(x.b.tipo_doc, x.b.documento)
    }));
}

/* ---------- API ---------- */

function conciliacionAnalizar(datos) {
  let filas;
  let archivo = null;
  if (datos.archivo && datos.archivo.base64) {
    const leido = leerArchivoConciliacion(datos.archivo);
    filas = leido.filas;
    archivo = leido.archivo;
  } else if (datos.texto) {
    filas = textoAFilas(datos.texto);
  } else {
    throw new ErrorApp('Adjunte un archivo o pegue las filas de la conciliación.', 'VALIDACION');
  }
  const { movimientos, ignoradas } = extraerMovimientos(filas);
  if (movimientos.length > MAX_MOVIMIENTOS_IMPORTACION) {
    throw new ErrorApp(`El archivo tiene ${movimientos.length} débitos. Divídalo en partes de máximo ${MAX_MOVIMIENTOS_IMPORTACION}.`, 'VALIDACION');
  }
  const contexto = contextoImportacion();
  const resultado = movimientos.map((m) => enriquecerMovimiento(m, contexto));
  const nuevos = resultado.filter((m) => m.estado === 'NUEVO');
  const fechas = resultado.map((m) => m.fecha).sort();
  return {
    archivo,
    movimientos: resultado,
    resumen: {
      total: resultado.length,
      nuevos: nuevos.length,
      duplicados: resultado.filter((m) => m.estado === 'DUPLICADO').length,
      posibles_duplicados: resultado.filter((m) => m.estado === 'POSIBLE_DUPLICADO').length,
      sin_beneficiario: resultado.filter((m) => !m.beneficiario).length,
      ignoradas,
      monto_nuevos: redondear2(nuevos.reduce((s, m) => s + m.monto, 0)),
      desde: fechas[0] || null,
      hasta: fechas[fechas.length - 1] || null,
      proximo_numero: (config.obtener('correlativos') || {}).op || 1
    }
  };
}

function conciliacionConfirmar(datos, usuario) {
  const entrada = Array.isArray(datos.movimientos) ? datos.movimientos : [];
  if (!entrada.length) throw new ErrorApp('No hay movimientos seleccionados para importar.', 'VALIDACION');
  if (entrada.length > MAX_MOVIMIENTOS_IMPORTACION) throw new ErrorApp('Demasiados movimientos en una sola importación.', 'VALIDACION');
  const categorias = (config.obtener('categorias') || []).map((c) => c.nombre);

  return db.conBloqueo(() => {
    const contexto = contextoImportacion();
    const validos = [];
    const omitidos = [];
    entrada.forEach((m) => {
      const fecha = aFechaISO(m.fecha);
      const monto = redondear2(aNumero(m.monto));
      const descripcion = textoSeguro(m.descripcion, 300);
      const ocurrencia = Math.max(1, Number(m.ocurrencia) || 1);
      if (!fecha || !(monto > 0) || !descripcion) { omitidos.push({ fila: m.fila, motivo: 'Datos incompletos' }); return; }
      const mov = enriquecerMovimiento({ fila: m.fila, fecha, descripcion, monto, referencia: textoSeguro(m.referencia, 60), ocurrencia }, contexto);
      if (mov.estado === 'DUPLICADO') { omitidos.push({ fila: m.fila, motivo: 'Ya importado' }); return; }
      contexto.claves[mov.clave] = 'en proceso';
      if (m.categoria && categorias.indexOf(m.categoria) > -1) mov.categoria = m.categoria;
      if (m.descripcion_pago) mov.descripcion_pago = mayusculas(m.descripcion_pago).substring(0, 1000);
      if (m.beneficiario_elegido && !mov.beneficiario_id && mov.tipo_mov !== 'NOMINA') {
        // El usuario confirmó una sugerencia: se usa el registrado y se guarda el documento del banco como referencia.
        const ben = db.porId('Beneficiarios', m.beneficiario_elegido);
        if (ben) {
          mov.observacion_documento = `Documento en el banco: ${mov.tipo_doc}-${mov.documento}`;
          Object.assign(mov, { beneficiario_id: ben.id, beneficiario: ben.nombre, tipo_doc: ben.tipo_doc, documento: ben.documento });
          if (cuentaValida(ben.cuenta)) mov.cuenta = ben.cuenta;
          if (!mov.categoria) mov.categoria = categoriaSugerida(ben.tipo_doc, ben.documento);
        }
      }
      if (m.beneficiario && !mov.beneficiario_id && mov.tipo_mov !== 'NOMINA') mov.beneficiario = normalizarNombre(m.beneficiario).substring(0, 200);
      if (m.cuenta && !mov.cuenta && cuentaValida(m.cuenta)) mov.cuenta = formatearCuenta(m.cuenta);
      validos.push(mov);
    });
    if (!validos.length) return { importados: 0, omitidos, pagos: [] };

    validos.sort((a, b) => (a.fecha === b.fecha ? a.fila - b.fila : (a.fecha < b.fecha ? -1 : 1)));
    const inicio = config.reservarCorrelativo('op', validos.length, usuario.email);
    const importacionId = uuid();
    const pagos = validos.map((m, i) => {
      const p = {
        numero: inicio + i, fecha: m.fecha, beneficiario_id: m.beneficiario_id, beneficiario: m.beneficiario,
        tipo_doc: m.tipo_doc, documento: m.documento, monto: m.monto, categoria: m.categoria,
        descripcion: m.descripcion_pago, cuenta: m.cuenta, banco_codigo: m.cuenta ? codigoBanco(m.cuenta) : m.banco_codigo,
        tasa_bcv: m.tasa_bcv, monto_usd: m.monto_usd, estado: ESTADO_ACTIVA, origen: 'CONCILIACION',
        clave_conciliacion: m.clave, referencia_banco: m.observacion_documento ? `${m.descripcion} · ${m.observacion_documento}` : m.descripcion,
        lote: m.lote, importacion_id: importacionId,
        op_generada: false, op_version: 0
      };
      p.banco = p.banco_codigo ? nombreBanco(p.banco_codigo) : '';
      p.estado_datos = estadoDatosPago(p);
      return p;
    });
    const insertados = db.insertarLote('Pagos', pagos, usuario.email);
    insertados.forEach((p) => {
      if (!p.beneficiario_id && p.cuenta) {
        const ben = sincronizarBeneficiarioDesdePago(p, usuario.email);
        if (ben) db.actualizar('Pagos', p.id, { beneficiario_id: ben.id }, usuario.email);
      }
    });
    const fechas = pagos.map((p) => p.fecha).sort();
    const archivo = datos.archivo || {};
    db.insertar('Importaciones', {
      id: importacionId, archivo_nombre: archivo.nombre || 'Texto pegado', archivo_id: archivo.id || '',
      archivo_url: archivo.url || '', filas_total: entrada.length, filas_importadas: insertados.length,
      duplicadas: omitidos.length, monto_total: redondear2(pagos.reduce((s, p) => s + p.monto, 0)),
      rango_desde: fechas[0], rango_hasta: fechas[fechas.length - 1]
    }, usuario.email);
    const resumen = {
      importados: insertados.length, omitidos, desde_numero: inicio, hasta_numero: inicio + insertados.length - 1,
      por_completar: insertados.filter((p) => p.estado_datos === 'POR_COMPLETAR').length,
      monto_total: redondear2(pagos.reduce((s, p) => s + p.monto, 0))
    };
    auditar(usuario, 'CONCILIACION', 'IMPORTAR', importacionId, Object.assign({ archivo: archivo.nombre || 'texto' }, resumen));
    return resumen;
  });
}

function conciliacionHistorial() {
  return db.leer('Importaciones').map(db.limpiar)
    .sort((a, b) => (a.creado_en < b.creado_en ? 1 : -1)).slice(0, 50);
}


/* ===================== 14_OrdenesPago.gs ===================== */
/**
 * Módulo: Orden de Pago (factura, retenciones, imputación, PDF).
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.7-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

function toleranciaCuadreOP() {
  const t = Number(config.obtener('tolerancia_diferencia'));
  return t >= 0 && !isNaN(t) && config.obtener('tolerancia_diferencia') !== undefined ? t : 1;
}

function umbralFondoNegro() {
  return Number(config.obtener('umbral_fondo_negro')) || CONFIG_BASE.umbral_fondo_negro.valor;
}

/**
 * Cálculo puro (sin acceso a datos) para poder probarlo y reutilizarlo en el ERP.
 * El Fondo Negro Primero no se elige: se aplica solo cuando el total de la factura supera el umbral.
 * Sin factura (con_factura = false) no hay IVA ni retenciones: la orden es por lo pagado.
 */
function calcularOrdenPago(entrada, retencionesConfig, ivaPctBase, montoPagado, umbralFN) {
  const conFactura = entrada.con_factura !== false;
  const base = conFactura ? redondear2(aNumero(entrada.base_imponible) || 0) : 0;
  const ivaPct = entrada.iva_pct !== undefined && entrada.iva_pct !== null && entrada.iva_pct !== ''
    ? Number(entrada.iva_pct) : Number(ivaPctBase);
  const iva = redondear2(base * ivaPct / 100);
  const total = redondear2(base + iva);
  const umbral = Number(umbralFN) || CONFIG_BASE.umbral_fondo_negro.valor;
  const fondoNegro = total > umbral;
  const seleccion = (Array.isArray(entrada.retenciones) ? entrada.retenciones : []).filter((c) => c !== CODIGO_FONDO_NEGRO);
  if (fondoNegro) seleccion.push(CODIGO_FONDO_NEGRO);
  const bases = { BASE: base, IVA: iva, TOTAL: total, NINGUNA: 0 };
  const filas = retencionesConfig.map((r) => {
    const seleccionada = base > 0 && seleccion.indexOf(r.codigo) > -1 && Number(r.porcentaje) > 0;
    const valorProcesar = seleccionada ? bases[r.base] || 0 : null;
    return {
      codigo: r.codigo, nombre: r.nombre, porcentaje: r.porcentaje, base: r.base,
      fila_titulo: r.fila_titulo === true, seleccionada,
      valor_procesar: valorProcesar,
      valor_retencion: seleccionada ? redondear2(valorProcesar * Number(r.porcentaje) / 100) : null
    };
  });
  const totalRetenciones = redondear2(filas.reduce((s, f) => s + (f.valor_retencion || 0), 0));
  const filaIva = filas.find((f) => f.codigo === 'IVA');
  const tieneFactura = base > 0;
  const montoEmpresa = tieneFactura ? redondear2(total - totalRetenciones) : null;
  const pagado = redondear2(montoPagado || 0);
  return {
    con_factura: conFactura,
    tiene_factura: tieneFactura,
    base_imponible: tieneFactura ? base : null,
    iva_pct: ivaPct,
    iva: tieneFactura ? iva : null,
    total_factura: tieneFactura ? total : null,
    fondo_negro_automatico: tieneFactura && fondoNegro,
    umbral_fondo_negro: umbral,
    retenciones: filas,
    total_retenciones: tieneFactura ? totalRetenciones : null,
    monto_empresa: montoEmpresa,
    restante_iva: tieneFactura ? (filaIva && filaIva.seleccionada ? redondear2(iva - filaIva.valor_retencion) : 0) : null,
    monto_pagado: pagado,
    diferencia: tieneFactura ? redondear2(pagado - montoEmpresa) : null
  };
}

/** Motivo por el que la orden no puede emitirse con estos datos, o '' si está bien. */
function problemaCuadreOP(calculo) {
  if (!calculo) return '';
  if (calculo.tiene_factura && Math.abs(calculo.diferencia) > toleranciaCuadreOP()) {
    return `El neto calculado (${formatoBs(calculo.monto_empresa)}) no coincide con lo pagado (${formatoBs(calculo.monto_pagado)}): ` +
      `diferencia de ${formatoBs(calculo.diferencia)} Corrija la base imponible o las retenciones.`;
  }
  return '';
}

function normalizarImputacionOP(imp, fechaPago) {
  const entrada = imp || {};
  const lineas = (Array.isArray(entrada.lineas) ? entrada.lineas : []).slice(0, 3).map((l) => ({
    sector: textoSeguro(l.sector, 10), programa: textoSeguro(l.programa, 10), actividad: textoSeguro(l.actividad, 10),
    partida: textoSeguro(l.partida, 10), generica: textoSeguro(l.generica, 10), especifica: textoSeguro(l.especifica, 10),
    subespecifica: textoSeguro(l.subespecifica, 10), total: aNumero(l.total), periodo: textoSeguro(l.periodo, 20)
  }));
  return {
    orden: textoSeguro(entrada.orden, 60),
    anio: textoSeguro(entrada.anio, 4) || String(fechaPago || hoyISO()).substring(0, 4),
    fecha: aFechaISO(entrada.fecha),
    lineas
  };
}

function textoOrdenVinculada(oc) {
  if (!oc) return '';
  return `${oc.tipo === 'COMPRA' ? 'ORDEN DE COMPRA' : 'ORDEN DE SERVICIO'} N° ${oc.numero}`;
}

function datosPlantillaOP(pago) {
  const cfg = config.todo();
  const oc = pago.orden_compra_id ? db.porId('OrdenesCompra', pago.orden_compra_id) : null;
  const calculo = pago.op_calculo || calcularOrdenPago({ con_factura: false }, cfg.retenciones, cfg.iva_pct, pago.monto, umbralFondoNegro());
  const imputacion = pago.op_imputacion || normalizarImputacionOP({}, pago.fecha);
  if (!imputacion.orden && oc) imputacion.orden = textoOrdenVinculada(oc);
  return {
    institucion: cfg.institucion,
    numero: pago.numero,
    fecha: pago.fecha,
    monto: pago.monto,
    beneficiario: pago.beneficiario,
    tipo_doc: pago.tipo_doc,
    documento: normalizarDocumento(pago.tipo_doc, pago.documento),
    contrato: pago.op_contrato || '',
    orden_compra: oc ? textoOrdenVinculada(oc) : '',
    orden_compra_monto: oc ? oc.total_final : null,
    debito: cfg.cuenta_debito,
    credito: { tipo_pago: 'TRANSFERENCIA BANCARIA', banco: pago.banco || nombreBanco(pago.cuenta), cuenta: formatearCuenta(pago.cuenta) },
    calculo,
    categoria: pago.categoria,
    imputacion,
    motivo: pago.descripcion,
    firmas: cfg.firmas_op,
    anulada: pago.estado === ESTADO_ANULADA
  };
}

function nombreArchivoSeguro(texto) {
  return normalizarTexto(texto).replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '').substring(0, 60);
}

function generarPdfOP(pago, usuario) {
  const faltan = faltantesPago(pago);
  if (faltan.length) throw new ErrorApp(`Complete los datos del pago antes de generar la orden: ${faltan.join(', ')}.`, 'INCOMPLETO', faltan);
  if (pago.estado === ESTADO_ANULADA) throw new ErrorApp('La orden está anulada; no se puede generar el PDF.', 'ESTADO');
  const problema = problemaCuadreOP(pago.op_calculo);
  if (problema) throw new ErrorApp(problema, 'DESCUADRE');
  const html = plantillaOrdenPago(datosPlantillaOP(pago));
  const version = (Number(pago.op_version) || 0) + 1;
  const nombre = `OP_${pago.numero}_${pago.fecha}_${nombreArchivoSeguro(pago.beneficiario)}${version > 1 ? '_v' + version : ''}`;
  const archivo = guardarPdf(html, nombre, carpetaDocumentos('OP', pago.fecha));
  const r = db.actualizar('Pagos', pago.id, {
    op_generada: true, op_pdf_id: archivo.id, op_pdf_url: archivo.url,
    op_generada_en: ahoraISO(), op_generada_por: usuario.email, op_version: version, op_borrador_en: ''
  }, usuario.email);
  auditar(usuario, 'ORDEN_PAGO', version > 1 ? 'REGENERAR_PDF' : 'GENERAR_PDF', pago.id, { numero: pago.numero, version, archivo: archivo.id });
  return { pago: r.despues, pdf_url: archivo.url, html };
}

/* ---------- API ---------- */

function opCalcular(datos) {
  const cfg = config.todo();
  const pago = datos.id ? db.porId('Pagos', datos.id) : null;
  return calcularOrdenPago(datos, cfg.retenciones, cfg.iva_pct, pago ? pago.monto : aNumero(datos.monto_pagado), umbralFondoNegro());
}

function opGuardar(datos, usuario) {
  const cfg = config.todo();
  return db.conBloqueo(() => {
    const pago = db.porId('Pagos', datos.id);
    if (!pago) throw new ErrorApp('No se encontró el pago.', 'NO_ENCONTRADO');
    if (pago.estado === ESTADO_ANULADA) throw new ErrorApp('La orden está anulada.', 'ESTADO');
    let ordenId = textoSeguro(datos.orden_compra_id, 60);
    if (ordenId) {
      const oc = db.porId('OrdenesCompra', ordenId);
      if (!oc) throw new ErrorApp('La orden de compra/servicio indicada no existe.', 'VALIDACION');
      if (oc.estado === ESTADO_ANULADA) throw new ErrorApp('La orden de compra/servicio está anulada.', 'VALIDACION');
    } else {
      ordenId = '';
    }
    if (datos.generar_pdf) {
      const faltan = faltantesPago(pago);
      if (faltan.length) throw new ErrorApp(`Complete los datos del pago antes de generar la orden: ${faltan.join(', ')}.`, 'INCOMPLETO', faltan);
    }
    const conFactura = datos.con_factura !== false;
    const retenciones = conFactura ? (Array.isArray(datos.retenciones) ? datos.retenciones : [])
      .filter((c) => cfg.retenciones.some((r) => r.codigo === c) && c !== CODIGO_FONDO_NEGRO) : [];
    const calculo = calcularOrdenPago(Object.assign({}, datos, { retenciones, con_factura: conFactura }), cfg.retenciones, cfg.iva_pct, pago.monto, umbralFondoNegro());
    if (conFactura && !calculo.tiene_factura && (datos.generar_pdf || pago.op_generada === true)) {
      throw new ErrorApp('Indique la base imponible de la factura, o desmarque "Tiene factura" si el pago no lleva factura.', 'VALIDACION');
    }
    // Una orden que no cuadra con lo pagado solo puede quedar como borrador.
    const problema = problemaCuadreOP(calculo);
    if (problema && (datos.generar_pdf || pago.op_generada === true)) throw new ErrorApp(problema, 'DESCUADRE');
    const cambios = {
      op_con_factura: conFactura,
      op_factura: conFactura ? textoSeguro(datos.factura, 40) : '',
      op_base_imponible: calculo.base_imponible,
      op_iva_pct: calculo.iva_pct,
      op_retenciones: calculo.retenciones.filter((f) => f.seleccionada).map((f) => f.codigo),
      op_calculo: calculo,
      op_contrato: textoSeguro(datos.contrato, 60),
      orden_compra_id: ordenId,
      op_imputacion: normalizarImputacionOP(datos.imputacion, pago.fecha),
      op_borrador_en: pago.op_generada === true ? '' : ahoraISO()
    };
    const r = db.actualizar('Pagos', pago.id, cambios, usuario.email);
    auditar(usuario, 'ORDEN_PAGO', 'GUARDAR', pago.id, Object.assign({ numero: pago.numero }, diferencias(r.antes, r.despues)));
    const actualizado = db.porId('Pagos', pago.id);
    if (datos.generar_pdf) return Object.assign(generarPdfOP(actualizado, usuario), { calculo });
    return { pago: r.despues, calculo, borrador: pago.op_generada !== true, aviso: problema, html: plantillaOrdenPago(datosPlantillaOP(actualizado)) };
  });
}

function opVista(datos) {
  const pago = db.porId('Pagos', datos.id);
  if (!pago) throw new ErrorApp('No se encontró el pago.', 'NO_ENCONTRADO');
  return {
    html: plantillaOrdenPago(datosPlantillaOP(pago)),
    titulo: `Orden de Pago N° ${pago.numero}`,
    faltan: faltantesPago(pago),
    descuadre: problemaCuadreOP(pago.op_calculo),
    pdf_url: pago.op_pdf_url || ''
  };
}

function opPdf(datos, usuario) {
  return db.conBloqueo(() => {
    const pago = db.porId('Pagos', datos.id);
    if (!pago) throw new ErrorApp('No se encontró el pago.', 'NO_ENCONTRADO');
    const r = generarPdfOP(pago, usuario);
    return { pdf_url: r.pdf_url, version: r.pago.op_version };
  });
}


/* ===================== 15_OrdenesCompra.gs ===================== */
/**
 * Módulo: Órdenes de Compra y Órdenes de Servicio (misma plantilla, correlativos separados).
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.2-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

const TIPOS_ORDEN = { COMPRA: { correlativo: 'oc', prefijo: 'OC', titulo: 'ORDEN DE COMPRA' }, SERVICIO: { correlativo: 'os', prefijo: 'OS', titulo: 'ORDEN DE SERVICIO' } };
const MAX_ITEMS_ORDEN = 15;

/** Cálculo puro de la orden. Los ítems exentos no llevan IVA y suman en "Total exento". */
function calcularOrdenCompra(itemsEntrada, ivaPct, descuentoPct) {
  const items = (Array.isArray(itemsEntrada) ? itemsEntrada : [])
    .map((it) => {
      const cantidad = aNumero(it.cantidad) || 0;
      const precio = aNumero(it.precio_unitario) || 0;
      const exento = it.exento === true;
      const subtotal = redondear2(cantidad * precio);
      const iva = exento ? 0 : redondear2(subtotal * Number(ivaPct) / 100);
      return {
        descripcion: mayusculas(it.descripcion).substring(0, 300), cantidad, precio_unitario: precio,
        exento, subtotal, iva, total: redondear2(subtotal + iva)
      };
    })
    .filter((it) => it.descripcion || it.subtotal > 0);
  const subtotal = redondear2(items.filter((i) => !i.exento).reduce((s, i) => s + i.subtotal, 0));
  const totalExento = redondear2(items.filter((i) => i.exento).reduce((s, i) => s + i.subtotal, 0));
  const totalIva = redondear2(items.reduce((s, i) => s + i.iva, 0));
  const totalGeneral = redondear2(subtotal + totalIva + totalExento);
  const desc = Math.min(Math.max(aNumero(descuentoPct) || 0, 0), 100);
  const totalFinal = redondear2(totalGeneral - totalGeneral * desc / 100);
  return { items, iva_pct: Number(ivaPct), subtotal, total_iva: totalIva, total_exento: totalExento, total_general: totalGeneral, descuento_pct: desc, total_final: totalFinal };
}

function normalizarImputacionOC(lineas) {
  return (Array.isArray(lineas) ? lineas : []).slice(0, 3).map((l) => ({
    programa: textoSeguro(l.programa, 10), programa2: textoSeguro(l.programa2, 10), subprograma: textoSeguro(l.subprograma, 10),
    proyecto: textoSeguro(l.proyecto, 10), obra: textoSeguro(l.obra, 10), partida: textoSeguro(l.partida, 12),
    generica: textoSeguro(l.generica, 10), especifica: textoSeguro(l.especifica, 10), monto: aNumero(l.monto)
  }));
}

function construirOrden(datos, usuario, actual) {
  const cfg = config.todo();
  const tipo = actual ? actual.tipo : String(datos.tipo || '').toUpperCase();
  if (!TIPOS_ORDEN[tipo]) throw new ErrorApp('Indique si es Orden de Compra u Orden de Servicio.', 'VALIDACION');
  const fecha = aFechaISO(datos.fecha) || hoyISO();
  const tipoDoc = normalizarTipoDoc(datos.tipo_doc);
  const documento = normalizarDocumento(tipoDoc, datos.documento);
  const beneficiario = normalizarNombre(datos.beneficiario).substring(0, 200);
  if (!beneficiario) throw new ErrorApp('Indique el proveedor o beneficiario.', 'VALIDACION');
  if (!tipoDoc || !documento) throw new ErrorApp('Indique el RIF o cédula del proveedor.', 'VALIDACION');
  const itemsEntrada = Array.isArray(datos.items) ? datos.items : [];
  if (itemsEntrada.filter((i) => String(i.descripcion || '').trim()).length > MAX_ITEMS_ORDEN) {
    throw new ErrorApp(`La plantilla admite máximo ${MAX_ITEMS_ORDEN} ítems.`, 'VALIDACION');
  }
  const calculo = calcularOrdenCompra(itemsEntrada, cfg.iva_pct, datos.descuento_pct);
  if (!calculo.items.length) throw new ErrorApp('Agregue al menos un ítem con descripción, cantidad y precio.', 'VALIDACION');
  if (calculo.items.some((i) => !i.descripcion)) throw new ErrorApp('Todos los ítems deben tener descripción.', 'VALIDACION');
  if (!(calculo.total_final > 0)) throw new ErrorApp('El total de la orden debe ser mayor que cero.', 'VALIDACION');
  const presupuesto = String(datos.presupuesto_tipo || '').toUpperCase();
  const t = tasaParaFecha(fecha);
  return {
    tipo, fecha,
    requisicion: textoSeguro(datos.requisicion, 40),
    beneficiario, tipo_doc: tipoDoc, documento,
    numero_proceso: mayusculas(datos.numero_proceso).substring(0, 60),
    unidad_solicitante: mayusculas(datos.unidad_solicitante).substring(0, 120),
    tipo_pago: mayusculas(datos.tipo_pago || 'TRANSFERENCIA').substring(0, 40),
    condicion: mayusculas(datos.condicion || 'DE CONTADO').substring(0, 40),
    fecha_emision: aFechaISO(datos.fecha_emision) || fecha,
    concepto: mayusculas(datos.concepto).substring(0, 1500),
    items: calculo.items,
    iva_pct: calculo.iva_pct, subtotal: calculo.subtotal, total_iva: calculo.total_iva,
    total_exento: calculo.total_exento, total_general: calculo.total_general,
    descuento_pct: calculo.descuento_pct, total_final: calculo.total_final,
    observaciones: mayusculas(datos.observaciones).substring(0, 600),
    presupuesto_tipo: ['ORDINARIO', 'EXTRAORDINARIO', 'OTROS'].indexOf(presupuesto) > -1 ? presupuesto : '',
    imputacion: normalizarImputacionOC(datos.imputacion),
    lugar_compra: mayusculas(datos.lugar_compra || cfg.institucion.lugar_compra).substring(0, 120),
    moneda: mayusculas(datos.moneda || 'BOLÍVARES (Bs)').substring(0, 40),
    tasa_bcv: t ? t.tasa : null,
    monto_divisa: t ? redondear2(calculo.total_final / t.tasa) : null,
    elaborado_por: actual && actual.elaborado_por ? actual.elaborado_por : mayusculas(usuario.nombre || usuario.email)
  };
}

function datosPlantillaOC(orden) {
  const cfg = config.todo();
  return Object.assign({}, orden, {
    institucion: cfg.institucion,
    titulo: TIPOS_ORDEN[orden.tipo] ? TIPOS_ORDEN[orden.tipo].titulo : 'ORDEN DE SERVICIO',
    firmas: cfg.firmas_oc,
    anulada: orden.estado === ESTADO_ANULADA
  });
}

function vincularPagoAOrden(pagoId, orden, usuario) {
  if (!pagoId) return;
  const pago = db.porId('Pagos', pagoId);
  if (!pago) throw new ErrorApp('El pago a vincular no existe.', 'VALIDACION');
  if (pago.orden_compra_id === orden.id) return;
  db.actualizar('Pagos', pago.id, { orden_compra_id: orden.id }, usuario.email);
  auditar(usuario, 'ORDEN_COMPRA', 'VINCULAR_PAGO', orden.id, { pago: pago.numero, orden: orden.numero });
}

/* ---------- API ---------- */

function ocListar(datos) {
  const pagina = Math.max(1, Number(datos.pagina) || 1);
  const porPagina = Math.min(Math.max(10, Number(datos.por_pagina) || 50), 200);
  const texto = normalizarTexto(datos.texto);
  const lista = db.leer('OrdenesCompra').filter((o) => {
    if (datos.tipo && o.tipo !== datos.tipo) return false;
    if (datos.estado && o.estado !== datos.estado) return false;
    if (datos.anio && String(o.fecha).substring(0, 4) !== String(datos.anio)) return false;
    if (datos.mes && Number(String(o.fecha).substring(5, 7)) !== Number(datos.mes)) return false;
    if (texto && normalizarTexto(`${o.beneficiario} ${o.concepto} ${o.numero_proceso} ${o.numero} ${o.documento}`).indexOf(texto) === -1) return false;
    return true;
  }).sort((a, b) => (a.fecha === b.fecha ? (b.numero || 0) - (a.numero || 0) : (a.fecha < b.fecha ? 1 : -1)));
  const pagosPorOrden = {};
  db.leer('Pagos').forEach((p) => { if (p.orden_compra_id) (pagosPorOrden[p.orden_compra_id] = pagosPorOrden[p.orden_compra_id] || []).push(p.numero); });
  return {
    total: lista.length, pagina, por_pagina: porPagina,
    monto_total: redondear2(lista.filter((o) => o.estado !== ESTADO_ANULADA).reduce((s, o) => s + (o.total_final || 0), 0)),
    registros: lista.slice((pagina - 1) * porPagina, pagina * porPagina).map((o) => ({
      id: o.id, tipo: o.tipo, numero: o.numero, fecha: o.fecha, beneficiario: o.beneficiario, tipo_doc: o.tipo_doc,
      documento: o.documento, concepto: o.concepto, total_final: o.total_final, monto_divisa: o.monto_divisa,
      unidad_solicitante: o.unidad_solicitante, estado: o.estado, pdf_url: o.pdf_url, pagos: pagosPorOrden[o.id] || []
    }))
  };
}

function ocObtener(datos) {
  const o = db.porId('OrdenesCompra', datos.id);
  if (!o) throw new ErrorApp('No se encontró la orden.', 'NO_ENCONTRADO');
  const pagos = db.leer('Pagos').filter((p) => p.orden_compra_id === o.id).map(resumenPago);
  return { orden: db.limpiar(o), pagos };
}

function ocPrellenarDesdePago(datos) {
  const p = db.porId('Pagos', datos.pago_id);
  if (!p) throw new ErrorApp('No se encontró el pago.', 'NO_ENCONTRADO');
  const cfg = config.todo();
  const base = p.op_base_imponible > 0 ? p.op_base_imponible : p.monto;
  return {
    tipo: datos.tipo === 'COMPRA' ? 'COMPRA' : 'SERVICIO',
    fecha: p.fecha, fecha_emision: p.fecha,
    beneficiario: p.beneficiario, tipo_doc: p.tipo_doc, documento: p.documento,
    concepto: p.descripcion, tipo_pago: 'TRANSFERENCIA', condicion: 'DE CONTADO',
    items: [{ descripcion: p.descripcion, cantidad: 1, precio_unitario: base, exento: !(p.op_base_imponible > 0) }],
    descuento_pct: 0, lugar_compra: cfg.institucion.lugar_compra, moneda: 'BOLÍVARES (Bs)',
    pago_id: p.id, pago_numero: p.numero
  };
}

function ocGuardar(datos, usuario) {
  return db.conBloqueo(() => {
    const actual = datos.id ? db.porId('OrdenesCompra', datos.id) : null;
    if (datos.id && !actual) throw new ErrorApp('No se encontró la orden.', 'NO_ENCONTRADO');
    if (actual && actual.estado === ESTADO_ANULADA) throw new ErrorApp('La orden está anulada.', 'ESTADO');
    const orden = construirOrden(datos, usuario, actual);
    const ben = sincronizarBeneficiarioDesdePago({ tipo_doc: orden.tipo_doc, documento: orden.documento, beneficiario: orden.beneficiario, cuenta: '' }, usuario.email);
    if (ben) orden.beneficiario_id = ben.id;
    let guardada;
    if (actual) {
      const r = db.actualizar('OrdenesCompra', actual.id, orden, usuario.email);
      auditar(usuario, 'ORDEN_COMPRA', 'EDITAR', actual.id, Object.assign({ numero: actual.numero, tipo: actual.tipo }, diferencias(r.antes, r.despues)));
      guardada = db.porId('OrdenesCompra', actual.id);
    } else {
      orden.numero = config.reservarCorrelativo(TIPOS_ORDEN[orden.tipo].correlativo, 1, usuario.email);
      orden.estado = ESTADO_ACTIVA;
      orden.pdf_version = 0;
      guardada = db.insertar('OrdenesCompra', orden, usuario.email);
      auditar(usuario, 'ORDEN_COMPRA', 'CREAR', guardada.id, { tipo: orden.tipo, numero: orden.numero, total: orden.total_final });
    }
    vincularPagoAOrden(datos.pago_id, guardada, usuario);
    const respuesta = { orden: db.limpiar(guardada) };
    if (datos.generar_pdf) Object.assign(respuesta, generarPdfOC(guardada, usuario));
    else respuesta.html = plantillaOrdenCompra(datosPlantillaOC(guardada));
    return respuesta;
  });
}

function generarPdfOC(orden, usuario) {
  if (orden.estado === ESTADO_ANULADA) throw new ErrorApp('La orden está anulada; no se puede generar el PDF.', 'ESTADO');
  const html = plantillaOrdenCompra(datosPlantillaOC(orden));
  const version = (Number(orden.pdf_version) || 0) + 1;
  const prefijo = TIPOS_ORDEN[orden.tipo].prefijo;
  const nombre = `${prefijo}_${orden.numero}_${orden.fecha}_${nombreArchivoSeguro(orden.beneficiario)}${version > 1 ? '_v' + version : ''}`;
  const archivo = guardarPdf(html, nombre, carpetaDocumentos(prefijo, orden.fecha));
  const r = db.actualizar('OrdenesCompra', orden.id, { pdf_id: archivo.id, pdf_url: archivo.url, pdf_version: version }, usuario.email);
  auditar(usuario, 'ORDEN_COMPRA', version > 1 ? 'REGENERAR_PDF' : 'GENERAR_PDF', orden.id, { numero: orden.numero, tipo: orden.tipo, version, archivo: archivo.id });
  return { orden: r.despues, pdf_url: archivo.url, html };
}

function ocAnular(datos, usuario) {
  const motivo = textoSeguro(datos.motivo, 500);
  if (motivo.length < 5) throw new ErrorApp('Indique el motivo de la anulación (mínimo 5 caracteres).', 'VALIDACION');
  return db.conBloqueo(() => {
    const o = db.porId('OrdenesCompra', datos.id);
    if (!o) throw new ErrorApp('No se encontró la orden.', 'NO_ENCONTRADO');
    if (o.estado === ESTADO_ANULADA) throw new ErrorApp('La orden ya estaba anulada.', 'ESTADO');
    const r = db.actualizar('OrdenesCompra', o.id, { estado: ESTADO_ANULADA, motivo_anulacion: motivo, anulado_por: usuario.email, anulado_en: ahoraISO() }, usuario.email);
    auditar(usuario, 'ORDEN_COMPRA', 'ANULAR', o.id, { numero: o.numero, tipo: o.tipo, motivo });
    return r.despues;
  });
}

function ocVista(datos) {
  const o = db.porId('OrdenesCompra', datos.id);
  if (!o) throw new ErrorApp('No se encontró la orden.', 'NO_ENCONTRADO');
  return {
    html: plantillaOrdenCompra(datosPlantillaOC(o)),
    titulo: `${TIPOS_ORDEN[o.tipo].titulo} N° ${o.numero}`,
    pdf_url: o.pdf_url || ''
  };
}

function ocVistaPrevia(datos, usuario) {
  const actual = datos.id ? db.porId('OrdenesCompra', datos.id) : null;
  const orden = construirOrden(datos, usuario, actual);
  orden.numero = actual ? actual.numero : '';
  orden.estado = actual ? actual.estado : ESTADO_ACTIVA;
  return { html: plantillaOrdenCompra(datosPlantillaOC(orden)), calculo: { subtotal: orden.subtotal, total_iva: orden.total_iva, total_final: orden.total_final, monto_divisa: orden.monto_divisa, tasa_bcv: orden.tasa_bcv } };
}

function ocPdf(datos, usuario) {
  return db.conBloqueo(() => {
    const o = db.porId('OrdenesCompra', datos.id);
    if (!o) throw new ErrorApp('No se encontró la orden.', 'NO_ENCONTRADO');
    const r = generarPdfOC(o, usuario);
    return { pdf_url: r.pdf_url, version: r.orden.pdf_version };
  });
}


/* ===================== 16_Plantillas.gs ===================== */
/**
 * Módulo: Plantillas imprimibles (Orden de Pago y Orden de Compra/Servicio).
 * Replican la grilla de las hojas originales: OP en 10 columnas iguales, OC/OS en 13 columnas.
 * El mismo HTML sirve para imprimir desde el navegador y para generar el PDF en Drive.
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.2-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

function celda(contenido, opciones) {
  const o = opciones || {};
  const attrs = [];
  if (o.cs > 1) attrs.push(`colspan="${o.cs}"`);
  if (o.rs > 1) attrs.push(`rowspan="${o.rs}"`);
  if (o.c) attrs.push(`class="${o.c}"`);
  if (o.s) attrs.push(`style="${o.s}"`);
  return `<td ${attrs.join(' ')}>${contenido === null || contenido === undefined ? '' : contenido}</td>`;
}

function fila(celdas, altoPt, clase) {
  return `<tr${clase ? ` class="${clase}"` : ''} style="height:${altoPt}pt">${celdas.join('')}</tr>`;
}

function e(s) {
  return escaparHtml(s);
}

function documentoHtml(titulo, estilos, cuerpo) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>${e(titulo)}</title>
<style>${estilos}</style></head><body>${cuerpo}</body></html>`;
}

function selloAnulada(datos) {
  return datos.anulada ? '<div class="anulada">ANULADA</div>' : '';
}

/* ======================= ORDEN DE PAGO ======================= */

const ESTILOS_OP = `
@page { size: letter portrait; margin: 0.3in 0.18in 0.2in 0.18in; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #fff; }
body { font-family: Arial, Helvetica, sans-serif; color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.hoja { width: 100%; max-width: 8.13in; margin: 0 auto; position: relative; }
table.op { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 6.4pt; }
.op td { padding: 0 2pt; vertical-align: middle; overflow: hidden; line-height: 1.12; }
.b { border: 0.75pt solid #000; }
.sec { background: #e5effe; font-weight: bold; font-size: 9.6pt; text-align: center; border: 0.75pt solid #000; }
.lbl { font-weight: bold; font-size: 6.4pt; text-align: center; border: 0.75pt solid #000; }
.lbl-izq { font-size: 6.4pt; text-align: left; border: 0.75pt solid #000; }
.val-grande { font-weight: bold; font-size: 11pt; text-align: center; border: 0.75pt solid #000; }
.val { font-size: 7.2pt; text-align: center; border: 0.75pt solid #000; }
.ret td { font-size: 5.4pt; }
.c { text-align: center; }
.n { font-weight: bold; }
td.inst { font-weight: bold; font-size: 8.4pt; text-align: center; line-height: 1.55; white-space: nowrap; overflow: visible !important; }
.titulo { font-family: 'Arial Black', Arial, Helvetica, sans-serif; font-weight: 900; font-size: 15pt; text-align: center; }
.cab { font-size: 10.4pt; border: 0.75pt solid #000; text-align: center; }
.cab-izq { font-size: 10.4pt; border: 0.75pt solid #000; font-weight: bold; text-align: left; padding-left: 3pt; }
img.escudo { height: 56pt; display: block; margin: 0 auto; }
img.logo { height: 48pt; display: block; margin: 0 auto; }
.anulada { position: absolute; top: 3.6in; left: 1.1in; font-size: 72pt; font-weight: bold; color: rgba(200,0,0,0.22);
  border: 6pt solid rgba(200,0,0,0.22); padding: 4pt 24pt; transform: rotate(-24deg); letter-spacing: 6pt; }
`;

function plantillaOrdenPago(d) {
  const [anio, mes, dia] = String(d.fecha || '').split('-');
  const k = d.calculo || {};
  const inst = d.institucion;
  const filas = [];
  const vacio = (n) => celda('', { cs: n });

  filas.push(fila([
    celda(`<img class="escudo" src="${LOGOS.escudo}" alt="Escudo">`, { cs: 3, s: 'vertical-align:middle' }),
    celda(`${e(inst.pais)}<br>${e(inst.estado)}<br>${e(inst.nombre)}<br>RIF: ${e(inst.rif)}`, { cs: 3, c: 'inst', s: 'vertical-align:top;padding-top:3pt' }),
    vacio(1),
    celda(`<img class="logo" src="${LOGOS.guanipa}" alt="Guanipa">`, { cs: 3, s: 'vertical-align:bottom' })
  ], 57));
  filas.push(fila([vacio(7), celda(e(inst.ciudad), { cs: 3, s: 'font-weight:bold;font-size:9.4pt;text-align:center' })], 13));
  filas.push(fila([
    vacio(2),
    celda('ORDEN DE PAGO', { cs: 3, c: 'titulo' }),
    vacio(2),
    celda('N° ORDEN DE PAGO', { cs: 2, c: 'cab' }),
    celda(e(d.numero), { c: 'cab', s: 'font-weight:bold;font-size:11pt' })
  ], 16.5));
  filas.push(fila([
    vacio(6),
    celda('FECHA', { c: 'cab-izq' }),
    celda(dia ? +dia : '', { c: 'cab', s: 'font-size:9.4pt' }),
    celda(mes ? +mes : '', { c: 'cab', s: 'font-size:9.4pt' }),
    celda(anio || '', { c: 'cab', s: 'font-size:9.4pt' })
  ], 14));
  filas.push(fila([
    vacio(6),
    celda('Por Bs.', { c: 'cab-izq' }),
    celda(e(formatoBsPlantilla(d.monto)), { cs: 3, c: 'cab', s: 'font-weight:bold;font-size:10.6pt' })
  ], 14));

  const seccion = (t, alto) => fila([celda(t, { cs: 10, c: 'sec' })], alto || 14);
  filas.push(seccion('INFORMACIÓN GENERAL'));
  filas.push(fila([celda('NOMBRE DE LA EMPRESA, BENEFICIARIO O<br>PROVEEDOR', { cs: 3, c: 'lbl' }), celda(e(d.beneficiario), { cs: 7, c: 'val-grande' })], 20));
  filas.push(fila([celda('NÚMERO DE DOCUMENTO DE LA EMPRESA,<br>BENEFICIARIO O PROVEEDOR', { cs: 3, c: 'lbl' }), celda(e(`${d.tipo_doc || ''} ${d.documento || ''}`.trim()), { cs: 7, c: 'val-grande' })], 20.5));
  filas.push(fila([celda('CONTRATO N°', { cs: 3, c: 'lbl' }), celda(e(d.contrato), { cs: 7, c: 'val' })], 13));
  filas.push(fila([celda('Nº ORDEN DE COMPRA / SERVICIO', { cs: 3, c: 'lbl' }), celda(e(d.orden_compra), { cs: 7, c: 'val' })], 14));
  filas.push(fila([celda('MONTO DE ORDEN DE COMPRA / SERVICIO', { cs: 3, c: 'lbl' }), celda(e(formatoBsPlantilla(d.orden_compra_monto)), { cs: 7, c: 'val' })], 14));

  const cuenta = (c) => fila([
    celda(`<b>TIPO DE PAGO:</b> ${e(c.tipo_pago)}`, { cs: 3, c: 'lbl-izq', s: 'font-size:6.6pt' }),
    celda(`<b>BANCO:</b> ${e(c.banco)}`, { cs: 3, c: 'lbl-izq', s: 'font-size:6.6pt;text-align:center' }),
    celda(`<b>NÚMERO DE CUENTA:</b> ${e(c.numero || c.cuenta)}`, { cs: 4, c: 'lbl-izq', s: 'font-size:6.6pt;text-align:center' })
  ], 13);
  filas.push(seccion('CUENTA A REALIZAR EL DÉBITO'));
  filas.push(cuenta(d.debito));
  filas.push(seccion('CUENTA A REALIZAR EL CRÉDITO'));
  filas.push(cuenta(d.credito));

  filas.push(seccion('DESGLOSE DE FACTURA'));
  filas.push(fila([celda('SUB-TOTAL', { cs: 4, c: 'lbl' }), celda(e(formatoBsPlantilla(k.base_imponible)), { cs: 6, c: 'val', s: 'font-size:6.6pt' })], 12));
  filas.push(fila([celda(`I.V.A ${formatoNumeroVE(k.iva_pct, 0)}%`, { cs: 4, c: 'lbl' }), celda(e(formatoBsPlantilla(k.iva)), { cs: 6, c: 'val', s: 'font-size:6.6pt' })], 12));
  filas.push(fila([celda('TOTAL BS.', { cs: 4, c: 'lbl' }), celda(e(formatoBsPlantilla(k.total_factura)), { cs: 6, c: 'val', s: 'font-size:6.6pt' })], 12));

  filas.push(seccion('RETENCIONES FISCALES'));
  filas.push.apply(filas, filasRetencionesOP(d, k));

  filas.push(seccion('IMPUTACIÓN PRESUPUESTARIA', 12.5));
  const imp = d.imputacion || {};
  const [ia, im, id] = String(imp.fecha || '').split('-');
  filas.push(fila([
    celda('ORDEN DE COMPRA/SERVICIO/CONTRATO', { cs: 3, c: 'lbl' }),
    celda('AÑO', { c: 'lbl' }),
    celda('FECHA DE IMPUTACIÓN PRESUPUESTARIA:', { cs: 3, c: 'lbl' }),
    celda(id ? +id : '', { c: 'val' }), celda(im ? +im : '', { c: 'val' }), celda(ia || '', { c: 'val' })
  ], 10.5));
  filas.push(fila([
    celda(e(imp.orden), { cs: 3, c: 'val', s: 'font-size:6.4pt' }),
    celda(e(imp.anio), { c: 'val', s: 'font-weight:bold;font-size:6.4pt' }),
    celda('', { cs: 6, c: 'b' })
  ], 10.5));
  filas.push(fila(['SECTOR', 'PROG', 'ACT.', 'PARTIDA', 'GEN.', 'ESP.', 'SUB-ESP.'].map((t) => celda(t, { c: 'lbl' }))
    .concat([celda('Total a Pagar', { cs: 2, c: 'lbl' }), celda('Período', { c: 'lbl' })]), 10.5));
  for (let i = 0; i < 3; i++) {
    const l = (imp.lineas || [])[i] || {};
    filas.push(fila([l.sector, l.programa, l.actividad, l.partida, l.generica, l.especifica, l.subespecifica]
      .map((v) => celda(e(v), { c: 'val', s: 'font-size:6.4pt' }))
      .concat([celda(e(l.total ? formatoBsPlantilla(l.total) : ''), { cs: 2, c: 'val', s: 'font-size:6.4pt' }), celda(e(l.periodo), { c: 'val', s: 'font-size:6.4pt' })]), 17.5));
  }

  filas.push(seccion('MOTIVO DEL PAGO', 13.5));
  filas.push(fila([celda(e(d.motivo), { cs: 10, c: 'val', s: 'font-size:6.6pt' })], 31));
  const f = d.firmas || [];
  filas.push(fila([0, 1, 2, 3].map((i) => celda(e((f[i] || {}).cargo), { cs: 2, c: 'lbl', s: 'font-size:6.6pt' }))
    .concat([celda('BENEFICIARIO', { cs: 2, rs: 2, c: 'lbl', s: 'font-size:6.6pt' })]), 30));
  filas.push(fila([0, 1, 2, 3].map((i) => celda(e((f[i] || {}).nombre), { cs: 2, c: 'val', s: 'font-size:6.6pt' })), 19.5));
  filas.push(fila([0, 1, 2, 3, 4].map(() => celda('', { cs: 2, c: 'b' })), 116));

  const columnas = '<colgroup>' + new Array(10).fill('<col style="width:10%">').join('') + '</colgroup>';
  const cuerpo = `<div class="hoja">${selloAnulada(d)}<table class="op">${columnas}<tbody>${filas.join('')}</tbody></table></div>`;
  return documentoHtml(`Orden de Pago N° ${d.numero}`, ESTILOS_OP, cuerpo);
}

function filasRetencionesOP(d, k) {
  const rets = (k.retenciones || []).slice();
  const titulo = rets.find((r) => r.fila_titulo) || { nombre: 'ANTICIPO' };
  const normales = rets.filter((r) => !r.fila_titulo);
  const pct = (r) => (r.porcentaje === null || r.porcentaje === undefined || r.porcentaje === '' ? '' : formatoNumeroVE(r.porcentaje, r.porcentaje % 1 ? 2 : 0) + '%');
  const bs = (v) => e(formatoBsPlantilla(v));
  const celdaRet = (r) => [
    celda(e(r.nombre), { cs: 3, c: 'lbl-izq' }),
    celda(pct(r), { c: 'b c' }),
    celda(r.seleccionada ? bs(r.valor_procesar) : '', { c: 'b c' }),
    celda(r.seleccionada ? bs(r.valor_retencion) : '', { c: 'b c' })
  ];
  const der = {
    0: [celda('DESGLOSE', { cs: 4, rs: 3, c: 'b', s: 'font-weight:bold;font-size:9.6pt;text-align:center' })],
    3: [celda('MONTO A PAGAR A LA EMPRESA', { cs: 2, rs: 2, c: 'lbl', s: 'font-size:6pt' }), celda(bs(k.monto_empresa), { cs: 2, rs: 2, c: 'val', s: 'font-size:7pt' })],
    5: [celda('MONTO RESTANTE DEL IVA (25%)', { cs: 2, rs: 2, c: 'lbl', s: 'font-size:6pt' }), celda(bs(k.restante_iva), { cs: 2, rs: 2, c: 'val', s: 'font-size:7pt' })],
    7: [celda('TOTAL GENERAL A PAGAR', { cs: 2, rs: 2, c: 'lbl', s: 'font-size:6pt' }), celda(bs(k.monto_pagado || d.monto), { cs: 2, rs: 2, c: 'val', s: 'font-weight:bold;font-size:7pt' })],
    9: [celda('CATEGORÍA DEL PAGO', { cs: 4, rs: 2, c: 'lbl', s: 'font-size:6.6pt' })]
  };
  const salida = [];
  salida.push(fila([celda(e(titulo.nombre), { cs: 3, c: 'lbl-izq' }), celda('', { cs: 3, c: 'b' })].concat(der[0]), 9, 'ret'));
  salida.push(fila([celda('', { cs: 3, c: 'b' }), celda('Porcentaje', { c: 'b c' }), celda('Valor a procesar', { c: 'b c' }), celda('Valor de retención', { c: 'b c' })], 9, 'ret'));
  normales.forEach((r, i) => {
    const indice = i + 2;
    salida.push(fila(celdaRet(r).concat(der[indice] || []), 9, 'ret'));
  });
  salida.push(fila([
    celda('TOTAL RETENCIONES FISCALES', { cs: 5, c: 'lbl-izq', s: 'font-weight:bold;font-size:6pt' }),
    celda(bs(k.total_retenciones), { c: 'b c' }),
    celda(e(d.categoria), { cs: 4, c: 'b c' })
  ], 12.5, 'ret'));
  return salida;
}

/* ================= ORDEN DE COMPRA / SERVICIO ================= */

const COLUMNAS_OC_PX = [58, 58, 66, 59, 58, 58, 58, 59, 58, 58, 58, 59, 58];

const ESTILOS_OC = `
@page { size: letter portrait; margin: 0.72in 0.69in 0.3in 0.85in; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #fff; }
body { font-family: Arial, Helvetica, sans-serif; color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.hoja { width: 6.96in; max-width: 100%; margin: 0; position: relative; }
table.oc { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 5.6pt; }
.oc td { padding: 0 1.5pt; vertical-align: middle; overflow: hidden; line-height: 1.12; }
.nw { white-space: nowrap; overflow: visible !important; }
.b { border: 0.75pt solid #000; }
.sec { font-weight: bold; font-size: 7.6pt; text-align: center; border: 0.75pt solid #000; }
.lbl { font-weight: bold; font-size: 5.4pt; text-align: center; border: 0.75pt solid #000; }
.lbl-izq { font-weight: bold; font-size: 5.4pt; text-align: left; border: 0.75pt solid #000; }
.val { font-size: 8.6pt; text-align: center; border: 0.75pt solid #000; }
.chico { font-size: 5.6pt; text-align: center; border: 0.75pt solid #000; }
.gris { background: #ebeff1; }
.der { text-align: right; }
td.inst { font-weight: bold; font-size: 6.2pt; text-align: center; line-height: 1.3; white-space: nowrap; overflow: visible !important; }
.titulo { font-weight: bold; font-size: 13.5pt; text-align: center; }
.rojo { color: #e00000; font-weight: bold; font-size: 13.5pt; }
.firma { font-family: Calibri, Carlito, Arial, sans-serif; font-weight: bold; font-size: 7.6pt; text-align: center; border: 0.75pt solid #000; }
img.escudo { height: 52pt; display: block; margin: 0 auto; }
img.logo { height: 44pt; display: block; margin: 0 auto; }
.pie { width: 100%; margin: 28pt 0 0 0; border-top: 1.5pt solid #e00000; text-align: center; font-size: 6.4pt; padding-top: 3pt; line-height: 1.35; }
.anulada { position: absolute; top: 3.4in; left: 0.7in; font-size: 66pt; font-weight: bold; color: rgba(200,0,0,0.22);
  border: 6pt solid rgba(200,0,0,0.22); padding: 4pt 24pt; transform: rotate(-24deg); letter-spacing: 6pt; }
`;

function plantillaOrdenCompra(d) {
  const inst = d.institucion;
  const filas = [];
  const vacio = (n) => celda('', { cs: n });
  const bs = (v) => e(formatoBsPlantilla(v));
  const items = Array.isArray(d.items) ? d.items : [];

  filas.push(fila([
    celda(`<img class="escudo" src="${LOGOS.escudo}" alt="Escudo">`, { cs: 2 }),
    vacio(3),
    celda(`${e(inst.pais)}<br>${e(inst.estado)}<br>${e(inst.nombre)}<br>RIF: ${e(inst.rif)}`, { cs: 3, c: 'inst' }),
    vacio(3),
    celda(`<img class="logo" src="${LOGOS.guanipa}" alt="Guanipa">`, { cs: 2, s: 'vertical-align:middle' })
  ], 54));
  filas.push(fila([vacio(11), celda(e(inst.ciudad), { cs: 2, c: 'b nw', s: 'font-weight:bold;font-size:5.2pt;text-align:center' })], 7.5));
  filas.push(fila([
    vacio(3),
    celda(e(d.titulo), { cs: 5, rs: 3, c: 'titulo', s: 'vertical-align:top;padding-top:1pt' }),
    celda(`<span class="rojo">Nº ${e(d.numero)}</span>`, { cs: 2, rs: 3, c: 'nw', s: 'text-align:left;padding-left:2pt;vertical-align:top;padding-top:1pt' }),
    celda('Nº REQUISICIÓN', { c: 'lbl-izq nw', s: 'font-size:5pt' }),
    celda(e(d.requisicion || 'Nº'), { cs: 2, c: 'b der', s: 'font-size:6.4pt' })
  ], 8));
  filas.push(fila([vacio(3), celda('FECHA', { c: 'lbl-izq nw', s: 'font-size:5pt' }), celda(e(fechaVE(d.fecha, true)), { cs: 2, c: 'b der', s: 'font-size:6.4pt' })], 8));
  filas.push(fila([vacio(3), celda('MONTO', { c: 'lbl-izq nw', s: 'font-size:5pt' }), celda(bs(d.total_final), { cs: 2, c: 'b der', s: 'font-weight:bold;font-size:9.4pt' })], 10.5));

  const seccion = (t, alto, extra) => fila([celda(t, { cs: 13, c: 'sec', s: extra || '' })], alto || 9);
  filas.push(seccion('INFORMACIÓN GENERAL', 8.5));
  const info = (lbl, val, alto, estilo) => fila([celda(lbl, { cs: 4, c: 'lbl' }), celda(val, { cs: 9, c: 'val', s: estilo || '' })], alto);
  filas.push(info('NOMBRE DE LA EMPRESA, BENEFICIARIO O PROVEEDOR', e(d.beneficiario), 13));
  filas.push(info('R.I.F. DE LA EMPRESA Y/O PROVEEDOR | C.I. DEL<br>BENEFICIARIO', e(`${d.tipo_doc || ''} ${documentoConPuntos(d.documento, d.tipo_doc)}`.trim()), 15));
  filas.push(info('NÚMERO DE PROCESO', e(d.numero_proceso), 15));
  filas.push(info('UNIDAD SOLICITANTE', e(d.unidad_solicitante), 15));
  filas.push(info('MONTO BS.', bs(d.total_final), 15, 'font-weight:bold;font-size:9.4pt'));

  filas.push(seccion('CONDICIONES DE PAGO', 9));
  filas.push(fila([
    celda('TIPO DE PAGO', { cs: 2, c: 'lbl' }), celda(e(d.tipo_pago), { cs: 2, c: 'chico' }),
    celda('CONDICIÓN', { cs: 2, c: 'lbl' }), celda(e(d.condicion), { cs: 2, c: 'chico' }),
    celda('FECHA DE EMISIÓN', { cs: 2, c: 'lbl' }), celda(e(fechaVE(d.fecha_emision, true)), { cs: 3, c: 'chico' })
  ], 15));
  filas.push(seccion('CONCEPTO', 9));
  filas.push(fila([celda(e(d.concepto), { cs: 13, c: 'b', s: 'font-size:7.6pt;text-align:center;padding:2pt 14pt' })], 60));

  filas.push(seccion('DESGLOSE', 8));
  filas.push(fila([
    celda('DESCRIPCIÓN DEL ÍTEM', { cs: 4, c: 'lbl gris', s: 'font-size:6.2pt' }), celda('CANTIDAD', { c: 'lbl gris', s: 'font-size:6.2pt' }),
    celda('PRECIO UNITARIO', { cs: 2, c: 'lbl gris', s: 'font-size:6.2pt' }), celda('SUB-TOTAL', { cs: 2, c: 'lbl gris', s: 'font-size:6.2pt' }),
    celda('I.V.A.', { cs: 2, c: 'lbl gris', s: 'font-size:6.2pt' }), celda('TOTAL', { cs: 2, c: 'lbl gris', s: 'font-size:6.2pt' })
  ], 14));
  for (let i = 0; i < MAX_ITEMS_ORDEN; i++) {
    const it = items[i];
    const sombra = i % 2 === 1 ? ' gris' : '';
    if (it) {
      filas.push(fila([
        celda(e(it.descripcion), { cs: 4, c: 'b' + sombra, s: 'font-size:5.6pt;text-align:center' }),
        celda(e(formatoNumeroVE(it.cantidad, it.cantidad % 1 ? 2 : 0)), { c: 'chico' + sombra }),
        celda(bs(it.precio_unitario), { cs: 2, c: 'chico' + sombra }),
        celda(bs(it.subtotal), { cs: 2, c: 'chico' + sombra }),
        celda(it.exento ? '' : bs(it.iva), { cs: 2, c: 'chico' + sombra }),
        celda(bs(it.total), { cs: 2, c: 'chico' + sombra })
      ], i === 0 ? 14 : 7.5));
    } else {
      filas.push(fila([
        celda('', { cs: 4, c: 'b' + sombra }), celda('', { c: 'b' + sombra }), celda('', { cs: 2, c: 'b' + sombra }),
        celda('Bs0,00', { cs: 2, c: 'chico' + sombra }), celda('Bs0,00', { cs: 2, c: 'chico' + sombra }), celda('Bs0,00', { cs: 2, c: 'chico' + sombra })
      ], 7.5));
    }
  }
  const totalLbl = (t, estilo) => celda(t, { cs: 2, c: 'lbl-izq', s: estilo || '' });
  const totalVal = (v, estilo) => celda(v, { cs: 2, c: 'b der', s: 'font-weight:bold;font-size:5.6pt;' + (estilo || '') });
  filas.push(fila([celda('OBSERVACIONES', { cs: 9, rs: 2, c: 'b', s: 'font-weight:bold;font-size:7pt;text-align:center' }), totalLbl('SUB-TOTAL'), totalVal(bs(d.subtotal))], 7.5));
  filas.push(fila([totalLbl('TOTAL I.V.A.'), totalVal(bs(d.total_iva))], 7.5));
  filas.push(fila([celda(e(d.observaciones), { cs: 9, rs: 4, c: 'b', s: 'font-size:6pt;text-align:center' }), totalLbl('TOTAL EXENTO'), totalVal(d.total_exento > 0 ? bs(d.total_exento) : '')], 7.5));
  filas.push(fila([totalLbl('TOTAL GENERAL'), totalVal(bs(d.total_general))], 7.5));
  filas.push(fila([totalLbl('DESCUENTO'), totalVal(formatoNumeroVE(d.descuento_pct || 0, (d.descuento_pct || 0) % 1 ? 2 : 0) + '%')], 7.5));
  filas.push(fila([totalLbl('TOTAL FINAL', 'font-size:7.6pt'), totalVal(bs(d.total_final), 'font-size:8.6pt')], 11));

  filas.push(seccion('IMPUTACIÓN PRESUPUESTARIA', 9, 'font-size:8pt'));
  const marca = (t) => (d.presupuesto_tipo === t ? `${t} (X)` : t);
  filas.push(fila([
    celda('PRESUPUESTO', { cs: 3, c: 'sec', s: 'font-size:7pt' }), celda(marca('ORDINARIO'), { cs: 2, c: 'sec', s: 'font-size:7pt' }),
    celda(marca('EXTRAORDINARIO'), { cs: 2, c: 'sec', s: 'font-size:7pt' }), celda(marca('OTROS'), { cs: 6, c: 'sec', s: 'font-size:7pt' })
  ], 8));
  filas.push(fila([
    celda('PROGRAMA', { cs: 2, c: 'chico' }), celda('SUB-PROGRAMA', { c: 'chico', s: 'font-size:4.4pt' }), celda('PROYECTO', { c: 'chico' }),
    celda('OBRA O A.C.', { c: 'chico' }), celda('PARTIDA', { cs: 2, c: 'chico' }), celda('GENÉRICA', { cs: 2, c: 'chico' }),
    celda('ESPECÍFICA', { cs: 2, c: 'chico' }), celda('MONTO', { cs: 2, c: 'chico' })
  ], 7.5));
  for (let i = 0; i < 3; i++) {
    const l = (d.imputacion || [])[i] || {};
    filas.push(fila([
      celda(e(l.programa), { c: 'chico' }), celda(e(l.programa2), { c: 'chico' }), celda(e(l.subprograma), { c: 'chico' }),
      celda(e(l.proyecto), { c: 'chico' }), celda(e(l.obra), { c: 'chico' }), celda(e(l.partida), { cs: 2, c: 'chico' }),
      celda(e(l.generica), { cs: 2, c: 'chico' }), celda(e(l.especifica), { cs: 2, c: 'chico' }),
      celda(l.monto ? bs(l.monto) : '', { cs: 2, c: 'chico' })
    ], 15));
  }
  filas.push(fila([
    celda('LUGAR DE COMPRA', { cs: 4, c: 'lbl' }), celda('TIPO DE MONEDA', { cs: 3, c: 'lbl' }),
    celda('TASA DE CAMBIO', { cs: 3, c: 'lbl' }), celda('MONTO DIVISA', { cs: 3, c: 'lbl' })
  ], 7.5));
  filas.push(fila([
    celda(e(d.lugar_compra), { cs: 4, c: 'chico' }), celda(e(d.moneda), { cs: 3, c: 'chico' }),
    celda(d.tasa_bcv ? bs(d.tasa_bcv) : '', { cs: 3, c: 'chico' }), celda(d.monto_divisa ? e(formatoUsdPlantilla(d.monto_divisa)) : '', { cs: 3, c: 'chico' })
  ], 7.5));
  const anchos = [2, 2, 2, 2, 2, 3];
  filas.push(fila(anchos.map((n) => celda('', { cs: n, c: 'b' })), 68));
  const firmas = d.firmas || [];
  filas.push(fila(anchos.map((n, i) => celda(e(firmas[i] || ''), { cs: n, c: 'firma' })), 10));
  filas.push(fila([celda(`ELABORADO POR: ${d.elaborado_por ? '<u>&nbsp;' + e(d.elaborado_por) + '&nbsp;</u>' : '______________________________________'}`, { cs: 13, c: 'b', s: 'font-size:4pt;text-align:center' })], 13));

  const totalPx = COLUMNAS_OC_PX.reduce((a, b) => a + b, 0);
  const columnas = '<colgroup>' + COLUMNAS_OC_PX.map((px) => `<col style="width:${(px * 100 / totalPx).toFixed(3)}%">`).join('') + '</colgroup>';
  const pie = `<div class="pie">${e(inst.pie)}<br>${e(inst.telefono)}</div>`;
  const cuerpo = `<div class="hoja">${selloAnulada(d)}<table class="oc">${columnas}<tbody>${filas.join('')}</tbody></table>${pie}</div>`;
  return documentoHtml(`${d.titulo} N° ${d.numero}`, ESTILOS_OC, cuerpo);
}


/* ===================== 17_Logos.gs ===================== */
/**
 * Módulo: Logos institucionales (escudo del municipio y logo de la Alcaldía) en base64.
 * Extraídos de las plantillas oficiales. Para cambiarlos, reemplace el texto base64 (JPEG).
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.2-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

const LOGOS = {
  escudo: 'data:image/jpeg;base64,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',
  guanipa: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAQDAwMDAgQDAwMEBAQFBgoGBgUFBgwICQcKDgwPDg4MDQ0PERYTDxAVEQ0NExoTFRcYGRkZDxIbHRsYHRYYGRj/2wBDAQQEBAYFBgsGBgsYEA0QGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBj/wAARCADIAPkDASIAAhEBAxEB/8QAHQABAAIDAQEBAQAAAAAAAAAAAAcIBQYJBAEDAv/EAFUQAAEDAwICBQQLCwgJBAMAAAECAwQABQYHERIhCBMxQVEUImGzFjI3OEJxdYGRsbIVFyNSVnJzdIKh0hgkMzQ2YpXRJTVEU2OSlKLBCVWDxEPT8P/EABwBAQACAwEBAQAAAAAAAAAAAAAFBgMEBwgCAf/EADsRAAIBAgIFCAgFBAMAAAAAAAABAgMEBREGEiExcSIzQVFhcrHRBzQ1U4GhweEUFTKS8BaRorITQtL/2gAMAwEAAhEDEQA/AL/UpSgFKUoBSlKAUpSgFKV+bz7MaOt+Q6hpptJUtxxQSlIHaST2CgP0rFX3JbDjULyq+3WNCbPtetV5y/zUjmr5hUPZ3ryG1O2zCEpWoeaq5up3T/8AEk9v5x5eAPbUGXC4z7rcXJ9zmPy5Th3U8+sqUfnPYPR2VZLDR2rWSnXequrp+382EPdYvCm9WktZ/L7k9X/pEwGVqZxuyOyyOyRMV1SD8SBuo/PtUd3TWfUK5EhN4RAbJPmQmEo2/aO5/fWgUqz2+D2lBcmCb7dviQlXELipvllw2GWl5Rk09wrm5DdX1HtK5S/q32qVeju++9lt76591z+aNnz1lX/5D41ClTR0c/7W3v8AU2/WGseM04xsamqsti8UfeHTlK5hm/5kWKpSlc4LgK/N95uPGcfeUEttpKlKPcB21+labn126i3t2ppX4R/z3Nu5APZ85+o1D4/i9PCLCre1P+q2Lrb2JfFmzZ2zua0aUenwPXimRrvL8xiQdnErLrSf+GT2fN/5rZ6ha0XFy1Xlicjc9Wrzkj4STyI+ipmadbfYQ80oKQtIUlQ7waqno60lnjFjKlcyzq03tfWntT8V8F1kjjViraqpQXJl4n90pSuhkKKUpQClKUApSlAKUpQClKUApSlAKUpQClKEgDcnYUB5bjcYVptb9yuUluNFYQVuuuHYJA//ALsqrOpOqVxzaauDCLsOxtq8yPvsp/b4bn/hPYPSa9er2o68tvqrPanz9xIa9gUnlKcHas+KR8H6e8bRlV5wTBlRiq9Zcp7l1ffwKxiWIuo3Spvk9Pb9hSlfrGjSJktqLEYdffdUENtNJKlLJ7gBzJqyt5bWQx+VfUIU46G20qWtXYhI3UfiA5mptwzQGTKbbn5lKXFbUOIW+ModZ+2vsT8Sdz6RU1WLEsbxpgNWOzRIZA2LiEbuK+NZ84/Oar95pFb0Hq01rvs3f38iWt8Iq1FnPkr5/wBipcDT/N7khC4eK3RSF+1Wtnq0n517VM2iuC5Tid/uku/2zyRp+Mhts9chZKgskjZJO3Kpo2FKr97j9a6pypOKSfHMlrbCqdGaqazbR5p0swYDkoRnpAQNyhkAq29AJrUnNRYwB6m2PK8ONwJ+ret2rTcow9MsLuFqQEyPbOMDkHPSPBX11y7TBY7SofiMGqLkrbHVTb7Y5p7ezp6Nux2fDfwkp6l0t+55+PmY13USeSept8ZA/vqUr/KtXuNwk3S5OTZRT1i9uSeQAA2AFeZSVIWULSUqSdikjYg+FfK85YtpLimKQ/4r6s5RTzy2JZ8EkXa3sbe3etSjkxWxWvMrpa7e3CQ3Heab5J6wHcDw3BrXaVpYbi15hlV1rOo4SayzXUZa9vTrx1asc0byzqM4NhItST6W3dv3EVm7NlrN5miMxbZYV2qX5pSgeJO9aFYsfmXyXwtDq46T+EfI5J9A8T6KlO22yHaYKYsNrgQOZJ7VHxJ7zXcNBb7SbFmrm7rZW66XGOcuxbFs638Fm88qpi1Kxt1qU48vi9nHyPZSlK66VwUpSgFKUoBSlKAUpSgFKUoBSlKAVFGuOaqsGKIx+3vFE+5pKVqSdi2x2KPxq9qPn8KlYkAEk7DxqmmoGSKyvUO5XcLKo5cLMYc+TSPNTy7t+avjUanMAslc3GtJcmO349H87CMxW5dGjqx3y2eZrNKU7BuTsK6EVI9dstk683ePa7ZGXIlyF8DTSO0n/wAADmT3AVavTrTK14PbkyHQ3LvTifw0wjkjftQ3v2J9Pae/wGC0SwJuw40nJrix/pO4NhTYUObDB5pA8Crko+jhHdUs1RsdxaVabt6T5K39r8iz4XYKnFVai5T3dn3FKUqtEyKUpQClKUBHGoCIiL3H6lpKX1Nlbqh8Lnsnf08jWoVnsxkmTmEob7pa4Wk/MOf7yax9ts9xuz3BBjKcAOynDyQn4zXk7SiM8Sx+5jaU9ZubSUVvy2Z5Lryzb+J0OwaoWcHUeWzp7dp4aHsrZ7hg13hxg9HU3M2G60NAhQPoB7R+/wBFaypKkLKFpKVJOxSobEH01DYngt9hU1C9pODe7Pc+DWx/Bm1QuqVws6UsyaLSiKiyRfI2kNsqaSpKUdnMb17awGGyfKMPijva4mj8x5fu2rP163wW5hc4fQrwWSlCLyW5ZpbPgc5uoOFacX0NilKVJmAUpSgFKUoBSlKAUpSgFKUoBSlKA1PUy8qsOlV6ntucDxjllojtC3DwDb/m3+aqcgADYdg5CrLdIWYWNN4cNP8AtM9APxJQpX1gVWmr5o1SUbVz6ZPw/jKtjVTWrqPUhW0aeY4Mq1ItlpdRxRus6+T4dUjzlD5+Sf2q1epv6OVtQ5eb7d1DzmWWoyD+eSpX2E1J4ncO3tZ1Fvy2fHYaVlSVWvGD3FgkpCUBKQAANgB3V9pSuYF2FKV/DzzUeM5IfWENNpK1qPYABuTX43ltZ+pZ7Ef3StNGq2nhG4yqDz/O/wAq+/fW09/KqD/3f5Vo/mll76P7l5kh+UX/ALif7X5G40rTvvq6e/lVB+lX+VPvq6e/lVB+lX+VPzSy99H9y8x+UX/uJ/tfkfrCwmOqe7PvDvlLrjinOqTuEDc78z2n91bS0y0wylpltDbaRsEoGwHzVqP31tPfyqg/93+VZCy5zieQ3I2+y3yNMkhBc6pvffhG255j0io3CLXB7DOnZOClJ7WmnKT7Xnm/5kZbu2xGcdevTmorri0l8skbDWLuuP2u8IPlccB3bk835qx8/f8APXpudyg2azSrtc5KI0KK0p595ftW0JG5UfQBWh/f80f/AC9tf0r/AIalr22trqm6F1FSi+h5NfMhvxsLWSk6ii+ORtmOWR6xMSYipCXmVudY2rbYjlsQR8wrN1HH3+9H/wAvbV9K/wCGspj2rOnWV35qy49lkC4T3UqUiOzxcSgkbk8wOwVjw+1trGhG1ttkI7lnnltzy6+B81MSo3FTWdSLk+1bTc6UpW+ZRSlKAUpSgFKUoBSlKAUpSgFKUoCE+kaT7GrEO7yxfqzVeasn0h4indPbfLTtsxcEhXxKbWPr2qtldC0eadlFdTfiVLF1lcv4CrFdHMI9iN6UNuMzkg/F1Sdv/NV1qdOjjcEJmX+1KV560syUJ9A4kqP70194/Fysp5dGXij5wqSVzHPt8CfqUpXOi3isdf8A+ylz/VHfsGsjWOv/APZS5/qjv2DWKvzcuDMtDnY8UUhQT1aefwR9Vf1ufE1/Kf6NP5o+qvtea3vPUp93PiabnxNfKV+A+7nxNSfoIT99hfye99pFRfUoaCe6wv5Pe+0ipvRv2pQ7yILSf2Vcd1k1au+4LmPyPJ9Wa5sbnxNdJ9XfcFzH5HlerNc167Xf/qR4w0y5+nw+p93PiamLovEnpKWjc/7NK9Uahypj6L3vlLR+rSvVGtWjzkeKK/g/r1HvLxL80pSp47EKUpQClKUApSlAKUpQClKUApSlAaXqvaDetIrzHQgrdZa8qbA7eJshf1Aiqg8u7sq+DiEOtKbcSFIUClSSNwQe0VSrMMfdxfOLlYnEkJjvHqifhNHzkH/lIq46L3C1Z0HxXg/oV3G6O2NVcDCVuWlmRJxrVK2zH3AiLIJhyCeQCXNgCfiUEn5q02lWivRjWpypy3NZEJSqOnNTjvRfLupUc6P5yjLMNRBmPA3a3JS0+FHm6jsQ784Gx9IPiKkauW3NvO3qypT3ovFGrGrBTjuYrzXCL5daZUIL4OvZW1xbb8PEkjfb569NK15RUk0zNGTi010EBDo4yAkD2XNcht/UT/HX3+TjI/K1v/oj/HU+Uqs/0dhHuf8AKXmWv+t8a99/jH/yVqyzRF7FsNn39WSIlCIgL6kRCjj3UB28Z27fCom76tzq37i9+/QJ9YmqjntNc60xwu2w66hTtY6qcc97e3N9bZ0zQrFrrE7OdW7lrSUstyWzJPoS6z5UoaCe6wv5Pe+0iovqUNBPdYX8nvfaRUZo37Uod5ErpP7KuO6yatXvcFzH5Hk+rNc166Uave4LmPyPJ9Wa5r12u/8A1I8YaZc/T4fUVMfRe98paP1aV6o1DlTH0XvfKWj9WleqNatHnI8UV7B/XqPeXiX5pSlTx2MUpSgFKUoBSlKAUpSgFKUoBSlKAVDGvmGKuFlZy6A1xPwU9XKCRzUyTuFfsk/QT4VM9fw8y1IjrYfbS404koWhY3CgRsQR3itqyupWtaNaPR80YLmhGvTdOXSUQpW86n4A/g+UHydC12eWoqiOnnwd5aUfEd3iOfca0aunUK8K9NVabzTKVVpSpTcJrajKY7kNzxfI496tL3VyGT2H2riT2oUO9J/yPaKtthOdWbOLGJlucDclsASYa1fhGFenxSe5XYfj3FU1r3Wi8XOw3dq6Wea7EltHzXGz3d4I7CD3g8qjsVwmF9HNbJrc/ozcsb+Vs8nti+gvJSoZw3Xu0zmm4WXtC3SuzyxpJUwv0kcyg/SPSKl6HOhXGGiXAlsymFjdLrKwtJ+cVQrqyrWstWrHLw/uWmhc066zpvM9FKUrVM5pWrfuL379An1iaqOe01bjVv3F79+gT6xNVHPaa5F6QfXqfc+rOz+jf2fV77/1ifKlDQT3WF/J732kVF9ShoJ7rC/k977SKrujftSh3kWbSf2Vcd1k1ave4LmPyPJ9Wa5r10o1e9wXMfkeT6s1zXrtd/8AqR4w0y5+nw+oqY+i975S0fq0r1RqHKmPove+UtH6tK9Ua1aPOR4or2D+vUe8vEvzSlKnjsYpSlAKUpQClKUApSlAKUpQClKUApSlAYzILBa8mx+RZrvHD0Z4bHuUg9yknuUDzBqpueaf3fBb0WJaVSIDqj5NOSnZLg/FV+Ksd4+ccquLXjulqt16tT1tusNqXEeHCtp0bg/5H091S2F4rUsZZb4Pevqu00L6wjcxz3SXSUZpUvZ3obdbMt25YoHbnA9sYp5yGR4D/eD/ALvQe2oiUlSHFIWlSVpOykqGxSfAjuNX+1vKN1DXpSz8VxKpXt6lCWrUWR8r22y8XazSOvtFzlwHD2qjOqb3+PY7H568VK2JRUllJZoxJtPNEh2/W3UOCAly6R5yQNgJUZJP0p4TUq6SalZBnF8uMK8swENxo6HUGM2pBJKiDvuo1Wepo6Of9rb3+pt+sNQGMWFtC1qVI00mupdqJXD7utKvCEpNr7Eq6t+4xfv0CfWJqo57TVuNW/cXv36BPrE1Uc9przJ6QfXqfc+rPSPo39n1e+/9YnypQ0E91hfye99pFRfUoaCe6wv5Pe+0iq7o37Uod5Fm0n9lXHdZNWr3uC5j8jyfVmua9dKNXvcFzH5Hk+rNc167Xf8A6keMNMufp8PqKmPove+UtH6tK9Uahypj6L3vlLR+rSvVGtWjzkeKK9g/r1HvLxL80pSp47GKUpQClKUApSlAKUpQClKUApTceNKAUpTceNAKV5Ytyt85+SxDnRpDsVzqpCGXUrUyvbfhWAfNO3ca9VAK1TKtOcTy8Fy621KZRGwmRz1bw/aHtviUDW17im4rJSqzpS16byfYfE6cai1ZrNFcr/0er5FUt3HLrGuDXaGZX4F34txuk/8AbUeXXA8zsq1i44zcm0oG5cbZLqNvzkbirobjxr5yqet9JbmmsqiUvk/l5EXVwajPbBtFDlgtq4XAUHwX5p/fUz9HJSTlt72UD/M2+w/8Q1YR+HDlDhkxWHge5xAV9dfjDtNptzy3YFthxXFjhWthlLZUPAkDnWS90hV1byounk329vA+LbCXQqxqa+eXZ9zV9XNhovftzt+AT6xNVGKk7nzk/TV6ZMaNMirjS2Gn2FjZTbqQtKvjB5Gsb7FsX3/s7aP+jb/hrk+kei08XrxrRqKOSy3Z9Lf1OpaMaXU8GtpUJ0nLOWex5dCXV2FJ+JP4yfpqUNBCDqwvYg/6Pe7D/eRViPYtjH5O2j/o2/4a9EOyWW3yPKIFogRXeEp6xiOhCtvDcDs5VGYXoPUsruncusnqvPLL7kriun1K+s6lsqLTkss815Gtave4JmO//s8r1ZrmtxJ/GT9NdWJEeNMhuxZbDUiO6kocadSFoWk8iCDyIPhWD9geDfkbj/8AhzP8NXq4tnVaaZw7G8CliVSM4z1clluOYfEn8ZP01MfReI/lK2gBQ/q0rv8A+Cauz7A8G/I3H/8ADmf4a9MDFMWtU5M22Y3aIUlIIS/GhttrAPIgKSkHnWKFk4yUs9xHWWik7evCs6ieq093UZilNxSpAuopSlAKU3HjSgFKUoBXjutzhWWxzLvcn0sQ4bK5D7quxCEJKlE/MDXsrF5FjtmyzF5mO5DBTNtk1HVSIylKSHE7g7EpIO3Id9AVC0Y6S2V5F0jI0LKcjjSLBk7khmDbEpb47U4HD5OhfCkKBUBw+cTvxA8q2TSTXjIj0as5ynKMgjXvJLZLlm3QpS2mnXEIZQpIDaAkqQCVE7DfYK58qnGdotpZcbXaLfJwi1hi0KQuD1KCythSQAkhaCFE8gdyTzG/bWPtHR80asWTxsitWBW6Pc4zqnmpPG6opUQQTspZB3ClciNudARBo3m2c3iRjua5V0gMclQrmzKlXDF3ozKHWUNJUeFrh2UkpA4lb9gHwu2tV0z6TmSXvpLxFXzJormJ5FOkW+JZt2wu2ecgRnFnhCvPOyRuTuVq7NhVh4/R30UiTJsqLp3aGXpramnlNhadkqGygjZX4PcEjzNuRI7DWQkaJ6VScZtuPu4PahAtjqHoaG0FtbS078Kg4khZPMnmo8+fdQEN6S6wZDd9KNTn8ozNly+W+bPatKJC2G3kJbZUUBCABx7KHgeYqO8O1q1as9l04zC56iN5Q3k92VbZmMyIbCXm0B7q+sQpsBW57QSBzIGxBqyiejjomi9m7jT+3+XKcW6Xy68Vca9+I819/Er6a9+LaFaR4Xf2r3jOB2qDcWf6KVwqdW3y23SVk8J25bjnQFU8T1gu2DdErKLjDuESLk14y9+3Qp/UNNlBKW1uyHDw+dwpUo8S+Lmod3Kpo6PGr15zzRzJol9vjNzyTHnH0LuDPAUyWiFqZeTwgJI3SpIIHPgBPbW/wNA9H7ZOhS4eC29LkKQ5LjhxTjiW3XNuNfApRSSeFPaD2DwrN23THArPllzyW04zCg3O6R/JJr0bibD7ewHCUA8PwRzAB7fE0BS3GOk5q396G4WCfMmXDKryW37Bdiw0ChkFSZJ2CQg8HUqI3HapW/JIrb9M9cM6mamYKxlucFNouWJyJ8ky0sMtvSA5JCVlXCNj+DSNgQPN7Ks7atJtOLJj8ay23D7YzDisyI8dJbK1styNw8lDiiVpC+I77HvrG3LQbSG74nacauWC21+22hCm4LRKwqOlSiopS4FcfCVEnYkjegKjWbpAa5N2PA7tCu8vIZUl26PzLcuM1/P2Y60Ep81AI4W+s2KeYI32O21ZBfSH1FvsC7X2xZXPj29/N4ESA0uOzxswXm3lFj2h39qnnzPLt51b+HpZp9b7tj9ygYrAiyceacYtS2ApAiIc34wlIOx4tzuSCdyTWKVoTpIpEhv2D25CJFxRdnUNqcQkykcXC4AFAAjjVyGw59lAV8xrU7UzUXLb/kCtbMewFm1X1NtjY3cozJStkuhB6zj2UpR5p5HmoKG6BtWoZfrpqxA+7SGM7uERtjOpNpS8zDZcW1ESjcISjg87btA7SeW9W2u2h2kt9zg5fd8Cs8u8lwOrkuNHZxf4y0b8C1cu1QJr+XtDNKH5apLuGQlOquhvRV1jo/nh7Xvb9vIcuz0UBVyPrNrW3Y7IqVkd1VbJGbR7ZCu8y1Nwn7lDUDxpU0pHIe1O45gqKdzty+XDWrVi+WDN9SIuqtqxo45czEiYc5FaUp9sOcOyuMcajzI37ylftABVxcpwXE81+5vsoszNy+5kpM2H1qljqXk9ixwkcx6dxWu3nQrSLIczVld6wGzzLspzrXJC2yA6v8ZaAeFZ8SoHfvoCD9cdYdRI2m2kd+xe4zsfmZQ2XJsaEy04tRUhkhKA8Nt91q4dyO0bmo6j9JHV2Fp7cLJKyphN3XkaLQm53KC2mRa2ClRK3uAdUSSDsRxcPVudvmmrlZrpfgWokWBGzPGot2at/GYqHVLQGuIAK2CFDtCU/RXgg6KaUW3CZmIw8DszdmmrS5Iilni61afaqKiSrdO52O+43O21AVXyjWfVfA5Wc4KzqQ1mBg2ti4Q8lhxmQ5DWXmQpCuEKQQQ4U7HfYlOxG5A3XU/WfJrZ0UtP8gxjNmPZLKegJurkZbDrqguOtSw4jYhG60jfkNiNuVTZbtCdI7Th1zxW3YLbY9qufAJrCePikBCwtIU4VcZAUAQN9t6xrPRp0NjsOMs6d21CHFocWA495ykElJPn93EfpoCB8y1o1P0/v2oumcrIJtxyWTOhDEpio7XGlmQ5zACUcJ2SUgbg896/TX7WnO8Eu9h0/wAdzxmLe7NZxNvdykdUDPklKeFgBTe3EobrASBuFgctqtBeNNsGv+e2vNLxjkSXfrWEiHOc4uNnhUVJ2AOx2KiRuDsTX5M6WaesZPeMi9idueud4IVPkyUF9T23L4ZITyO3mgd3gKArFqlr9fp2Q6e3TH88ueKY5fbCudPXbbc3cFsPpUtKh1ak7q4VpKDzGwBPdXnwfWvV685No0i/3xbUS+z5zMpSGGkC5R2nEpQ4sBPmkHjG6eHfh3qydm0Q0rx+dbZlow6HHetqH2oZ6x1YZQ+FB1IClkbKClbgjvNeaNoBpBEjW9iNhUVtu3F5UNIkP7MF4bO8Hn8uIDn9PbQFbrP0pr/K6UTM17KIqsDm3ddpbtBDfWMMcKUNyzsnjCVLIVxFRGxUNuQrG37pG6rYzfNULdMmzZNtTcplps9zbjtb2qWhxZab34dlJU2kjzgT5u432VVq3tDNJH8HjYg5gdpNnjLDjUcIKVJUCTv1gPGeaj2qr92tGdMWcevljTiEJVvvryZFyZcU4vylxPNKyVKJCgee4IO9AVmhasaoZ9mcPEk6rwMAYt2MRLm5cZsdnjub647bilkrAASSvfZO2yUk7HunXo16j5Fqfog3fcpDLlxjzXoK5TLfVplBHCQ5wjkD52x22G6TyHYM7f8AQzSXJ7da4V9we2zGrVHREhFXGlbTKBslvjSoKKR3Ak1udlsloxyxRrLYbbFt1vjI4GYsVsNttj0AfT6aA99KUoDF5DkdixPG5V/yS6RrbbYqeN6TIVwpSO4eJJPIAbknkKqZmvToZZuDkXT/AA4S2EKIE68OqaDnpSyjzgPzlA+gVGHSz1VnZtrFKxGJJWmw468YyGUnzXpQGzrqufPYkoT4AK/GNQTabTc77e4tns0CRPuEtwNMRY6ONbqj3AfSfQASeQoCxKOm9qymX1i7Lia299+q8leHLw4ut3qScC6cNouFxZgah4ybOhxXCblbXFSGW9+9bZHGkelJV8VQhJ6JWuEXHDdjjcJ5YTxqgMz21yQPzfak+gKJqIF2K+tOqbcsd1QtBKVJVDdBSRyIPm9tAdfrdcrfeLRHutqmsTYUlsOsSI6wtt1BG4UlQ5EGqd6i9MTO8O1ayPFIGLY7Ii2u4OxGnX1P8a0pPIq2Vtv8VfehRmeQxbpd9NrxGnotxYVcreZDDiEsLCgl1tJKdgFcaV7b9oUe81XTXT3y+d/LUj6xQFsdBek/l+q+sCMRvWPWODFVBflddDU6XOJHBsPOURt5xqxObXyRjGmuQZJDZaekW22yJrTTu/AtTbalgK257EjntVBuhp76Fn5Il/W3V5dW/cCzb5Bm+oXQFPB06dRikH2HYtzH40j+OrIdHPWC+6yYNd73frXbre9CuHkaEQSspUnqkL3PGSd91GuZafaJ+IVfHoK+4/k3y3/9dqgLRyZLEOE7LkuJbZZQXHFq7EpA3JPxAGqM3Hp0ZqLxLFoxHHXLf16/JVyFPhxTXEeAq2VtxFOxO3fU6dLbPBh3R4m2yLI6u45Av7mMBK+FQbUN3lD0BAKfjWK5vfNQFqofTpzkXKOblh+OiEHUGQWFP9YGuIcfDurbi4d9t+/arzwpka422PPhupdjSG0vNOJ7FoUAUkfGCK43V0Z6IWeey7o+x7LKeC7hjrv3OcBJKiztxMKO/wDdJT+xQE3364O2rFrldGUIW5FiuvoQvfZRQgqAO3dyqjKOnVqMppCjh2Lc0g+2keH59XbzL3O798nSPVKrj+1/V2/zE/VQF+9B+ldI1I1CVh+Z2q12eXLRvbXoa18DzidyppXGTsojmnnz2I7dqtB3b1xsiypMGcxNhSHY0lhxLzL7SuFba0ndKknuIIBB9FdOej7rBG1d0tamyltoyC38Ma6x08vwm3mupHchwAkeBCh3UBWmR05NRWZjzKcPxchDikAlUjfYKI/H9FTh0b9esl1nm5Gzf7LareLW3HW0YBcPH1hcB4uMns4Btt4mud03/Wkr9O59s1broHf62zr9BC+09QHt1L6YGdYVq/keJW/F8dkRbXOVFaekKf6xaQAd1bK23591ZzQ3pTZlqjrRBw6845YoUSRGfeU9DU8XAW0cQA4lEbGqt6+++ezr5Xc+ymtv6IPvrrR+ozPVUBYXpB9JbLdItVY+L2PH7LPjO25qYXZqnQsKUtxJHmKA22QPpNRT/Lo1G/I7Fv8Amkfx1i+m1746D8hR/XP1A+J4+7lme2XF2JLcV26TWoSH3ElSWy4oJCiBzIG/ZQFjm+nTqEHAXcMxhaN+YS5IST8/EfqqYtKOl/h+d3yNjuUWxeL3WSoNx3HHw9EfWeQQHNgUKJ7AobHs332FVv1Z6LOW6VYC5l7+QWy829h1DclMdlbLjIWoJSrZRIUOIgHmCNx21A/byPYfCgOzFQN0j+kBN0ZRYoNgttuuV2uSnHXGpqlhLTCABxbIIO5WoAc/gqrbOj5lc7M+jbi19ukkyJ5jKjSHlDmtbS1NcR8SQgEnxJqgvSGzv74PSFv13YeLlviOfcyD4dUySkkehSy4rfwUKAlP+XRqN+R2Lf8ANI/iqe+jjr/M1mbvkG/2+222725TbrbEJSyl1hY249lkncLBB5/CTXODY7b7Hbs3qUujvnh0+6Qthuj75at01z7mzvO4U9U8QkKV6Er4FfsmgOo1KDspQHHG5yX5t8nTZSip9+S664o9pUpZJP0k1ZnoN2qBL1iyK6SGkLlQbUlMYqG/B1ruy1D07IA38CfGoh11weRp/r5kVjXHU1EdkqnQT3LjukrTsfQSpJ8Cmvw0e1SuekOpzGVQIqZrC2lRZsJS+DyhhRBICufCoFKVA7do27CaAsBrn0ltVcD1+yHE8dnWlu2QVMpZQ/ADixxMNrO6irnzUaj3+WNrj/7pZP8ADE/xVtWW5j0TNR8muGc5Qc9iXmdwKfhsoI5obSgBPDujsSPhfRVd8vlYjLyZ1WD2e5WyzpHC0i5SxIfcPetZACU7/ijfbbtNAWw6PXSN1Q1G13g4rlE61u216JJeWmPBDS+JCAU7KCj31XHXT3y+d/LUj6xW/wDQ4ts+X0nY02NFdcjQrbKVJeSPNaC0hCOI+lXIDv2Pga13pOY9Lx7pSZSmQ3wt3B5Fyjq7ltuoHMftpWPjFAbJ0NPfQs/JEv626vLq37gWbfIM31C65oaSajS9KtWLdmUaEmchhK2JEQq4C8y4NlAK7lcgQezdI35GrC6sdMezZfpVdMUxHGbrFlXWOqI/KuKm0pZaWNl8AQpRUogkDfYDffnttQFQk+0HxCr4dBb3H8m+W/8A67VUQ79gKvd0cXk6UdCS96hXlpTaZDkm7tIWP6RCUpaZAH99SBt48QoCFumHnqsq17VjkV9S7fjbIiBIVugyV7LeUB4jzEfsGtD0Ewr2e9IbGrG8yHITUkT5gUPN6ljZwg+hSghP7VR/cJ8y63eXdLi71syW8uTIc/GcWoqUfpJr3Y7lOS4jcnLji1+uFmluNllciC8WlqQSCUkju3AO3oFAbr0gcNGDdIzJrO02luI/JNxiJT2Bp/dwAfEorT+zW4dETPPYh0gmLLKeKLfkbX3PWFL4UpfG62VHxO4UgfpKhvIsryfLri1Pyq/3G8ymm+pbfnvF1aEbk8IJ7tyTt6ax0OZLt1yj3CA8pmXGdQ+w6ntQ4hQUlXzEA0B12zH3Or98nSPVKrj+1/V2/wAxP1V1ZtmYRc/6M5zCGOFFysbzykbbcDnVKDiPmWFD5q5TNf1dv8xP1UBkRZ7krG15AmG4q2olCCuSOaUPFHWBB8CUgkeOx8K27R/U656T6pwcog8bsQ/ze4Q0q2EmOojiT+cOSknxHgTVgeiThdk1C0K1FxHII/Wwp01hBUB57KwzuhxB7lJUAoH0eFVnz/B73pzqHcsPv7YEuE5sl1I2RIaPNDqP7qhz9B3HaDQGvyVpdnPuoJKVurUkkbHYqJH11bzoHf62zr9BC+09VPquD0Dv9bZ1+ghfaeoCBNfffPZ18rufZTW39EH31to/UZnqq1DX33z2dfK7n2U1t/RB99daP1GZ6qgM302vfGwfkKP65+oCxy+zcXzC1ZLbUsqmWyW3MYS+kqQVoUFJ4gCNxuOY3FT702vfGwfkKP65+oLwvHfZfqNYcV8s8j+6s9mF5RwcfVdYoJ4uHcb7b9m4oCQtSOklqVqhh5xe/rtMW2LdQ681boymi8UHiSFKUtR4QQDsNuYFRKww/JlNRozDj77q0tttNJKluLJ2SlIHaSSABVymugW31o67VBzg7+C0AH97tTPpd0aNNtLri3eYUWTeL22PMuVzUlamTtsS0hICUfHsVcyN6A1W4SZXR56AjEKW40zf0QDFaSCf67KUpRAI7SjjWfD8Ga56AbAJBJ25bmrW9N7PTc89s+n0J8mPaWfLpiUr5KfdGyEqHilsE8/97VUu0bUBZZzRdSf/AE7m8y8mV92BcfZEQB53khHUbEeAa/C1WkgEFJ7DyO1bedVdTVY4cfOfZCbUY3kfkPliup6nh4Or4ezh4eW3hWoUB1M0Bzz74ugNgvz7ocntM+RT/HyhrzFE/nAJX8ShUmVRboP52bdnl60+lvbMXVny+GlROwfaGziQOzzmyD/8dXpoCLNbdD8e1mxVuNNdNvvUIKNvujaOItE9qFp+G2rYbjcEEAgg9tCs26PWreCTHUXHEZlwho3IuFpQZbCkg9vmjiT8Skg0pQEdptN2XI8nRap6nt9urEZZVv4bbb1Kmn/Rn1Yzy5MBWOybBbFEFy5XhssJSk96Gzstw+AAA8SKUoC/2lWlOL6R4QnH8daU444Q7MnvAddLd224lkdgHYlI5JHZ3k6tr/oRb9ZsWjriyWrdkduCvIZriSULSrmpl3bnwEgEEc0nmN9yCpQFAcx0g1LwKW41k2HXOM0hXCJjLRfjr9KXUbp+nY+itWt9kvN2nIhWuz3CdJWdksxoy3Fk/EkGlKAsPpD0Q8yyi9RrpqLCex3H0KC3IjqgJksb+0CR/RJO2xUrZW3YO8Sj0ybrNg6dY7phidllqjPqEmQ3AiuKQzHY2S015gIAK+e3/DFKUBS8YtlJOyMYvalHkEiA9zPcPa1fzDOiTpMxp5ZW8rxVyZfPI2jPfXNfQVPlIKxshYSACSBsOwUpQH95h0SdJJGA3lrF8VXDvZhumA+mc+rhfCSUbhaykgqAB3HYTVADi2UpPCvGL2lQ5FJgPcj3j2tKUBbnoq329o0XzrT272q5RlRYj9wgeURXEcaHW1JcQkqHMhYSrYf7w1UNrF8nEdsexm9e0H+wPeH5tKUBdboOW25W3DMwTcbdMhqXcWCgSWFtFQ6ntHEBvW7dKDRUan6efduxxQrKbM2pyKEDzpbPauOfEnbiR4K5fCNKUBz19i+T/kzevngPfw1bjoN2q62265ubja50MLZhhBkx1tcWynt9uIDftFKUBBWu2PZDJ6S2byI1guzzK7q4pDjUJ1aVDhTzBCdiK2zol2K+QelLaZE2yXOKyIMwF1+I42kEtctypIFKUBmumfZbzcOkNCft9nuMtoWNhJcjxXHU79a9y3SCN+Y5VFujmOZEx0hsHffx+7NNIvkRS3HITqUpAdG5JKdgPTSlAdTK81xnMWyzyrlK4+oisrfc6tBWrhSkqOwHMnYHkKUoDlDmIzPNdQLzltwxq9+UXSW5KKfue75iVHzE+1+CgJT81Sx0YdDIuoOd3d/P8enGx26IB1EhL0Xrn3FeZsRwkhKULJ2PemlKAtN/JP0G/Ig/4jK//ZVVOk3ofG0+1Fti8Cx64fcK4wuIMx23pIZfbVssFR4j5wUgjc+NKUBF2FHM8J1EsuWwMavfX2uY3J4RAe89IOy0e1+EgqT89dH/AL9eBf726f4c9/DSlAf/2Q=='
};


/* ===================== 18_Documentos.gs ===================== */
/**
 * Módulo: Archivo digital en Drive. Estructura: Raíz / Tipo / Año / "MM - Mes".
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.2-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

const CARPETA_PRUEBAS = 'ENTORNO DE PRUEBAS (datos ficticios)';

const CARPETAS_TIPO = {
  OP: { nombre: 'Órdenes de Pago', porMes: true },
  OC: { nombre: 'Órdenes de Compra', porMes: true },
  OS: { nombre: 'Órdenes de Servicio', porMes: true },
  IMPORTACIONES: { nombre: 'Conciliaciones importadas', porMes: false },
  RESPALDOS: { nombre: 'Respaldos', porMes: false }
};

function carpetaRaiz() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('CARPETA_RAIZ_ID');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (e) { console.warn('CARPETA_RAIZ_ID no accesible, se crea una nueva: ' + e.message); }
  }
  const carpeta = DriveApp.createFolder(APP.nombreCarpetaRaiz);
  props.setProperty('CARPETA_RAIZ_ID', carpeta.getId());
  return carpeta;
}

function subcarpeta(padre, nombre) {
  const cache = CacheService.getScriptCache();
  const clave = 'dir_' + hashTexto(padre.getId() + '/' + nombre).substring(0, 30);
  const enCache = cache.get(clave);
  if (enCache) {
    try { return DriveApp.getFolderById(enCache); } catch (e) { cache.remove(clave); }
  }
  const existentes = padre.getFoldersByName(nombre);
  const carpeta = existentes.hasNext() ? existentes.next() : padre.createFolder(nombre);
  cache.put(clave, carpeta.getId(), 21600);
  return carpeta;
}

function carpetaDocumentos(tipo, fechaISO) {
  const def = CARPETAS_TIPO[tipo];
  if (!def) throw new ErrorApp(`Tipo de carpeta desconocido: ${tipo}`, 'CONFIGURACION');
  const fecha = esFechaISO(fechaISO) ? fechaISO : hoyISO();
  const anio = fecha.substring(0, 4);
  const mes = Number(fecha.substring(5, 7));
  // Los documentos del entorno de pruebas quedan aparte para no mezclarse con el archivo oficial.
  const base = tipo !== 'RESPALDOS' && db.entorno() === ENTORNO_PRUEBAS ? subcarpeta(carpetaRaiz(), CARPETA_PRUEBAS) : carpetaRaiz();
  let carpeta = subcarpeta(subcarpeta(base, def.nombre), anio);
  if (def.porMes) carpeta = subcarpeta(carpeta, `${String(mes).padStart(2, '0')} - ${MESES[mes - 1]}`);
  return carpeta;
}

/** Convierte el HTML de la plantilla a PDF con el conversor de Google y lo guarda en la carpeta. */
function guardarPdf(html, nombre, carpeta) {
  const blob = Utilities.newBlob(html, 'text/html', `${nombre}.html`).getAs('application/pdf').setName(`${nombre}.pdf`);
  const archivo = carpeta.createFile(blob);
  return { id: archivo.getId(), url: archivo.getUrl() };
}


/* ===================== 19_Panel.gs ===================== */
/**
 * Módulo: Panel de indicadores del mes.
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.2-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

function panelResumen(datos) {
  const hoy = hoyISO();
  const anio = Number(datos.anio) || Number(hoy.substring(0, 4));
  const mes = Number(datos.mes) || Number(hoy.substring(5, 7));
  const prefijo = `${anio}-${String(mes).padStart(2, '0')}`;
  const pagosMes = db.leer('Pagos').filter((p) => String(p.fecha).substring(0, 7) === prefijo);
  const activos = pagosMes.filter((p) => p.estado !== ESTADO_ANULADA);
  const categorias = config.obtener('categorias') || [];
  const colores = {};
  categorias.forEach((c) => { colores[c.nombre] = c.color; });

  const porCategoria = {};
  activos.forEach((p) => {
    const c = p.categoria || 'Sin categoría';
    const r = porCategoria[c] = porCategoria[c] || { categoria: c, monto: 0, monto_usd: 0, cantidad: 0, color: colores[c] || '#e2e8f0' };
    r.monto += p.monto || 0;
    r.monto_usd += p.monto_usd || 0;
    r.cantidad++;
  });
  const porDia = {};
  activos.forEach((p) => {
    const r = porDia[p.fecha] = porDia[p.fecha] || { fecha: p.fecha, monto: 0, monto_usd: 0, cantidad: 0 };
    r.monto += p.monto || 0;
    r.monto_usd += p.monto_usd || 0;
    r.cantidad++;
  });
  const ordenesMes = db.leer('OrdenesCompra').filter((o) => String(o.fecha).substring(0, 7) === prefijo && o.estado !== ESTADO_ANULADA);
  const tasas = db.leer('Tasas').filter((t) => t.fecha <= hoy).sort((a, b) => (a.fecha < b.fecha ? -1 : 1)).slice(-30)
    .map((t) => ({ fecha: t.fecha, tasa: t.tasa }));
  const tasaHoy = tasaParaFecha(hoy);
  const tasaSemana = tasaParaFecha(sumarDias(hoy, -7));

  return {
    periodo: { anio, mes, nombre: `${MESES[mes - 1]} ${anio}` },
    kpis: {
      total_bs: redondear2(activos.reduce((s, p) => s + (p.monto || 0), 0)),
      total_usd: redondear2(activos.reduce((s, p) => s + (p.monto_usd || 0), 0)),
      cantidad: activos.length,
      por_completar: activos.filter((p) => p.estado_datos === 'POR_COMPLETAR').length,
      op_pendientes: activos.filter((p) => p.op_generada !== true).length,
      op_generadas: activos.filter((p) => p.op_generada === true).length,
      op_borradores: activos.filter(esBorradorOP).length,
      anuladas: pagosMes.length - activos.length,
      sin_tasa: activos.filter((p) => !(p.tasa_bcv > 0)).length,
      ordenes_compra: ordenesMes.filter((o) => o.tipo === 'COMPRA').length,
      ordenes_servicio: ordenesMes.filter((o) => o.tipo === 'SERVICIO').length,
      ordenes_total: redondear2(ordenesMes.reduce((s, o) => s + (o.total_final || 0), 0))
    },
    por_categoria: Object.keys(porCategoria).map((k) => porCategoria[k])
      .map((r) => Object.assign(r, { monto: redondear2(r.monto), monto_usd: redondear2(r.monto_usd) }))
      .sort((a, b) => b.monto - a.monto),
    por_dia: Object.keys(porDia).sort().map((k) => porDia[k])
      .map((r) => Object.assign(r, { monto: redondear2(r.monto), monto_usd: redondear2(r.monto_usd) })),
    tasas,
    tasa_hoy: tasaHoy,
    variacion_semana: tasaHoy && tasaSemana ? redondear2((tasaHoy.tasa / tasaSemana.tasa - 1) * 100) : null,
    beneficiarios_con_problemas: db.leer('Beneficiarios').filter((b) => b.activo !== false && problemasBeneficiario(b).length).length,
    ultimos: activos.slice().sort((a, b) => (b.numero || 0) - (a.numero || 0)).slice(0, 8).map(resumenPago)
  };
}


/* ===================== 20_Admin.gs ===================== */
/**
 * Módulo: Administración (configuración, usuarios y roles, auditoría, estado del sistema).
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.2-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

const VALIDADORES_CONFIG = {
  institucion: (v) => {
    const campos = ['pais', 'estado', 'nombre', 'rif', 'ciudad', 'lugar_compra', 'pie', 'telefono'];
    const r = {};
    campos.forEach((c) => { r[c] = textoSeguro(v && v[c], 200); });
    if (!r.nombre || !r.rif) throw new ErrorApp('El nombre y el RIF de la institución son obligatorios.', 'VALIDACION');
    return r;
  },
  cuenta_debito: (v) => {
    const numero = soloDigitos(v && v.numero);
    if (numero.length !== 20) throw new ErrorApp('La cuenta de débito debe tener 20 dígitos.', 'VALIDACION');
    return { tipo_pago: mayusculas(v.tipo_pago || 'TRANSFERENCIA BANCARIA'), banco: mayusculas(v.banco || nombreBanco(numero)), numero: formatearCuenta(numero) };
  },
  firmas_op: (v) => {
    if (!Array.isArray(v) || v.length !== 4) throw new ErrorApp('La Orden de Pago tiene exactamente 4 firmantes.', 'VALIDACION');
    return v.map((f) => ({ cargo: mayusculas(f.cargo).substring(0, 80), nombre: mayusculas(f.nombre).substring(0, 80) }));
  },
  firmas_oc: (v) => {
    if (!Array.isArray(v) || v.length !== 6) throw new ErrorApp('La Orden de Compra/Servicio tiene exactamente 6 casillas de firma.', 'VALIDACION');
    return v.map((f) => mayusculas(f).substring(0, 40));
  },
  iva_pct: (v) => {
    const n = aNumero(v);
    if (!(n >= 0 && n <= 100)) throw new ErrorApp('La alícuota de IVA debe estar entre 0 y 100.', 'VALIDACION');
    return n;
  },
  retenciones: (v) => {
    if (!Array.isArray(v) || v.length !== RETENCIONES_BASE.length) throw new ErrorApp('La lista de retenciones debe conservar sus filas.', 'VALIDACION');
    return RETENCIONES_BASE.map((base, i) => {
      const r = v[i] || {};
      if (r.codigo !== base.codigo) throw new ErrorApp('No se puede cambiar el orden ni los códigos de las retenciones.', 'VALIDACION');
      const pct = base.fila_titulo ? null : aNumero(r.porcentaje);
      if (!base.fila_titulo && !(pct >= 0 && pct <= 100)) throw new ErrorApp(`Porcentaje inválido en ${base.nombre}.`, 'VALIDACION');
      const baseCalculo = ['BASE', 'IVA', 'TOTAL', 'NINGUNA'].indexOf(r.base) > -1 ? r.base : base.base;
      return Object.assign({}, base, { nombre: mayusculas(r.nombre || base.nombre).substring(0, 60), porcentaje: pct, base: baseCalculo });
    });
  },
  categorias: (v) => {
    if (!Array.isArray(v) || !v.length) throw new ErrorApp('Debe existir al menos una categoría.', 'VALIDACION');
    const nombres = {};
    const lista = v.map((c) => {
      const nombre = textoSeguro(c.nombre, 80);
      if (!nombre) throw new ErrorApp('Hay una categoría sin nombre.', 'VALIDACION');
      if (nombres[nombre]) throw new ErrorApp(`Categoría repetida: ${nombre}.`, 'VALIDACION');
      nombres[nombre] = true;
      return { nombre, color: /^#[0-9a-f]{6}$/i.test(c.color) ? c.color : '#e2e8f0' };
    });
    const enUso = {};
    db.leer('Pagos').forEach((p) => { if (p.categoria) enUso[p.categoria] = true; });
    const eliminadas = Object.keys(enUso).filter((c) => !nombres[c]);
    if (eliminadas.length) throw new ErrorApp(`No puede eliminar categorías con pagos registrados: ${eliminadas.join(', ')}.`, 'VALIDACION');
    return lista;
  },
  unidades: (v) => {
    if (!Array.isArray(v)) throw new ErrorApp('Lista de unidades inválida.', 'VALIDACION');
    return v.map((u) => mayusculas(u).substring(0, 120)).filter(Boolean);
  },
  correlativos: (v) => {
    const r = { op: Number(v && v.op), oc: Number(v && v.oc), os: Number(v && v.os) };
    Object.keys(r).forEach((k) => { if (!(r[k] >= 1 && Math.floor(r[k]) === r[k])) throw new ErrorApp('Los correlativos deben ser enteros mayores que cero.', 'VALIDACION'); });
    const maxOp = db.leer('Pagos').reduce((m, p) => Math.max(m, Number(p.numero) || 0), 0);
    const maxOc = db.leer('OrdenesCompra').filter((o) => o.tipo === 'COMPRA').reduce((m, o) => Math.max(m, Number(o.numero) || 0), 0);
    const maxOs = db.leer('OrdenesCompra').filter((o) => o.tipo === 'SERVICIO').reduce((m, o) => Math.max(m, Number(o.numero) || 0), 0);
    if (r.op <= maxOp) throw new ErrorApp(`El próximo número de OP debe ser mayor que ${maxOp} (último usado).`, 'VALIDACION');
    if (r.oc <= maxOc) throw new ErrorApp(`El próximo número de OC debe ser mayor que ${maxOc}.`, 'VALIDACION');
    if (r.os <= maxOs) throw new ErrorApp(`El próximo número de OS debe ser mayor que ${maxOs}.`, 'VALIDACION');
    return r;
  },
  beneficiario_nomina: (v) => mayusculas(v).substring(0, 120) || 'PAGO DE NÓMINA',
  tolerancia_diferencia: (v) => {
    const n = aNumero(v);
    if (!(n >= 0)) throw new ErrorApp('La tolerancia debe ser un número positivo.', 'VALIDACION');
    return n;
  },
  umbral_fondo_negro: (v) => {
    const n = aNumero(v);
    if (!(n > 0)) throw new ErrorApp('El umbral del Fondo Negro Primero debe ser mayor que cero.', 'VALIDACION');
    return n;
  }
};

function adminConfig() {
  const valores = config.todo();
  return Object.keys(CONFIG_BASE).map((clave) => ({ clave, descripcion: CONFIG_BASE[clave].descripcion, valor: valores[clave] }));
}

function adminGuardarConfig(datos, usuario) {
  const validar = VALIDADORES_CONFIG[datos.clave];
  if (!validar) throw new ErrorApp('Parámetro de configuración no reconocido.', 'VALIDACION');
  return db.conBloqueo(() => {
    const anterior = config.obtener(datos.clave);
    const valor = validar(datos.valor);
    config.guardar(datos.clave, valor, usuario.email);
    auditar(usuario, 'ADMIN', 'CONFIGURAR', datos.clave, { antes: anterior, despues: valor });
    return { clave: datos.clave, valor };
  });
}

function adminUsuarios() {
  return db.leer('Usuarios').map(db.limpiar).sort((a, b) => String(a.nombre).localeCompare(String(b.nombre), 'es'))
    .map((u) => Object.assign(u, { rol_nombre: ROLES[u.rol] ? ROLES[u.rol].nombre : u.rol }));
}

function adminGuardarUsuario(datos, usuario) {
  const email = String(datos.email || '').toLowerCase().trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new ErrorApp('Correo electrónico inválido.', 'VALIDACION');
  if (!ROLES[datos.rol]) throw new ErrorApp('Rol inválido.', 'VALIDACION');
  const nombre = textoSeguro(datos.nombre, 100);
  if (nombre.length < 3) throw new ErrorApp('Indique el nombre del usuario.', 'VALIDACION');
  const registro = { email, nombre, rol: datos.rol, direccion: mayusculas(datos.direccion).substring(0, 120), activo: datos.activo !== false };
  return db.conBloqueo(() => {
    const duplicado = db.primero('Usuarios', (u) => String(u.email).toLowerCase() === email && u.id !== datos.id);
    if (duplicado) throw new ErrorApp('Ya existe un usuario con ese correo.', 'DUPLICADO');
    if (datos.id) {
      const actual = db.porId('Usuarios', datos.id);
      if (!actual) throw new ErrorApp('Usuario no encontrado.', 'NO_ENCONTRADO');
      if (actual.email === usuario.email && (registro.rol !== 'ADMIN' || !registro.activo)) {
        throw new ErrorApp('No puede quitarse a sí mismo el rol de administrador ni desactivarse.', 'VALIDACION');
      }
      const r = db.actualizar('Usuarios', datos.id, registro, usuario.email);
      auditar(usuario, 'ADMIN', 'EDITAR_USUARIO', datos.id, diferencias(r.antes, r.despues));
      return r.despues;
    }
    const nuevo = db.insertar('Usuarios', registro, usuario.email);
    auditar(usuario, 'ADMIN', 'CREAR_USUARIO', nuevo.id, registro);
    return db.limpiar(nuevo);
  });
}

function adminAuditoria(datos) {
  const texto = normalizarTexto(datos.texto);
  const pagina = Math.max(1, Number(datos.pagina) || 1);
  const porPagina = 50;
  const lista = db.leer('Auditoria').filter((a) => {
    if (datos.modulo && a.modulo !== datos.modulo) return false;
    if (texto && normalizarTexto(`${a.usuario} ${a.accion} ${a.registro_id} ${JSON.stringify(a.detalle)}`).indexOf(texto) === -1) return false;
    return true;
  }).sort((a, b) => (a.fecha_hora < b.fecha_hora ? 1 : -1));
  return { total: lista.length, pagina, por_pagina: porPagina, registros: lista.slice((pagina - 1) * porPagina, pagina * porPagina).map(db.limpiar) };
}

function adminEstado() {
  const props = PropertiesService.getScriptProperties();
  const triggers = ScriptApp.getProjectTriggers().map((t) => t.getHandlerFunction());
  const conteos = {};
  Object.keys(ESQUEMA).forEach((t) => { conteos[t] = db.leer(t).length; });
  const leer = (k) => { const v = props.getProperty(k); try { return v ? JSON.parse(v) : null; } catch (e) { return v; } };
  return {
    version: APP.version,
    entorno: db.entorno(),
    base_datos_url: `https://docs.google.com/spreadsheets/d/${db.idLibro()}/edit`,
    carpeta_url: `https://drive.google.com/drive/folders/${carpetaRaiz().getId()}`,
    client_id_configurado: !!(props.getProperty('GOOGLE_CLIENT_ID') || GOOGLE_CLIENT_ID_PREDETERMINADO),
    disparadores: triggers,
    ultima_sincronizacion_tasa: leer('TASA_ULTIMA_SYNC'),
    ultimo_respaldo: leer('ULTIMO_RESPALDO'),
    conteos,
    correlativos: config.obtener('correlativos')
  };
}

function adminRespaldar(datos, usuario) {
  return respaldarBaseDatos(usuario);
}


/* ===================== 21_Migracion.gs ===================== */
/**
 * Módulo: Migración desde la hoja de cálculo anterior (pestañas Pagos_*, beneficiarios y Tasa_BCV).
 * Solo lee la hoja anterior; nunca la modifica. Se puede ejecutar varias veces: no duplica.
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.2-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

function indiceColumna(encabezado, patrones) {
  for (let i = 0; i < patrones.length; i++) {
    const k = encabezado.findIndex((c) => patrones[i].test(c));
    if (k > -1) return k;
  }
  return -1;
}

function leerPagosAnteriores(hoja) {
  const valores = hoja.getDataRange().getValues();
  if (valores.length < 2) return [];
  const enc = valores[0].map((c) => normalizarTexto(c));
  const col = {
    numero: indiceColumna(enc, [/^NUMERO$/, /^N(RO|UMERO)?\.? ?(DE )?ORDEN/, /^N[°º]$/]),
    fecha: indiceColumna(enc, [/^FECHA/]),
    beneficiario: indiceColumna(enc, [/^BENEFICIARIO/]),
    tipo: indiceColumna(enc, [/^V ?\/ ?G/, /^TIPO/]),
    documento: indiceColumna(enc, [/^DOCUMENTO/, /CEDULA|RIF/]),
    monto: indiceColumna(enc, [/^MONTO/]),
    categoria: indiceColumna(enc, [/^CATEGORIA/]),
    descripcion: indiceColumna(enc, [/^DESCRIPCION/]),
    cuenta: indiceColumna(enc, [/CUENTA/]),
    anulacion: indiceColumna(enc, [/ANULACION|ESTATUS|ESTADO/]),
    tasa: indiceColumna(enc, [/^TASA/]),
    usd: indiceColumna(enc, [/CONVERSION|USD/])
  };
  if (col.numero < 0 || col.fecha < 0 || col.monto < 0) return [];
  const v = (fila, c) => (c > -1 ? fila[c] : '');
  return valores.slice(1).map((fila) => ({
    numero: Number(String(v(fila, col.numero)).replace(/\D/g, '')) || 0,
    fecha: aFechaISO(v(fila, col.fecha)),
    beneficiario: normalizarNombre(v(fila, col.beneficiario)),
    tipo_doc: normalizarTipoDoc(v(fila, col.tipo)),
    documento: normalizarDocumento(v(fila, col.tipo), v(fila, col.documento)),
    monto: redondear2(aNumero(v(fila, col.monto))),
    categoria: textoSeguro(v(fila, col.categoria), 120),
    descripcion: mayusculas(v(fila, col.descripcion)),
    cuenta: soloDigitos(v(fila, col.cuenta)),
    anulada: /ANULAD/i.test(String(v(fila, col.anulacion))),
    tasa: aNumero(v(fila, col.tasa)),
    usd: aNumero(v(fila, col.usd)),
    hoja: hoja.getName()
  })).filter((p) => p.numero > 0 && p.fecha && p.monto > 0);
}

function leerBeneficiariosAnteriores(hoja) {
  const valores = hoja.getDataRange().getValues();
  const enc = (valores[0] || []).map((c) => normalizarTexto(c));
  const col = {
    documento: indiceColumna(enc, [/DOCUMENTO/]),
    tipo: indiceColumna(enc, [/^TIPO/]),
    nombre: indiceColumna(enc, [/NOMBRE/]),
    cuenta: indiceColumna(enc, [/CUENTA/])
  };
  if (col.documento < 0 || col.nombre < 0) return [];
  return valores.slice(1).map((f) => ({
    tipo_doc: normalizarTipoDoc(f[col.tipo]), documento: normalizarDocumento(f[col.tipo], f[col.documento]),
    nombre: normalizarNombre(f[col.nombre]), cuenta: col.cuenta > -1 ? soloDigitos(f[col.cuenta]) : ''
  })).filter((b) => b.tipo_doc && b.documento && b.nombre);
}

function leerTasasAnteriores(hoja) {
  return hoja.getDataRange().getValues().slice(1)
    .map((f) => ({ fecha: aFechaISO(f[0]), tasa: aNumero(f[1]) }))
    .filter((t) => t.fecha && t.tasa > 0);
}

/** Agrupa variantes del mismo documento: gana la cuenta válida y el nombre más completo. */
function consolidarBeneficiarios(lista) {
  const grupos = {};
  lista.forEach((b) => {
    const k = claveDocumento(b.tipo_doc, b.documento);
    const g = grupos[k] = grupos[k] || { tipo_doc: b.tipo_doc, documento: b.documento, nombres: {}, cuentas: {} };
    if (estadoDocumento(b.tipo_doc, b.documento) === 'VÁLIDO') g.documento = b.documento;
    if (b.nombre) g.nombres[b.nombre] = (g.nombres[b.nombre] || 0) + 1;
    if (b.cuenta) g.cuentas[b.cuenta] = (g.cuentas[b.cuenta] || 0) + 1;
  });
  return Object.keys(grupos).map((k) => {
    const g = grupos[k];
    const nombres = Object.keys(g.nombres).sort((a, b) => (b.length - a.length) || (g.nombres[b] - g.nombres[a]));
    const validas = Object.keys(g.cuentas).filter((c) => c.length === 20).sort((a, b) => g.cuentas[b] - g.cuentas[a]);
    const cuenta = validas[0] || Object.keys(g.cuentas)[0] || '';
    return {
      tipo_doc: g.tipo_doc, documento: g.documento, nombre: nombres[0] || '',
      alias: nombres.slice(1, 10).join('|'),
      cuenta: cuenta.length === 20 ? formatearCuenta(cuenta) : cuenta,
      banco_codigo: codigoBanco(cuenta), banco: cuenta ? nombreBanco(cuenta) : '',
      estado_cuenta: estadoCuenta(cuenta), activo: true
    };
  });
}

function adminMigrar(datos, usuario) {
  const id = String(datos.spreadsheet_id || '').trim().replace(/^.*\/d\/([a-zA-Z0-9_-]+).*$/, '$1');
  if (!id || id.length < 20) throw new ErrorApp('Indique el ID o el enlace de la hoja de cálculo anterior.', 'VALIDACION');
  let origen;
  try {
    origen = SpreadsheetApp.openById(id);
  } catch (e) {
    throw new ErrorApp('No se pudo abrir la hoja anterior. Verifique el enlace y que la cuenta dueña del sistema tenga acceso.', 'VALIDACION', e.message);
  }
  const pagosOrigen = [];
  let benefOrigen = [];
  let tasasOrigen = [];
  const hojasLeidas = [];
  origen.getSheets().forEach((h) => {
    const nombre = h.getName();
    if (/^Pagos_/i.test(nombre)) { pagosOrigen.push.apply(pagosOrigen, leerPagosAnteriores(h)); hojasLeidas.push(nombre); return; }
    if (/^Tasa_?BCV/i.test(nombre)) { tasasOrigen = leerTasasAnteriores(h); hojasLeidas.push(nombre); return; }
    const enc = normalizarTexto((h.getRange(1, 1, 1, Math.max(h.getLastColumn(), 1)).getValues()[0] || []).join('|'));
    if (/RAZON SOCIAL/.test(enc)) { benefOrigen = benefOrigen.concat(leerBeneficiariosAnteriores(h)); hojasLeidas.push(nombre); }
  });

  return db.conBloqueo(() => {
    const tasasExistentes = {};
    db.leer('Tasas').forEach((t) => { tasasExistentes[t.fecha] = t.fuente; });
    const tasasNuevas = {};
    tasasOrigen.forEach((t) => { if (!tasasExistentes[t.fecha] || tasasExistentes[t.fecha] === FUENTE_RELLENO) tasasNuevas[t.fecha] = t.tasa; });

    const numerosExistentes = {};
    db.leer('Pagos').forEach((p) => { numerosExistentes[p.numero] = true; });
    const vistos = {};
    const pagosNuevos = pagosOrigen.filter((p) => {
      if (numerosExistentes[p.numero] || vistos[p.numero]) return false;
      vistos[p.numero] = true;
      return true;
    });

    const benefExistentes = {};
    db.leer('Beneficiarios').forEach((b) => { benefExistentes[claveDocumento(b.tipo_doc, b.documento)] = true; });
    const desdePagos = pagosOrigen.filter((p) => p.tipo_doc && p.documento && p.beneficiario)
      .map((p) => ({ tipo_doc: p.tipo_doc, documento: p.documento, nombre: p.beneficiario, cuenta: p.cuenta }));
    const beneficiariosNuevos = consolidarBeneficiarios(benefOrigen.concat(desdePagos))
      .filter((b) => !benefExistentes[claveDocumento(b.tipo_doc, b.documento)]);

    const resumen = {
      hojas_leidas: hojasLeidas,
      pagos_encontrados: pagosOrigen.length, pagos_nuevos: pagosNuevos.length,
      beneficiarios_nuevos: beneficiariosNuevos.length,
      tasas_encontradas: tasasOrigen.length, tasas_nuevas: Object.keys(tasasNuevas).length,
      simulacion: datos.simular === true
    };
    if (datos.simular === true) return resumen;

    aplicarTasasExternas(tasasNuevas, 'MIGRACION', usuario.email);
    rellenarHuecosTasas(hoyISO(), usuario.email);
    invalidarCacheTasas();
    const insertadosBen = db.insertarLote('Beneficiarios', beneficiariosNuevos, usuario.email);
    const idPorDoc = {};
    db.leer('Beneficiarios').forEach((b) => { idPorDoc[claveDocumento(b.tipo_doc, b.documento)] = b.id; });
    const categorias = (config.obtener('categorias') || []).map((c) => c.nombre);
    const pagos = pagosNuevos.map((p) => {
      const t = p.tasa > 0 ? { tasa: p.tasa } : tasaParaFecha(p.fecha);
      const reg = {
        numero: p.numero, fecha: p.fecha, beneficiario_id: idPorDoc[claveDocumento(p.tipo_doc, p.documento)] || '',
        beneficiario: p.beneficiario, tipo_doc: p.tipo_doc, documento: p.documento, monto: p.monto,
        categoria: categorias.indexOf(p.categoria) > -1 ? p.categoria : '', descripcion: p.descripcion,
        cuenta: p.cuenta.length === 20 ? formatearCuenta(p.cuenta) : p.cuenta,
        banco_codigo: codigoBanco(p.cuenta), banco: p.cuenta ? nombreBanco(p.cuenta) : '',
        tasa_bcv: t ? t.tasa : null, monto_usd: t ? redondear2(p.monto / t.tasa) : null,
        estado: p.anulada ? ESTADO_ANULADA : ESTADO_ACTIVA, origen: 'MIGRACION', referencia_banco: `Hoja ${p.hoja}`,
        motivo_anulacion: p.anulada ? 'Anulada en el sistema anterior' : '',
        op_generada: false, op_version: 0
      };
      reg.estado_datos = estadoDatosPago(reg);
      return reg;
    });
    db.insertarLote('Pagos', pagos, usuario.email);
    const maxNumero = db.leer('Pagos').reduce((m, p) => Math.max(m, Number(p.numero) || 0), 0);
    const cor = Object.assign({ op: 1, oc: 1, os: 1 }, config.obtener('correlativos'));
    if (maxNumero >= cor.op) config.guardar('correlativos', Object.assign(cor, { op: maxNumero + 1 }), usuario.email);
    resumen.beneficiarios_insertados = insertadosBen.length;
    resumen.proximo_numero_op = Math.max(maxNumero + 1, cor.op);
    auditar(usuario, 'ADMIN', 'MIGRAR', id, resumen);
    return resumen;
  });
}


/* ===================== 22_Mantenimiento.gs ===================== */
/**
 * Módulo: Instalación, disparadores y respaldos.
 * Ejecute instalar() una sola vez desde el editor de Apps Script.
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.2-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

function instalar() {
  const props = PropertiesService.getScriptProperties();
  const raiz = carpetaRaiz();
  if (!props.getProperty('DB_ID')) {
    const libro = SpreadsheetApp.create(APP.nombreLibro);
    DriveApp.getFileById(libro.getId()).moveTo(raiz);
    props.setProperty('DB_ID', libro.getId());
    db.usarLibro(libro);
  }
  db.prepararTablas();
  const sobrante = SpreadsheetApp.openById(props.getProperty('DB_ID')).getSheetByName('Hoja 1') ||
    SpreadsheetApp.openById(props.getProperty('DB_ID')).getSheetByName('Sheet1');
  if (sobrante && db.leer('Config').length === 0) SpreadsheetApp.openById(props.getProperty('DB_ID')).deleteSheet(sobrante);

  const existentes = {};
  db.leer('Config').forEach((r) => { existentes[r.clave] = true; });
  const faltantes = Object.keys(CONFIG_BASE).filter((k) => !existentes[k])
    .map((k) => ({ clave: k, valor: valorConfigInicial(k), descripcion: CONFIG_BASE[k].descripcion }));
  db.insertarLote('Config', faltantes, 'instalador');
  config.invalidar();

  const email = Session.getEffectiveUser().getEmail();
  if (email && !usuarioPorEmail(email)) {
    db.insertar('Usuarios', { email: email.toLowerCase(), nombre: 'Director de TI', rol: 'ADMIN', direccion: 'TECNOLOGÍAS DE LA INFORMACIÓN', activo: true }, 'instalador');
  }
  configurarDisparadores();
  let historico = 'Histórico BCV: ';
  try {
    const h = importarHistoricoBcvToday('instalador');
    historico += `${h.recibidas} días descargados de bcv.today (${h.creadas} nuevos).`;
  } catch (e) {
    historico += `no se pudo descargar (${e.message}). Impórtelo desde Tasa BCV.`;
  }
  auditar('instalador', 'SISTEMA', 'INSTALAR', '', { version: APP.version, administrador: email });

  const mensaje = [
    `✅ ${APP.nombre} ${APP.version} instalado.`,
    `Base de datos: https://docs.google.com/spreadsheets/d/${props.getProperty('DB_ID')}/edit`,
    `Carpeta de documentos: https://drive.google.com/drive/folders/${raiz.getId()}`,
    `Administrador: ${email}`,
    historico,
    'ID de cliente Google: ' + (props.getProperty('GOOGLE_CLIENT_ID') || GOOGLE_CLIENT_ID_PREDETERMINADO)
  ].join('\n');
  console.log(mensaje);
  return mensaje;
}

function configurarDisparadores() {
  const deseados = [
    { fn: 'disparadorTasaBCV', hora: 6 },
    { fn: 'disparadorTasaBCV', hora: 17 },
    { fn: 'respaldoDiario', hora: 23 }
  ];
  const actuales = ScriptApp.getProjectTriggers();
  actuales.forEach((t) => {
    if (['disparadorTasaBCV', 'respaldoDiario', 'actualizarTasaBCVDiaria'].indexOf(t.getHandlerFunction()) > -1) ScriptApp.deleteTrigger(t);
  });
  deseados.forEach((d) => {
    ScriptApp.newTrigger(d.fn).timeBased().everyDays(1).atHour(d.hora).inTimezone(APP.zona).create();
  });
  return deseados.map((d) => `${d.fn} ${d.hora}:00`);
}

/** Copia fechada de la base de datos en la carpeta de respaldos. No borra respaldos anteriores. */
function respaldarBaseDatos(usuario) {
  const id = PropertiesService.getScriptProperties().getProperty('DB_ID');
  if (!id) throw new ErrorApp('El sistema no está instalado.', 'NO_INSTALADO');
  const carpeta = carpetaDocumentos('RESPALDOS', hoyISO());
  const nombre = `Respaldo_${APP.nombreLibro}_${formatearFecha(new Date(), 'yyyy-MM-dd_HHmm')}`;
  const copia = DriveApp.getFileById(id).makeCopy(nombre, carpeta);
  const info = { cuando: ahoraISO(), archivo: copia.getId(), url: copia.getUrl() };
  PropertiesService.getScriptProperties().setProperty('ULTIMO_RESPALDO', JSON.stringify(info));
  auditar(usuario || 'sistema', 'SISTEMA', 'RESPALDO', copia.getId(), info);
  return info;
}

function respaldoDiario() {
  try {
    respaldarBaseDatos(null);
  } catch (e) {
    console.error('Respaldo diario falló: ' + e.message);
  }
}

/** Utilidad para el editor: da acceso de administrador a otra cuenta. */
function agregarAdministrador(email, nombre) {
  const correo = String(email || '').toLowerCase().trim();
  if (!correo) throw new Error('Indique el correo.');
  const existente = usuarioPorEmail(correo);
  if (existente) {
    db.actualizar('Usuarios', existente.id, { rol: 'ADMIN', activo: true }, 'editor');
  } else {
    db.insertar('Usuarios', { email: correo, nombre: nombre || correo, rol: 'ADMIN', direccion: '', activo: true }, 'editor');
  }
  return `Administrador: ${correo}`;
}


/* ===================== 23_Entorno.gs ===================== */
/**
 * Módulo: Entorno de pruebas. Una base de datos aparte con datos ficticios para practicar
 * todas las funciones sin tocar la información real. Usuarios y tasas BCV se comparten con producción.
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * Versión: 1.0.7-beta
 * © 2026 Soluciones AFFINITY. Todos los derechos reservados.
 */

const NOMBRE_LIBRO_PRUEBAS = 'ERP Guanipa - ENTORNO DE PRUEBAS (datos ficticios)';
const PRIMER_NUMERO_PRUEBAS = 2001;

/* ---------- Datos ficticios ---------- */

function cuentaFicticia(banco, oficina, control, numero) {
  return banco + oficina + control + numero;
}

/**
 * Beneficiarios ficticios. Varios tienen errores de tipeo a propósito (como los que llegan de
 * listados viejos) para practicar su corrección: los pagos del banco sí traen el dato correcto.
 */
function beneficiariosFicticios() {
  return [
    { k: 'pinos', tipo_doc: 'J', documento: '401234569', nombre: 'INVERSIONES LOS PINOS DEL SUR, C.A.', cuenta: cuentaFicticia('0102', '0123', '45', '0000123456') },
    { k: 'figuera', tipo_doc: 'V', documento: '14567890', nombre: 'MARÍA JOSÉ FIGUERA LEÓN', cuenta: '0134031230123456789', cuenta_real: cuentaFicticia('0134', '0312', '30', '1234567890') },
    { k: 'mendez', tipo_doc: 'V', documento: '123456789', documento_real: '12345678', nombre: 'CARLOS EDUARDO MÉNDEZ RIVAS', cuenta: cuentaFicticia('0105', '0045', '11', '0045123987') },
    { k: 'rondon', tipo_doc: 'V', documento: '9876543', nombre: 'LUIS ALBERTO RONDÓN', cuenta: cuentaFicticia('0191', '0077', '21', '2100456321') },
    { k: 'redes', tipo_doc: 'J', documento: '412345672', nombre: 'TECNOLOGÍA Y REDES GUANIPA, C.A.', cuenta: cuentaFicticia('0172', '0194', '81', '9400112233') },
    { k: 'tigre', tipo_doc: 'J', documento: '298765437', nombre: 'TRANSPORTE Y SERVICIOS EL TIGRE, C.A.', cuenta: cuentaFicticia('0108', '0360', '11', '0100654987') },
    { k: 'fundacion', tipo_doc: 'J', documento: '312345675', nombre: 'FUNDACIÓN DEPORTIVA GUANIPA', cuenta: cuentaFicticia('0999', '0102', '33', '0000987654'), cuenta_real: cuentaFicticia('0102', '0412', '33', '0000987654') },
    { k: 'oriente', tipo_doc: 'J', documento: '50123456', documento_real: '501234566', nombre: 'SUMINISTROS ORIENTE 2020, C.A.', cuenta: cuentaFicticia('0163', '0220', '14', '2200778899') },
    { k: 'salazar', tipo_doc: 'E', documento: '81234567', nombre: 'ANA KARINA SALAZAR', cuenta: cuentaFicticia('0175', '0301', '50', '0071234560') },
    { k: 'palma', tipo_doc: 'V', documento: '12345', nombre: 'JOSÉ GREGORIO PALMA', cuenta: cuentaFicticia('0102', '0456', '78', '0011223344') },
    { k: 'aguaclara', tipo_doc: 'J', documento: '297654321', nombre: 'COOPERATIVA AGUA CLARA, R.L.', cuenta: '011401230456789012345' },
    { k: 'cedeno', tipo_doc: 'V', documento: '18765432', nombre: 'ROSA ELENA CEDEÑO', cuenta: cuentaFicticia('0102', '0789', '01', '0055667788') }
  ];
}

/** Diez pagos repartidos en los dos meses anteriores al actual, de categorías distintas, sin OP generada. */
function pagosFicticios(hoy) {
  const mes = (desplazamiento, dia) => {
    const f = new Date(Date.UTC(Number(hoy.substring(0, 4)), Number(hoy.substring(5, 7)) - 1 + desplazamiento, dia, 12));
    const semana = f.getUTCDay();
    if (semana === 6) f.setUTCDate(f.getUTCDate() + 2);
    if (semana === 0) f.setUTCDate(f.getUTCDate() + 1);
    return f.toISOString().substring(0, 10);
  };
  return [
    { k: 'pinos', fecha: mes(-2, 2), monto: 245780, categoria: 'Suministros', descripcion: 'ADQUISICIÓN DE MATERIALES DE OFICINA PARA LA DIRECCIÓN DE ADMINISTRACIÓN' },
    { k: 'figuera', fecha: mes(-2, 7), monto: 32000, categoria: 'Ayudas Económicas', descripcion: 'AYUDA ECONÓMICA PARA TRATAMIENTO MÉDICO' },
    { k: 'nomina', fecha: mes(-2, 14), monto: 4123805.55, categoria: CATEGORIA_NOMINA, descripcion: 'PAGO DE NÓMINA PRIMERA QUINCENA' },
    { k: 'mendez', fecha: mes(-2, 17), monto: 98000, categoria: 'Servicios Profesionales', descripcion: 'ASESORÍA TÉCNICA EN LEVANTAMIENTO TOPOGRÁFICO DEL SECTOR LAS MERCEDES' },
    { k: 'rondon', fecha: mes(-2, 24), monto: 11500, categoria: 'Viáticos, Transporte y Representación', descripcion: 'VIÁTICOS POR TRASLADO A BARCELONA PARA GESTIONES ANTE LA GOBERNACIÓN' },
    { k: 'redes', fecha: mes(-1, 2), monto: 1269000, categoria: 'Tecnología', descripcion: 'ADQUISICIÓN DE DOS (2) EQUIPOS DE COMPUTACIÓN PARA HACIENDA MUNICIPAL' },
    { k: 'tigre', fecha: mes(-1, 8), monto: 2543000, categoria: 'Servicios Públicos, Infraestructura y Obras', descripcion: 'SERVICIO DE BACHEO EN LA CALLE BOLÍVAR' },
    { k: 'fundacion', fecha: mes(-1, 15), monto: 120000, categoria: 'Subvenciones', descripcion: 'SUBVENCIÓN PARA LOS JUEGOS DEPORTIVOS MUNICIPALES' },
    { k: 'oriente', fecha: mes(-1, 21), monto: 76400, categoria: 'Comunicación, Publicidad y Logística', descripcion: 'IMPRESIÓN DE MATERIAL INFORMATIVO DE LA JORNADA DE CEDULACIÓN' },
    { k: 'salazar', fecha: mes(-1, 27), monto: 155000, categoria: 'Honorarios Profesionales', descripcion: 'HONORARIOS POR ELABORACIÓN DEL PROYECTO DE ALUMBRADO PÚBLICO' }
  ];
}

/** Texto de conciliación de ejemplo (mes actual) para practicar la importación. */
function conciliacionFicticia(hoy) {
  const dia = (d) => {
    const f = new Date(Date.UTC(Number(hoy.substring(0, 4)), Number(hoy.substring(5, 7)) - 1, d, 12));
    return fechaVE(f.toISOString().substring(0, 10));
  };
  return [
    'Fecha;Referencia;Descripción;Débito;Crédito',
    `${dia(2)};PR-90001;PAGO A PROVEEDORES BDV J040123456 LOTE 00500101;198.250,00;`,
    `${dia(3)};PR-90002;PAGO A PROVEEDORES OTROS BANCOS 0172 J412345672;311.400,00;`,
    `${dia(5)};PR-90003;PAGO DE NOMINA;4.250.118,20;`,
    `${dia(6)};PR-90004;PAGO A PROVEEDORES BDV V001876543 LOTE 00500102;24.000,00;`,
    `${dia(6)};PR-90005;PAGO A PROVEEDORES OTROS BANCOS 0134 J305556660;67.800,00;`,
    `${dia(6)};;TRANSFERENCIA RECIBIDA;;150.000,00`
  ].join('\n');
}

function sembrarDatosFicticios(quien) {
  const hoy = hoyISO();
  const categorias = (config.obtener('categorias') || []).map((c) => c.nombre);
  const categoriaValida = (c) => (categorias.indexOf(c) > -1 ? c : '');
  const fichas = beneficiariosFicticios();
  const registros = db.insertarLote('Beneficiarios', fichas.map((b) => {
    const cuenta = soloDigitos(b.cuenta);
    return {
      tipo_doc: b.tipo_doc, documento: b.documento, nombre: b.nombre,
      cuenta: cuenta.length === 20 ? formatearCuenta(cuenta) : cuenta,
      banco_codigo: codigoBanco(cuenta), banco: nombreBanco(cuenta), estado_cuenta: estadoCuenta(cuenta),
      alias: '', activo: true, notas: 'DATO FICTICIO DEL ENTORNO DE PRUEBAS'
    };
  }), quien);
  const porClave = {};
  fichas.forEach((b, i) => { porClave[b.k] = { ficha: b, registro: registros[i] }; });
  const nombreNomina = config.obtener('beneficiario_nomina') || 'PAGO DE NÓMINA';

  const pagos = pagosFicticios(hoy).map((p, i) => {
    const ben = porClave[p.k];
    const cuenta = ben ? soloDigitos(ben.ficha.cuenta_real || ben.ficha.cuenta) : '';
    const base = {
      numero: PRIMER_NUMERO_PRUEBAS + i, fecha: p.fecha, monto: p.monto,
      beneficiario_id: ben ? ben.registro.id : '',
      beneficiario: ben ? ben.ficha.nombre : nombreNomina,
      tipo_doc: ben ? ben.ficha.tipo_doc : '',
      documento: ben ? (ben.ficha.documento_real || ben.ficha.documento) : '',
      categoria: categoriaValida(p.categoria), descripcion: p.descripcion, cuenta,
      estado: ESTADO_ACTIVA, origen: 'CONCILIACION', referencia_banco: `PRUEBA-${String(i + 1).padStart(3, '0')}`,
      op_generada: false, op_version: 0
    };
    return Object.assign(base, camposCalculadosPago(base));
  });
  db.insertarLote('Pagos', pagos, quien);
  return { beneficiarios: registros.length, pagos: pagos.length, con_errores: registros.filter((b) => problemasBeneficiario(b).length).length };
}

/* ---------- Gestión del entorno ---------- */

function propiedadesEntorno() {
  const props = PropertiesService.getScriptProperties();
  let info = null;
  try { info = JSON.parse(props.getProperty('PRUEBAS_INFO') || 'null'); } catch (e) { info = null; }
  return { props, idPruebas: props.getProperty('DB_ID_PRUEBAS') || '', info };
}

function conteosEntorno(nombre) {
  const anterior = db.entorno();
  db.usarEntorno(nombre);
  try {
    return {
      pagos: db.leer('Pagos').length,
      beneficiarios: db.leer('Beneficiarios').length,
      ordenes_pago: db.leer('Pagos').filter((p) => p.op_generada === true).length,
      ordenes_compra_servicio: db.leer('OrdenesCompra').length
    };
  } finally {
    db.usarEntorno(anterior);
  }
}

function estadoEntorno() {
  const { idPruebas, info } = propiedadesEntorno();
  const activo = db.entorno();
  return {
    activo,
    existe_pruebas: !!idPruebas,
    pruebas: idPruebas ? Object.assign({ url: `https://docs.google.com/spreadsheets/d/${idPruebas}/edit` }, info || {}, { conteos: conteosEntorno(ENTORNO_PRUEBAS) }) : null,
    produccion: { conteos: conteosEntorno(ENTORNO_PRODUCCION) }
  };
}

function auditarEnProduccion(usuario, accion, detalle) {
  const anterior = db.entorno();
  db.usarEntorno(ENTORNO_PRODUCCION);
  try { auditar(usuario, 'ENTORNO', accion, '', detalle); } finally { db.usarEntorno(anterior); }
}

function enviarAPapelera(id) {
  if (!id) return;
  try { DriveApp.getFileById(id).setTrashed(true); } catch (e) { console.warn('No se pudo enviar a la papelera el libro de pruebas: ' + e.message); }
}

/** Crea (o reinicia) el entorno de pruebas con datos ficticios y lo deja activo. */
function crearEntornoPruebas(usuario, copiarReales) {
  return db.conBloqueo(() => {
    const { props, idPruebas } = propiedadesEntorno();
    db.usarEntorno(ENTORNO_PRODUCCION);
    const configProduccion = db.leer('Config').map((r) => ({ clave: r.clave, valor: r.valor, descripcion: r.descripcion }));
    // Copia de los beneficiarios reales: permite practicar con conciliaciones reales y ver las sugerencias.
    const campos = ESQUEMA.Beneficiarios.map((c) => c[0]);
    const copiaBeneficiarios = copiarReales ? db.leer('Beneficiarios').map((b) => {
      const r = {};
      campos.forEach((k) => { if (b[k] !== undefined) r[k] = b[k]; });
      return r;
    }) : [];

    const libro = SpreadsheetApp.create(NOMBRE_LIBRO_PRUEBAS);
    DriveApp.getFileById(libro.getId()).moveTo(subcarpeta(carpetaRaiz(), CARPETA_PRUEBAS));
    db.usarLibro(libro, ENTORNO_PRUEBAS);
    props.setProperty('DB_ID_PRUEBAS', libro.getId());
    db.usarEntorno(ENTORNO_PRUEBAS);
    db.prepararTablas();
    ['Hoja 1', 'Sheet1'].forEach((n) => { const h = libro.getSheetByName(n); if (h && libro.getSheets().length > 1) libro.deleteSheet(h); });

    const configPruebas = configProduccion.map((r) => {
      if (r.clave !== 'correlativos') return r;
      return Object.assign({}, r, { valor: Object.assign({ oc: 1, os: 1 }, r.valor, { op: PRIMER_NUMERO_PRUEBAS + pagosFicticios(hoyISO()).length }) });
    });
    if (!configPruebas.some((r) => r.clave === 'correlativos')) {
      configPruebas.push({ clave: 'correlativos', valor: { op: PRIMER_NUMERO_PRUEBAS + 10, oc: 1, os: 1 }, descripcion: CONFIG_BASE.correlativos.descripcion });
    }
    db.insertarLote('Config', configPruebas, usuario.email);
    config.invalidar();
    const sembrado = sembrarDatosFicticios(usuario.email);
    if (copiaBeneficiarios.length) db.insertarLote('Beneficiarios', copiaBeneficiarios, usuario.email);
    sembrado.beneficiarios_reales = copiaBeneficiarios.length;
    auditar(usuario, 'ENTORNO', 'CREAR_PRUEBAS', libro.getId(), sembrado);

    enviarAPapelera(idPruebas);
    const info = { creado_en: ahoraISO(), creado_por: usuario.email };
    props.setProperty('PRUEBAS_INFO', JSON.stringify(info));
    props.setProperty('ENTORNO', ENTORNO_PRUEBAS);
    auditarEnProduccion(usuario, idPruebas ? 'REINICIAR_PRUEBAS' : 'CREAR_PRUEBAS', Object.assign({ libro: libro.getId(), anterior: idPruebas || null }, sembrado));
    return Object.assign({ entorno: ENTORNO_PRUEBAS, url: `https://docs.google.com/spreadsheets/d/${libro.getId()}/edit` }, sembrado);
  });
}

function cambiarEntorno(destino, usuario) {
  const { props, idPruebas } = propiedadesEntorno();
  if (destino === ENTORNO_PRUEBAS && !idPruebas) throw new ErrorApp('Primero cree el entorno de pruebas.', 'SIN_ENTORNO');
  props.setProperty('ENTORNO', destino === ENTORNO_PRUEBAS ? ENTORNO_PRUEBAS : ENTORNO_PRODUCCION);
  db.usarEntorno(destino);
  config.invalidar();
  auditarEnProduccion(usuario, 'CAMBIAR', { destino });
  return { entorno: db.entorno() };
}

/**
 * Termina las pruebas: el libro de pruebas va a la papelera de Drive (recuperable 30 días)
 * y el sistema queda trabajando con la base real. La base de producción no se toca.
 */
function eliminarEntornoPruebas(usuario) {
  return db.conBloqueo(() => {
    const { props, idPruebas } = propiedadesEntorno();
    if (!idPruebas) throw new ErrorApp('No hay entorno de pruebas que eliminar.', 'SIN_ENTORNO');
    const conteos = conteosEntorno(ENTORNO_PRUEBAS);
    props.setProperty('ENTORNO', ENTORNO_PRODUCCION);
    props.deleteProperty('DB_ID_PRUEBAS');
    props.deleteProperty('PRUEBAS_INFO');
    db.usarEntorno(ENTORNO_PRODUCCION);
    config.invalidar();
    enviarAPapelera(idPruebas);
    auditarEnProduccion(usuario, 'ELIMINAR_PRUEBAS', { libro: idPruebas, conteos });
    return { entorno: ENTORNO_PRODUCCION, produccion: conteosEntorno(ENTORNO_PRODUCCION) };
  });
}

/* ---------- API ---------- */

function entornoEstadoApi() {
  return estadoEntorno();
}

function entornoCrearApi(datos, usuario) {
  if (datos.confirmacion !== 'PRUEBAS') throw new ErrorApp('Escriba PRUEBAS para confirmar.', 'VALIDACION');
  return crearEntornoPruebas(usuario, datos.copiar_beneficiarios !== false);
}

function entornoCambiarApi(datos, usuario) {
  return cambiarEntorno(datos.destino, usuario);
}

function entornoEliminarApi(datos, usuario) {
  if (datos.confirmacion !== 'REALES') throw new ErrorApp('Escriba REALES para confirmar.', 'VALIDACION');
  return eliminarEntornoPruebas(usuario);
}

function conciliacionEjemplo() {
  if (db.entorno() !== ENTORNO_PRUEBAS) throw new ErrorApp('El ejemplo solo está disponible en el entorno de pruebas.', 'ENTORNO');
  return { texto: conciliacionFicticia(hoyISO()) };
}
