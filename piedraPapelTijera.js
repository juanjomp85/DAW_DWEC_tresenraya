// Este array no se puede modificar
const posibilidades = ["piedra", "papel", "tijera"];

document.addEventListener("DOMContentLoaded", () => {
    let totalPartidas = 0;
    let partidaActual = 0;
    let victoriasJugador = 0;
    let victoriasMaquina = 0;
    let nombreJugador = "";

    const nombreJugadorInput = document.getElementById("nombre");
    const partidasInput = document.getElementById("partidas");
    const jugarBtn = document.getElementById("jugar-btn");
    const yaBtn = document.getElementById("ya-btn");
    const resetBtn = document.getElementById("reset-btn");
    const actualSpan = document.getElementById("actual");
    const totalSpan = document.getElementById("total");
    const historialUl = document.getElementById("historial");
    const jugadorImgs = document.querySelectorAll("#jugador img");
    const maquinaImg = document.querySelector("#maquina img");
    const victoryDisplay = document.getElementById("victory-count");
    const estadoRonda = document.getElementById("estado-ronda");

    const imgRutas = {
        piedra: "img/piedraJugador.png",
        papel: "img/papelJugador.png",
        tijera: "img/tijeraJugador.png",
        defecto: "img/defecto.png"
    };

    yaBtn.disabled = true;

    jugarBtn.addEventListener("click", () => {
        totalPartidas = Number.parseInt(partidasInput.value, 10);
        partidaActual = 0;
        victoriasJugador = 0;
        victoriasMaquina = 0;
        nombreJugador = nombreJugadorInput.value.trim();

        const nombreValido = nombreJugador.length > 3 && Number.isNaN(Number.parseInt(nombreJugador.charAt(0), 10));
        const partidasValidas = Number.isInteger(totalPartidas) && totalPartidas > 0;

        nombreJugadorInput.classList.toggle("fondoRojo", !nombreValido);
        partidasInput.classList.toggle("fondoRojo", !partidasValidas);

        if (!nombreValido || !partidasValidas) {
            estadoRonda.textContent = "Corrige los campos en rojo para comenzar.";
            return;
        }

        nombreJugadorInput.disabled = true;
        partidasInput.disabled = true;

        actualSpan.textContent = "0";
        totalSpan.textContent = String(totalPartidas);
        historialUl.innerHTML = "";

        jugadorImgs.forEach((img, index) => {
            img.src = imgRutas[posibilidades[index]];
        });

        actualizarSeleccionUI(0);
        maquinaImg.src = imgRutas.defecto;
        updateVictoryCount();
        estadoRonda.textContent = `¡Comienza el duelo, ${nombreJugador}!`;
        yaBtn.disabled = false;
    });

    yaBtn.addEventListener("click", () => {
        jugarRonda();
    });

    jugadorImgs.forEach((img, indice) => {
        img.addEventListener("click", () => {
            actualizarSeleccionUI(indice);
        });
    });

    resetBtn.addEventListener("click", () => {
        totalPartidas = 0;
        partidaActual = 0;
        victoriasJugador = 0;
        victoriasMaquina = 0;
        nombreJugador = "";

        historialUl.innerHTML = "";
        const resultadoLi = document.createElement("li");
        resultadoLi.textContent = "Nueva partida";
        historialUl.appendChild(resultadoLi);

        partidasInput.value = "0";
        nombreJugadorInput.value = "";
        nombreJugadorInput.disabled = false;
        partidasInput.disabled = false;
        nombreJugadorInput.classList.remove("fondoRojo");
        partidasInput.classList.remove("fondoRojo");

        actualSpan.textContent = "0";
        totalSpan.textContent = "0";
        maquinaImg.src = imgRutas.defecto;
        jugadorImgs.forEach((img) => {
            img.src = imgRutas.defecto;
        });
        actualizarSeleccionUI(0);

        estadoRonda.textContent = "Juego reiniciado. Configura una nueva partida.";
        updateVictoryCount();
        yaBtn.disabled = true;
    });

    function jugarRonda() {
        if (partidaActual >= totalPartidas) {
            yaBtn.disabled = true;
            return;
        }

        const eleccionJugadorIndex = Array.from(jugadorImgs).findIndex((img) => img.classList.contains("seleccionado"));
        const eleccionJugador = posibilidades[eleccionJugadorIndex] ?? posibilidades[0];

        const eleccionMaquinaIndex = Math.floor(Math.random() * posibilidades.length);
        const eleccionMaquina = posibilidades[eleccionMaquinaIndex];
        maquinaImg.src = imgRutas[eleccionMaquina];

        partidaActual += 1;
        actualSpan.textContent = String(partidaActual);

        let resultadoPartida = "";
        if (eleccionJugador === eleccionMaquina) {
            resultadoPartida = `Ronda ${partidaActual}: Empate`;
        } else {
            const ganadorIndex = posibilidades.indexOf(eleccionMaquina) - posibilidades.indexOf(eleccionJugador);
            if (ganadorIndex === 1 || ganadorIndex === -(posibilidades.length - 1)) {
                resultadoPartida = `Ronda ${partidaActual}: Gana la máquina`;
                victoriasMaquina += 1;
            } else {
                resultadoPartida = `Ronda ${partidaActual}: ${nombreJugador} gana`;
                victoriasJugador += 1;
            }
        }

        const resultadoLi = document.createElement("li");
        resultadoLi.textContent = resultadoPartida;
        historialUl.appendChild(resultadoLi);

        estadoRonda.textContent = resultadoPartida;
        updateVictoryCount();

        if (partidaActual === totalPartidas) {
            yaBtn.disabled = true;
            estadoRonda.textContent = getMensajeFinal();
        }
    }

    function actualizarSeleccionUI(indiceSeleccionado) {
        jugadorImgs.forEach((img, indice) => {
            img.classList.toggle("seleccionado", indice === indiceSeleccionado);
            img.classList.toggle("noSeleccionado", indice !== indiceSeleccionado);
        });
    }

    function getMensajeFinal() {
        if (victoriasJugador === victoriasMaquina) {
            return "Fin de partida: empate global. ¡Buena batalla!";
        }

        return victoriasJugador > victoriasMaquina
            ? `Fin de partida: ${nombreJugador} gana el duelo 🎉`
            : "Fin de partida: la máquina gana el duelo 🤖";
    }

    function updateVictoryCount() {
        victoryDisplay.textContent = `Victorias Jugador: ${victoriasJugador}, Victorias Máquina: ${victoriasMaquina}`;
    }
});
