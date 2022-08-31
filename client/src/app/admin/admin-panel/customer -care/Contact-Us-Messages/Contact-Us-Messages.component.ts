import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContactUs } from 'src/app/admin/models/Contact-Us';
import Swal from 'sweetalert2';
import { ContactUsService } from './Contact-Us.service';

@Component({
  selector: 'app-Contact-Us-Messages',
  templateUrl: './Contact-Us-Messages.component.html',
  styleUrls: ['./Contact-Us-Messages.component.css'],
})
export class ContactUsMessagesComponent implements OnInit {
  listContact: any[] = [];
  displayForm!: Boolean;
  formContact: FormGroup;
  selected: ContactUs;
  message: any;
  @ViewChild(FormGroupDirective) form: FormGroupDirective;
  constructor(
    private contactService: ContactUsService,
    private fb: FormBuilder,
    private toast: ToastrService
  ) {
    this.formContact = this.fb.group({
      message: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.contactService.getAll();
    this.contactService.getUpdates().subscribe((res) => {
      this.listContact = [...res];
    });
  }

  showForm(selected: ContactUs = null) {
    this.displayForm = true;
    if (selected) {
      this.selected = selected;
    }
  }

  convertDate(data: any) {
    return (
      new Date(data?.date).toLocaleDateString('en-US') +
      ' -  ' +
      new Date(data?.date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  }
  onSubmit() {
    let model = this.formContact.value;
    model.email = this.selected?.email;
    console.log(model);

    this.contactService.add(model).subscribe(
      (res: any) => {
        Swal.fire('Sended!', '', 'success');
      },
      (error: HttpErrorResponse) => {
        this.toast.error(error.error);
      }
    );
    this.displayForm = false;
  }

  resetForm() {
    this.form.resetForm();
    this.selected = null;
  }
}
