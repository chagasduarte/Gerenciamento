import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogged = false;
  constructor() { 
    if (typeof window !== 'undefined') {
    this.isLogged = localStorage.getItem('isLoggedIn') == 'true';
  }}

  login(username: string, password: string): boolean {
    // Aqui você deve implementar a autenticação real
    if (username === 'xuxu' && password === 'xuxuzinha') {
      if (typeof window !== 'undefined') {
        this.isLogged = true;
        localStorage.setItem('isLoggedIn', 'true');
      }
      return true;
    }
    return false;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'false');
    }
  }

  IsLoggedIn(): boolean {
    return this.isLogged;
  }
}
