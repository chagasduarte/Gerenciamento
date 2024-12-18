import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { LogMensal } from '../models/logMensal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogMensalService {

api: string;
  constructor(
    private readonly http: HttpClient,
    private readonly appSettingService: AppSettingsService 
  ) {
    this.api = appSettingService.get().WebApi + "/Logs";
  }

  getAllLogs(ano: number): Observable<LogMensal[]>{
    return this.http.get<LogMensal[]>(`${this.api}?ano=${ano}`);
  }
  postLog(log: LogMensal): Observable<LogMensal> {
    return this.http.post<LogMensal>(`${this.api}`, log);
  }
}
