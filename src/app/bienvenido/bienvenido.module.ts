import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BienvenidoPageRoutingModule } from './bienvenido-routing.module';

import { BienvenidoPage } from './bienvenido.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BienvenidoPageRoutingModule,
    SharedModule  // Asegúrate de importar el SharedModule aquí
  ],
  declarations: [BienvenidoPage]
})
export class BienvenidoPageModule {}
