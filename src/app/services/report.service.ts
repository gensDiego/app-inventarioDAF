import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  getResumenVentasPorProducto(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reportes/ventas-producto?startDate=${startDate}&endDate=${endDate}`).pipe(
      catchError((error) => {
        console.error('Error en getResumenVentasPorProducto:', error);
        return throwError(error);
      })
    );
  }

  getResumenVentasPorUsuario(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reportes/ventas-usuario?startDate=${startDate}&endDate=${endDate}`).pipe(
      catchError((error) => {
        console.error('Error en getResumenVentasPorUsuario:', error);
        return throwError(error);
      })
    );
  }

  getVentasDetalladasPorPeriodo(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reportes/ventas-detalladas?startDate=${startDate}&endDate=${endDate}`).pipe(
      catchError((error) => {
        console.error('Error en getVentasDetalladasPorPeriodo:', error);
        return throwError(error);
      })
    );
  }

  getVentasTotalesPorPeriodo(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reportes/ventas-totales?startDate=${startDate}&endDate=${endDate}`).pipe(
      catchError((error) => {
        console.error('Error en getVentasTotalesPorPeriodo:', error);
        return throwError(error);
      })
    );
  }
}
