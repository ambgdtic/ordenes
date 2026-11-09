/**
 * Configuración del frontend. Estos valores NO son secretos (el ID de cliente OAuth es público).
 * Sistema: ERP Alcaldía de Guanipa · Módulo de Órdenes
 * © 2026 Soluciones AFFINITY.
 */
window.CONFIG = {
  // URL de la implementación de la aplicación web de Apps Script (termina en /exec).
  API_URL: 'https://script.google.com/macros/s/REEMPLAZAR_ID_DE_IMPLEMENTACION/exec',
  // ID de cliente OAuth 2.0 (tipo "Aplicación web") creado en Google Cloud Console.
  GOOGLE_CLIENT_ID: 'REEMPLAZAR.apps.googleusercontent.com',
  // Solo para pruebas locales con el simulador. Debe quedar vacío en producción.
  TOKEN_PRUEBA: ''
};
