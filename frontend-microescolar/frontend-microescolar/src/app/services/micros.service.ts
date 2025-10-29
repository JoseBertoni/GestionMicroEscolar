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

  crearMicro(micro: MicroRequest): Observable<any> {
    const url = `${this.baseUrl}?patente=${encodeURIComponent(micro.patente)}`;
    return this.http.post<any>(url, {}).pipe(
      catchError(this.handleError)
    );
  }

  eliminarMicro(patente: string): Observable<any> {
    const url = `${this.baseUrl}/${encodeURIComponent(patente)}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  desasignarChofer(patente: string): Observable<any> {
    const url = `${this.baseUrl}/${encodeURIComponent(patente)}/desasignar-chofer`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  desasignarChico(dniChico: string): Observable<any> {
    const url = `${this.baseUrl}/chico/${encodeURIComponent(dniChico)}/desasignar`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  desasignarTodosLosChicos(patente: string): Observable<any> {
    const url = `${this.baseUrl}/${encodeURIComponent(patente)}/desasignar-todos-chicos`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  asignarChofer(patente: string, dniChofer: string): Observable<any> {
    const url = `${this.baseUrl}/${encodeURIComponent(patente)}/asignar-chofer/${encodeURIComponent(dniChofer)}`;
    return this.http.post(url, {}).pipe(
      catchError(this.handleError)
    );
  }

  asignarChico(patente: string, dniChico: string): Observable<any> {
    const url = `${this.baseUrl}/${encodeURIComponent(patente)}/agregar-chico/${encodeURIComponent(dniChico)}`;
    return this.http.post(url, {}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    // NO transformar el error, pasarlo tal como viene del HttpClient
    // para que mantenga toda la información (status, error, message, etc.)
    console.log('MicrosService handleError - Error original:', error);
    return throwError(() => error);
  }
}
