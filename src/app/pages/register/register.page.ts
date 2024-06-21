import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Importa el servicio AuthService
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router'; // Importa Router para la navegación
import { NgForm } from '@angular/forms';

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

  async onSubmit(registerForm: NgForm) {
    if (registerForm.valid) {
      this.register();
    } else {
      const errors = [];
      if (!registerForm.controls['firstName']?.valid) {
        errors.push('Nombre es requerido.');
      }
      if (!registerForm.controls['lastName']?.valid) {
        errors.push('Apellido es requerido.');
      }
      if (!registerForm.controls['birthDate']?.valid) {
        errors.push('Fecha de Nacimiento es requerida.');
      }
      if (!registerForm.controls['email']?.valid) {
        errors.push('Correo Electrónico es requerido y debe ser válido.');
      }
      if (!registerForm.controls['password']?.valid) {
        errors.push('Contraseña es requerida y debe tener al menos 8 caracteres.');
      }

      const errorMessage = errors.join('\n');
      await this.showAlert('Error', errorMessage);
      registerForm.control.markAllAsTouched(); // Para mostrar mensajes de error
    }
  }

  async register() {
    console.log('Datos del formulario:', this.registerFormData);

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
