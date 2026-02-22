import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    styleUrls: ['./landing.component.css']
})
export class LandingComponent {
    username: string = '';
    password: string = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private readonly toastrService: ToastrService
    ) { }

    onLogin() {
        this.authService.login(this.username, this.password).subscribe({
            next: () => {
                this.router.navigate(['home']);
            },
            error: (err) => {
                this.toastrService.error(err);
            }
        });
    }

    registrar() {
        this.router.navigate(["register"]);
    }

    scrollToDescription() {
        const element = document.getElementById('description');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
