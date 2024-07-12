import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { VposService } from '../services/vpos.service';

@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.page.html',
  styleUrls: ['./bienvenido.page.scss'],
})
export class BienvenidoPage implements OnInit {
  userId!: number | null;
  userRol!: number | null;
  products: any[] = [];
  detalleCarrito: any[] = [];
  totalGeneral: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private vposService: VposService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.userRol = this.authService.getUserRol();
    this.loadProducts();
    this.loadCarrito();
  }

  loadProducts() {
    this.vposService.getProducts().subscribe((data: any[]) => {
      this.products = data.map(product => ({ ...product, Cantidad: 1 }));
    });
  }

  loadCarrito() {
    if (!this.userId) return;

    this.vposService.obtenerDetalleCarrito(this.userId).subscribe((data: any[]) => {
      this.detalleCarrito = data;
      this.totalGeneral = data.reduce((total, item) => total + item.total, 0);
    });
  }

  async agregarProducto(product: any) {
    if (!this.userId) {
      await this.showAlert('Error', 'Usuario no autenticado');
      return;
    }

    this.vposService.agregarProductoCarrito(this.userId, product.ID_Producto, product.Cantidad).subscribe(
      async () => {
        await this.showAlert('Éxito', 'Producto agregado al carrito correctamente');
        this.loadCarrito();
      },
      async (error) => {
        console.error('Error al agregar producto al carrito:', error);
        await this.showAlert('Error', 'No se pudo agregar el producto al carrito: ' + error);
      }
    );
  }

  async quitarProducto(product: any) {
    if (!this.userId) {
      await this.showAlert('Error', 'Usuario no autenticado');
      return;
    }

    this.vposService.agregarProductoCarrito(this.userId, product.ID_Producto, -product.Cantidad).subscribe(
      async () => {
        await this.showAlert('Éxito', 'Producto quitado del carrito correctamente');
        this.loadCarrito();
      },
      async (error) => {
        console.error('Error al quitar producto del carrito:', error);
        await this.showAlert('Error', 'No se pudo quitar el producto del carrito: ' + error);
      }
    );
  }

  navigateAndReload(route: string) {
    this.router.navigate([route]).then(() => {
      window.location.reload();
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
