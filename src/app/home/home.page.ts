import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  loginFormData = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Componente HomePage inicializado');
  }

  async login() {
    console.log('Datos del formulario:', this.loginFormData);

    // Validar que todas las variables requeridas estén presentes
    if (!this.loginFormData.email || !this.loginFormData.password) {
      await this.showAlert('Error', 'Faltan datos requeridos');
      return;
    }

    this.authService.login(this.loginFormData).subscribe(
      async (response) => {
        console.log('Inicio de sesión exitoso:', response);
        // Guardar el token en el almacenamiento local o en una variable global
        localStorage.setItem('token', response.token);

        // Obtener el rol del usuario
        const userRol = this.authService.getUserRol();
        console.log('Rol del usuario:', userRol);

        // Redirigir al usuario a la página correspondiente según el rol
        if (userRol === 1) {
          this.router.navigate(['/stock']);
        } else if (userRol === 2) {
          this.router.navigate(['/vendedor-pos']);
        } else if (userRol === 3) {
          this.router.navigate(['/bienvenido']);
        } else {
          // Manejar el caso donde el rol no es reconocido
          await this.showAlert('Error', 'Rol de usuario no reconocido');
        }
      },
      async (error) => {
        console.error('Error al iniciar sesión:', error);
        if (error.status === 401) {
          await this.showAlert('Error', 'Credenciales inválidas');
        } else if (error.status === 403) {
          await this.showAlert('Error', 'Usuario inactivo');
        } else {
          await this.showAlert('Error', 'Error en el servidor');
        }
      }
    );
  }

  // Método para mostrar una alerta
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
