import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { empty, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) { }
  private url = "http://localhost:8000/api/";

  getTokenUser(user: any) {
    this.token(this.http.post<any>(this.url + "login_check", user))
  }

  async token(observable: Observable<any>) {
    await new Promise((resolve, reject) => {
      observable.subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => reject(err),
        complete: () => resolve(true) 
      });
    });
  }
}
