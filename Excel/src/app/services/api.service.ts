import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) { }
  private url = "http://localhost:8000/api/";

  getTokenUser(user:any): Observable<any> {
    return this.http.post<any>(this.url + "login_check",user);
  }
}
