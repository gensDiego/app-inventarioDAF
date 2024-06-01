import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class VposService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  crearCarrito(ID_Usuario: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/create`, { ID_Usuario }).pipe(
      catchError((error) => {
        console.error('Error en crearCarrito:', error);
        return throwError(error);
      })
    );
  }

  agregarProductoCarrito(ID_Usuario: number, ID_Producto: number, Cantidad: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/add`, { ID_Usuario, ID_Producto, Cantidad }).pipe(
      catchError((error) => {
        console.error('Error en agregarProductoCarrito:', error);
        return throwError(error);
      })
    );
  }

  finalizarVenta(ID_Usuario: number, ID_Metodo_Pago: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/checkout`, { ID_Usuario, ID_Metodo_Pago }).pipe(
      catchError((error) => {
        console.error('Error en finalizarVenta:', error);
        return throwError(error);
      })
    );
  }

  buscarProductos(term: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/search?term=${term}`).pipe(
      catchError((error) => {
        console.error('Error en buscarProductos:', error);
        return throwError(error);
      })
    );
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`).pipe(
      catchError((error) => {
        console.error('Error en getProducts:', error);
        return throwError(error);
      })
    );
  }

  obtenerDetalleCarrito(ID_Usuario: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart/details/${ID_Usuario}`).pipe(
      catchError((error) => {
        console.error('Error en obtenerDetalleCarrito:', error);
        return throwError(error);
      })
    );
  }
}
