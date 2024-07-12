import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  listarProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos`).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  agregarProducto(productoData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos`, productoData).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  editarProducto(productoData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos`, productoData).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos`, { body: { ID_Producto: id } }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}
