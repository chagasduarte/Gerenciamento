import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;

  constructor() { }

  login(username: string, password: string): boolean {
    // Aqui você deve implementar a autenticação real
    if (username === 'xuxu' && password === 'xuxuzinha') {
      this.loggedIn = true;
      return true;
    }
    return false;
  }

  logout() {
    this.loggedIn = false;
  }

  isLoggedIn(): boolean {
    return true;
  }
}
