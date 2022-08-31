import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { User } from './User';

interface AuthResponseData {
  username: string;
  email: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = environment.apiUrl;
  // private readonly url = '/api/Account/login'; //ده ممكن يكون حل لو انت متاكد ان ال ابي اي و اللانجولار هيكونو على نفس الدومين

  user = new BehaviorSubject<User>(null);
  private tokenTimer: any;
  private helper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http
      .post(this.url + `Account/login`, {
        email: email,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        tap((res: any) => {
          return res;
        })
      );
  }

  verifySignInCode(model: { code: string; email: string }) {
    this.http.post(this.url + `Account/VerifySignInCode`, model).subscribe(
      (res: any) => {
        console.log(res, 'verfy');

        this.handleAuth(res.email, res.username, res.token, res.roles);
        this.router.navigateByUrl('/admin/admin-panel/dashboard');
      },
      (err) => {
        this.handleError(err);
      }
    );
  }
  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('user');
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
    }

    this.tokenTimer = null;
  }

  autoLogin() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      return;
    }

    const loadedUser = new User(
      user.email,
      user.username,
      user._token,
      user.roles
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      // const expireDate =
      //   this.helper.getTokenExpirationDate(loadedUser.token).getTime() -
      //   new Date().getTime();

      const expireDate = 2147483647;

      // this.autoLogout(expireDate);
      this.router.navigateByUrl('/admin/admin-panel/dashboard');
    }
  }

  autoLogout(timeout: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, timeout);
  }

  private handleAuth(
    email: string,
    username: string,
    token: string,
    roles: any
  ) {
    console.log('handle auth', roles);

    const user = new User(email, username, token, roles);

    this.user.next(user);
    localStorage.setItem('user', JSON.stringify(user));

    // let expireDate = this.helper.getTokenExpirationDate(user.token).getTime();
    let expireDate = 2147483647;
    this.autoLogout(expireDate);
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
