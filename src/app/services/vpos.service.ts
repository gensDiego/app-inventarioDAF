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
        return throwError(error.error.message || 'Error en crear carrito');
      })
    );
  }

  agregarProductoCarrito(ID_Usuario: number, ID_Producto: number, Cantidad: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/add`, { ID_Usuario, ID_Producto, Cantidad }).pipe(
      catchError((error) => {
        console.error('Error en agregarProductoCarrito:', error);
        return throwError(error.error.message || 'Error al agregar producto al carrito');
      })
    );
  }

  finalizarVenta(ID_Usuario: number, ID_Metodo_Pago: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/checkout`, { ID_Usuario, ID_Metodo_Pago }).pipe(
      catchError((error) => {
        console.error('Error en finalizarVenta:', error);
        return throwError(error.error.message || 'Error al finalizar la venta');
      })
    );
  }

  buscarProductos(term: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/search?term=${term}`).pipe(
      catchError((error) => {
        console.error('Error en buscarProductos:', error);
        return throwError(error.error.message || 'Error al buscar productos');
      })
    );
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`).pipe(
      catchError((error) => {
        console.error('Error en getProducts:', error);
        return throwError(error.error.message || 'Error al obtener productos');
      })
    );
  }

  obtenerDetalleCarrito(ID_Usuario: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart/details/${ID_Usuario}`).pipe(
      catchError((error) => {
        console.error('Error en obtenerDetalleCarrito:', error);
        return throwError(error.error.message || 'Error al obtener detalle del carrito');
      })
    );
  }

  eliminarProductoCarrito(ID_Usuario: number, ID_Producto: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/remove`, { ID_Usuario, ID_Producto }).pipe(
      catchError((error) => {
        console.error('Error en eliminarProductoCarrito:', error);
        return throwError(error.error.message || 'Error al eliminar producto del carrito');
      })
    );
  }

  generarEntradaCarrito(ID_Carrito: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/generarEntradaCarrito`, { ID_Carrito }).pipe(
      catchError((error) => {
        console.error('Error en generarEntradaCarrito:', error);
        return throwError(error.error.message || 'Error al generar entrada del carrito');
      })
    );
  }

  obtenerDetalleCarritoPorCodigo(ID_Codigo: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/obtenerDetalleCarritoPorCodigo`, { ID_Codigo }).pipe(
      catchError((error) => {
        console.error('Error en obtenerDetalleCarritoPorCodigo:', error);
        return throwError(error.error.message || 'Error al obtener detalle del carrito por código');
      })
    );
  }

  aplicarCodigoCarrito(ID_Codigo: number, ID_Vendedor: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart/aplicarCodigo`, { ID_Codigo, ID_Vendedor }).pipe(
        catchError((error) => {
            console.error('Error en aplicarCodigoCarrito:', error);
            return throwError(error.error.message || 'Error al aplicar código al carrito');
        })
    );
}
}
