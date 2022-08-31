import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Role } from '../../shared/models/role';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private readonly url = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getChildRoles() {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http.get<Role[]>(
          environment.apiUrl + `Roles/GetChildRoles?userId=${user?.getUserId()}`
        );
      })
    );
  }
}
