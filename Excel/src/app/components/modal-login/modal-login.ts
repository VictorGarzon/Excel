import { Component, inject, model, signal } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-modal-login',
  imports: [NzButtonModule, NzModalModule, ReactiveFormsModule, NzFormModule, NzInputModule],
  templateUrl: './modal-login.html',
  styleUrl: './modal-login.css',
})
export class ModalLogin {
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthService);
  message = inject(MessageService)

  visible = model(false);
  loading = signal(false);

  showModal(): void {
    this.visible.set(true);
  }

  handleCancel(): void {
    this.visible.set(false);
    this.validateForm.reset()
  }

  validateForm = this.fb.group({
    email: this.fb.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this.fb.control('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]),
  });

  async submitForm() {
    if (this.validateForm.valid) {
      try {
        let user = this.validateForm.value;
        this.loading.set(true);
        await firstValueFrom(
          this.auth.login(user)
        )
        this.message.createBasicMessage('success', "Iniciada Sesion con exito")
        this.visible.set(false);
      } catch (err: any) {
        if (err.status === 401) {
          this.message.createBasicMessage('error', "Email o contrasaeña mal")
        } else {
          this.message.createBasicMessage('error', err.message)
        }
      }
    } else {
      this.message.createBasicMessage('error', "Formulario no valido")
    }
    this.validateForm.markAllAsTouched();
    this.loading.set(false);
    this.validateForm.reset()
  }
}
