import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Chofer, ChoferRequest } from '../models/chofer.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChoferesService {
  private readonly baseUrl = `${environment.apiUrl}/Chofer`;

  constructor(private http: HttpClient) {}

  obtenerChoferes(): Observable<Chofer[]> {
    return this.http.get<Chofer[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  crearChofer(chofer: ChoferRequest): Observable<Chofer> {
    return this.http.post<Chofer>(this.baseUrl, chofer).pipe(
      catchError(this.handleError)
    );
  }

  eliminarChofer(dni: string): Observable<any> {
    const url = `${this.baseUrl}/${dni}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  modificarChofer(dni: string, chofer: ChoferRequest): Observable<Chofer> {
    const url = `${this.baseUrl}/${dni}`;
    return this.http.put<Chofer>(url, chofer).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.message || 'Error del servidor'));
  }
}
