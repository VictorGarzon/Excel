import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable, timeout, toArray } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private url = "http://localhost:8000/api/";
  auth = inject(AuthService);
  constructor(private http: HttpClient) { }

  async buscar(observable: Observable<any>) {
    try {
      return await firstValueFrom(
        observable.pipe(timeout(10000))
      );
    } catch (err: any) {
      if (err.status === 406) {
        throw new Error("No es posible conectarse");
      }
      if (err.status === 403) {
        throw new Error("No tienes la autorización");
      }
      if (err.name === "TimeoutError") {
        throw new Error("No es posible conectarse");
      }
      throw err;
    }
  }

  async postLogin(user: any) {
    let resul = await this.buscar(this.http.post<any>(this.url + "login_check", user))
    if (resul.token) {
      this.auth.setToken(resul.token)
      return true
    } else {
      return false
    }
  }

  async postRegister(user: any) {
    let resul = await this.buscar(this.http.post<any>(this.url + "register", user))
    if (resul.status === 201) {
      await this.postLogin(user)
    }
  }

  async getAllUsers() {
    return await this.buscar(this.http.get<any>(this.url + "user"))
  }
}
