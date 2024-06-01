import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendedorPOSPage } from './vendedor-pos.page';

describe('VendedorPOSPage', () => {
  let component: VendedorPOSPage;
  let fixture: ComponentFixture<VendedorPOSPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VendedorPOSPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
