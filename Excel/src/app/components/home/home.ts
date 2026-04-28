import { Component, inject, signal } from '@angular/core';

import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { ApiService } from '../../services/api.service';
import { firstValueFrom } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Fichero } from '../../models/ficheros';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ModalCreateFichero } from "../modal-create-fichero/modal-create-fichero";
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-home',
  imports: [NzBreadCrumbModule, NzIconModule, NzMenuModule, NzLayoutModule, NzButtonModule, NzTableModule, NzDividerModule, NzTypographyModule, ModalCreateFichero],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  message = inject(MessageService)
  ficheros = signal<[Fichero] | []>([])
  filtro = '';
  constructor(private api: ApiService) {
    this.buscar()
  }

  async buscar() {
    try {
      let ficheros = await firstValueFrom(
        this.api.get("fichero" + this.filtro)
      )
      this.ficheros.set(ficheros);
    } catch (err: any) {
      this.message.createBasicMessage('error', err.message)
    }
  }

  aplicarFiltro(filtro: string) {
    this.filtro = filtro
    this.buscar()
  }

  async abrir(fichero: Fichero) {
    try {
      let data = await firstValueFrom(
        this.api.get(`fichero/${fichero.id}/data`)
      )
      fichero.data = data
      
    } catch (err: any) {
      this.message.createBasicMessage('error', err.message)
    }
  }
}
