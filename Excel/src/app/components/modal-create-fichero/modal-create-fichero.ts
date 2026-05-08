import { Component, inject, input, model, output, signal } from '@angular/core';

import { NzButtonModule, NzButtonType } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { firstValueFrom } from 'rxjs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { Fichero } from '../../models/ficheros';

@Component({
  selector: 'app-modal-create-fichero',
  imports: [FormsModule, NzButtonModule, NzModalModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule],
  templateUrl: './modal-create-fichero.html',
  styleUrl: './modal-create-fichero.css',
})
export class ModalCreateFichero {
  private fb = inject(NonNullableFormBuilder);
  message = inject(MessageService)
  private api = inject(ApiService)

  cargar = output()

  tipo = input(0)
  data = input<any>()

  visible = model(false);
  loading = signal(false);

  tipos = input<any>()

  get buttonType(): NzButtonType {
    return this.tipo() === 0 ? 'primary' : 'link';
  }

  showModal(): void {
    this.visible.set(true);
    if (this.tipo() == 0) {
      let defaultTipo = this.tipos()[0].id
      this.createForm.patchValue({
        tipo: defaultTipo
      })
    } else if (this.tipo() == 1) {
      this.editForm.patchValue({
        nombre: this.data().nombre,
        descripcion: this.data().descripcion,
      })
    }
  }

  handleCancel(): void {
    this.visible.set(false);
    this.createForm.reset()
    this.editForm.reset()
  }

  createForm = this.fb.group({
    nombre: this.fb.control('', [
      Validators.required,
    ]),
    descripcion: this.fb.control(''),
    tipo: this.fb.control(0, [
      Validators.required,
    ]),
  });

  editForm = this.fb.group({
    nombre: this.fb.control('', [
      Validators.required,
    ]),
    descripcion: this.fb.control('')
  });

  async submitForm() {
    if ((this.tipo() == 0 ? this.createForm : this.editForm).valid) {
      try {
        let newData = (this.tipo() == 0 ? this.createForm : this.editForm).value;
        this.loading.set(true);
        if (this.tipo() == 0) {
          await firstValueFrom(
            this.api.post('fichero', newData)
          )
          this.message.createBasicMessage('success', "Creado con exito")
        } else if (this.tipo() == 1) {
          await firstValueFrom(
            this.api.patch('fichero/' + this.data().id, newData)
          )
          this.message.createBasicMessage('success', "Editado con exito")
        }
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
    this.createForm.markAllAsTouched();
    this.loading.set(false);
    this.createForm.reset()
  }
}
