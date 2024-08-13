// Definir coeficientes únicos para cada input
const coeficientesPA = {
    'pa1': 1, 
    'pa2': 2,
    'pa3': 3,
};

const coeficientesPCU = {
    'pcu1': 1, 
    'pcu2': 2,
    'pcu3': 3,
};


function calpuntosPA(){
    let totalPA = 0;

    for (const [id, coef] of Object.entries(coeficientesPA)) {
        const valor = parseInt(document.getElementById(id).value) || 0;
        totalPA += valor * coef;
    }

    // Actualizar el valor total en la interfaz
    document.getElementById('total').textContent = totalPA; 
    document.getElementById('peso-actores').value = totalPA;
    totalPAGlobal = totalPA;

    // Llamar a calPCUSA para actualizar la etiqueta pcusa
    calPCUSA(totalPA, obtenerPCU());
}

function calpuntosPCU(){
    let totalPCU = 0;

    for (const [id, coef] of Object.entries(coeficientesPCU)) {
        const valor = parseInt(document.getElementById(id).value) || 0;
        totalPCU += valor * coef;
    }

    // Actualizar el valor total en la interfaz
    document.getElementById('totalpcu').textContent = totalPCU; 
    document.getElementById('peso-caso-de-uso').value = totalPCU;
    totalPCUGlobal = totalPCU;

    // Llamar a calPCUSA para actualizar la etiqueta pcusa
    calPCUSA(obtenerPA(), totalPCU);
}

function calPCUSA(totalPA, totalPCU) {
    let totalPCUSA = totalPA + totalPCU;

    document.getElementById('pcusa').value = totalPCUSA;

    calcularPCUA();
}

function obtenerPA() {
    // Obtener el valor de totalPA directamente desde el DOM
    return parseFloat(document.getElementById('peso-actores').value) || 0;
}

function obtenerPCU() {
    // Obtener el valor de totalPCU directamente desde el DOM
    return parseFloat(document.getElementById('peso-caso-de-uso').value) || 0;
}




const coeficientesFCT = {
    fct1: 1.5,
    fct2: 1.2,
    fct3: 1.1,
    fct4: 1.3,
    fct5: 1.0,
    fct6: 0.9,
    fct7: 1.4,
    fct8: 1.2,
    fct9: 1.3,
    fct10: 1.5,
    fct11: 1.1,
    fct12: 1.0,
    fct13: 0.8
};

function calpuntosFCT() {
    let totalFCT = 0;

    for (const [id, coef] of Object.entries(coeficientesFCT)) {
        const valor = parseFloat(document.getElementById(id).value) || 0;
        totalFCT += valor * coef;
    }

    // Mostrar el valor total en la celda con id "totalfct"
    document.getElementById('totalfct').textContent = totalFCT.toFixed(3);
    document.getElementById('fct').value = totalFCT.toFixed(3);

    calcularPCUA();
}





const coeficientesFA = {
    fa1: 1.5,
    fa2: 0.5,
    fa3: 1.0,
    fa4: 0.5,
    fa5: 1.0,
    fa6: 2.0,
    fa7: -1.0,
    fa8: -1.0
};

function calFA() {
    let totalFA = 0;

    for (const [id, coef] of Object.entries(coeficientesFA)) {
        const valor = parseFloat(document.getElementById(id).value) || 0;
        totalFA += valor * coef;
    }

    totalFA = 1.4 + (-0.03 * totalFA);

    // Mostrar el valor total en la celda con id "totalfct"
    document.getElementById('totalfa').textContent = totalFA.toFixed(3);
    document.getElementById('fa').value = totalFA.toFixed(3);

    calcularPCUA();
}


function calcularPCUA() {
    let totalPCUA = 0;
    const valor1 = parseFloat(document.getElementById("pcusa").value) || 0;
    const valor2 = parseFloat(document.getElementById("fct").value) || 0;
    const valor3 = parseFloat(document.getElementById("fa").value) || 0;
    totalPCUA = valor1 * valor2 * valor3;
    if (valor1 == 0 || valor2 == 0 || valor3 == 0){
        document.getElementById('pcua').value = 0;
    }else{
        let countMenor3 = 0;
        let countMayor3 = 0;

        const coeficientesFA1= [
            "fa1",
            "fa2",
            "fa3",
            "fa4",
            "fa5",
            "fa6",
            "fa7",
            "fa8"
        ];
        
        // Contar cuántos de los primeros 6 coeficientes son menores que 3
        for (let i = 0; i < 6; i++) {
            const valor = parseFloat(document.getElementById(coeficientesFA1[i]).value);
            if (valor < 3) {
                countMenor3++;
            }
        }
    
        // Contar cuántos de los últimos 2 coeficientes son mayores que 3
        for (let i = 6; i < 8; i++) {
            const valor = parseFloat(document.getElementById(coeficientesFA1[i]).value);
            if (valor > 3) {
                countMayor3++;
            }
        }

        document.getElementById('pcua').value = totalPCUA.toFixed(4);

        let sumaF = countMayor3 + countMenor3;

        if(sumaF <= 2){
            totalPCUA = totalPCUA * 20;
            document.getElementById('esfuerzo').value = totalPCUA.toFixed(4);
        }
        if(sumaF == 3 || sumaF == 4){
            totalPCUA = totalPCUA * 28;
            document.getElementById('esfuerzo').value = totalPCUA.toFixed(4);
        }
        if(sumaF >= 5){
            document.getElementById('esfuerzo').value = "Riesgo Fracaso";




            /*      *****************************                     */ 
        }
        
        

    }
}


