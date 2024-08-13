// Función para elevar un número a un exponente con precisión en decimales
function elevarConDecimales(base, exponente, decimales = 4) {
    return parseFloat((Math.pow(base, exponente)).toFixed(decimales));
}

// Configuración de modos
const modos = {
    1: { p1: 2.94, exp1: 0.91, exp2: 0.28 }
};

// Lista de IDs de los selects Conductores
const factorIds = ["rss", "tbd", "cpr", "ruse", "doc", "rte", "rmp", "vmc", "can", "eapl", "cpro", "cper", "epla", "elp", "uhs", "rpl", "dms"];
// Lista de IDs de los selects Conductores
const factorIdsE = ["prec", "flex", "resl", "team", "pmat"];
// Lista de IDs de los selects Entradas de costo por etapas
const costoU = ["cost-input1", "cost-input2", "cost-input3", "cost-input4", "cost-input5", "cost-input6"];
// Lista de IDs de los selects Salidas de costo por etapas
const costoF = ["f-costo1", "f-costo2", "f-costo3", "f-costo4", "f-costo5", "f-costo6"];

// Definir coeficientes únicos para cada input
const coeficientes = {
    'nctpfsa11': 3, 
    'nctpfsa12': 4,
    'nctpfsa13': 6,
    'nctpfsa21': 4,
    'nctpfsa22': 5,
    'nctpfsa23': 7,
    'nctpfsa31': 3,
    'nctpfsa32': 4,
    'nctpfsa33': 6,
    'nctpfsa41': 7,
    'nctpfsa42': 10,
    'nctpfsa43': 15,
    'nctpfsa51': 5,
    'nctpfsa52': 7,
    'nctpfsa53': 10
};


// Función para obtener valores de los selects
function obtenerValoresFactores(factorIds) {
    return factorIds.map(id => parseFloat(document.getElementById(id).value) || 1);
}
// Función para obtener valores de los selects
function obtenerValoresFactoresE(factorIdsE) {
    return factorIdsE.map(id => parseFloat(document.getElementById(id).value) || 1);
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
            document.getElementById("lineas-codigo-equivalente").value = cantLineas;
        }

        // Obtener los valores de los factores
        const factores = obtenerValoresFactores(factorIds);
        // Obtener los valores de los factores
        const factoresE = obtenerValoresFactoresE(factorIdsE);
        // Obtener los valores de los factores
        const costosU = obtenerValoresCostoU(costoU);

        // Calcular el producto de los factores
        const productoFactores = factores.reduce((acc, val) => acc * val, 1);

        // Calcular el producto de los factores
        const sumaFactoresE = factoresE.reduce((suma, valor) => suma + valor, 0);

        // Calcular esfuerzo
        const exp1n = exp1 + (sumaFactoresE / 100);
        const esfuerzo = p1 * elevarConDecimales(cantLineas, exp1n.toFixed(4)) * productoFactores;
        document.getElementById(esfuerzoOutputId).value = esfuerzo.toFixed(4);

        // Multiplicar cada valor de costosU por 2 para obtener los valores de costosF
        const costosF = costosU.map(valor => valor * esfuerzo);

        // Asignar los valores multiplicados a los inputs de costoF
        asignarValoresCostoF(costoF, costosF);

        // Calcular tiempo
        const exp2n = exp2 + ( 0.2 * (sumaFactoresE / 100) );
        const tiempo = 3.67 * elevarConDecimales(esfuerzo, exp2n.toFixed(4));
        document.getElementById(tiempoOutputId).value = tiempo.toFixed(4);

        // Calcular el total de costos finales
        const costoTotal = costosF.reduce((acc, val) => acc + val, 0);
        document.getElementById("f-costoT").value = costoTotal.toFixed(4);
        
        
    } catch (e) {
        console.error('Error al calcular el esfuerzo:', e);
    }
}

