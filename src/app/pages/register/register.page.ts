import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Importa el servicio AuthService
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router'; // Importa Router para la navegación

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerFormData = {
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private alertController: AlertController, // Inyecta AlertController
    private router: Router // Inyecta Router
  ) { }

  ngOnInit() {
    console.log('Componente RegisterPage inicializado');
  }

  async register() {
    console.log('Datos del formulario:', this.registerFormData);

    // Validar que todas las variables requeridas estén presentes
    if (!this.registerFormData.firstName || !this.registerFormData.lastName || !this.registerFormData.birthDate || !this.registerFormData.email || !this.registerFormData.password) {
      await this.showAlert('Error', 'Faltan datos requeridos');
      return;
    }

    this.authService.register(this.registerFormData).subscribe(
      async (response) => {
        console.log('Registro exitoso:', response);
        await this.showAlert('Éxito', 'Usuario registrado exitosamente');
        this.resetForm(); // Llamar a resetForm para limpiar los campos
        this.router.navigate(['/home']); // Redirigir al usuario a la página de inicio
      },
      async (error) => {
        console.error('Error al registrar usuario:', error);
        if (error.status === 400) {
          await this.showAlert('Error', 'Correo electrónico duplicado');
          this.resetForm();
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

  // Método para limpiar los campos del formulario
  resetForm() {
    this.registerFormData = {
      firstName: '',
      lastName: '',
      birthDate: '',
      email: '',
      password: ''
    };
  }
}