// Lista de IDs de los selects Entradas de costo por etapas
const costoU = ["cost-input1", "cost-input2", "cost-input3", "cost-input4", "cost-input5", "cost-input6"];
// Lista de IDs de los selects Salidas de costo por etapas
const costoF = ["f-costo1", "f-costo2", "f-costo3", "f-costo4", "f-costo5", "f-costo6"];


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

function actualizarCalculos() {

    // Obtener los valores de los factores
    const costosU = obtenerValoresCostoU(costoU);
    const esfuerzo = parseFloat(document.getElementById("esfuerzo").value);
    // Multiplicar cada valor de costosU por 2 para obtener los valores de costosF
    const costosF = costosU.map(valor => valor * esfuerzo);

    // Asignar los valores multiplicados a los inputs de costoF
    asignarValoresCostoF(costoF, costosF);

    // Calcular el total de costos finales
    const costoTotal = costosF.reduce((acc, val) => acc + val, 0);
    document.getElementById("f-costoT").value = costoTotal.toFixed(4);
}



const btnAbrirModalEcua = document.querySelector("#pesosdeactores");
const btnCerrarModalEcua = document.querySelector("#btn-cerrar-modal-pa");
const modal = document.querySelector("#modal-pa");

const btnAbrirModalEcua2 = document.querySelector("#pesosdecasosdeuso");
const btnCerrarModalEcua2 = document.querySelector("#btn-cerrar-modal-pcu");
const modal2 = document.querySelector("#modal-pcu");

const btnAbrirModalEcua3 = document.querySelector("#factorct");
const btnCerrarModalEcua3 = document.querySelector("#btn-cerrar-modal-fct");
const modal3 = document.querySelector("#modal-fct");

const btnAbrirModalEcua4 = document.querySelector("#factora");
const btnCerrarModalEcua4 = document.querySelector("#btn-cerrar-modal-fa");
const modal4 = document.querySelector("#modal-fa");

// Escuchar cambios en el campo de entrada y selects
document.addEventListener("DOMContentLoaded", function() {
    
    document.getElementById('peso-actores').addEventListener('input', calPCUSA);
    document.getElementById('peso-caso-de-uso').addEventListener('input', calPCUSA);
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
    btnAbrirModalEcua4.addEventListener("click",()=>{
        modal4.showModal();
    })
    btnCerrarModalEcua4.addEventListener("click",()=>{
        modal4.close();
    })

});



const toastDetails = {
    timer: 5000,
    pesoactores: {
        icon: 'fa-circle-info',
        text: 'Es la suma total de los factores que son asignados a los pesos de los actores representados en los casos de uso. <strong> Presionar el Boton "Pesos de Actores" de color Azul para realizar el calculo. </strong>',
    },
    pesocasodeuso: {
        icon: 'fa-circle-info',
        text: 'Puede realizarse de 2 formas como son cosiderando Transacciones o Clases analizadas en los casos de uso. <strong> Presionar el Boton "Pesos de Casos de Uso" de color Verde para realizar el calculo. </strong>  ',
    },
    pcusa: {
        icon: 'fa-circle-info',
        text: 'Peso de los Casos de Uso sin ajustar(PCUSA): Este cálculo se obtiene con la suma de PA y PCU',
    },
    fct: {
        icon: 'fa-circle-info',
        text: 'Nos referimos al Factor de Complejidad Tecnica (FCT).  <strong> Presionar el Boton "Factor de Complejidad Tecnica (FCT)" de color Naranja para realizar el calculo respectivo.</strong>',
    },
    fat: {
        icon: 'fa-circle-info',
        text: 'Nos referimos al Factor de Ambiente (FA). <strong> Presionar el Boton "Factor de Ambiente (FA)" de color Rojo para realizar el calculo respectivo.</strong> ',
    },
    pcua: {
        icon: 'fa-circle-info',
        text: 'Este es el calculo de los Puntos de Caso de Uso Ajustados (PCUA): Se obtiene de multiplicar PCUSA por FCT por FA. ',
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
