import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AlertController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.page.html',
  styleUrls: ['./control.page.scss'],
})
export class ControlPage implements OnInit {
  userId!: number | null;
  userRol!: number | null;
  usuarios: any[] = [];
  roles: any[] = [
    { ID_Rol: 1, Nombre_rol: 'admin' },
    { ID_Rol: 2, Nombre_rol: 'vendedor' },
    { ID_Rol: 3, Nombre_rol: 'cliente' }
  ];
  estados: any[] = [
    { ID_Estado: 1, Estado_usuario: 'activo' },
    { ID_Estado: 2, Estado_usuario: 'inactivo' }
  ];

  constructor(
    private adminService: AdminService,
    private alertController: AlertController,
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.reloadPage();
    });
  }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.userRol = this.authService.getUserRol();
    
    if (this.userRol !== 1) {
      this.presentAlert('Acceso denegado', 'No tienes permiso para acceder a esta página.');
      this.router.navigate(['/home']); // Redirige al usuario a la página de inicio
    } else {
      this.getUsuarios();
    }
  }

  reloadPage() {
    this.getUsuarios();
  }

  getUsuarios() {
    this.adminService.getUsuarios().subscribe(data => {
      console.log('Usuarios recibidos:', data); // Verificar los datos recibidos
      if (Array.isArray(data)) {
        this.usuarios = data;
      } else {
        console.error('La respuesta de la API no es un array:', data);
      }
    });
  }

  actualizarUsuario(usuario: any) {
    this.adminService.actualizarUsuario(usuario).subscribe(
      async () => {
        await this.presentAlert('Éxito', 'Usuario actualizado correctamente');
      },
      async error => {
        await this.presentAlert('Error', 'Hubo un problema al actualizar el usuario');
        console.error(error);
      }
    );
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
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
