import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { FicheroService } from './fichero.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private userSubject = new BehaviorSubject<User | null>(null);
  private router = inject(Router);
  private fichero = inject(FicheroService);

  user$: Observable<User | null> = this.userSubject.asObservable();
  api = inject(ApiService);

  constructor() {
    this.loadUserProfileOnStartup();
  }

  register(userData: any): Observable<User> {
    return this.api.post("register", userData).pipe(
      switchMap(() => this.login(userData)),
    )
  }

  login(credentials: any): Observable<User> {
    return this.api.post("login_check", credentials).pipe(
      tap(response => localStorage.setItem('accessToken', response.token)),
      switchMap(() => this.api.get("me")),
      tap(user => this.userSubject.next(user)),
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.userSubject.next(null);
    this.fichero.reset()
    this.router.navigate(['/main']);
  }

  private loadUserProfileOnStartup(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        this.api.get("me").subscribe({
          next: user => this.userSubject.next(user),
          error: () => this.logout()
        });
      }
    }
  }

  get isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}
