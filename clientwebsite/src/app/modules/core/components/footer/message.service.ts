import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendMessage(model: Message) {
    return this.http.post(this.url + `ContactUs/AddContactUsMessage`, model);
  }
}
