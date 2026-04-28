import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private url = "http://localhost:8000/api/";
  constructor(private http: HttpClient) { }

  buscar(observable: Observable<any>): Observable<any> {
    return observable.pipe(
      timeout(10000),
      catchError(err => {
        if (err.status === 0) {
          return throwError(() => new Error('No es posible conectarse'));
        }
        if (err.name === 'TimeoutError') {
          return throwError(() => new Error('No es posible conectarse por tiempo'));
        }
        if (err.status === 406) {
          return throwError(() => new Error('No es posible conectarse'));
        }
        if (err.status === 403) {
          return throwError(() => new Error('No tienes la autorización'));
        }
        return throwError(() => err);
      })
    )
  }

  get(url: string): Observable<any> {
    return this.buscar(this.http.get<any>(this.url + url))
  }

  post(url: string, obj: object): Observable<any> {
    return this.buscar(this.http.post<any>(this.url + url, obj))
  }
}
