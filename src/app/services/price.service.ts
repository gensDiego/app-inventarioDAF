import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PriceService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  listarPrecios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/prices`).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  agregarPrecio(precioData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/prices`, precioData).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  editarPrecio(precioData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/prices`, precioData).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  eliminarPrecio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/prices`, { body: { ID_Historial: id } }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}
