// Placeholder: move filtrar(), limpiar(), actualizarPanelOP() here
// filters.js

function actualizarHead() {
    const estado = document.getElementById("f_estado").value;
    const modo = document.getElementById("f_modo").value;
    const h = document.getElementById("headRow");

    if (modo === "PROCESO") {
        h.innerHTML = `
            <th>Máquina</th>
            <th>OP</th>
            <th>Colada</th>
            <th>Tipo rosca</th>
            <th>Diámetro</th>
            <th>Acero</th>
            <th>Piezas</th>
            <th>Cliente</th>
            <th>Estado (P)</th>
            <th>+</th>
        `;
    } else {
        if (estado === "EE33") {
            h.innerHTML = `
                <th>Huacal</th>
                <th>OP</th>
                <th>Colada</th>
                <th>Tipo rosca</th>
                <th>Diámetro</th>
                <th>Acero</th>
                <th>Piezas</th>
                <th>Cliente</th>
                <th>Estado (S)</th>
                <th>+</th>
            `;
        } else {
            h.innerHTML = `
                <th>Telar</th>
                <th>OP</th>
                <th>Colada</th>
                <th>Tipo rosca</th>
                <th>Diámetro</th>
                <th>Acero</th>
                <th>Piezas</th>
                <th>Cliente</th>
                <th>Estado (S)</th>
                <th>+</th>
            `;
        }
    }
}

function filtrar() {
    paginaActual = 1;

    const estado = document.getElementById("f_estado").value;
    const modo = document.getElementById("f_modo").value;
    const diam = document.getElementById("f_diam").value;
    const acero = document.getElementById("f_acero").value;
    const op = document.getElementById("f_op").value.trim();
    const linea = document.getElementById("f_linea").value;

    let base = datos.filter(d => d.estado === estado);

    if (diam) base = base.filter(d => d.diam === diam);
    if (acero) base = base.filter(d => d.acero === acero);
    if (op)    base = base.filter(d => d.op === op);

    if (modo === "STOCK") {
        base = base.filter(d => d.ubicacion === "STOCK");
    } else if (modo === "PROCESO") {
        base = base.filter(d => d.ubicacion !== "STOCK" && d.estado !== "C9");
        if (linea) base = base.filter(d => d.ubicacion === linea);
    }

    resultados = base;

    actualizarHead();
    renderTabla();
    actualizarResumen();
    actualizarPanelOP();
}

function limpiar() {
    document.getElementById("f_modo").value = "";
    document.getElementById("f_linea").value = "";
    document.getElementById("f_linea").disabled = true;
    document.getElementById("f_diam").value = "";
    document.getElementById("f_acero").value = "";
    document.getElementById("f_op").value = "";
    filtrar();
}

function obtenerFilasProcesadasPorMaquina(estado) {
    const modo = document.getElementById("f_modo").value;
    if (modo !== "PROCESO") return resultados;

    let maquinas = [];
    if (estado === "EE33") {
        maquinas = ["SC01","SC02","SC03","SC04","SC05","SC06"];
    } else if (estado === "EE47") {
        maquinas = ["FC01"];
    } else if (estado === "EE57") {
        maquinas = ["LT09","LT10"];
    } else {
        return resultados;
    }

    const filas = [];
    maquinas.forEach(m => {
        const cand = resultados.filter(r => r.ubicacion === m);
        if (cand.length > 0) {
            const r = cand[0];
            filas.push({
                maquina: m,
                op: r.op,
                colada: r.colada,
                rosca: r.rosca,
                diam: r.diam,
                acero: r.acero,
                piezas: r.piezas,
                cliente: r.cliente
            });
        } else {
            filas.push({
                maquina: m,
                op: "—",
                colada: "—",
                rosca: "—",
                diam: "—",
                acero: "—",
                piezas: 0,
                cliente: "—"
            });
        }
    });
    return filas;
}

function actualizarPanelOP() {
    const op = document.getElementById("f_op").value.trim();
    const panel = document.getElementById("panelOP");
    const title = document.getElementById("panelOP-title");
    const row = document.getElementById("panelOP-row");

    if (!op) {
        panel.style.display = "none";
        row.innerHTML = "";
        title.textContent = "";
        return;
    }

    let e33 = 0, e47 = 0, e57 = 0, c9 = 0;
    datos.forEach(d => {
        if (d.op === op) {
            if (d.estado === "EE33") e33 += d.piezas;
            if (d.estado === "EE47") e47 += d.piezas;
            if (d.estado === "EE57") e57 += d.piezas;
            if (d.estado === "C9")  c9  += d.piezas;
        }
    });
    const total = e33 + e47 + e57 + c9;

    if (total === 0) {
        panel.style.display = "none";
        row.innerHTML = "";
        title.textContent = "";
        return;
    }

    panel.style.display = "block";
    title.textContent = "Resumen por OP " + op;
    row.innerHTML = "";
    row.innerHTML += `<span>EE33 disponible: <b>${e33}</b></span>`;
    row.innerHTML += `<span>EE47 para fosfato: <b>${e47}</b></span>`;
    row.innerHTML += `<span>EE57 para pintura: <b>${e57}</b></span>`;
    row.innerHTML += `<span>C9 terminadas: <b>${c9}</b></span>`;
    row.innerHTML += `<span>Total trazado: <b>${total}</b></span>`;
}
