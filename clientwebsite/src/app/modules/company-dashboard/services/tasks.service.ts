import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LocalStorageServiceService } from '../../core/services/local-storage-service.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly url = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private localService: LocalStorageServiceService
  ) {}

  GetTasksByUserId() {
    let id = this.localService.UserId;
    return this.http.get(this.url + `Tasks/GetTasksByUserId?userId=${id}`).pipe(
      map((data: any) => {
        return data.map((e: any) => {
          e.extraFields = JSON.parse(e.extraFields);
          e.taskLocation = JSON.parse(e.taskLocation);

          return e;
        });
      })
    );
  }

  GetTasksForManagement(id: number) {
    return this.http
      .get(this.url + `Tasks/GetTasksForManagement?managementId=${id}`)
      .pipe(
        map((data: any) => {
          return data.map((e: any) => {
            e.extraFields = JSON.parse(e.extraFields);
            e.taskLocation = JSON.parse(e.taskLocation);

            return e;
          });
        })
      );
  }

  GetTasksById(taskId: number) {
    return this.http.get(this.url + `Tasks/GetTasksById/${taskId}`).pipe(
      map((e: any) => {
        e.extraFields = JSON.parse(e.extraFields);
        e.taskLocation = JSON.parse(e.taskLocation);
        return e;
      })
    );
  }

  DeleteTasksById(id: number) {
    return this.http.post(this.url + `Tasks/DeleteTasks?id=${id}`, null);
  }
}
