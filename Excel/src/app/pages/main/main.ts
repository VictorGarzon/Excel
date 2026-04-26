import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { Tabla } from "../../components/tabla/tabla";

@Component({
  selector: 'app-main',
  imports: [NzLayoutModule, NzMenuModule, NzGridModule, NzIconModule, NzButtonModule, NzDrawerModule, Tabla],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {

}
