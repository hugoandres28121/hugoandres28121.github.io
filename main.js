// main.js

document.addEventListener('DOMContentLoaded', function() {
    // Generar datos de ejemplo
    generarDatos();

    // Inicializar filtros (primer filtrado)
    filtrar();

    // Inicializar inventario estático (localStorage + eventos)
    inicializarInventarioEstatico();

    // Eventos de filtros adicionales
    var selEstado = document.getElementById("f_estado");
    var selModo = document.getElementById("f_modo");
    var selLinea = document.getElementById("f_linea");
    var inputOP = document.getElementById("f_op");

    if (selEstado) {
        selEstado.addEventListener("change", filtrar);
    }
    if (selModo) {
        selModo.addEventListener("change", function() {
            if (selLinea) {
                selLinea.disabled = (this.value !== "PROCESO");
            }
            filtrar();
        });
    }
    if (inputOP) {
        inputOP.addEventListener("input", actualizarPanelOP);
    }
});
