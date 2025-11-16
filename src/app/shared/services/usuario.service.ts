import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
   api: string;
  constructor(
    private readonly http: HttpClient,
    private readonly appSettingService: AppSettingsService 
  ) {
    this.api = appSettingService.get().WebApi;
  }
  getAvatar(userid: number | null): Observable<any>{
    if(userid == null)
      return this.http.get<any>(`${this.api}/user/avatar`);
    else 
      return this.http.get<any>(`${this.api}/user/${userid}/avatar`);
  }
}
