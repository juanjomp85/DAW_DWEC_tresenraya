    // Este array no se puede modificar,
    var posibilidades = ["piedra", "papel", "tijera"];
    
    document.addEventListener('DOMContentLoaded', function() {
    let totalPartidas = 0;
    let partidaActual = 0;
    let victoriasJugador = 0;
    let victoriasMaquina = 0;

    // Selección de elementos del DOM
    const nombreJugadorInput = document.querySelector('input[name="nombre"]');
    const partidasInput = document.querySelector('input[name="partidas"]');
    const jugarBtn = document.querySelectorAll('button')[0];
    const yaBtn = document.querySelectorAll('button')[1];
    const resetBtn = document.querySelectorAll('button')[2];
    const actualSpan = document.getElementById('actual');
    const totalSpan = document.getElementById('total');
    const historialUl = document.getElementById('historial');
    const jugadorImgs = document.querySelectorAll('#jugador img');
    const maquinaImg = document.getElementById('maquina').getElementsByTagName('img')[0];

    // Inhabilitamos el botón ¡YA! al inicio
    yaBtn.disabled = true;

    // Configuración de imágenes
        const imgRutas = {
        'piedra': 'img/piedraJugador.png',
        'papel': 'img/papelJugador.png',
        'tijera': 'img/tijeraJugador.png',
        'defecto': 'img/defecto.png'
    };

    // Función para iniciar el juego
    jugarBtn.addEventListener('click', function() {
        totalPartidas = parseInt(partidasInput.value);
        partidaActual = 0;
        victoriasJugador = 0;
        victoriasMaquina = 0;
        actualSpan.textContent = '0';
        totalSpan.textContent = String(totalPartidas);
        historialUl.innerHTML = ''; // Limpiamos el historial
        // Obtener los valores de los campos de texto
        nombreJugador = nombreJugadorInput.value.trim();

        // Realizar las comprobaciones de validez del nombre y el número de partidas
        let nombreValido = false;
        let partidasValidas = false;

        // Comprobar si el nombre es válido
        if (nombreJugador.length > 3 && isNaN(nombreJugador.charAt(0))) {
            nombreValido = true;
            nombreJugadorInput.classList.remove('fondoRojo');
        } else {
            // Marcar el campo de texto del nombre como incorrecto
            nombreJugadorInput.classList.add('fondoRojo');
        }
        
        // Comprobar si el número de partidas es válido
        if (totalPartidas > 0) {
            partidasValidas = true;
            partidasInput.classList.remove('fondoRojo');
        } else {
            // Marcar el campo de texto de partidas como incorrecto
            partidasInput.classList.add('fondoRojo');
        }

        // Si ambos campos son válidos, proceder con el juego
        if (nombreValido && partidasValidas) {
            // Eliminar la clase "fondoRojo" de ambos campos de texto
            nombreJugadorInput.classList.remove('fondoRojo');
            partidasInput.classList.remove('fondoRojo');

            // Desactivar los campos de texto
            nombreJugadorInput.disabled = true;
            partidasInput.disabled = true;

            // Volcar el valor de partidas introducido en el span "total"
            totalSpan.textContent = totalPartidas;

            // Cargar las imágenes para las opciones del jugador
            jugadorImgs.forEach((img, index) => {
                img.src = imgRutas[posibilidades[index]];
            });

            // Habilitar el botón ¡YA! para comenzar a jugar
            yaBtn.disabled = false;
        }
    });

    // Función para el botón ¡YA!
    yaBtn.addEventListener('click', function() {
        jugar();
    });

    // Añadir event listeners a las imágenes del jugador para la selección de jugada
    Array.from(jugadorImgs).forEach((img, indice) => {
        img.addEventListener('click', function() {
            actualizarSeleccionUI(indice);
        });
    });

    // Función para actualizar la UI después de que el jugador selecciona una opción
    function actualizarSeleccionUI(indiceSeleccionado) {
        Array.from(jugadorImgs).forEach((img, indice) => {
            if (indice === indiceSeleccionado) {
                img.classList.add('seleccionado');
                img.classList.remove('noSeleccionado'); // Eliminar la clase noSeleccionado
            } else {
                img.classList.remove('seleccionado');
                img.classList.add('noSeleccionado');
            }
        });
    }

    function jugar() {
        if (partidaActual < totalPartidas) {
            // Determinar la elección del jugador
            const eleccionJugadorIndex = Array.from(jugadorImgs).findIndex(img => img.classList.contains('seleccionado'));
            const eleccionJugador = posibilidades[eleccionJugadorIndex];
    
            // Determinar la elección de la máquina
            const eleccionMaquinaIndex = Math.floor(Math.random() * posibilidades.length);
            const eleccionMaquina = posibilidades[eleccionMaquinaIndex];
            maquinaImg.src = imgRutas[eleccionMaquina];
    
            // Incrementar el contador de partidas actual
            partidaActual++;
            actualSpan.textContent = String(partidaActual);
    
            // Comprobar el resultado de la jugada
            let resultadoPartida = '';
            if (eleccionJugador === eleccionMaquina) {
                resultadoPartida = 'Empate';
            } else {
                const ganadorIndex = posibilidades.indexOf(eleccionMaquina) - posibilidades.indexOf(eleccionJugador);
                if (ganadorIndex === 1 || ganadorIndex === -(posibilidades.length - 1)) {
                    resultadoPartida = 'Gana la máquina';
                    victoriasMaquina++;
                } else {
                    resultadoPartida = `${nombreJugadorInput.value} gana`;
                    victoriasJugador++;
                }
            }
    
            // Actualizar el historial de partidas
            const resultadoLi = document.createElement('li');
            resultadoLi.textContent = resultadoPartida;
            historialUl.appendChild(resultadoLi);

            // Actualizar contadores de victorias en el DOM
            updateVictoryCount();//ultimo
    
            // Verificar si se han jugado todas las partidas
            if (partidaActual === totalPartidas) {
                yaBtn.disabled = true; // Deshabilita el botón ¡YA! al finalizar las partidas
            }
        }
    }

    function updateVictoryCount() {//Ultimo
        // Asegurar que exista un elemento para mostrar las victorias
        let victoryDisplay = document.getElementById('victory-count');
        if (!victoryDisplay) {
            victoryDisplay = document.createElement('div');
            victoryDisplay.id = 'victory-count';
            document.body.appendChild(victoryDisplay);
        }
        victoryDisplay.textContent = `Victorias Jugador: ${victoriasJugador}, Victorias Máquina: ${victoriasMaquina}`;
    }

    resetBtn.addEventListener('click', function() {
        historialUl.innerHTML = '';
    
        const resultadoLi = document.createElement('li');
        resultadoLi.textContent = 'Nueva partida';
        historialUl.appendChild(resultadoLi);
    
        partidasInput.value = '0';
        nombreJugadorInput.disabled = false;
        partidasInput.disabled = false;
        actualSpan.textContent = '0';
        totalSpan.textContent = '0';
        maquinaImg.src = imgRutas['defecto'];
    
        // Restablecer victorias
        victoriasJugador = 0;
        victoriasMaquina = 0;
        updateVictoryCount();
    });
    

});


