import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Message {
  type: 'error' | 'warning' | 'info' | 'success';
  text: string;
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  addMessage(message: Message) {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  removeMessage(index: number) {
    const currentMessages = this.messagesSubject.value;
    currentMessages.splice(index, 1);
    this.messagesSubject.next([...currentMessages]);
  }

  clearMessages() {
    this.messagesSubject.next([]);
  }

  get messageCount(): number {
    return this.messagesSubject.value.length;
  }
}
