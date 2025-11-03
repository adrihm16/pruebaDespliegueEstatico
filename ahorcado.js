let palabras = [
    "RESCATE", "ACOTADO", "CORNISA", "LASTRAR", "AVISTAR",
    "CABEZAL", "DILECTO", "SORTIJA", "POLLINO", "MIRADOR",
    "ARRABAL", "FRAGATA", "CANSINO", "COLADOR", "OBCECAR",
    "INSIGNE", "PASADOR", "CALIDAD", "DIALOGO", "MUTILAR"
];

let palabraActual = "";
let letrasAdivinadas = [];
let fallos = 0;
const maxFallos = 7;
let puntuacionActual = 0;
let puntuacionUltima = 0;
let puntuacionMaxima = 0;
let letrasFalladas = [];

function aleatorio(inferior, superior) {
    return Math.floor(Math.random() * (superior - inferior)) + inferior;
}

function mostrarMensaje(texto) {
    const mensajeContainer = document.getElementById("mensajeContainer");
    mensajeContainer.innerHTML = ""; // Limpiar mensajes anteriores
    const mensaje = document.createElement("div");
    mensaje.className = "mensaje";
    mensaje.textContent = texto;
    mensajeContainer.appendChild(mensaje);

    setTimeout(() => {
        mensajeContainer.innerHTML = "";
    }, 3000);
}

function comenzar() {
    if (palabras.length === 0) {
        mostrarMensaje("No quedan más palabras para jugar.");
        return;
    }

    const indiceAleatorio = aleatorio(0, palabras.length);
    palabraActual = palabras.splice(indiceAleatorio, 1)[0];
    letrasAdivinadas = Array(palabraActual.length).fill("");
    fallos = 0;
    letrasFalladas = [];

    for (let i = 0; i < 7; i++) {
        const input = document.getElementById(`letra${i}`);
        input.value = "";
        input.classList.remove("letra-acertada", "letra-fallada"); // Limpiar estilos
    }
    document.getElementById("letraEnviada").value = "";
    document.getElementById("letrasFalladas").style.display = "none";

    actualizarInterfaz();
}

function validarInput(input) {
    const regex = /^[a-zA-ZÑñ]$/;
    if (!regex.test(input.value) && input.value !== "") {
        input.value = "";
        mostrarMensaje("Solo se permiten letras del alfabeto español (sin tildes).");
    }
}

function comprobarLetra() {
    if (palabraActual === "") {
        mostrarMensaje("Debes presionar 'Comenzar' para iniciar el juego.");
        document.getElementById("letraEnviada").value = "";
        return;
    }

    const letraInput = document.getElementById("letraEnviada").value.toUpperCase();
    
    if (letraInput === "" || !/^[A-ZÑ]$/.test(letraInput)) {
        mostrarMensaje("Por favor, introduce una letra válida del alfabeto español.");
        return;
    }

    if (letrasAdivinadas.includes(letraInput) || letrasFalladas.includes(letraInput)) {
        mostrarMensaje("Esa letra ya ha sido ingresada.");
        return;
    }

    let acierto = false;
    for (let i = 0; i < palabraActual.length; i++) {
        if (palabraActual[i] === letraInput) {
            letrasAdivinadas[i] = letraInput;
            const input = document.getElementById(`letra${i}`);
            input.value = letraInput;
            input.classList.add("letra-acertada"); 
            acierto = true;
        }
    }

    if (!acierto) {
        fallos++;
        letrasFalladas.push(letraInput);
        document.getElementById("letrasFalladas").style.display = "block";
        document.getElementById("listaFalladas").textContent = letrasFalladas.join(", ");
    }

    // Calcular puntuación por acierto
    if (acierto) {
        const letrasAcertadas = letrasAdivinadas.filter(letra => letra !== "").length;
        puntuacionActual += letrasAcertadas * (maxFallos - fallos);
    }

    actualizarInterfaz();

    // Verificar fin del juego
    if (fallos >= maxFallos) {
        mostrarMensaje(`¡Has perdido! La palabra era "${palabraActual}". Puntuación actual: ${puntuacionActual}`);
        mostrarPalabraCompleta();
        setTimeout(reiniciarJuego, 3000); // Reiniciar tras 3 segundos
    } else if (!letrasAdivinadas.includes("")) {
        puntuacionUltima = puntuacionActual;
        puntuacionMaxima = Math.max(puntuacionMaxima, puntuacionActual);
        mostrarMensaje(`¡Felicidades! Has adivinado la palabra "${palabraActual}". Puntuación: ${puntuacionActual}`);
        setTimeout(reiniciarJuego, 3000); // Reiniciar tras 3 segundos
    }

    document.getElementById("letraEnviada").value = "";
}

function mostrarPalabraCompleta() {
    for (let i = 0; i < palabraActual.length; i++) {
        const input = document.getElementById(`letra${i}`);
        if (letrasAdivinadas[i] === "") {
            input.value = palabraActual[i];
            input.classList.add("letra-fallada"); // Rojo
        }
    }
}

// Actualizar la interfaz del juego
function actualizarInterfaz() {
    document.getElementById("puntuacionAct").value = puntuacionActual;
    document.getElementById("puntuacionUltima").value = puntuacionUltima;
    document.getElementById("puntuacionMax").value = puntuacionMaxima;
    document.getElementById("numFallosActuales").value = fallos;
    document.getElementById("numFallosPerm").value = maxFallos;
    document.getElementById("palabrasRest").value = palabras.length;
}

function reiniciarJuego() {
    palabraActual = "";
    letrasAdivinadas = [];
    fallos = 0;
    puntuacionActual = 0;
    letrasFalladas = [];
    for (let i = 0; i < 7; i++) {
        const input = document.getElementById(`letra${i}`);
        input.value = "";
        input.classList.remove("letra-acertada", "letra-fallada");
    }
    document.getElementById("letrasFalladas").style.display = "none";
    document.getElementById("mensajeContainer").innerHTML = "";
    actualizarInterfaz();
}

window.onload = function() {
    document.getElementById("numFallosPerm").value = maxFallos;
    document.getElementById("palabrasRest").value = palabras.length;
    document.getElementById("puntuacionAct").value = 0;
    document.getElementById("puntuacionUltima").value = 0;
    document.getElementById("puntuacionMax").value = 0;
    document.getElementById("numFallosActuales").value = 0;
};