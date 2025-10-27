// Logica de negocio y la interacción con el backend

// Act. 2.7 - Requisito 1: Lógica de negocio en el Presentador
import { Usuario } from '../Usuario.js'; // Importar el modelo

export class UsuarioPresentador {
    
    constructor(vista) {
        this.vista = vista; // La vista que interactúa con este presentador
    }

    // Método que maneja la lógica de negocio del registro
    async registrarUsuario(formData) {
        // 1. Usar el Modelo para crear un nuevo usuario
        const nuevoUsuario = new Usuario(
            formData.get('nombre'),
            formData.get('email'),
            formData.get('password')
        );

        // Lógica de validación de negocio 
        if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.password) {
            this.vista.mostrarError('Todos los campos son obligatorios.');
            return;
        }

        this.vista.mostrarCarga();
        
        // 2. Ejecutar la llamada al Backend 
        try {
            const response = await fetch('/usuarios/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Convertir el modelo a JSON para enviarlo
                body: JSON.stringify({
                    nombre: nuevoUsuario.nombre,
                    email: nuevoUsuario.email,
                    password: nuevoUsuario.password
                })
            });

           if (response.ok || response.redirected) {
                
                if (response.url.includes('/usuarios/login')) {
                    window.location.href = response.url;
                } else {
                    // Si el backend no redirigió, asumimos éxito y redirigimos
                    this.vista.redireccionarLogin();
                }
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Fallo al procesar la respuesta.' }));
                this.vista.mostrarError(errorData.errorMessage || errorData.message || 'Fallo desconocido en el registro.');
            }
        } catch (error) {
            this.vista.mostrarError('Error de red. Verifique la conexión.');
        } finally {
            this.vista.ocultarCarga();
        }
    }
}

