import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import { HeaderMenu } from "./components/header-menu/header-menu";
import { NzFlexModule } from 'ng-zorro-antd/flex';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NzLayoutModule, NzMenuModule, NzGridModule, NzIconModule, NzButtonModule, NzDrawerModule, NzFlexModule, HeaderMenu],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(private drawerService: NzDrawerService) { }

  openDrawer() {
    this.drawerService.create({
      nzClosable:false,
      nzContent: HeaderMenu,
      nzContentParams: {
        isVertical: true
      },
      nzWidth: 'auto'
    });
  }
}