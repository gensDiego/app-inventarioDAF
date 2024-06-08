// src/app/bienvenido/bienvenido.page.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Importa el servicio AuthService
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.page.html',
  styleUrls: ['./bienvenido.page.scss'],
})
export class BienvenidoPage implements OnInit {
  products: any[] = [];
  currentUser = { username: 'Usuario' }; // Ajusta esto según la lógica de tu aplicación

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.authService.getProducts().subscribe(
      (response) => {
        this.products = response;
      },
      async (error) => {
        console.error('Error al obtener productos:', error);
        await this.showAlert('Error', 'No se pudieron cargar los productos');
      }
    );
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
