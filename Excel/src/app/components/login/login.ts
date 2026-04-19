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

  async token() {
    let user = {
      "email": "victor@test.com",
      "password": "1234"
    }
    this.api.getTokenUser(user)
  }

  async submitForm() {
    if (this.userForm.valid) {
      let datos = this.userForm.value;
      this.mensaje.set("")
      this.mensajeClass.set("loader");
      if (false) {
        console.log('si');
      } else {
        this.mensajeClass.set("error");
        this.mensaje.set("Email o contrasaeña mal")
      }
    } else {
      this.mensajeClass.set("error");
      this.mensaje.set("Formulario mal")
    }
    this.userForm.markAllAsTouched();
  }

  get email() { return this.userForm.get("email") }
  get password() { return this.userForm.get("password") }
}
