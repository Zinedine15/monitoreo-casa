let ultimoComando = ''; // Variable para almacenar el último comando detectado
let ultimaHora = ''; // Variable para almacenar la última hora detectada
let primeraCarga = true; // Variable para controlar la primera carga

document.addEventListener('DOMContentLoaded', function () {
    const OrdenText = document.getElementById('orden');
    const EstadoText = document.getElementById('estado');

    // Definir el objeto con los casos y las imágenes correspondientes
    const casos = {
        "Encender la luz de la recámara": {
            imagen: "imágenes/focoRecamaraOn.png",
            estadoInicial: false
        },
        "Apagar la luz de la recámara": {
            imagen: "imágenes/focoRecamaraOff.png",
            estadoInicial: true
        },
        "Encender la luz de la sala": {
            imagen: "imágenes/focoSalaOn.png",
            estadoInicial: false
        },
        "Apagar la luz de la sala": {
            imagen: "imágenes/focoSalaOff.png",
            estadoInicial: true
        },
        "Encender las luces del jardín": {
            imagen: "imágenes/focoJardinOn.png",
            estadoInicial: false
        },
        "Apagar las luces del jardín": {
            imagen: "imágenes/focoJardinOff.png",
            estadoInicial: true
        },
        "Encender el ventilador": {
            imagen: "imágenes/ventiladorEncendido.gif",
            estadoInicial: false
        },
        "Apagar el ventilador": {
            imagen: "imágenes/ventiladorApagado.png",
            estadoInicial: true
        },
        "Abrir las cortinas": {
            imagen: "imágenes/abrirCortinas.gif",
            estadoInicial: false,
            animacion: true
        },
        "Cerrar las cortinas": {
            imagen: "imágenes/cerrarCortinas.gif",
            estadoInicial: true,
            animacion: true
        },
        "Activar la alarma": {
            imagen: "imágenes/alarmaEncendida.png",
            estadoInicial: false
        },
        "Desactivar la alarma": {
            imagen: "imágenes/alarmaApagada.png",
            estadoInicial: true
        },
        "Encender las cámaras": {
            imagen: "imágenes/camaraOn.png",
            estadoInicial: false
        },
        "Apagar las cámaras": {
            imagen: "imágenes/camaraOff.png",
            estadoInicial: true
        }
    };

    // Función para cambiar el estado y la imagen
    function cambiarEstadoYImagen(caso, imagenID, estadoInicial) {
        const nuevoEstadoTexto = estadoInicial ? "Desactivado" : "Activado";
        const nuevoEstadoColor = estadoInicial ? "red" : "green";
        const imagenElement = document.getElementById(imagenID);

        // Cambiar la imagen
        imagenElement.src = caso.imagen;

        // Cambiar el estado y el color
        EstadoText.textContent = `Estado: ${nuevoEstadoTexto}`;
        EstadoText.style.color = nuevoEstadoColor;

        // Si el caso tiene animación, reiniciar la imagen después de la animación
        if (caso.animacion) {
            setTimeout(() => {
                imagenElement.src = estadoInicial ? "imágenes/cortinasCerradas.png" : "imágenes/cortinasAbiertas.png";
            }, 1000); // Ajusta el tiempo según la duración de la animación
        }
    }

    // Función para leer el comando de la API y ejecutar el switch
    function leerComandoDeMockAPI() {
        const url = "https://6604c6232ca9478ea17e7e32.mockapi.io/instruccionesCasa";

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const ultimoRegistro = data[data.length - 1];
                    console.log('Último registro en MockAPI:', ultimoRegistro);

                    // Si es la primera carga, actualizar el último comando y hora detectados sin mostrarlo en la página
                    if (primeraCarga) {
                        ultimoComando = ultimoRegistro.ordenUsr;
                        ultimaHora = ultimoRegistro.fechaHora;
                        primeraCarga = false;
                        return;
                    }

                    // Mostrar la última orden en la página solo si hay un cambio en el comando o la hora
                    if ((ultimoRegistro.ordenUsr == ultimoComando && ultimoRegistro.fechaHora !== ultimaHora) ||
                        (ultimoRegistro.ordenUsr !== ultimoComando && ultimoRegistro.fechaHora !== ultimaHora)) {
                        OrdenText.textContent = ultimoRegistro.ordenUsr.toUpperCase();

                        // Ejecutar el switch para cambiar el estado y la imagen según el comando
                        const caso = casos[ultimoRegistro.ordenUsr];
                        if (caso) {
                            cambiarEstadoYImagen(caso, obtenerImagenID(ultimoRegistro.ordenUsr), caso.estadoInicial);
                        } else {
                            OrdenText.textContent = "Orden no reconocida";
                        }

                        // Actualizar el último comando y hora detectados
                        ultimoComando = ultimoRegistro.ordenUsr;
                        ultimaHora = ultimoRegistro.fechaHora;
                    }
                }
            })
            .catch(error => console.error('Error al obtener registros del MockAPI:', error));
    }

    // Función para obtener el ID de la imagen según el comando
    function obtenerImagenID(comando) {
        switch (comando) {
            case "Encender la luz de la recámara":
            case "Apagar la luz de la recámara":
                return "focoRecamara";
            case "Encender la luz de la sala":
            case "Apagar la luz de la sala":
                return "focoSala";
            case "Encender las luces del jardín":
            case "Apagar las luces del jardín":
                return "focoJardin";
            case "Encender el ventilador":
            case "Apagar el ventilador":
                return "ventilador";
            case "Abrir las cortinas":
            case "Cerrar las cortinas":
                return "cortinas";
            case "Activar la alarma":
            case "Desactivar la alarma":
                return "alarma";
            case "Encender las cámaras":
            case "Apagar las cámaras":
                return "camaras";
            default:
                return ""; // Devolver un ID válido para los casos no reconocidos
        }
    }

    // Llamar a la función leerComandoDeMockAPI cada 2 segundos
    setInterval(leerComandoDeMockAPI, 2000);
});
