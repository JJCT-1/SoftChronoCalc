// Función para elevar un número a un exponente con precisión en decimales
function elevarConDecimales(base, exponente, decimales = 4) {
    return parseFloat((Math.pow(base, exponente)).toFixed(decimales));
}

// Configuración de modos
const modos = {
    1: { p1: 3.2, exp1: 1.05, exp2: 0.38 },
    2: { p1: 3.0, exp1: 1.12, exp2: 0.35 },
    3: { p1: 2.8, exp1: 1.20, exp2: 0.32 }
};

// Lista de IDs de los selects Conductores
const factorIds = ["rss", "tbd", "cpr", "rte", "rmp", "vmc", "trc", "can", "ean", "cpro", "eso", "elp", "utp", "uhs", "rpl"];
// Lista de IDs de los selects Entradas de costo por etapas
const costoU = ["cost-input1", "cost-input2", "cost-input3", "cost-input4", "cost-input5", "cost-input6"];
// Lista de IDs de los selects Salidas de costo por etapas
const costoF = ["f-costo1", "f-costo2", "f-costo3", "f-costo4", "f-costo5", "f-costo6"];



// Función para obtener valores de los selects
function obtenerValoresFactores(factorIds) {
    return factorIds.map(id => parseFloat(document.getElementById(id).value) || 1);
}
// Función para obtener valores de los selects
function obtenerValoresCostoU(costoU) {
    return costoU.map(id => parseFloat(document.getElementById(id).value) || 0);
}
// Función para asignar valores a los inputs
function asignarValoresCostoF(costoF, valores) {
    costoF.forEach((id, index) => {
        document.getElementById(id).value = valores[index].toFixed(4);
    });
}


// Función principal para calcular el esfuerzo y tiempo
function calcularEsfuerzo(modoId, esfuerzoOutputId, tiempoOutputId) {
    try {
        // Obtiene el modo de complejidad
        const modo = parseInt(document.getElementById(modoId).value, 10) || 0;
        
        // Validar el modo
        const { p1, exp1, exp2 } = modos[modo] || { p1: 1.0, exp1: 1.00, exp2: 1.00 };

        // Obtener la cantidad de líneas de código
        let cantLineas;
        if (!document.getElementById('lineas-codigo').disabled) {
            cantLineas = parseFloat(document.getElementById("lineas-codigo").value) || 0;
        } else {
            const puntosFuncion = parseFloat(document.getElementById('puntos-funcion').value) || 0;  
            const factorconver = parseFloat(document.getElementById('factor-conversion').value) || 0;   
            cantLineas = puntosFuncion * factorconver;
            document.getElementById("lineas-codigo-equivalente").value = cantLineas.toFixed(4);
        }

        // Obtener los valores de los factores
        const factores = obtenerValoresFactores(factorIds);
        // Obtener los valores de los factores
        const costosU = obtenerValoresCostoU(costoU);

        // Calcular el producto de los factores
        const productoFactores = factores.reduce((acc, val) => acc * val, 1);

        // Calcular esfuerzo
        const esfuerzo = p1 * elevarConDecimales(cantLineas, exp1) * productoFactores;
        document.getElementById(esfuerzoOutputId).value = esfuerzo.toFixed(4);

        // Multiplicar cada valor de costosU por 2 para obtener los valores de costosF
        const costosF = costosU.map(valor => valor * esfuerzo);

        // Asignar los valores multiplicados a los inputs de costoF
        asignarValoresCostoF(costoF, costosF);

        // Calcular tiempo
        const tiempo = 2.5 * elevarConDecimales(esfuerzo, exp2);
        document.getElementById(tiempoOutputId).value = tiempo.toFixed(4);

        // Calcular el total de costos finales
        const costoTotal = costosF.reduce((acc, val) => acc + val, 0);
        document.getElementById("f-costoT").value = costoTotal.toFixed(4);
        
    } catch (e) {
        console.error('Error al calcular el esfuerzo:', e);
    }
}

// Función para actualizar los cálculos
function actualizarCalculos() {
    calcularEsfuerzo("modo", "esfuerzo", "tiempo-dev");
}

// Función para alternar el estado de los inputs
function alternarInputs() {
    const lineasCodigo = document.getElementById('lineas-codigo');
    const puntosFuncion = document.getElementById('puntos-funcion');
    const puntosFuncion2 = document.getElementById('factor-conversion');
    const puntosFuncion3 = document.getElementById('lineas-codigo-equivalente');

    if (lineasCodigo.disabled) {
        lineasCodigo.disabled = false;
        puntosFuncion.disabled = true;
        puntosFuncion2.disabled = true;
        puntosFuncion3.disabled = true;
        puntosFuncion.value = 0; 
        puntosFuncion2.value = 0;
        puntosFuncion3.value = 0; 
    
    } else {
        lineasCodigo.disabled = true;
        puntosFuncion.disabled = false;
        puntosFuncion2.disabled = false;
        puntosFuncion3.disabled = false;
        lineasCodigo.value = 0; 
    }
}


// Inicializa el estado de los inputs (opcional, si quieres que uno empiece deshabilitado)
document.getElementById('lineas-codigo').disabled = false;
document.getElementById('puntos-funcion').disabled = true;
document.getElementById('factor-conversion').disabled = true;
document.getElementById('lineas-codigo-equivalente').disabled = true;


const btnAbrirModalEcua = document.querySelector("#ecuaciones");
const btnCerrarModalEcua = document.querySelector("#btn-cerrar-modal");
const modal = document.querySelector("#modal");

// Escuchar cambios en el campo de entrada y selects
document.addEventListener("DOMContentLoaded", function() {

    document.getElementById('alternar').addEventListener('click', alternarInputs);
    document.getElementById("lineas-codigo").addEventListener("input", actualizarCalculos);
    document.getElementById('puntos-funcion').addEventListener('input', actualizarCalculos);
    document.getElementById('factor-conversion').addEventListener('input', actualizarCalculos);
    document.getElementById("modo").addEventListener("input", actualizarCalculos);
    factorIds.forEach(id => {
        document.getElementById(id).addEventListener("input", actualizarCalculos);
    });
    btnAbrirModalEcua.addEventListener("click",()=>{
        modal.showModal();
    })
    btnCerrarModalEcua.addEventListener("click",()=>{
        modal.close();
    })
});







