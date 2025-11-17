import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, UserRequest, Usuario } from '../models/user.model';
import { AppSettingsService } from './app-settings.service';



@Injectable({ providedIn: 'root' })
export class AuthService {
  apiUrl: string;

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'usuario';

  constructor(private http: HttpClient, private configService: AppSettingsService) {
    this.carregarUsuario();
    this.apiUrl = this.configService.get().WebApi;  

  }

  login(nome: string, senha: string) {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/login`,
      { nome, senha }
    ).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.usuario));
        this.usuarioSubject.next(response.usuario);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.usuarioSubject.next(null);
  }

  register(data: UserRequest): Observable<UserRequest> {
    const formData = new FormData();
    formData.append('nome', data.nome);
    formData.append('senha', data.senha);
    formData.append('confirmarSenha', data.confirmarSenha);

    if(data.avatar) {
      formData.append('avatar', data.avatar);
    }
    return this.http.post<UserRequest>(`${this.apiUrl}/user`, formData);
  }
  
  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get usuario(): Usuario | null {
    return this.usuarioSubject.value;
  }
  private carregarUsuario() {
    // verifica se está no navegador
    if (typeof window === 'undefined') {
      // estamos no SSR, localStorage não existe
      this.usuarioSubject.next(null);
      return;
    }

    const usuarioStr = localStorage.getItem(this.USER_KEY);
    if (!usuarioStr) {
      this.usuarioSubject.next(null);
      return;
    }

    try {
      const usuario: Usuario = JSON.parse(usuarioStr);
      this.usuarioSubject.next(usuario);
    } catch (e) {
      console.warn('Erro ao carregar usuário do localStorage:', e);
      localStorage.removeItem(this.USER_KEY); // limpa valor inválido
      this.usuarioSubject.next(null);
    }
  }


  isAutenticado(): boolean {
    return !!this.token;
  }
}
