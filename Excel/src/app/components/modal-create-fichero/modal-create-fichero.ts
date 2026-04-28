import { Component, inject, model, output, signal } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { firstValueFrom } from 'rxjs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-modal-create-fichero',
  imports: [FormsModule, NzButtonModule, NzModalModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule],
  templateUrl: './modal-create-fichero.html',
  styleUrl: './modal-create-fichero.css',
})
export class ModalCreateFichero {
  private fb = inject(NonNullableFormBuilder);
  message = inject(MessageService)
  cargar = output()

  visible = model(false);
  loading = signal(false);
  validating = signal(true)
  tipos = signal<[{
    id: number,
    nombre: string
  }] | []>([])

  constructor(private api: ApiService) {
    this.buscarTipos()
  }

  showModal(): void {
    this.visible.set(true);
  }

  handleCancel(): void {
    this.visible.set(false);
    this.validateForm.reset()
  }

  validateForm = this.fb.group({
    nombre: this.fb.control('', [
      Validators.required,
    ]),
    descripcion: this.fb.control(''),
    tipo: this.fb.control('', [
      Validators.required,
    ]),
  });

  async buscarTipos() {
    try {
      this.validating.set(true)
      let tipos = await firstValueFrom(
        this.api.get("tipos")
      )
      this.tipos.set(tipos);
      this.validating.set(false)
    } catch (err: any) {
      this.message.createBasicMessage('error', err.message)
    }
  }

  async submitForm() {
    if (this.validateForm.valid) {
      try {
        let tipo = this.validateForm.value;
        this.loading.set(true);
        await firstValueFrom(
          this.api.post('fichero/create', tipo)
        )
        this.message.createBasicMessage('success', "Creado con exito")
        this.cargar.emit();
        this.visible.set(false);
      } catch (err: any) {
        if (err.status === 400) {
          this.message.createBasicMessage('error', err.message)
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
