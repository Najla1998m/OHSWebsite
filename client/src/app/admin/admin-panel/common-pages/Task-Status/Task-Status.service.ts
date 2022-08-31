import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { TaskStatus } from 'src/app/admin/models/taskStatus';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class TaskStatusService {
  baseUrl = environment.apiUrl;
  listTaskStatus: TaskStatus[] = [];
  updates = new Subject<TaskStatus[]>();
  constructor(private http: HttpClient, private toast: ToastrService) {}

  getAllStatusTask() {
    this.http
      .get<TaskStatus[]>(this.baseUrl + `TasksStatusStatus/GetAllTasksStatus`)
      .subscribe(
        (res: any) => {
          this.listTaskStatus = [...res];
          this.updates.next([...this.listTaskStatus]);
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  addTaskStatus(task: TaskStatus) {
    this.http
      .post(this.baseUrl + `TasksStatusStatus/CreateTasksStatus`, task)
      .subscribe(
        (res: any) => {
          if (res) {
            this.listTaskStatus.push(res);
            this.updates.next([...this.listTaskStatus]);
            Swal.fire('Added!', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  editTaskStatus(id: number, tasks: TaskStatus) {
    this.http
      .post(
        this.baseUrl + `TasksStatusStatus/UpdateTasksStatus?id=${id}`,
        tasks
      )
      .subscribe(
        (res: any) => {
          if (res) {
            const index = this.listTaskStatus.findIndex((t) => t.id == id);
            tasks.id = id;
            this.listTaskStatus[index] = tasks;
            this.updates.next([...this.listTaskStatus]);
            Swal.fire('updated', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  deleteTaskStatus(id: number) {
    this.http
      .post(this.baseUrl + `TasksStatusStatus/DeleteTasksStatus?id=${id}`, null)
      .subscribe(
        (res) => {
          if (res) {
            this.listTaskStatus = this.listTaskStatus.filter((t) => t.id != id);
            this.updates.next([...this.listTaskStatus]);
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
