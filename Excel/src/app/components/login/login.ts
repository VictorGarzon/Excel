import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  userForm: FormGroup;

  mensaje = signal("")
  mensajeClass = signal("");

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.userForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    })
  }

  async submitForm() {
    if (this.userForm.valid) {
      try {
        let user = this.userForm.value;
        this.mensaje.set("")
        this.mensajeClass.set("loader");
        await this.api.postLogin(user)
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
        await this.api.postRegister(user)
        console.log("bien");
      } catch (err: any) {
        if (err.status === 409) {
          this.mensajeClass.set("error");
          this.mensaje.set("Email en uso")
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

  get email() { return this.userForm.get("email") }
  get password() { return this.userForm.get("password") }

  async verusers() {
    console.log(await this.api.getAllUsers());
  }
}
