// staticInventory.js

var inventarioEstatico = [];

function cargarInventarioEstatico() {
    try {
        var data = localStorage.getItem('inventarioEstatico');
        inventarioEstatico = data ? JSON.parse(data) : [];
    } catch (e) {
        inventarioEstatico = [];
    }
}

function guardarInventarioEstatico() {
    try {
        localStorage.setItem('inventarioEstatico', JSON.stringify(inventarioEstatico));
    } catch (e) {
        // Ignorar errores de storage
    }
}

function renderInventarioEstatico() {
    var cont = document.getElementById('listaInventario');
    if (!cont) return;

    if (!inventarioEstatico.length) {
        cont.innerHTML = '<p style="font-size:13px;color:#555;">Sin elementos en el inventario estático.</p>';
        return;
    }

    var numCols = inventarioEstatico[0].cols.length;
    var html = '<table class="tabla-inventario-estatico"><thead><tr>';
    for (var i = 0; i < numCols; i++) {
        html += '<th>Col ' + (i + 1) + '</th>';
    }
    html += '<th></th></tr></thead><tbody>';

    inventarioEstatico.forEach(function(item) {
        html += '<tr>';
        item.cols.forEach(function(c) {
            html += '<td>' + c + '</td>';
        });
        html += '<td><button class="btn-remove-static" data-id="' + item.id + '">X</button></td>';
        html += '</tr>';
    });

    html += '</tbody></table>';
    cont.innerHTML = html;
}

function agregarFilaAInventarioEstatico(tr) {
    if (!tr) return;

    if (inventarioEstatico.length >= 7) {
        alert('Inventario estático lleno (máximo 7 elementos).');
        return;
    }

    var celdas = Array.prototype.slice.call(tr.querySelectorAll('td'));
    if (!celdas.length) return;

    // Quitamos la última celda que contiene el botón +
    celdas.pop();

    var cols = celdas.map(function(td) {
        return td.textContent.trim();
    });

    inventarioEstatico.push({
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        cols: cols
    });

    guardarInventarioEstatico();
    renderInventarioEstatico();
    alert('Agregado al inventario estático');
}

function inicializarInventarioEstatico() {
    cargarInventarioEstatico();
    renderInventarioEstatico();

    var btnInv = document.getElementById('btnInventario');
    var cardInv = document.getElementById('cardInventario');

    if (btnInv && cardInv) {
        btnInv.addEventListener('click', function() {
            if (cardInv.style.display === 'none' || cardInv.style.display === '') {
                cardInv.style.display = 'block';
            } else {
                cardInv.style.display = 'none';
            }
        });
    }

    // Delegación para añadir desde la tabla principal
    var tabla = document.getElementById('tabla');
    if (tabla) {
        tabla.addEventListener('click', function(e) {
            var target = e.target;
            if (target.classList.contains('btn-add-static')) {
                var tr = target.closest('tr');
                agregarFilaAInventarioEstatico(tr);
            }
        });
    }

    // Delegación para eliminar desde el inventario estático
    var lista = document.getElementById('listaInventario');
    if (lista) {
        lista.addEventListener('click', function(e) {
            var target = e.target;
            if (target.classList.contains('btn-remove-static')) {
                var id = target.getAttribute('data-id');
                inventarioEstatico = inventarioEstatico.filter(function(it) {
                    return it.id !== id;
                });
                guardarInventarioEstatico();
                renderInventarioEstatico();
            }
        });
    }
}
