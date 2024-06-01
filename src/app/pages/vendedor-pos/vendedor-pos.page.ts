import { Component, OnInit } from '@angular/core';
import { VposService } from '../../services/vpos.service';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vendedor-pos',
  templateUrl: './vendedor-pos.page.html',
  styleUrls: ['./vendedor-pos.page.scss'],
})
export class VendedorPosPage implements OnInit {
  ID_Producto!: number;
  Cantidad!: number;
  ID_Metodo_Pago!: number;
  productos: any[] = [];
  detalleCarrito: any[] = [];
  totalGeneral: number = 0;
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
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.userID = this.authService.getUserId();
    this.loadCarrito();
    console.log('User ID on init:', this.userID); // Log to ensure userID is being set
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

  async finalizarVenta() {
    const ventaData = { ID_Metodo_Pago: this.ID_Metodo_Pago, userID: this.userID };
    console.log('Finalizar Venta - Data:', ventaData);
    if (!this.userID || !this.ID_Metodo_Pago) {
      const errorMessage = 'Todos los campos son obligatorios';
      console.error(errorMessage);
      await this.showAlert('Error', errorMessage);
      return;
    }
    this.vposService.finalizarVenta(this.userID!, this.ID_Metodo_Pago).subscribe(
      async () => {
        console.log('Venta finalizada');
        await this.showAlert('Éxito', 'Venta finalizada correctamente');
        this.loadCarrito();
      },
      async (error) => {
        console.error('Error al finalizar venta:', error);
        await this.showAlert('Error', 'No se pudo finalizar la venta: ' + JSON.stringify({ ...ventaData, error: error.message }));
      }
    );
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

