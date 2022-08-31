import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { User } from './models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageServiceService } from '../services/local-storage-service.service';

export interface AuthResponseData {
  username: string;
  id: string;
  email: string;
  isActive: boolean;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = environment.apiUrl;
  user = new BehaviorSubject<User | null>(null);
  private tokenTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localService: LocalStorageServiceService
  ) {}

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData | { message: string; code: number }>(
        this.url + `Account/login`,
        {
          email: email,
          password: password,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((res: any) => {
          if (res.message) {
            return res;
          } else {
            this.handleAuth(res.email, res.username, res.token);
            return false;
          }
        })
      );
  }

  registerVendorCompany(user: any) {
    return this.http.post<AuthResponseData>(
      this.url + `Account/RegsiterCompanyVendor`,
      user
    );
  }

  registerVendorIndividual(user: any) {
    return this.http.post<AuthResponseData>(
      this.url + `Account/RegsiterIndividualVendor`,
      user
    );
  }

  registerCompanyOwner(user: any) {
    return this.http.post<AuthResponseData>(
      this.url + `Account/RegsiterCompany`,
      user
    );
  }

  getResetPasswordToken(email: string) {
    return this.http.post(this.url + `Account/ResetPassword`, { email: email });
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/home']);
    localStorage.removeItem('user');
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
    }

    this.tokenTimer = null;
  }

  verifySignInCode(model: { code: string; email: string }) {
    return this.http.post(this.url + `Account/VerifySignInCode`, model).pipe(
      catchError(this.handleError),
      tap((res: any) => {
        this.handleAuth(res.email, res.username, res.token);
      })
    );
  }

  GetResetPasswordToken(model: { code: string; email: string }) {
    return this.http.post(this.url + `Account/GetResetPasswordToken`, model);
  }

  VerifyResetPassword(model: {
    email: string;
    password: string;
    confirmPassword: string;
    token: string;
  }) {
    return this.http.post(this.url + `Account/VerifyResetPassword`, model);
  }

  private handleAuth(email: string, username: string, token: string) {
    const user = new User(email, username, token);
    this.user.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userId', user.getUserId());
    this.localService.UserRole = user.getRole();

    // let expireDate = this.helper.getTokenExpirationDate(user.token).getTime();
    let expireDate = 2147483647;
    // this.autoLogout(expireDate);
    user;
  }

  autoLogout(timeout: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, timeout);
  }

  autoLogin() {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (!user) {
      return;
    }

    const loadedUser = new User(user.email, user.username, user._token);

    if (loadedUser.token) {
      this.user.next(loadedUser);

      localStorage.setItem('userId', loadedUser.getUserId());
      // const expireDate =
      //   this.helper.getTokenExpirationDate(loadedUser.token).getTime() -
      //   new Date().getTime();

      const expireDate = 2147483647;

      this.autoLogout(expireDate);
    }
  }

  private handleError(err: HttpErrorResponse) {
    let message = '';
    switch (err.status) {
      case 404:
        message = 'Please Check your internet connection';
        break;
      case 401:
        message = 'UnAuthorized';
        break;
      default:
        message = err.error;
        break;
      // ...... continue
    }

    return throwError(message);
  }
}
