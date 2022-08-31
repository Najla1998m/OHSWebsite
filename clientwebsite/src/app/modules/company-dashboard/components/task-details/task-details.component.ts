import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicFormsService } from 'src/app/modules/core/services/dynamic-forms.service';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
})
export class TaskDetailsComponent implements OnInit {
  task!: any;
  taskId!: number;
  taskLevels!: any[];
  taskStatus!: any[];
  p2!: number;

  constructor(
    private taskService: TasksService,
    private ar: ActivatedRoute,
    private dynamicService: DynamicFormsService
  ) {
    this.ar.params.subscribe((params) => (this.taskId = params.id));
  }

  ngOnInit() {
    this.taskService.GetTasksById(this.taskId).subscribe((data) => {
      this.task = data;
    });

    this.loadTaskLevels();
    this.loadTaskStatus();
  }

  loadTaskStatus() {
    this.dynamicService.getAllTaskStatus().subscribe((data: any) => {
      this.taskStatus = data;
      console.log(data);
    });
  }

  loadTaskLevels() {
    this.dynamicService.getAllTasksLevel().subscribe((data: any) => {
      this.taskLevels = data;
      console.log(data);
    });
  }

  getStatus(status: any) {
    let word = 'غير معروفة';
    word = this.taskStatus?.find((e) => e.id == status)?.name;
    return word;
  }

  getTaskLevel(id: number) {
    return this.taskLevels?.find((e) => e?.id == id).name;
  }

  isEmpty(obj: Object) {
    return (
      obj &&
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype
    );
  }
}
