import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { asyncScheduler, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AttachmentDto } from '../../shared/models/attachmentDto';
import { AttachmentService } from './attachment.service';

@Injectable({
  providedIn: 'root',
})
export class UploadFilesService {
  private readonly url = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private attachmentService: AttachmentService
  ) {}

  async upload(file: File, userId: string, subscriptionId: number) {
    let imageBase64 = (await this.attachmentService.convertToBase64(
      file
    )) as string;

    let model: AttachmentDto = {
      image: imageBase64.split(',')[1],
      imageUrl: '',
      name: file.name,
      userId: userId,
      subscriptionTypeAttachmentMappingId: subscriptionId,
    };

    model;

    const req = new HttpRequest(
      'POST',
      this.url + `Attachment/UploadSubscriptionAttachment`,
      [model],
      {
        reportProgress: true,
        responseType: 'json',
      }
    );

    return this.http.request(req);
  }

  UploadAttachments(files: any) {
    return this.http.post(
      this.url + `Attachment/UploadSubscriptionAttachment`,
      files
    );
  }
}
