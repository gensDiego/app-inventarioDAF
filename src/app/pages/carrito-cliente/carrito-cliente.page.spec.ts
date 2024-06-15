import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoClientePage } from './carrito-cliente.page';

describe('CarritoClientePage', () => {
  let component: CarritoClientePage;
  let fixture: ComponentFixture<CarritoClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarritoClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
