import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, from, Observable, throwError, timeout } from 'rxjs';

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
        if (err.name === 'TimeoutError') {
          return throwError(() => new Error('No es posible conectarse'));
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

  /*
  async postLogin(user: any) {
    let resul = await this.buscar(this.http.post<any>(this.url + "login_check", user))
  }

  async postRegister(user: any) {
    let resul = await this.buscar(this.http.post<any>(this.url + "register", user))
    // if (resul.status === 201) {
    //  await this.postLogin(user)
    //}
  }
    */

  getAllUsers() {
    return this.get("user")
  }

  getme() {
    return this.get("me")
  }
}
