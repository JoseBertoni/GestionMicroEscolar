import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Micro, MicroRequest } from '../models/micro.model';

@Injectable({ providedIn: 'root' })
export class MicrosService {
  private readonly baseUrl = '/api/Micro';

  constructor(private http: HttpClient) {}

  obtenerMicros(): Observable<Micro[]> {
    return this.http.get<Micro[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  crearMicro(micro: MicroRequest): Observable<Micro> {
    return this.http.post<Micro>(this.baseUrl, micro).pipe(
      catchError(this.handleError)
    );
  }

  eliminarMicro(patente: string): Observable<any> {
    const url = `${this.baseUrl}/${encodeURIComponent(patente)}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.message || 'Error del servidor'));
  }
}
