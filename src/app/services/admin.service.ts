import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/usuarios`).pipe(
      map(response => response.usuarios), // Ahora solo obtenemos 'usuarios' del objeto de respuesta
      catchError((error) => {
        console.error('Error en getUsuarios:', error);
        return throwError(error);
      })
    );
  }

  actualizarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario/actualizar`, usuario).pipe(
      catchError((error) => {
        console.error('Error en actualizarUsuario:', error);
        return throwError(error);
      })
    );
  }
}
