import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { TaskStatus } from 'src/app/admin/models/taskStatus';
import { TaskStatusService } from './Task-Status.service';

@Component({
  selector: 'app-Task-Status',
  templateUrl: './Task-Status.component.html',
  styleUrls: ['./Task-Status.component.css'],
})
export class TaskStatusComponent implements OnInit {
  taskList: TaskStatus[] = [];
  displayForm: boolean;
  selected: TaskStatus;
  taskStateForm: FormGroup;
  @ViewChild(FormGroupDirective) form: FormGroupDirective;
  constructor(private taskServic: TaskStatusService, private fb: FormBuilder) {
    this.taskStateForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      isVisible: [false],
    });
  }

  ngOnInit() {
    this.taskServic.getAllStatusTask();
    this.taskServic.getUpdates().subscribe((res) => {
      this.taskList = [...res];
      console.log(this.taskList);
    });
  }

  public get Name(): FormControl {
    return this.taskStateForm.get('name') as FormControl;
  }
  public get IsVisible(): FormControl {
    return this.taskStateForm.get('isVisible') as FormControl;
  }

  onSubmit() {
    let model = this.taskStateForm.value;

    console.log(model);

    if (this.taskStateForm.valid && !this.selected) {
      this.taskServic.addTaskStatus(model);
      this.displayForm = false;
      this.resetForm();
    } else if (this.taskStateForm.valid && this.selected) {
      this.taskServic.editTaskStatus(this.selected.id, model);
      this.displayForm = false;
      this.resetForm();
    }
  }

  showForm(selected: TaskStatus) {
    this.displayForm = true;
    this.selected = selected;
    console.log(selected);

    if (selected) {
      this.taskStateForm.patchValue(this.selected);
    }
  }
  onDelete(id: number) {
    this.taskServic.deleteTaskStatus(id);
  }
  resetForm() {
    this.form.resetForm();
    this.selected = null;
  }
}
