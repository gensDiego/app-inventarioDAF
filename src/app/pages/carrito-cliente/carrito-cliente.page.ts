import { Component, OnInit } from '@angular/core';
import { VposService } from '../../services/vpos.service';
import { AlertController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-carrito-cliente',
  templateUrl: './carrito-cliente.page.html',
  styleUrls: ['./carrito-cliente.page.scss'],
})
export class CarritoClientePage implements OnInit {
  ID_Producto!: number;
  Cantidad!: number;
  productos: any[] = [];
  detalleCarrito: any[] = [];
  totalGeneral: number = 0;
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
    this.userID = this.authService.getUserId();
    console.log('User ID on init:', this.userID); // Log para asegurar que el userID se está estableciendo correctamente
    this.loadProducts();
    this.loadCarrito();
  }

  reloadPage() {
    this.userID = this.authService.getUserId(); // Asegúrate de que el userID se actualiza
    this.loadProducts();
    this.loadCarrito();
  }

  logout() {
    this.authService.logout();
    this.userID = null;
    this.detalleCarrito = [];
    this.totalGeneral = 0;
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
        await this.showAlert('Error', 'No se pudo incrementar la cantidad: ' + JSON.stringify(error));
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
          await this.showAlert('Error', 'No se pudo decrementar la cantidad: ' + JSON.stringify(error));
        }
      );
    } else {
      this.vposService.eliminarProductoCarrito(this.userID!, item.ID_Producto).subscribe(
        async () => {
          this.loadCarrito();
        },
        async (error) => {
          console.error('Error al eliminar producto:', error);
          await this.showAlert('Error', 'No se pudo eliminar el producto: ' + JSON.stringify(error));
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
        await this.showAlert('Error', 'No se pudo crear el carrito: ' + JSON.stringify({ ID_Usuario: this.userID, error: error.message }));
      }
    );
  }

  async agregarProducto() {
    const productData = { ID_Producto: this.ID_Producto, Cantidad: this.Cantidad, userID: this.userID };
    console.log('Agregar Producto - Data:', productData);
    if (!this.userID || !this.ID_Producto || !this.Cantidad) {
      const errorMessage = 'Todos los campos son obligatorios';
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
        await this.showAlert('Error', 'No se pudo agregar el producto: ' + JSON.stringify({ ...productData, error: error.message }));
      }
    );
  }

  async obtenerCarritoActivo() {
    return new Promise<number | null>((resolve, reject) => {
      if (!this.userID) {
        resolve(null);
      } else {
        this.vposService.obtenerDetalleCarrito(this.userID).subscribe(
          (data: any[]) => {
            if (data.length > 0) {
              resolve(data[0].ID_Carrito);
            } else {
              resolve(null);
            }
          },
          (error) => {
            console.error('Error al obtener el carrito activo:', error);
            reject(error);
          }
        );
      }
    });
  }

  async generarCodigo() {
    try {
      const carritoID = await this.obtenerCarritoActivo();
      if (!carritoID) {
        const errorMessage = 'Carrito no creado o no encontrado';
        console.error(errorMessage);
        await this.showAlert('Error', errorMessage);
        return;
      }
      this.vposService.generarEntradaCarrito(carritoID).subscribe(
        async (response) => {
          console.log('Código generado:', response);
          await this.showAlert('Éxito', response.message);
        },
        async (error) => {
          console.error('Error al generar código:', error);
          await this.showAlert('Error', 'No se pudo generar el código: ' + JSON.stringify(error));
        }
      );
    } catch (error) {
      console.error('Error al obtener el carrito activo:', error);
      await this.showAlert('Error', 'No se pudo obtener el carrito activo: ' + JSON.stringify(error));
    }
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