function calpuntosfuncion(){
    let total = 0;

    for (const [id, coef] of Object.entries(coeficientes)) {
        const valor = parseInt(document.getElementById(id).value) || 0;
        total += valor * coef;
    }

    // Actualizar el valor total en la interfaz
    document.getElementById('total').textContent = total; 
    document.getElementById('puntos-funcion').value = total;
}


// Función para actualizar los cálculos
function actualizarCalculos() {
    calcularEsfuerzo("modo", "esfuerzo", "tiempo-dev");
    calpuntosfuncion();
}

// Función para alternar el estado de los inputs
function alternarInputs() {
    const lineasCodigo = document.getElementById('lineas-codigo');
    const puntosFuncion = document.getElementById('puntos-funcion');
    const factorConversion  = document.getElementById('factor-conversion');
    const lineasCodigoEquivalente  = document.getElementById('lineas-codigo-equivalente');
    const totalElement  = document.getElementById('total');
    const btnPFSA = document.getElementById('calpuntfunc');
    const btnFACTOR = document.getElementById('fact-conversion');

    // Alternar estado de los inputs
    if (lineasCodigo.disabled) {
        lineasCodigo.disabled = false;
        puntosFuncion.disabled = true;
        factorConversion.disabled = true;
        lineasCodigoEquivalente.disabled = true;
    } else {
        lineasCodigo.disabled = true;
        puntosFuncion.disabled = false;
        factorConversion.disabled = false;
        lineasCodigoEquivalente.disabled = false;
    }

    // Resetear valores de los inputs
    puntosFuncion.value = 0;
    factorConversion.value = 0;
    lineasCodigoEquivalente.value = 0;
    totalElement.textContent = '0';

    // Reiniciar valores de los inputs con IDs en el objeto coeficientes
    for (const id in coeficientes) {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.value = 0;
        }
    }

    // Alternar estado de los botones PFSA y FACTOR
    const botonesActivos = lineasCodigo.disabled;
    if (botonesActivos) {
        btnPFSA.classList.remove('disabled');
        btnPFSA.disabled = false;
        btnFACTOR.classList.remove('disabled');
        btnFACTOR.disabled = false;
    } else {
        btnPFSA.classList.add('disabled');
        btnPFSA.disabled = true;
        btnFACTOR.classList.add('disabled');
        btnFACTOR.disabled = true;
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

const btnAbrirModalEcua2 = document.querySelector("#calpuntfunc");
const btnCerrarModalEcua2 = document.querySelector("#btn-cerrar-modal2");
const modal2 = document.querySelector("#modal-pfsa");

const btnAbrirModalEcua3 = document.querySelector("#fact-conversion");
const btnCerrarModalEcua3 = document.querySelector("#btn-cerrar-modal3");
const modal3 = document.querySelector("#modal-lcd-pf");


function toggleDivs() {
    const conductoresCostes = document.getElementById('conductores-costes');
    const conductoresEscala = document.getElementById('conductores-escala');
    const toggleButton = document.getElementById('toggle-button');

    conductoresCostes.classList.toggle('hidden');
    conductoresEscala.classList.toggle('hidden');

}

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


    btnAbrirModalEcua2.addEventListener("click",()=>{
        modal2.showModal();
    })
    btnCerrarModalEcua2.addEventListener("click",()=>{
        modal2.close();
    })
    

    btnAbrirModalEcua3.addEventListener("click",()=>{
        modal3.showModal();
    })
    btnCerrarModalEcua3.addEventListener("click",()=>{
        modal3.close();
    })
});









