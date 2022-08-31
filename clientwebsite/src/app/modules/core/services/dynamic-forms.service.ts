import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Form } from '../../shared/models/form';

@Injectable({
  providedIn: 'root',
})
export class DynamicFormsService {
  private readonly url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllFormsByDepartmentId(id: number) {
    return this.http.get<Form>(
      this.url + `Form/GetAllFormsByDepartementId?departementId=${id}`
    );
  }

  createTask(model: any) {
    return this.http.post(this.url + `Tasks/CreateTasks`, model);
  }

  /* -------------------------------------------------------------------------- */
  getAllTasksLevel() {
    return this.http.get(this.url + `TasksLevelsContoller/GetAllTasksLevels`);
  }

  getAllTaskStatus() {
    return this.http.get(this.url + `TasksStatusStatus/GetAllTasksStatus`);
  }

  getAllUsersInCompany(id: number) {
    return this.http.get(
      this.url + `Users/GetAllUserInCompany?CompanyId=${id}`
    );
  }

  UpdateTasks(model: any) {
    return this.http.post(this.url + `Tasks/UpdateTasks?id=${model.id}`, model);
  }

  GetTasksForForm(formId: number) {
    return this.http.get(this.url + `Tasks/GetTasksForForm?formId=${formId}`);
  }
}
