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

    // Botones principales
    var btnFiltrar = document.getElementById("btnFiltrar");
    var btnLimpiar = document.getElementById("btnLimpiar");
    var btnAnterior = document.getElementById("btnAnterior");
    var btnSiguiente = document.getElementById("btnSiguiente");
    var btnInventario = document.getElementById("btnInventario");

    if (btnFiltrar) {
        btnFiltrar.addEventListener("click", filtrar);
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", limpiar);
    }

    if (btnAnterior) {
        btnAnterior.addEventListener("click", anterior);
    }

    if (btnSiguiente) {
        btnSiguiente.addEventListener("click", siguiente);
    }

    if (btnInventario) {
        btnInventario.addEventListener("click", function () {
            var card = document.getElementById("cardInventario");
            if (card) {
                card.style.display = card.style.display === "none" ? "block" : "none";
            }
        });
    }

