import { Component, effect, inject, input, output, signal, TemplateRef, untracked, viewChild, ViewChild } from '@angular/core';
import { NzHeaderComponent } from "ng-zorro-antd/layout";
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonComponent } from "ng-zorro-antd/button";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { AuthService } from '../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FicheroService } from '../../services/fichero.service';
import { NzDrawerModule, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NgTemplateOutlet } from "@angular/common";

@Component({
  selector: 'app-header-tabla',
  imports: [NzHeaderComponent, NzDrawerModule, NzGridModule, NzButtonComponent, NzIconModule, NzFlexModule, NzFloatButtonModule, NzFormModule, NzInputModule, NgTemplateOutlet],
  templateUrl: './header-tabla.html',
  styleUrl: './header-tabla.css',
})
export class HeaderTabla {
  private auth = inject(AuthService);
  user = toSignal(this.auth.user$)
  ficheroService = inject(FicheroService)

  upload = output()
  uploadDB = output()
  download = output()

  isVisible = signal(false)

  setSelect = output<boolean>();
  setSelectMult = output<boolean>();
  clear = output();
  result = output<{ tipo: string, funcion: string }>();
  funcion = "";
  tipo = signal('');
  mode = signal(0);

  constructor(private drawerService: NzDrawerService) {
    effect(() => {
      if (this.mode() > 2) {
        this.setSelect.emit(true)
        this.isVisible.set(true)
        if (this.tipo() == 'f' && this.mode() == 3) {
          this.setSelectMult.emit(true)
        } else {
          this.setSelectMult.emit(false)
        }
      } else {
        this.setSelect.emit(false)
        this.isVisible.set(false)
        this.clear.emit()
      }
    })
  }

  // Aplicar funciones

  setTipo(tipo: string) {
    this.tipo.set(tipo)
    this.mode.set(2)
  }

  setFuncion(fun: string) {
    this.funcion = fun
    if (fun === '') {
      this.mode.set(4)
    } else {
      this.mode.set(3)
    }
  }

  confirm() {
    if (this.tipo() === 'f' && this.mode() === 3) {
      this.mode.set(4)
    } else {
      this.result.emit({ tipo: this.tipo(), funcion: this.funcion })
      this.mode.set(0)
    }
  }

  cambiarNombre(event: any) {
    this.ficheroService.setNombre(event.target.value.trim())
  }

  @ViewChild('Acciones', { static: false }) Acciones?: TemplateRef<{
    $implicit: { isVertical: boolean };
    drawerRef: NzDrawerRef<string>;
  }>;

  openAcciones() {
    this.drawerService.create({
      nzClosable: false,
      nzContent: this.Acciones,
      nzContentParams: {
        isVertical: true
      },
      nzPlacement: 'right',
      nzWidth: 'auto'
    });
  }

  @ViewChild('TipoFun', { static: false }) TipoFun?: TemplateRef<{
    $implicit: { isVertical: boolean };
    drawerRef: NzDrawerRef<string>;
  }>;
  openFunciones() {
    this.drawerService.create({
      nzClosable: false,
      nzContent: this.TipoFun,
      nzContentParams: {
        isVertical: true
      },
      nzWidth: 'auto'
    });
  }
}
