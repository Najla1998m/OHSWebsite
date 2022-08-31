import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AttachmentService } from 'src/app/modules/core/services/attachment.service';
import { SubscriptionService } from 'src/app/modules/core/services/subscription.service';
import { UserService } from 'src/app/modules/core/services/user.service';
import { AllUserDetails } from 'src/app/modules/shared/models/all-user-details';

import { UserDetails } from 'src/app/modules/shared/models/user-details';

@Component({
  selector: 'app-upload-attachments',
  templateUrl: './upload-attachments.component.html',
  styleUrls: ['./upload-attachments.component.scss'],
})
export class UploadAttachmentsComponent implements OnInit {
  attachments: any[] = [];
  user!: AllUserDetails;
  userDetails!: UserDetails;
  subId!: number;
  attachmentsForm!: FormGroup;
  numberOfFiles!: number;
  model: any[] = [];
  listOfRequiredAttachments!: any[];

  @ViewChild('dropFiles', { static: false }) fileDropEl!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private attachmentService: AttachmentService,
    private router: Router,
    private subscriptionService: SubscriptionService
  ) {
    this.attachmentsForm = this.fb.group({
      files: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.userService.getUserDetails().subscribe((user) => {
      this.userDetails = user;

      this.numberOfFiles =
        this.userDetails.attachmentWithSubscriptionTypeId.length;
      this.listOfRequiredAttachments =
        this.userDetails.attachmentWithSubscriptionTypeId;

      this.listOfRequiredAttachments;
    });
  }

  onFilesUploaded(event: any) {
    event;

    this.prepareFilesList(event.target.files);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.attachments.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.attachments[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.attachments[index].progress += 5;
          }
        }, 100);
      }
    }, 1000);
  }

  deleteFile(index: number) {
    if (this.attachments[index].progress < 100) {
      ('Upload in progress.');
      return;
    }
    this.attachments.splice(index, 1);

    this.model.slice(index, 1);
  }

  async prepareFilesList(files: Array<any>) {
    for (let i = 0; i < this.numberOfFiles; i++) {
      files[i].progress = 0;
      let image = (await this.attachmentService.convertToBase64(
        files[i]
      )) as string;

      this.model.push({
        image: image.split(',')[1],
        imageUrl: '',
        name: files[i].name + '.' + files[i].name.split('.').pop(),
        userId: this.userDetails.user.id,
        subscriptionTypeAttachmentMappingId:
          this.listOfRequiredAttachments[i].subscriptionTypeId,
      });
      this.attachments.push(files[i]);
    }

    this.fileDropEl.nativeElement.value = '';
    this.uploadFilesSimulator(0);
  }

  onSubmit() {
    this.attachmentService.uploadFiles(this.model).subscribe(() => {
      this.router.navigate(['/company-dashboard/dash']);
    });
  }
}
