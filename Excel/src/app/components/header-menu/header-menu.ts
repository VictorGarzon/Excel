import { Component, inject, input } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router'
import { MessageService } from '../../services/message.service';
import { ModalLogin } from "../modal-login/modal-login";
import { ModalRegister } from "../modal-register/modal-register";
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { FicheroService } from '../../services/fichero.service';

@Component({
  selector: 'app-header-menu',
  imports: [NzLayoutModule, NzMenuModule, NzGridModule, NzIconModule, NzButtonModule, ModalLogin, ModalRegister, RouterLink, NzFlexModule],
  templateUrl: './header-menu.html',
  styleUrl: './header-menu.css',
})
export class HeaderMenu {
  private auth = inject(AuthService);
  user = toSignal(this.auth.user$)
  private router = inject(Router);
  private message = inject(MessageService)
  ficheroService = inject(FicheroService)

  isVertical = false

  logout() {
    this.auth.logout()
    this.router.navigate(['/main']);
    this.message.createBasicMessage('success', "Sesion Cerrada con exito")
  }
}
