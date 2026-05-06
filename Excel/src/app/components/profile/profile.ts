import { Component, inject, signal } from '@angular/core';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidationErrors, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { firstValueFrom } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  imports: [NzLayoutModule, NzFlexModule, NzButtonModule, NzFormModule, NzInputModule, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthService)
  private api = inject(ApiService)
  user = toSignal(this.auth.user$)
  message = inject(MessageService)

  loading = signal(false);

  isRequiredEmail = signal<boolean>(false)
  isRequired = signal<boolean>(false)

  validateForm = this.fb.group({
    email: this.fb.control('', [
      Validators.email,
    ]),
    password: this.fb.control('', [
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]),
    newpassword: this.fb.control('', [
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]),
    confirm: this.fb.control(''),
  },
    {
      validators: [this.emailOrPasswordRequired.bind(this), this.confirmValidator],
    }
  );

  confirmValidator(control: AbstractControl): ValidationErrors | null {
    const newpassword = control.get('newpassword');
    const confirm = control.get('confirm');

    if (!newpassword?.value) return null;

    if (!confirm?.value) {
      confirm?.setErrors({ required: true });
      return { required: true };
    } else if (confirm.value !== newpassword.value) {
      confirm?.setErrors({ confirm: true });
      return { confirm: true, error: true };
    }
    control.get('confirm')?.setErrors(null);
    return null;
  }

  emailOrPasswordRequired(
    control: AbstractControl
  ): ValidationErrors | null {
    const email = control.value.email.trim();
    const password = control.value.password.trim();
    const newpassword = control.value.newpassword.trim();

    if (email || password || newpassword) {

      if (email) {
        this.isRequiredEmail.set(true)
      } else {
        this.isRequiredEmail.set(false)
      }
      if (password || newpassword) {
        if (!password || !newpassword) {
          return { required: true };
        }
        this.isRequired.set(true)
      } else {
        this.isRequired.set(false)
      }
      return null;
    }
    this.isRequiredEmail.set(false)
    this.isRequired.set(false)
    return { emailOrPasswordRequired: true };
  }

  async submitForm() {
    if (this.validateForm.valid) {
      try {
        let user = this.validateForm.value;
        delete user.confirm
        this.loading.set(true);
        await firstValueFrom(
          this.api.patch('me', user)
        )
        if (user.email) {
          this.auth.setUser({ ...this.user(), email: user.email })
        }
        this.message.createBasicMessage('success', "Edicion existoso")
      } catch (err: any) {
        if (err.status === 400) {
          this.message.createBasicMessage('error', err.error)
        } else if (err.status === 401) {
          this.message.createBasicMessage('error', "Contraseña mal")
        } else if (err.status === 409) {
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
}
