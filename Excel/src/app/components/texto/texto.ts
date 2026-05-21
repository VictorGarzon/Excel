import { afterNextRender, Component, computed, effect, HostListener, inject, signal, untracked, viewChildren } from '@angular/core';
import { Fila } from "../fila/fila";
import { tablaColumna, tablaFila, tablaFuncion } from '../../models/tabla';
import { NzLayoutComponent, NzContentComponent } from "ng-zorro-antd/layout";
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { MessageService } from '../../services/message.service';
import { FicheroService } from '../../services/fichero.service';
import { firstValueFrom, switchMap, tap, timer } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { HeaderTabla } from "../header-tabla/header-tabla";
import { saveCanDeactivate } from '../../guards/save-guard';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormsModule } from "@angular/forms";


@Component({
  selector: 'app-texto',
  imports: [NzLayoutComponent, NzContentComponent, NzGridModule, NzIconModule, NzFlexModule, HeaderTabla, NzAlertModule, NzButtonModule, NzSpaceModule, NzSpinModule, FormsModule],
  templateUrl: './texto.html',
  styleUrl: './texto.css',
})
export class Texto {
  message = inject(MessageService)
  ficheroService = inject(FicheroService)
  private api = inject(ApiService)

  data = signal<string>('')

  constructor() {
    effect(() => {
      this.ficheroService.setTipo(2)
      let data = this.ficheroService.data();
      if (untracked(() => !this.ficheroService.modificado)) {
        untracked(() => this.reinicio(data))
      }
    })
  }

  reinicio(data: any) {
    this.data.set(data?.text ?? '')
    this.ficheroService.modificado = false;
  }

  canDeactivate(): boolean {
    if (this.ficheroService.modificado) {
      return confirm('Tienes cambios sin guardar ¿Quieres salir?');
    }
    return true;
  }

  //alert cerrar ventana
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.ficheroService.modificado) {
      event.preventDefault();
    }
  }

  // alerta
  visibleAlert = signal(false)

  showAlert() {
    this.visibleAlert.set(true)
  }
  closedAlert() {
    this.visibleAlert.set(false)
  }


  // Cargar
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const content = e.target.result;
        this.reinicio({ text: content })
        this.ficheroService.modificado = true
        this.message.createBasicMessage("success", "Subido con exito")
      } catch (error) {
        this.message.createBasicMessage("error", "El archivo no tiene un formato JSON válido")
      }
    };

    reader.readAsText(file);
    event.target.value = ""
  }

  // descargar 
  download() {
    const data = this.data();
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'texto.txt';
    anchor.click();

    URL.revokeObjectURL(url);

    this.ficheroService.modificado = false;
  }

  //guardar base de datos
  async uploadDB(acept: boolean = false) {
    if (!this.ficheroService.modificado) {
      this.message.createBasicMessage('warning', 'Sin cambios')
    } else {
      try {
        let fichero = this.ficheroService.fichero();
        if (!fichero?.nombre) {
          this.message.createBasicMessage('error', "Se necesita nombre")
        } else {
          const data: any = { text: this.data() };
          let newData: any = {
            nombre: fichero!.nombre,
            data: data
          }
          if (fichero.id) {
            try {
              this.closedAlert();
              newData.fecha_mod = fichero.fecha_mod
              newData.acept = acept;
              let fecha_mod = await firstValueFrom(
                this.api.patch('fichero/' + fichero.id, newData)
              )
              untracked(() => this.ficheroService.setData(data))
              untracked(() => this.ficheroService.setFechMod(fecha_mod))
              this.ficheroService.modificado = false;
              this.message.createBasicMessage('success', "Se ha guardado")
            } catch (err: any) {
              if (err.status == 409) {
                this.showAlert();
              } else {
                throw err
              }
            }
          } else {
            newData.tipo = this.ficheroService.tipo();
            await firstValueFrom(
              this.api.post('fichero', newData).pipe(
                switchMap((id) => this.api.get('fichero/' + id)),
                tap(f => untracked(() => this.ficheroService.fichero.set(f))),
              )
            )
            this.ficheroService.modificado = false;
            this.message.createBasicMessage('success', "Se ha creado un nuevo fichero")
          }
        }
      } catch (err: any) {
        if (err.status == 409) {

        } else {
          this.message.createBasicMessage('error', err.message)
        }
      }
    }
  }
}
