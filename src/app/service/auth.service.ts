import { Injectable } from '@angular/core';
import { BehaviorSubject,lastValueFrom, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserApi } from '../modelos/userapi.module';
import { catchError,tap } from 'rxjs/operators';

import { inject } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://6711db204eca2acdb5f5f551.mockapi.io/usuarios';
  mensajeError: string = '';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private usuarioCompletoSubject = new BehaviorSubject<UserApi | null>(null);
  usuarioCompleto$ = this.usuarioCompletoSubject.asObservable();

  private loginFailedSubject = new BehaviorSubject<boolean>(false);
  loginFailed$ = this.loginFailedSubject.asObservable();

  constructor() {
    this.restaorarSesion();
  }

  async apiData(usuario: string, clave: string): Promise<boolean> {

    try {

    const usuarios = await this.request<UserApi[]>('GET', this.apiUrl);
    const user = usuarios.find(u => u.usuario === usuario && u.clave === clave);
    if (user) {

      this.isAuthenticatedSubject.next(true);
      this.usuarioCompletoSubject.next(user);
      this.guardarsesion(user);
      this.loginFailedSubject.next(false);
      return true;
    } else {
      this.isAuthenticatedSubject.next(false);
      this.loginFailedSubject.next(true);
      return false;
    }
    }catch(error){
      this.mensajeError = 'Problema al iniciar sesión, intentalo mas tarde';
      throw error;
    }return Promise.resolve(true);
  }

  async registrouser(nombreCompleto: string, rut: string, usuario: string,
     clave: string, rol: string, email: string): Promise<void> {

    try {
    const usuarioExistente = await this.revUserExistente(usuario);
    if (usuarioExistente) {
      this.mensajeError = 'Este nombre de usuario ya está en uso. Prueba con otro.  ';
      return;
    }
    const nuevoUsuario = {
      nombreCompleto: nombreCompleto,
      rut: rut,
      usuario: usuario,
      clave: clave,
      rol: rol,
      email: email,
      createdAt: new Date().toISOString(), //BORRAR EN CASO DE
      updatedAt: new Date().toISOString() //BORRAR EN CASO DE

    };

      await this.request('POST', this.apiUrl, nuevoUsuario);
      this.mensajeError = '';
    } catch (error) {
       throw error;
    }
  }

  async revUserExistente(usuario: string): Promise<boolean> {

    try {
    const usuarios: UserApi[] = await this.request<UserApi[]>('GET', this.apiUrl);
    return usuarios.some(u => u.usuario === usuario);
  }catch(error){
    this.mensajeError = 'Error al verificar si el nombre de usuario existe, intentalo mas tarde';
    throw error;
  }
  }

  salirsesion(): void {
    this.usuarioCompletoSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.loginFailedSubject.next(false);
    localStorage.clear();
  }

  public restaorarSesion() {
    const storedUser = localStorage.getItem('usuario');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (storedUser && isAuthenticated ) {
      const user: UserApi = JSON.parse(storedUser);
      this.usuarioCompletoSubject.next(user)
      this.isAuthenticatedSubject.next(true);
    }
  }
  private guardarsesion(usuario: UserApi) {
    localStorage.setItem('user', JSON.stringify(usuario));
    localStorage.setItem('isAuthenticated', 'true');
  }





  private async request<T>(method: string, url: string, body?: any): Promise<T> {
    try {
    switch (method) {
      case 'GET':
        return await lastValueFrom(this.http.get<T>(url));
      case 'POST':
        return await lastValueFrom(this.http.post<T>(url, body));
      default:
        throw new Error(`ERROR ${method}`);
    }
  }catch (error) {
    this.mensajeError = 'Error al conectar con el API, intentalo mas tarde';
    throw error;
    }
  }

}








