import { Component, inject, model, signal } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Message } from '../../services/message';

@Component({
  selector: 'app-modal-register',
  imports: [NzButtonModule, NzModalModule, ReactiveFormsModule, NzFormModule, NzInputModule],
  templateUrl: './modal-register.html',
  styleUrl: './modal-register.css',
})
export class ModalRegister {
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthService);
  message = inject(Message)

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
    confirm: this.fb.control('', [this.confirmValidator]),
  });

  async submitForm() {
    if (this.validateForm.valid) {
      try {
        let user = this.validateForm.value;
        delete user.confirm

        this.loading.set(true);
        await firstValueFrom(
          this.auth.register(user)
        )
        this.message.createBasicMessage('success', "Registro existoso")
        this.visible.set(false);
      } catch (err: any) {
        if (err.status === 409) {
          this.message.createBasicMessage('error', "Email en uso")
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

  confirmValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== control.parent!.value.password) {
      return { confirm: true, error: true };
    }
    return {};
  }
}
