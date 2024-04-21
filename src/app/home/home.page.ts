import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router,
             private toastController: ToastController) {}

register() {
  this.authService.register(this.username, this.password);
  this.presentToast();
}

async presentToast() {
  const toast = await this.toastController.create({
    message: 'Usuario creado',
    duration: 2000, // Duración del mensaje en milisegundos
    position: 'top' // Posición del mensaje en la pantalla ('top', 'bottom' o 'middle')
  });
  toast.present();
}

login() {
  this.authService.login(this.username, this.password);
  if (!this.authService.isAuthenticated()) {
    this.presentErrorToast();
  } else {
    this.router.navigate(['/bienvenido']);
  }
}

async presentErrorToast() {
  const toast = await this.toastController.create({
    message: 'Error: Usuario no registrado',
    duration: 2000,
    position: 'top'
  });
  toast.present();
}
}