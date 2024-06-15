import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarritoClientePageRoutingModule } from './carrito-cliente-routing.module';

import { CarritoClientePage } from './carrito-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarritoClientePageRoutingModule
  ],
  declarations: [CarritoClientePage]
})
export class CarritoClientePageModule {}
