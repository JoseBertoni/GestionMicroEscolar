import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Chico, ChicoRequest } from '../models/chico.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChicosService {
  private readonly baseUrl = `${environment.apiUrl}/Chico`;

  constructor(private http: HttpClient) {}

  obtenerChicos(): Observable<Chico[]> {
    return this.http.get<Chico[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  crearChico(chico: ChicoRequest): Observable<Chico> {
    return this.http.post<Chico>(this.baseUrl, chico).pipe(
      catchError(this.handleError)
    );
  }

  eliminarChico(dni: string): Observable<any> {
    const url = `${this.baseUrl}/${dni}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  modificarChico(dni: string, chico: ChicoRequest): Observable<Chico> {
    const url = `${this.baseUrl}/${dni}`;
    return this.http.put<Chico>(url, chico).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en ChicosService:', error);
    return throwError(() => new Error(error.message || 'Error del servidor'));
  }
}
