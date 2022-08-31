import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from './notification.service';
import { Notification } from 'src/app/admin/models/notification';
import { AuthService } from 'src/app/Auth/Auth.service';

import { User } from 'src/app/Auth/User';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  listNotification: Notification[] = [];
  displayModel!: boolean;
  displayDetails!: boolean;
  selected!: any;
  NotificationTypeId: any;
  ListUsers: any[] = [];
  listTaskStatus: any[] = [];
  taskForm: FormGroup;
  UserId: any;
  public user: User;
  @ViewChild(FormGroupDirective) form: FormGroupDirective;
  constructor(
    private notificationService: NotificationService,
    private auth: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.auth.user.subscribe((user) => {
      this.UserId = user.getUserId();
      console.log(this.UserId);
      this.notificationService.getAll(this.UserId);
      this.notificationService.getUpdate().subscribe((res: any) => {
        this.listNotification = [...res].reverse();
        console.log(this.listNotification);
      });
    });

    this.taskForm = this.fb.group({
      assignedToId: [null, [Validators.required]],
      tasksStatusId: [null, [Validators.required]],
      description: [''],
    });

    // this.UserId = '0bab58d7-4f82-4a49-9753-91aa61620113';

    this.notificationService
      .getAllUserInCompany(this.UserId)
      .subscribe((res: any) => {
        console.log(this.ListUsers, 'elmozafin');
        if (typeof res == 'object') {
          this.ListUsers.push(res);
        } else {
          this.ListUsers = [...res];
        }
      });

    this.notificationService.getStatusTasks().subscribe((res: any) => {
      this.listTaskStatus = [...res];
    });
  }

  showForm(selected: any = null) {
    if (
      selected.notificationTypeId == 5 ||
      selected.notificationTypeId == 10 ||
      selected.notificationTypeId == 11
    ) {
      this.selected = selected;
      this.displayModel = true;
      this.displayDetails = false;
      this.selected.isRead = true;
      console.log(this.selected);
      this.taskForm
        .get('description')
        .patchValue(this.selected?.tasks?.description);
      this.taskForm
        .get('tasksStatusId')
        .patchValue(this.selected?.tasks?.tasksStatusId);
      this.taskForm
        .get('assignedToId')
        .patchValue(this.selected?.tasks?.assignedToId);
    } else if (
      selected.notificationTypeId == 1 ||
      selected.notificationTypeId == 2 ||
      selected.notificationTypeId == 6 ||
      selected.notificationTypeId == 7 ||
      selected.notificationTypeId == 8 ||
      selected.notificationTypeId == 9
    ) {
      this.displayDetails = true;
      this.displayModel = false;
      this.selected = selected;
      console.log(this.selected);

      this.selected.isRead = true;
    }

    // this.selected = selected;
    // this.displayModel = true;
    // this.displayDetails = false;
    // this.selected.isRead = true;
    // console.log(this.selected);
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
    let model = this.taskForm.value;
    model.id = this.selected?.tasks?.id;
    // model.description = this.selected?.tasks?.description;
    model.taskslevelid = this.selected?.tasks?.tasksLevelId;
    model.companyid = this.selected?.tasks?.companyId;
    console.log(model);
    this.notificationService.updateTask(this.selected?.id, model);
    this.displayModel = false;
    this.resetForm();
  }

  onDelete(id: number) {
    this.notificationService.delete(id);
  }
  resetForm() {
    this.selected = null;
    this.form.resetForm();
  }
}
