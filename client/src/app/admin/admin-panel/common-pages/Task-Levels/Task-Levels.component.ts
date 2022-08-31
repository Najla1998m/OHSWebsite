import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { TaskLevelsService } from './Task-levels.service';
import { Task } from 'src/app/admin/models/Task';

@Component({
  selector: 'app-Task-Levels',
  templateUrl: './Task-Levels.component.html',
  styleUrls: ['./Task-Levels.component.css'],
})
export class TaskLevelsComponent implements OnInit {
  tasksList: Task[] = [];
  displayForm: boolean;
  selected: Task;
  taskForm: FormGroup;
  @ViewChild(FormGroupDirective) form: FormGroupDirective;
  constructor(private taskServic: TaskLevelsService, private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      isVisible: [false],
    });
  }

  ngOnInit() {
    this.taskServic.getAllTasks();
    this.taskServic.getUpdates().subscribe((res: any) => {
      this.tasksList = [...res];
      console.log(this.tasksList, 'list');
    });
  }

  public get Name(): FormControl {
    return this.taskForm.get('name') as FormControl;
  }
  public get IsVisible(): FormControl {
    return this.taskForm.get('isVisible') as FormControl;
  }
  onSubmit() {
    let model = this.taskForm.value;
    // model.id=null;
    console.log(model);

    if (this.taskForm.valid && !this.selected) {
      this.taskServic.addTaskLevels(model);
      this.displayForm = false;
      this.resetForm();
    } else if (this.taskForm.valid && this.selected) {
      this.taskServic.editTaskLevels(this.selected.id, model);
      this.displayForm = false;
      this.resetForm();
    }
  }
  showForm(selected: Task) {
    this.displayForm = true;
    this.selected = selected;
    console.log(selected);

    if (selected) {
      this.taskForm.patchValue(this.selected);
    }
  }
  onDelete(id: number) {
    this.taskServic.deleteTaskLevels(id);
  }
  resetForm() {
    this.form.resetForm();
    this.selected = null;
  }
}
