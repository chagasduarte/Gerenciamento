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
    imports: [
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
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['home']); // Redireciona para a página principal ou dashboard
      },
      error: (err) => {
        this.toastrService.error(err.message);
      }
    })
    
  }
}
