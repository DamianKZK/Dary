//Juego
const entradaPalabra = document.querySelector('#palabra-usuario');
const botonEnviar = document.querySelector('#pantalla-juego button');
const contenedor1 = document.querySelector('#Palabras');
const contenedor2 = document.querySelector('#Palabras1')
const visualContador = document.querySelector('#contador-letras');
const nombre1 = document.querySelector('#Jug1');
const nombre2 = document.querySelector('#Jug2');
const Tem = document.querySelector('#Tem');
const turno = document.querySelector("#Turno");
const conteo1 = document.querySelector('#conteo1');
const conteo2 = document.querySelector('#conteo2');
//const salir = document.querySelector('#Salir');

//Sonidos
const bubble = new Audio('Sounds/Bubble.wav'); 
const clock = new Audio('Sounds/clock.wav');
const Error = new Audio('Sounds/Error.mp3');
//Reloj
const visualReloj = document.querySelector('#info-juego span');
let tiempoRestante = 15;
let cronometro; // Aquí guardaremos el intervalo
let juegoIniciado = true; // Para que el reloj solo empiece con la primera palabra

//Loby
const inputJugadores = document.querySelector('#input-jugadores');
const btnRegistrar = document.querySelector('#registrar');
const btnTerminar = document.querySelector('#terminar-registro');
const listaVisual = document.querySelector('#lista-nombres');
const instruccion = document.querySelector('#instruccion-lobby');
/*const InputTematica = document.querySelector('#InputTems');
const enviarTematica = document.querySelector('#enviar-tematicas')*/
// Seleccionamos los dos grandes bloques
const lobbyDiv = document.querySelector('#Lobby');
const juegoDiv = document.querySelector('#Juego-completo');

//Globales
let maximoLetras = 35;
let letras1 =[];
let letras2 =[];
let jugadores = [];
let JugadorObjeto=[];
let tematicas = ["Lugares a los que hemos ido", "Palabras de Mari",
                "Pelicula que vimos juntos", "Persona importante", "Libro", 
                "Canción de tu Playlist >:(", "Celebrity crush de Mari", "Cosas de Damian que enamoraron a Mari",
                "Apodos de Beto", "Animal infravalorado", "Animal sobrevalorado",
                "Animal acuático", "Marca de chocolates", "Escuadería de la F1", "País", "Mes del año", "Dia del mes", "Año"];
let JugadorActual ="";
let juegoActivo =true;
let ContTem = 0;

// Seleccionamos la pantalla de inicio
const pantallaInicio = document.querySelector('#Pantalla-Inicio');

// Al hacer clic en cualquier parte de esa pantalla
pantallaInicio.addEventListener('click', () => {
    // Aplicamos una transición de desvanecimiento
    pantallaInicio.style.opacity = '0';
    
    // Esperamos a que termine la animación (0.5s) para quitarla del flujo
    setTimeout(() => {
        pantallaInicio.classList.add('oculto'); // Usamos tu clase existente
    }, 500);
});


//Crear jugadores
class Jugador{
    constructor(Name){
        this.Name=Name;
        this.LetrasTotales = [];
    }
}
function CrearJugador(){
    for (let i=0;i<jugadores.length;i++){
        const user = new Jugador(jugadores[i]);
        JugadorObjeto.push(user);
        console.log(JugadorObjeto);
    }
}
function PersonalizarNombres(){
    nombre1.innerText = ` ${JugadorObjeto[0].Name}:`;
    nombre2.innerText = ` ${JugadorObjeto[1].Name}:`;

}
function ElegirTematica(){
    if (ContTem%4==0){
        let aleatorio = Math.floor(Math.random()* tematicas.length);
        let TemActual = tematicas[aleatorio];
        Tem.innerText = `${TemActual}`;
        tematicas.splice(aleatorio, 1);
    }
    ContTem = ContTem+1;

}
function CambiarJugador(){
    if (JugadorActual==JugadorObjeto[0]){
        let nombreJug=JugadorObjeto[1].Name;
        turno.innerText = `Turno de ${nombreJug}`;
        JugadorActual = JugadorObjeto[1];
    }
    else  if (JugadorActual ==JugadorObjeto[1]){
        let nombreJug = JugadorObjeto[0].Name;
        turno.innerText = `Turno de ${nombreJug}`;
        JugadorActual = JugadorObjeto[0];
    }
    console.log(JugadorActual);
    ContTem = ContTem+1;
    
}
// Esta función se activa cuando den clic en "¡Todos listos!"


function enviarPalabra() {
        let palabra = entradaPalabra.value.trim();
        if (palabra === "" || !juegoActivo) return;

        let contenedorActual = (JugadorActual == JugadorObjeto[0]) ? contenedor1 : contenedor2;
        let letrasActuales = (JugadorActual == JugadorObjeto[0]) ? letras1 : letras2;

        palabra.split('').forEach(letra => {
            const burbujaLetra = document.createElement('div');
            burbujaLetra.classList.add('palabra-descubierta');
            burbujaLetra.innerText = letra;
            contenedorActual.appendChild(burbujaLetra);
            letrasActuales.push(letra);
            bubble.cloneNode(true).play();
        });
        const burbujaLetra = document.createElement('div');
        burbujaLetra.classList.add('palabra-descubierta');
        burbujaLetra.innerText=' ';
        contenedorActual.appendChild(burbujaLetra);
        contenedorActual.scrollLeft = contenedorActual.scrollWidth;

        entradaPalabra.value = "";
        CambiarJugador();
        ColorearLetra(letrasActuales, contenedorActual);
        contador(letrasActuales);
        ElegirTematica();

        let proximoContenedor = (JugadorActual == JugadorObjeto[0]) ? contenedor1 : contenedor2;
        let proximasLetras = (JugadorActual == JugadorObjeto[0]) ? letras1 : letras2;
        
        iniciarReloj(proximoContenedor, proximasLetras);
}



