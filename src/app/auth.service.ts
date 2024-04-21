import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private currentUser: any;

  constructor() { }

  register(username: string, password: string) {
    // Simplemente almacenamos el usuario en este ejemplo básico
    this.currentUser = { username, password };
    this.isLoggedIn = true; // Una vez registrado, consideramos al usuario como autenticado
  }

  login(username: string, password: string) {
    // Verificamos si las credenciales coinciden con el usuario registrado
    if (this.currentUser && this.currentUser.username === username && this.currentUser.password === password) {
      this.isLoggedIn = true; // Si coinciden, consideramos al usuario como autenticado
    } else {
      this.isLoggedIn = false; // Si no coinciden, el usuario no está autenticado
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return this.isLoggedIn;
  }
}