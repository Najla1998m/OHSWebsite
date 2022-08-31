import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Task } from 'src/app/admin/models/Task';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class TaskLevelsService {
  baseUrl = environment.apiUrl;
  listTasks: Task[] = [];
  updates = new Subject<Task[]>();
  constructor(private http: HttpClient, private toast: ToastrService) {}

  getAllTasks() {
    this.http
      .get<Task[]>(this.baseUrl + `TasksLevelsContoller/GetAllTasksLevels`)
      .subscribe(
        (res) => {
          console.log(res);

          this.listTasks = [...res];
          this.updates.next([...this.listTasks]);
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  addTaskLevels(task: Task) {
    this.http
      .post(this.baseUrl + `TasksLevelsContoller/CreateTasksLevels`, task)
      .subscribe(
        (res: any) => {
          if (res) {
            this.listTasks.push(res);
            this.updates.next([...this.listTasks]);
            Swal.fire('Added!', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  editTaskLevels(id: number, task: Task) {
    this.http
      .post(
        this.baseUrl + `TasksLevelsContoller/UpdateTasksLevels?id=${id}`,
        task
      )
      .subscribe(
        (res) => {
          if (res) {
            const index = this.listTasks.findIndex((t) => t.id == id);
            task.id = id;
            this.listTasks[index] = task;
            this.updates.next([...this.listTasks]);
            Swal.fire('updated', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  deleteTaskLevels(id: number) {
    this.http
      .post(
        this.baseUrl + `TasksLevelsContoller/DeleteTasksLevels?id=${id}`,
        null
      )
      .subscribe(
        (res) => {
          if (res) {
            this.listTasks = this.listTasks.filter((t) => t.id != id);
            this.updates.next([...this.listTasks]);
            Swal.fire('Deleted!', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
