import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private router: Router) {}

  handleError(err: any) {
    let message = err;
    switch (err.status) {
      case 401:
        Swal.fire({
          icon: 'error',
          text: message,
        }).then(() => {
          this.router.navigate(['/auth/login']);
        });
        break;
      default:
        Swal.fire({
          icon: 'error',
          text: message,
        });
        break;
    }
  }
}
