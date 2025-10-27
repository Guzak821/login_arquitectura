import { UsuarioPresentador } from '../js/models/presenters/UsuarioPresentador.js';

// 1. Definir la Interfaz de la Vista 
const vistaRegistro = {
    form: document.getElementById('register-form'),
    errorMessage: document.getElementById('error-message'),
    loadingSpinner: document.getElementById('loading-spinner'),

    mostrarError: (mensaje) => {
        vistaRegistro.errorMessage.textContent = mensaje;
    },
    mostrarCarga: () => {
        vistaRegistro.loadingSpinner.style.display = 'block';
    },
    ocultarCarga: () => {
        vistaRegistro.loadingSpinner.style.display = 'none';
    },
    limpiarFormulario: () => {
        vistaRegistro.form.reset();
    },
    redireccionarLogin: () => {
        // Redirigimos al navegador a la ruta correcta
        window.location.href = '/usuarios/login'; 
    }
};

// 2. Inicialización y Acoplamiento del Presentador con la Vista
const presentador = new UsuarioPresentador(vistaRegistro);

// 3. Manejador de Eventos
vistaRegistro.form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Recoge los datos del DOM y se los pasa al Presentador
    const formData = new FormData(vistaRegistro.form);
    
    presentador.registrarUsuario(formData);
});