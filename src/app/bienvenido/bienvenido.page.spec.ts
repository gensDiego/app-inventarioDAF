import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BienvenidoPage } from './bienvenido.page';

describe('BienvenidoPage', () => {
  let component: BienvenidoPage;
  let fixture: ComponentFixture<BienvenidoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BienvenidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
