// Act. 2.7 - Requisito 2 y 3: Creación y uso del modelo
export class Usuario {
    constructor(nombre, email, password) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
    }

    getPresentacion() {
        return `Usuario: ${this.email} | Nombre: ${this.nombre}`;
    }
}