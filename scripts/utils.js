// utils.js
// Variables globales para compartir entre módulos
var TOTAL_TELARES = 55;
var datos = [];
var resultados = [];
var paginaActual = 1;
var porPagina = 10;

// Función utilitaria
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
