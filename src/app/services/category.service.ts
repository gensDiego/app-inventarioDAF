import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  listarCategorias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  agregarCategoria(categoriaData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories`, categoriaData).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  editarCategoria(categoriaData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/categories`, categoriaData).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  eliminarCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories`, { body: { ID_Categoria: id } }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}
