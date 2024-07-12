import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { AuthService } from '../../services/auth.service'; // Importar AuthService
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {
  productos: any[] = [];
  productoSeleccionado: number | null = null; // Variable para almacenar el ID del producto seleccionado
  isModalOpen = false;
  isEditMode = false;
  productoActual: any = {
    Nombre: '',
    Sku: '',
    Marca: '',
    ID_Categoria: null,
    ID_Historial_Precios: null,
    Imagen: ''
  };
  userRol: number | null = null;
  selectedFile: File | null = null;

  constructor(
    private productosService: ProductosService,
    private authService: AuthService, // Añadir AuthService al constructor
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.listarProductos();
    this.userRol = this.authService.getUserRol(); // Obtener el rol del usuario
    this.setearIDs();
  }

  setearIDs() {
    const precioSeleccionado = localStorage.getItem('precioSeleccionado');
    const categoriaSeleccionada = localStorage.getItem('categoriaSeleccionada');
    if (precioSeleccionado) {
      this.productoActual.ID_Historial_Precios = +precioSeleccionado;
    }
    if (categoriaSeleccionada) {
      this.productoActual.ID_Categoria = +categoriaSeleccionada;
    }
  }

  listarProductos() {
    this.productosService.listarProductos().subscribe(data => {
      this.productos = data;
    });
  }

  agregarProducto() {
    this.isEditMode = false;
    this.productoActual = {
      Nombre: '',
      Sku: '',
      Marca: '',
      ID_Categoria: this.productoActual.ID_Categoria,
      ID_Historial_Precios: this.productoActual.ID_Historial_Precios,
      Imagen: ''
    };
    this.isModalOpen = true;
  }

  editarProducto(producto: any) {
    this.isEditMode = true;
    this.productoActual = { ...producto };
    this.isModalOpen = true;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.productoActual.Imagen = `../assets/Products/${this.selectedFile.name}`;
      }
    }
  }

  async guardarProducto() {
    try {
      if (this.isEditMode) {
        await this.productosService.editarProducto(this.productoActual).toPromise();
      } else {
        if (this.selectedFile) {
          this.productoActual.Imagen = `../assets/Products/${this.selectedFile.name}`;
        } else {
          this.productoActual.Imagen = '';
        }
        await this.productosService.agregarProducto(this.productoActual).toPromise();
      }
      this.presentAlert('Éxito', `Producto ${this.isEditMode ? 'editado' : 'agregado'} correctamente`);
      this.listarProductos();
      this.closeModal();
    } catch (error) {
      console.error(error);
      this.presentAlert('Error', `Hubo un problema al ${this.isEditMode ? 'editar' : 'agregar'} el producto`);
    }
  }

  async eliminarProducto(id: number) {
    try {
      await this.productosService.eliminarProducto(id).toPromise();
      this.presentAlert('Éxito', 'Producto eliminado correctamente');
      this.listarProductos();
    } catch (error) {
      console.error(error);
      this.presentAlert('Error', 'Hubo un problema al eliminar el producto');
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  siguientePaso() {
    if (this.productoSeleccionado !== null) {
      localStorage.setItem('productoSeleccionado', this.productoSeleccionado.toString());
      // Aquí puedes redirigir a la siguiente página si es necesario
    } else {
      this.presentAlert('Error', 'Por favor selecciona un producto antes de continuar');
    }
  }

  volverPaso() {
    this.router.navigate(['/crear-producto']);
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
}
