// Placeholder: move renderTabla(), actualizarResumen(), paginación here
// tableRender.js

function renderTabla() {
    const estado = document.getElementById("f_estado").value;
    const modo = document.getElementById("f_modo").value;
    const tbody = document.querySelector("#tabla tbody");
    tbody.innerHTML = "";

    let filas;
    if (modo === "PROCESO") {
        filas = obtenerFilasProcesadasPorMaquina(estado);
    } else {
        filas = resultados;
    }

    const inicio = (paginaActual - 1) * porPagina;
    const pagina = filas.slice(inicio, inicio + porPagina);

    pagina.forEach(r => {
        let filaHTML = "";

        if (modo === "PROCESO") {
            filaHTML = `
                <tr>
                    <td>${r.maquina}</td>
                    <td>${r.op}</td>
                    <td>${r.colada}</td>
                    <td>${r.rosca}</td>
                    <td>${r.diam}</td>
                    <td>${r.acero}</td>
                    <td>${r.piezas || "—"}</td>
                    <td>${r.cliente}</td>
                    <td>P</td>
                    <td><button class="btn-add-static">+</button></td>
                </tr>`;
        } else {
            const estadoSP = "S";
            if (estado === "EE33") {
                filaHTML = `
                    <tr>
                        <td>${r.huacal}</td>
                        <td>${r.op}</td>
                        <td>${r.colada}</td>
                        <td>${r.rosca}</td>
                        <td>${r.diam}</td>
                        <td>${r.acero}</td>
                        <td>${r.piezas}</td>
                        <td>${r.cliente}</td>
                        <td>${estadoSP}</td>
                        <td><button class="btn-add-static">+</button></td>
                    </tr>`;
            } else {
                const telarVisible = r.telar || "—";
                filaHTML = `
                    <tr>
                        <td>${telarVisible}</td>
                        <td>${r.op}</td>
                        <td>${r.colada}</td>
                        <td>${r.rosca}</td>
                        <td>${r.diam}</td>
                        <td>${r.acero}</td>
                        <td>${r.piezas}</td>
                        <td>${r.cliente}</td>
                        <td>${estadoSP}</td>
                        <td><button class="btn-add-static">+</button></td>
                    </tr>`;
            }
        }
        tbody.innerHTML += filaHTML;
    });

    const totalPag = Math.max(1, Math.ceil(filas.length / porPagina));
    document.getElementById("infoPagina").textContent =
        "Página " + paginaActual + " de " + totalPag;
}

// Resumen: KPI arriba + total acumulado abajo
function actualizarResumen() {
    const estado = document.getElementById("f_estado").value;
    const modo = document.getElementById("f_modo").value;
    const totalAcDiv = document.getElementById("totalAcumulado");

    let filasBase;
    if (modo === "PROCESO") {
        filasBase = obtenerFilasProcesadasPorMaquina(estado);
    } else {
        filasBase = resultados;
    }

    // Filas visibles en la página actual
    const inicio = (paginaActual - 1) * porPagina;
    const paginaVisible = filasBase.slice(inicio, inicio + porPagina);

    const piezasVisibles = paginaVisible.reduce((t, r) => t + (r.piezas || 0), 0);

    document.getElementById("countReg").textContent = paginaVisible.length;
    document.getElementById("countPiezas").textContent = piezasVisibles;

    // Telares ocupados solo aplican a STOCK en EE47/EE57
    if (modo === "STOCK" && (estado === "EE47" || estado === "EE57")) {
        const setTel = new Set(
            resultados
                .filter(r => r.ubicacion === "STOCK" && r.telar)
                .map(r => r.telar)
        );
        const ocup = setTel.size;
        document.getElementById("telaresOcup").textContent = ocup;
    } else {
        document.getElementById("telaresOcup").textContent = "--";
    }

    if (modo === "PROCESO") {
        // En proceso no hay total acumulado abajo
        totalAcDiv.style.display = "none";
    } else {
        // Total acumulado = suma de todas las filas filtradas (todas las páginas)
        const piezasAcum = resultados.reduce((t, r) => t + r.piezas, 0);
        totalAcDiv.style.display = "block";
        totalAcDiv.textContent = "Total acumulado: " + piezasAcum + " piezas";
    }
}

function siguiente() {
    const estado = document.getElementById("f_estado").value;
    const modo = document.getElementById("f_modo").value;
    let filas;
    if (modo === "PROCESO") {
        filas = obtenerFilasProcesadasPorMaquina(estado);
    } else {
        filas = resultados;
    }
    const totalPag = Math.ceil(filas.length / porPagina);
    if (paginaActual < totalPag) {
        paginaActual++;
        renderTabla();
        actualizarResumen();
    }
}

function anterior() {
    if (paginaActual > 1) {
        paginaActual--;
        renderTabla();
        actualizarResumen();
    }
}
