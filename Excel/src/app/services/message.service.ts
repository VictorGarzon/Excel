import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private message: NzMessageService) { }

  createBasicMessage(type: string, message: string): void {
    this.message.create(type, message, {
      nzDuration: 3000
    });
  }
}
