import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendedorPosPage } from './vendedor-pos.page';

const routes: Routes = [
  {
    path: '',
    component: VendedorPosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendedorPOSPageRoutingModule {}
