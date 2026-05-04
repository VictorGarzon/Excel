import { Component, inject, input, model, signal } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { firstValueFrom } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-modal-edit-user',
  imports: [NzButtonModule, NzModalModule, ReactiveFormsModule, NzFormModule, NzInputModule],
  templateUrl: './modal-edit-user.html',
  styleUrl: './modal-edit-user.css',
})
export class ModalEditUser {
  private fb = inject(NonNullableFormBuilder);
  private api = inject(ApiService);
  message = inject(MessageService)

  data = input<User>()

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
          this.api.patch('user/'+this.data()?.id, user)
        )
        this.message.createBasicMessage('success', "Editado con exito")
        this.visible.set(false);
      } catch (err: any) {
        if (err.status === 401) {
          this.message.createBasicMessage('error', "Contrasaeña mal introducida")
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
