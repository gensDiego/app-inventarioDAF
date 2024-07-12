import { Component, OnInit } from '@angular/core';
import { PriceService } from '../../services/price.service';
import { AuthService } from '../../services/auth.service'; // Importar AuthService
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.page.html',
  styleUrls: ['./crear-producto.page.scss'],
})
export class CrearProductoPage implements OnInit {
  precios: any[] = [];
  precioSeleccionado: number | null = null; // Variable para almacenar el ID del precio seleccionado
  isModalOpen = false;
  isEditMode = false;
  precioActual: any = {
    InicioVigencia: '',
    FinVigencia: '',
    Precio: null
  };
  today: string;
  maxDate: string;
  userRol: number | null = null;

  constructor(
    private priceService: PriceService,
    private authService: AuthService, // Añadir AuthService al constructor
    private alertController: AlertController,
    private router: Router
  ) {
    const currentDate = new Date();
    this.today = this.formatDate(currentDate.toISOString())!;
    const futureDate = new Date();
    futureDate.setFullYear(currentDate.getFullYear() + 10);
    this.maxDate = this.formatDate(futureDate.toISOString())!;
  }

  ngOnInit() {
    this.listarPrecios();
  }

  listarPrecios() {
    this.priceService.listarPrecios().subscribe(data => {
      console.log(data);
      this.precios = data.map((precio: any) => {
        return {
          ...precio,
          InicioVigencia: this.formatDate(precio.InicioVigencia),
          FinVigencia: this.formatDate(precio.FinVigencia)
        };
      });
    });
  }

  agregarPrecio() {
    this.isEditMode = false;
    this.precioActual = {
      InicioVigencia: this.today,
      FinVigencia: null,
      Precio: null
    };
    this.isModalOpen = true;
  }

  editarPrecio(precio: any) {
    this.isEditMode = true;
    this.precioActual = {
      ID_Historial: precio.ID_Historial,
      InicioVigencia: this.formatDate(precio.InicioVigencia),
      FinVigencia: this.formatDate(precio.FinVigencia),
      Precio: precio.Precio
    };
    this.isModalOpen = true;
  }

  formatDate(dateString: string): string | null {
    if (!dateString) {
      return null;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD
  }

  async guardarPrecio() {
    try {
      // Formatear las fechas antes de enviarlas a la API
      this.precioActual.InicioVigencia = this.formatDate(this.precioActual.InicioVigencia);
      this.precioActual.FinVigencia = this.formatDate(this.precioActual.FinVigencia);

      console.log("Datos enviados a la API:", this.precioActual); // Imprime los datos en la consola

      if (this.isEditMode) {
        await this.priceService.editarPrecio(this.precioActual).toPromise();
      } else {
        await this.priceService.agregarPrecio(this.precioActual).toPromise();
      }
      this.presentAlert('Éxito', `Precio ${this.isEditMode ? 'editado' : 'agregado'} correctamente`);
      this.listarPrecios();
      this.closeModal();
    } catch (error) {
      console.error(error);
      this.presentAlert('Error', `Hubo un problema al ${this.isEditMode ? 'editar' : 'agregar'} el precio`);
    }
  }

  async eliminarPrecio(id: number) {
    try {
      await this.priceService.eliminarPrecio(id).toPromise();
      this.presentAlert('Éxito', 'Precio eliminado correctamente');
      this.listarPrecios();
    } catch (error) {
      console.error(error);
      this.presentAlert('Error', 'Hubo un problema al eliminar el precio');
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
    if (this.precioSeleccionado !== null) {
      localStorage.setItem('precioSeleccionado', this.precioSeleccionado.toString());
      this.router.navigate(['/category']);
    } else {
      this.presentAlert('Error', 'Por favor selecciona un precio antes de continuar');
    }
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