function ColorearLetra(letras, contenedor){
    let cant = letras.length;
    let porcentaje = (cant / maximoLetras)*100;

    let colorBase = "white";
    if (porcentaje>=50&&porcentaje<=80){
        colorBase="#f8db66";
    }
    else if(porcentaje>80&&porcentaje<100){
        colorBase = "#f66e6e";
    }
    else if (porcentaje >= 100){
        colorBase = "#ec4b4b";
    }
    const todasLasLetras=contenedor.querySelectorAll('.palabra-descubierta');
    todasLasLetras.forEach(burbujaLetra => {
        burbujaLetra.style.backgroundColor = colorBase;
    });
}

function contador(letras){
    let actual = letras.length;
    let nuevoContador = (JugadorActual == JugadorObjeto[0]) ? conteo2 : conteo1;
    nuevoContador.innerText = `${actual} / ${maximoLetras}`;
    if (actual >= maximoLetras) {
        nuevoContador.style.color = "#ec4b4b";
        finalizarJuego();
        
    } else {
        nuevoContador.style.color = "inherit"; // Color normal
    }
}

function iniciarReloj(contenedor, letras) {
    if(!juegoIniciado)
        return;
    clearInterval(cronometro);
    
    tiempoRestante = 15;
    visualReloj.innerText = tiempoRestante;

    cronometro = setInterval(() => {
        tiempoRestante--;
        visualReloj.innerText = tiempoRestante;
        clock.play();
        if (tiempoRestante <= 0) {
            clearInterval(cronometro);
            const msj = "MUYLENTO ";
            msj.split('').forEach(letra => {
            const burbujaLetra = document.createElement('div');
            burbujaLetra.classList.add('palabra-descubierta');
            burbujaLetra.innerText=letra;
            contenedor.appendChild(burbujaLetra);
            letras.push(letra);
            });
            CambiarJugador();
            ElegirTematica();
            ColorearLetra(letras, contenedor);
            contador(letras);
            Error.play();
            let nuevoContenedor = (JugadorActual == JugadorObjeto[0]) ? contenedor1 : contenedor2;
            let nuevasLetras = (JugadorActual == JugadorObjeto[0]) ? letras1 : letras2;
        }
    }, 1000);
    
}

function finalizarJuego(perdedor) {
    juegoIniciado=false;
    clearInterval(cronometro); 
    console.log("Ya fue");
    entradaPalabra.disabled = true;
    botonEnviar.disabled = true;
    visualReloj.style.color = "red";
    console.log(JugadorActual.Name);

    const modal= document.querySelector('#modal-final');
    const msjGanador = document.querySelector('#mensaje-ganador');

    msjGanador.innerText =`El ganador es: \n${JugadorActual.Name}\n ¡Felicidades!`;
    modal.classList.remove('oculto');

    document.querySelector('#btn-reiniciar').addEventListener('click', () => {
    location.reload(); // La forma más fácil de resetear todo el estado
});

}

function main() {
    // Registro de jugadores
    btnRegistrar.addEventListener('click', () => {
        const nombre = inputJugadores.value.trim();
        if (nombre !== "") {
            jugadores.push(nombre);
            
            // Feedback visual en el Lobby
            const li = document.createElement('li');
            li.innerText = `${jugadores.length}. ${nombre}`;
            if (listaVisual) listaVisual.appendChild(li);

            inputJugadores.value = "";
            inputJugadores.focus();
            instruccion.innerText = `Introduce el nombre del Jugador ${jugadores.length + 1}:`;

            // Mostrar botón de terminar si hay jugadores
            if (jugadores.length >= 2) {
                btnTerminar.style.display = "inline-block";
            }
        }
    });

    // Cambio de Lobby a Juego
    btnTerminar.addEventListener('click', () => {
        if (jugadores.length >= 2) {
            lobbyDiv.classList.add('oculto'); // Oculta registro
            juegoDiv.classList.remove('oculto');
            juegoDiv.style.display = "block"; // Muestra juego
            
            // OPCIONAL: Podrías disparar el sistema de temáticas aquí
            console.log("Iniciando juego con:", jugadores);
            CrearJugador();
            PersonalizarNombres();
            ElegirTematica();
            JugadorActual=JugadorObjeto[0];
            turno.innerText = `Turno de ${JugadorActual.Name}.`;
        } else {
            alert("Registra al menos 2 jugadores para competir.");
        }
    });
}

main();
botonEnviar.addEventListener('click', enviarPalabra);
entradaPalabra.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        enviarPalabra(); // Llama directamente a la función
    }
});
document.querySelector('#Salir').addEventListener('click', () => {
    location.reload(); // La forma más fácil de resetear todo el estado
});


