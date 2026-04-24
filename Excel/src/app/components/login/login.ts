import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  userForm: FormGroup;

  auth = inject(AuthService);
  mensaje = signal("")
  mensajeClass = signal("");

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.userForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    })
  }

  user = toSignal(this.auth.user$)

  async submitForm() {
    if (this.userForm.valid) {
      try {
        let user = this.userForm.value;
        this.mensaje.set("")
        this.mensajeClass.set("loader");
        await firstValueFrom(
          this.auth.login(user)
        )
        console.log("bien");
      } catch (err: any) {
        if (err.status === 401) {
          this.mensajeClass.set("error");
          this.mensaje.set("Email o contrasaeña mal")
          console.log("mal");
        } else {
          console.log(err.message);
        }
      }
    } else {
      this.mensajeClass.set("error");
      this.mensaje.set("Formulario mal")
    }
    this.userForm.markAllAsTouched();
  }

  async submitForm2() {
    if (this.userForm.valid) {
      try {
        let user = this.userForm.value;
        this.mensaje.set("")
        this.mensajeClass.set("loader");
        console.log(user);
        await firstValueFrom(
          this.auth.register(user)
        )
        console.log("bien");
      } catch (err: any) {
        if (err.status === 409) {
          this.mensajeClass.set("error");
          this.mensaje.set("Email en uso")
          console.log("conficto");
        } else {
          console.log(err.message);
        }
      }
    } else {
      this.mensajeClass.set("error");
      this.mensaje.set("Formulario mal")
    }
    this.userForm.markAllAsTouched();
  }

  get email() { return this.userForm.get("email") }
  get password() { return this.userForm.get("password") }

  async verusers() {
    let result = await firstValueFrom(
      this.api.getAllUsers()
    )
    console.log(result);
  }

  async verme() {
    let result = await firstValueFrom(
      this.api.getme()
    )
    console.log(result);
  }

  logout() {
    this.auth.logout()
  }
}
