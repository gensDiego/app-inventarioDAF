import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarritoClientePage } from './carrito-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: CarritoClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarritoClientePageRoutingModule {}
