import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    const authToken = localStorage.getItem('token');
    let authReq = req;

    if (authToken) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Token ${authToken}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            console.error('Unauthorized request:', err);
            this.router.navigateByUrl('/login');
          }
        }
        return throwError(() => err);
      })
    );
  }
}