const toastDetails = {
    timer: 5000,
    rss: {
        icon: 'fa-circle-info',
        text: 'Requerimientos de Seguridad del Software(RSS): en el cual se considera el efecto que pudiera proporcionar una falla en el sistema (costo dinero, vidas).',
    },
    tbd: {
        icon: 'fa-circle-info',
        text: 'Tamaño de la Base de Datos(TBD): Se toma el tamaño de la BDxen Kilobytes (Kb) y se divide entre KLDC estimados en el software.',
    },
    cpr: {
        icon: 'fa-circle-info',
        text: 'Complejidad del Producto(CPR): La complejidad del producto, subsistemas o tareas a desarrollar dependen del tipo de operaciones de control, aritméticas, de E/S, manejo de la BDxque contenga dicho producto.',
    },
    ruse: {
        icon: 'fa-circle-info',
        text: 'Requerida Fiabilidad del Software(RUSE): Mide el grado en el que el software debe ser fiable, es decir, la capacidad del software para operar bajo condiciones específicas sin fallos.',
    },
    doc: {
        icon: 'fa-circle-info',
        text: 'Documentación(DOC): Mide el nivel de esfuerzo requerido para crear y mantener la documentación del software.',
    },


    rte: {
        icon: 'fa-circle-info',
        text: 'Restricciones de tiempo de Ejecución(RTE): Este punto se refiere a que se debe estimar el tiempo necesario para la ejecución del sistema y calcular el tiempo disponible de computación.',
    },
    rmp: {
        icon: 'fa-circle-info',
        text: 'Restricciones de Memoria Principal(RMP): Donde se calcula la memoria necesaria para ejecutar el software entre la memoria disponible todo esto en %.',
    },
    vmc: {
        icon: 'fa-circle-info',
        text: 'Velocidad con que Cambian los Medios de Computo(VMC): Es la frecuencia de cambio del Hardware y del Software necesarios para las tareas de nuestro sistema (aproximadamente 6 meses).',
    },
    


    can: {
        icon: 'fa-circle-info',
        text: 'Capacidad de los Analistas(CAN):  La capacidad de los analistas se mide en términos de percentiles con respecto a la población de analistas donde se consideran habilidades de analisis, eficiencia, entre otros.',
    },
    eapl: {
        icon: 'fa-circle-info',
        text: 'Experiencia con Lenguajes de Programación Aplicacional(EAPL): Mide el impacto que la experiencia del equipo con el lenguaje de programación tiene en el esfuerzo requerido para desarrollar el software.',
    },
    cpro: {
        icon: 'fa-circle-info',
        text: 'Capacidad de los Programadores(CPRO): Es análogo a la capacidad de los analistas, salvo que la principal es la habilidad para programar en vez de la habilidad para el análisis.',
    },
    cper: {
        icon: 'fa-circle-info',
        text: 'Complejidad del Producto(CPER): Este conductor de coste evalúa el nivel de complejidad del software que se está desarrollando y cómo esta complejidad afecta el esfuerzo necesario para completar el proyecto.',
    },
    epla: {
        icon: 'fa-circle-info',
        text: 'Experiencia con el Lenguaje de Programación y la Aplicación (EPLA): Este conductor de coste evalúa el nivel de experiencia y familiaridad del equipo de desarrollo con el lenguaje de programación y el tipo de aplicación que se está desarrollando.',
    },
    elp: {
        icon: 'fa-circle-info',
        text: 'Experiencia en el Lenguaje de Programación(ELP):  Es el tiempo promedio de experiencia en el lenguaje de Programación en el que se desarrolla el Software de los analistas y programadores.',
    },


    dms: {
        icon: 'fa-circle-info',
        text: 'Sistema de Gestión de Documentos (DMS): Refleja la capacidad del DMS para soportar diferentes niveles de comunicación y colaboración, desde métodos básicos hasta herramientas avanzadas de comunicación y multimedia.',
    },
    uhs: {
        icon: 'fa-circle-info',
        text: 'Uso de Modernas Herramientas de Software(UHS): Es la cantidad de herramientas que se usan para el desarrollo del Software.',
    },
    rpl: {
        icon: 'fa-circle-info',
        text: 'Requisitos de Planificación(RPL): Se obtiene dividiendo el TDes Nominal entre el TDes Real para luego multiplicarlo por 100 obteniendo el resultado en %.',
    },

    headerCostes: {
        icon: 'fa-circle-info',
        text: 'Info: Los conductores de coste son los factores multiplicativos que determinan el esfuerzo requerido para terminar un proyecto de  software.',
    },
    headerEscala: {
        icon: 'fa-circle-info',
        text: 'Info: Los conductores de escala son los que describen el proyecto y determinan el exponente usado en la ecuación del esfuerzo.',
    },
    productoD: {
        icon: 'fa-circle-info',
        text: 'Producto: Son las características del producto de software que afectan el costo de desarrollo, como la complejidad, el tamaño del software, y las características de rendimiento.',
    },
    plataformaD: {
        icon: 'fa-circle-info',
        text: 'Plataforma: Examina las restricciones y requisitos del hardware en el que el software será ejecutado. Esto incluye la velocidad del hardware y la memoria disponible.',
    },
    personalD: {
        icon: 'fa-circle-info',
        text: 'Personal: Considera las características del equipo de desarrollo, como la experiencia y habilidades de los programadores y analistas.',
    },
    proyectoD: {
        icon: 'fa-circle-info',
        text: 'Proyecto: Se refiere a las características del proyecto de software, como el entorno de desarrollo, la disponibilidad de herramientas y la experiencia en el dominio del proyecto.',
    },
    modo: {
        icon: 'fa-circle-info',
        text: 'Considera solo un unico modelo en el boton de "Ecuaciones" podras encontrar los coeficientes usados.',
    },
    lineascodigo: {
        icon: 'fa-circle-info',
        text: 'Se considera a partir de las 1000 (K) las lineas de codigo. (KLDC)',
    },
    puntosfuncion: {
        icon: 'fa-circle-info',
        text: 'Otra forma de entrada ademas de Lineas de Codigo, se tiene en cuenta los Puntos de Función Sin Ajustar (PFSA) y el Factor de Conversión.',
    },
    factorConversion: {
        icon: 'fa-circle-info',
        text: 'Oprimir el boton de color rojo con etiqueta de "Factor" para seleccionar uno de los valores adecuados.',
    },
    lineascodigoequivalente: {
        icon: 'fa-circle-info',
        text: 'Equivalencia resultante de multiplicar Puntos de Función Sin Ajustar y Factor de Conversión.',
    },


    prec: {
        icon: 'fa-circle-info',
        text: 'La experiencia (Precedentedness): Es la experiencia de la organización en el desarrollo de proyectos del mismo tipo que se quiere desarrollar.',
    },
    flex: {
        icon: 'fa-circle-info',
        text: 'Flexibilidad del Desarrollo (FLEX): Refleja el grado de flexibilidad en el proceso de desarrollo.',
    },
    resl: {
        icon: 'fa-circle-info',
        text: 'Resolución de la Arquitectura/Riesgo (RESL): Refleja el grado de análisis de riegos realizado.',
    },
    team: {
        icon: 'fa-circle-info',
        text: 'Cohesión del Equipo (TEAM): Refleja lo bien que el equipo de desarrollo se conoce y trabaja juntos.',
    },
    pmat: {
        icon: 'fa-circle-info',
        text: 'Madurez del Proceso (PMAT): Refleja la madurez del proceso de la organización, considere el cuestinario de madurez del CMM.',
    }





};


const notifications = document.querySelector(".notifications"),
labels = document.querySelectorAll(".lbl, h3, h4");

const removeToast = (toast) => {
    toast.classList.add("hide");
    if(toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
    setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms
}

const createToast = (id) => {
    // Getting the icon and text for the toast based on the id passed
    const { icon, text } = toastDetails[id];
    const toast = document.createElement("li"); // Creating a new 'li' element for the toast
    toast.className = `toast ${id}`; // Setting the classes for the toast
    // Setting the inner HTML for the toast
    toast.innerHTML = `<div class="column">
                         <i class="fa-solid ${icon}"></i>
                         <span>${text}</span>
                      </div>
                      <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>`;
    notifications.appendChild(toast); // Append the toast to the notification ul
    // Setting a timeout to remove the toast after the specified duration
    toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
}

// Adding a click event listener to each label to create a toast when clicked
labels.forEach(lbl => {
    lbl.addEventListener("click", () => createToast(lbl.id));
});






