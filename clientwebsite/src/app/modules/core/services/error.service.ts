import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private router: Router) {}

  handleError(err: HttpErrorResponse) {
    let message = err.error.message;

    Swal.fire({
      icon: 'error',
      text: message,
    });
  }
}
