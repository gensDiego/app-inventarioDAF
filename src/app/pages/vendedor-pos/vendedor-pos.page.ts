import { Component, OnInit } from '@angular/core';
import { VposService } from '../../services/vpos.service';
import { AlertController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-vendedor-pos',
  templateUrl: './vendedor-pos.page.html',
  styleUrls: ['./vendedor-pos.page.scss'],
})
export class VendedorPosPage implements OnInit {
  userId!: number | null;
  userRol!: number | null;
  ID_Producto!: number;
  Cantidad!: number;
  ID_Metodo_Pago!: number;
  productos: any[] = [];
  detalleCarrito: any[] = [];
  totalGeneral: number = 0;
  codigoCliente!: number;
  metodosPago: { ID_Metodo_Pago: number, Nombre: string }[] = [
    { ID_Metodo_Pago: 1, Nombre: 'Tarjeta de crédito' },
    { ID_Metodo_Pago: 2, Nombre: 'Tarjeta de débito' },
    { ID_Metodo_Pago: 3, Nombre: 'Efectivo' },
    { ID_Metodo_Pago: 4, Nombre: 'Transferencia bancaria' }
  ];
  userID!: number | null;

  constructor(
    private vposService: VposService,
    private alertController: AlertController,
    private authService: AuthService, 
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.reloadPage();
    });
  }

  ngOnInit() {
    this.userRol = this.authService.getUserRol();
    this.userID = this.authService.getUserId();
    console.log('User ID on init:', this.userID); // Log to ensure userID is being set
    this.loadProducts();
    this.loadCarrito();
    const userRol = this.authService.getUserRol();
    console.log('Rol del usuario:', userRol);
  }

  reloadPage() {
    this.loadProducts();
    this.loadCarrito();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  loadProducts() {
    this.vposService.getProducts().subscribe((data: any[]) => {
      this.productos = data;
    });
  }

  loadCarrito() {
    if (!this.userID) return;

    this.vposService.obtenerDetalleCarrito(this.userID).subscribe((data: any[]) => {
      this.detalleCarrito = data;
      this.totalGeneral = data.reduce((total, item) => total + item.total, 0);
    });
  }

  incrementarCantidad(item: any) {
    this.vposService.agregarProductoCarrito(this.userID!, item.ID_Producto, 1).subscribe(
      async () => {
        this.loadCarrito();
      },
      async (error) => {
        console.error('Error al incrementar cantidad:', error);
        await this.showAlert('Error', 'No se pudo incrementar la cantidad: ' + this.getErrorMessage(error));
      }
    );
  }

  decrementarCantidad(item: any) {
    if (item.Cantidad > 1) {
      this.vposService.agregarProductoCarrito(this.userID!, item.ID_Producto, -1).subscribe(
        async () => {
          this.loadCarrito();
        },
        async (error) => {
          console.error('Error al decrementar cantidad:', error);
          await this.showAlert('Error', 'No se pudo decrementar la cantidad: ' + this.getErrorMessage(error));
        }
      );
    } else {
      this.vposService.eliminarProductoCarrito(this.userID!, item.ID_Producto).subscribe(
        async () => {
          this.loadCarrito();
        },
        async (error) => {
          console.error('Error al eliminar producto:', error);
          await this.showAlert('Error', 'No se pudo eliminar el producto: ' + this.getErrorMessage(error));
        }
      );
    }
  }

  async crearCarrito() {
    console.log('Crear Carrito - Usuario ID:', this.userID);
    if (!this.userID) {
      const errorMessage = 'Usuario no autenticado';
      console.error(errorMessage);
      await this.showAlert('Error', errorMessage);
      return;
    }
    this.vposService.crearCarrito(this.userID).subscribe(
      async (response) => {
        console.log('Carrito creado:', response);
        await this.showAlert('Éxito', 'Carrito creado correctamente');
        this.loadCarrito();
      },
      async (error) => {
        console.error('Error al crear carrito:', error);
        await this.showAlert('Error', 'No se pudo crear el carrito: ' + this.getErrorMessage(error));
      }
    );
  }

  async agregarProducto() {
    const productData = { ID_Producto: this.ID_Producto, Cantidad: this.Cantidad, userID: this.userID };
    console.log('Agregar Producto - Data:', productData);
    if (!this.userID || !this.ID_Producto || !this.Cantidad) {
      const errorMessage = 'Selecciona un producto y su cantidad a agregar';
      console.error(errorMessage);
      await this.showAlert('Error', errorMessage);
      return;
    }
    this.vposService.agregarProductoCarrito(this.userID!, this.ID_Producto, this.Cantidad).subscribe(
      async () => {
        console.log('Producto agregado al carrito');
        await this.showAlert('Éxito', 'Producto agregado correctamente');
        this.loadCarrito();
      },
      async (error) => {
        console.error('Error al agregar producto:', error);
        await this.showAlert('Error', 'No se pudo agregar el producto: ' + this.getErrorMessage(error));
      }
    );
  }

  async finalizarVenta() {
    console.log('Finalizar Venta - Data:', { ID_Metodo_Pago: this.ID_Metodo_Pago, userID: this.userID });
    if (!this.userID) {
      await this.showAlert('Error', 'Usuario no autenticado');
      return;
    }

    if (this.detalleCarrito.length === 0) {
      await this.showAlert('Error', 'No hay productos en el carrito para generar la venta');
      return;
    }

    if (!this.ID_Metodo_Pago) {
      await this.showAlert('Error', 'Por favor elige tu método de pago');
      return;
    }

    this.vposService.finalizarVenta(this.userID, this.ID_Metodo_Pago).subscribe(
      async () => {
        console.log('Venta finalizada');
        await this.showAlert('Éxito', 'Venta finalizada correctamente');
        this.loadCarrito();
      },
      async (error) => {
        console.error('Error al finalizar venta:', error);
        await this.showAlert('Error', 'No se pudo finalizar la venta: ' + this.getErrorMessage(error));
      }
    );
  }

  async aplicarCodigoCliente() {
    console.log('Aplicar Código - Código Cliente:', this.codigoCliente);
    if (!this.codigoCliente) {
      const errorMessage = 'El código de cliente es obligatorio';
      console.error(errorMessage);
      await this.showAlert('Error', errorMessage);
      return;
    }
    if (!this.userID) {
      const errorMessage = 'Usuario no autenticado';
      console.error(errorMessage);
      await this.showAlert('Error', errorMessage);
      return;
    }
    this.vposService.aplicarCodigoCarrito(this.codigoCliente, this.userID!).subscribe(
      async (response) => {
        console.log('Código aplicado:', response);
        await this.showAlert('Éxito', 'Código aplicado correctamente');
        this.loadCarrito();
      },
      async (error) => {
        console.error('Error al aplicar código:', error);
        const errorMessage = this.getErrorMessage(error);
        await this.showAlert('Error', 'No se pudo aplicar el código: ' + errorMessage);
      }
    );
  }

  navigateAndReload(route: string) {
    this.router.navigate([route]).then(() => {
      window.location.reload();
    });
  }

  resetForm() {
    this.ID_Producto = null!;
    this.Cantidad = null!;
    this.ID_Metodo_Pago = null!;
    this.codigoCliente = null!;
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  private getErrorMessage(error: any): string {
    if (error.error && error.error.message) {
      return error.error.message;
    }
    return 'Ocurrió un error inesperado';
  }
}
