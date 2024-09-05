import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './loggin.component.html',
  standalone: true,
  imports:[
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./loggin.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, 
    private router: Router,
    private readonly toastrService: ToastrService
  ) {}

  onLogin() {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['home']); // Redireciona para a página principal ou dashboard
    } else {
      this.toastrService.error("Usuário ou senha inválido");
    }
  }
}
