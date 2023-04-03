import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class EventEmiterService {

  dataStr = new EventEmitter();

  constructor() { }

  sendMessage(data: number) {
    this.dataStr.emit(data);
  }
}