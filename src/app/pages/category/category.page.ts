import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  categorias: any[] = [];
  categoriaSeleccionada: number | null = null; // Variable para almacenar el ID de la categoría seleccionada
  isModalOpen = false;
  isEditMode = false;
  categoriaActual: any = {
    Nombre: ''
  };
  userRol: number | null = null;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.userRol = this.authService.getUserRol();
    this.listarCategorias();
  }

  listarCategorias() {
    this.categoryService.listarCategorias().subscribe(data => {
      console.log(data);
      this.categorias = data;
    });
  }

  agregarCategoria() {
    this.isEditMode = false;
    this.categoriaActual = {
      Nombre: ''
    };
    this.isModalOpen = true;
  }

  editarCategoria(categoria: any) {
    this.isEditMode = true;
    this.categoriaActual = {
      ID_Categoria: categoria.ID_Categoria,
      Nombre: categoria.Nombre
    };
    this.isModalOpen = true;
  }

  async guardarCategoria() {
    try {
      console.log("Datos enviados a la API:", this.categoriaActual);

      if (this.isEditMode) {
        await this.categoryService.editarCategoria(this.categoriaActual).toPromise();
      } else {
        await this.categoryService.agregarCategoria(this.categoriaActual).toPromise();
      }
      this.presentAlert('Éxito', `Categoría ${this.isEditMode ? 'editada' : 'agregada'} correctamente`);
      this.listarCategorias();
      this.closeModal();
    } catch (error) {
      console.error(error);
      this.presentAlert('Error', `Hubo un problema al ${this.isEditMode ? 'editar' : 'agregar'} la categoría`);
    }
  }

  async eliminarCategoria(id: number) {
    try {
      await this.categoryService.eliminarCategoria(id).toPromise();
      this.presentAlert('Éxito', 'Categoría eliminada correctamente');
      this.listarCategorias();
    } catch (error) {
      console.error(error);
      this.presentAlert('Error', 'Hubo un problema al eliminar la categoría');
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
    if (this.categoriaSeleccionada !== null) {
      localStorage.setItem('categoriaSeleccionada', this.categoriaSeleccionada.toString());
      this.router.navigate(['/producto']);
    } else {
      this.presentAlert('Error', 'Por favor selecciona una categoría antes de continuar');
    }
  }

  volver() {
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
