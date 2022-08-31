import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Attachment } from '../../shared/models/attachment';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  private readonly url = environment.apiUrl;
  private attachments: Attachment[] = [];
  private updates!: Subject<Attachment[]>;

  constructor(private http: HttpClient, private errorService: ErrorService) {
    this.updates = new Subject<Attachment[]>();
  }

  getAll() {
    this.http.get<Attachment[]>(this.url).subscribe(
      (data) => {
        this.attachments = [...data];
        this.updates.next([...this.attachments]);
      },
      (err) => {
        this.errorService.handleError(err);
      }
    );
  }

  getById(id: number) {
    this.http.get<Attachment>(this.url);
  }

  uploadFiles(model: any) {
    model;
    return this.http.post(
      this.url + `Attachment/UploadSubscriptionAttachment`,
      model
    );
  }

  convertToBase64(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  formatBytes(bytes: any, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
