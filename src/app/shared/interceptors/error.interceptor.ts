import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastService: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        let mensagem = 'Ocorreu um erro inesperado.';
       //// Implementar chain of reponsability
        if (error.status === 0) {
          mensagem = 'Falha na comunicação com o servidor.';
        } else if (error.status === 401 || error.status == 403) {
          mensagem = 'Sessão expirada. Faça login novamente.';
          this.router.navigate(['login']);
        } else if (error.status === 404) {
          mensagem = 'Recurso não encontrado.';
        } else if (error.status === 500) {
          mensagem = 'Erro interno do servidor.';
        } else if ( error.status == 405){
          this.toastService.warning("Preencha os dados")
          mensagem = error.error
          this.router.navigate(["config"]);
        }
        return throwError(() => new Error(mensagem));
      })
    );
  }
}
