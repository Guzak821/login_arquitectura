//Contendra dos metodos para consumir servicios externos (GetUsuarios(), InsertUsuario())
import { Injectable } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpService } from '@nestjs/axios';
import { UsuariosCQRS } from '../cqrs/usuarios.cqrs';
import { UsrInsertExternoViewModel } from '../viewmodel/user-insert-externo.viewmodel';
import { UsrPublicoExternoViewModel } from '../viewmodel/user-publico-externo.viewmodel';
import { UpdateProfileDto } from '../modules/DTO/update-profile.dto'; 

@Injectable()
export class ApiExternaService {
    constructor(private readonly httpService: HttpService) {
    }
// Definicion de mi ruta BASE para la API externa
    private readonly baseUrl: string = 'http://localhost:3000/api-externa'; // <-- URL REAL

    // Metodo para GetUsuarios consulta de API a API externa
    async getUsuarios(): Promise<UsrPublicoExternoViewModel[]> {
        const externalApiUrl = `${this.baseUrl}/usuarios`; 
        try {
            // Realiza la petición GET a la API externa
            const response = await this.httpService.get(externalApiUrl).toPromise();
            
            if (!response) {
            console.error('API Externa Simulada: La respuesta fue indefinida.');
            return [];
        }
            // Aquí mapeo la respuesta al UsrPublicoExternoViewModel
            return response.data.map(externalUser => ({
                Identificador: externalUser.id_externo,
                Usr: externalUser.username_externo, 
            }));
        } catch (error) {
            console.error('Error al obtener usuarios de la API externa:', error.message);
            // Manejo de errores apropiado (lanzar excepción, retornar vacío, etc.)
            return []; 
        }
    }

    // Metodo para InsertUsuario consumo de API externa a API externa
async insertUsuario(userData: UsrInsertExternoViewModel): Promise<UsrPublicoExternoViewModel> {
        const externalApiUrl = `${this.baseUrl}/insert`;
        try {
            // Realiza la petición POST a la API externa
            const response = await this.httpService.post(externalApiUrl, userData).toPromise();
            if (!response) {
            console.error('API Externa Simulada: La respuesta fue indefinida.');
            throw new Error('Respuesta indefinida de la API externa');
        }
            // Mapea la respuesta al UsrPublicoExternoViewModel
            const createdUser = response.data;
            return {
                Identificador: createdUser.Identificador,
                Usr: createdUser.Usr,
            };
        } catch (error) {
            console.error('Error al insertar usuario en la API externa:', error.message);
            throw new Error('Fallo al registrar usuario en la API externa');
        }
    }

}