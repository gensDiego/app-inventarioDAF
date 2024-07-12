import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'bienvenido',
    loadChildren: () => import('./bienvenido/bienvenido.module').then( m => m.BienvenidoPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'stock',
    loadChildren: () => import('./pages/stock/stock.module').then( m => m.StockPageModule)
  },
  {
    path: 'vendedor-pos',
    loadChildren: () => import('./pages/vendedor-pos/vendedor-pos.module').then( m => m.VendedorPosPageModule)
  },
  {
    path: 'reporte',
    loadChildren: () => import('./pages/reporte/reporte.module').then( m => m.ReportePageModule)
  },
  {
    path: 'carrito-cliente',
    loadChildren: () => import('./pages/carrito-cliente/carrito-cliente.module').then( m => m.CarritoClientePageModule)
  },  {
    path: 'control',
    loadChildren: () => import('./pages/control/control.module').then( m => m.ControlPageModule)
  },
  {
    path: 'crear-producto',
    loadChildren: () => import('./pages/crear-producto/crear-producto.module').then( m => m.CrearProductoPageModule)
  },
  {
    path: 'category',
    loadChildren: () => import('./pages/category/category.module').then( m => m.CategoryPageModule)
  },
  {
    path: 'producto',
    loadChildren: () => import('./pages/producto/producto.module').then( m => m.ProductoPageModule)
  }







];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
