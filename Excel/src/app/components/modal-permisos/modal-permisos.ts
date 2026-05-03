import { Component, inject, input, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule, NzInputSearchEvent } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-modal-permisos',
  imports: [NzDividerModule, NzTableModule, FormsModule, NzIconModule, NzInputModule, NzSelectModule, NzButtonModule, NzModalModule],
  templateUrl: './modal-permisos.html',
  styleUrl: './modal-permisos.css',
})
export class ModalPermisos {
  message = inject(MessageService)
  private api = inject(ApiService)

  id = input();

  loading = signal(true);
  permiso = signal('1');
  email = signal('');

  users = signal<[{
    "id": number,
    "email": string,
    "permiso": number
  }] | []>([]);

  isVisible = false;

  showModal(): void {
    this.isVisible = true;
    this.permiso.set('1')
    this.email.set('')
    this.buscarPermisUser()
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  async buscarPermisUser() {
    try {
      this.loading.set(true);
      let users = await firstValueFrom(
        this.api.get(`fichero/${this.id()}/permisos`)
      )
      this.users.set(users);
      this.loading.set(false);
    } catch (err: any) {
      this.message.createBasicMessage('error', err.message)
    }
  }

  async buscarEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.email().trim())) {
      try {
        let acceso = {
          'id': this.id(),
          'email': this.email().trim(),
          'permiso': this.permiso()
        }
        await firstValueFrom(
          this.api.post(`acceso`, acceso)
        )
        this.buscarPermisUser()
        this.message.createBasicMessage('success', 'Permiso añadido')
      } catch (err: any) {
        if (err.status === 404) {
          this.message.createBasicMessage('error', 'Usuario no encontrado')
        } else if (err.status === 409) {
          this.message.createBasicMessage('error', 'Usuario ya existe')
        } else {
          this.message.createBasicMessage('error', err.message)
        }
      }
    } else {
      this.message.createBasicMessage('error', 'Tiene que ser un email')
    }
  }

  async deleteUser(id_u: number) {
    try {
      this.loading.set(true);
      await firstValueFrom(
        this.api.delete(`acceso/${this.id()}/${id_u}`)
      )
      this.buscarPermisUser()
      this.message.createBasicMessage('success', 'Permiso eliminado')
    } catch (err: any) {
      this.message.createBasicMessage('error', err.message)
    }
  }

  async cambiarPermiso(id_u: number, permiso: any) {
    try {
      await firstValueFrom(
        this.api.patch(`acceso/${this.id()}/${id_u}`, { permiso: permiso })
      )
      this.buscarPermisUser()
      this.message.createBasicMessage('success', 'Permiso modificado')
    } catch (err: any) {
      this.message.createBasicMessage('error', err.message)
    }
  }
}
