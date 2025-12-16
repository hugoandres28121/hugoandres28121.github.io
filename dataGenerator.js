// Placeholder: move generarDatos() here
// dataGenerator.js
function generarDatos() {
    const diametros = ["3.5","5","5.5","6","7","7.625","8.625","9.625","12.0"];
    const aceros = ["P110","L80","N80","K55"];
    const clientes = ["OXY", "Ecopetrol", "TexasDrill", "Hallman Oil", "DrillCorp", "PetroAndes"];
    const roscas = ["BTC","STC","LTC","EUE","VAM TOP","FOX"];

    const ops = [];
    for (let i = 0; i < 20; i++) {
        ops.push(String(70010 + i)); // 70010–70029
    }

    const opConfig = {};
    ops.forEach(op => {
        opConfig[op] = {
            diam: pick(diametros),
            acero: pick(aceros),
            rosca: pick(roscas),
            cliente: pick(clientes)
        };
    });

    const lineasSC = ["SC01","SC02","SC03","SC04","SC05","SC06"];
    const lineasPint = ["LT09","LT10"];

    // Asignamos SIEMPRE una OP a cada línea de pintura (siempre activas)
    const lineaOP = {};
    lineasPint.forEach(l => { lineaOP[l] = pick(ops); });

    // Asignamos una OP (o ninguna) a cada cabina SC para proceso
    lineasSC.forEach(l => {
        // 70% prob de tener OP, 30% detenida
        lineaOP[l] = Math.random() < 0.7 ? pick(ops) : null;
    });

    // Fosfato FC01 con hasta 3 OP distintas en proceso
    const fosfatoOPs = [];
    while (fosfatoOPs.length < 3) {
        const candidate = pick(ops);
        if (!fosfatoOPs.includes(candidate)) fosfatoOPs.push(candidate);
    }

    // Limpia datos globales por si se re-llama
    datos = [];

    // EE33 – HUACALES (stock + SC0X)
    for (let i = 0; i < 40; i++) {
        let ubic;
        if (Math.random() < 0.7) {
            ubic = "STOCK";
        } else {
            ubic = pick(lineasSC);
        }
        let op;
        if (ubic === "STOCK") {
            op = pick(ops);
        } else {
            if (!lineaOP[ubic]) continue;
            op = lineaOP[ubic];
        }
        const cfg = opConfig[op];
        datos.push({
            estado: "EE33",
            op: op,
            colada: String(9000 + Math.floor(Math.random()*80)),
            diam: cfg.diam,
            acero: cfg.acero,
            rosca: cfg.rosca,
            piezas: 20 + Math.floor(Math.random()*40),
            huacal: "H-" + (5000 + i),
            telar: null,
            cliente: cfg.cliente,
            ubicacion: ubic
        });
    }

    // EE47 – TELARES (stock + FC01)
    for (let i = 0; i < 45; i++) {
        let ubic;
        if (Math.random() < 0.6) {
            ubic = "STOCK";
        } else {
            ubic = "FC01";
        }
        let op;
        if (ubic === "STOCK") {
            op = pick(ops);
        } else {
            op = pick(fosfatoOPs);
        }
        const cfg = opConfig[op];
        datos.push({
            estado: "EE47",
            op: op,
            colada: String(9100 + Math.floor(Math.random()*80)),
            diam: cfg.diam,
            acero: cfg.acero,
            rosca: cfg.rosca,
            piezas: 25 + Math.floor(Math.random()*60),
            huacal: null,
            telar: "T-" + (1 + Math.floor(Math.random()*TOTAL_TELARES)),
            cliente: cfg.cliente,
            ubicacion: ubic
        });
    }

    // EE57 – TELARES (stock + LT09/LT10)
    lineasPint.forEach((l, idx) => {
        const op = lineaOP[l];
        const cfg = opConfig[op];
        datos.push({
            estado: "EE57",
            op: op,
            colada: String(9200 + idx),
            diam: cfg.diam,
            acero: cfg.acero,
            rosca: cfg.rosca,
            piezas: 30 + Math.floor(Math.random()*60),
            huacal: null,
            telar: "T-" + (1 + Math.floor(Math.random()*TOTAL_TELARES)),
            cliente: cfg.cliente,
            ubicacion: l
        });
    });
    for (let i = 0; i < 30; i++) {
        let ubic;
        if (Math.random() < 0.6) {
            ubic = "STOCK";
        } else {
            ubic = pick(lineasPint);
        }
        let op;
        if (ubic === "STOCK") {
            op = pick(ops);
        } else {
            op = lineaOP[ubic];
        }
        const cfg = opConfig[op];
        datos.push({
            estado: "EE57",
            op: op,
            colada: String(9250 + Math.floor(Math.random()*80)),
            diam: cfg.diam,
            acero: cfg.acero,
            rosca: cfg.rosca,
            piezas: 30 + Math.floor(Math.random()*60),
            huacal: null,
            telar: "T-" + (1 + Math.floor(Math.random()*TOTAL_TELARES)),
            cliente: cfg.cliente,
            ubicacion: ubic
        });
    }

    // C9 – solo para panel OP
    for (let i = 0; i < 30; i++) {
        const op = pick(ops);
        const cfg = opConfig[op];
        datos.push({
            estado: "C9",
            op: op,
            colada: String(9300 + Math.floor(Math.random()*80)),
            diam: cfg.diam,
            acero: cfg.acero,
            rosca: cfg.rosca,
            piezas: 40 + Math.floor(Math.random()*90),
            huacal: null,
            telar: null,
            cliente: cfg.cliente,
            ubicacion: "C9"
        });
    }
}
