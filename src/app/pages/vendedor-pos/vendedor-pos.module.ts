import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VendedorPOSPageRoutingModule } from './vendedor-pos-routing.module';
import { VendedorPosPage } from './vendedor-pos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendedorPOSPageRoutingModule
  ],
  declarations: [VendedorPosPage]
})
export class VendedorPosPageModule {}
