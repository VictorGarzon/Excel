import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { ModalLogin } from "./components/modal-login/modal-login";
import { ModalRegister } from "./components/modal-register/modal-register";
import { AuthService } from './services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import {Router} from '@angular/router'
import { MessageService } from './services/message.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NzLayoutModule, NzMenuModule, NzGridModule, NzIconModule, NzButtonModule, NzDrawerModule, ModalLogin, ModalRegister, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private auth = inject(AuthService);
  user = toSignal(this.auth.user$)
  private router = inject(Router);
  private message = inject(MessageService)

  logout() {
    this.auth.logout()
    this.router.navigate(['/main']);
    this.message.createBasicMessage('success',"Sesion Cerrada con exito")
  }

}