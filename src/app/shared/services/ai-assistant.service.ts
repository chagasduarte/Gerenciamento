import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { CategoriaService } from './categoria.service';
import { Observable, from, map, catchError, of, switchMap, throwError } from 'rxjs';
import { AiTransaction } from '../models/ai-transaction.model';

@Injectable({
    providedIn: 'root'
})
export class AiAssistantService {
    private settings: string;

    constructor(
        private readonly http: HttpClient,
        private readonly appSettingService: AppSettingsService,
        private readonly categoriaService: CategoriaService
    ) {
        this.settings = this.appSettingService.get().WebApi;
    }

    processMessage(message: string, base64Image?: string): Observable<AiTransaction | null> {
        return this.http.post<AiTransaction>(`${this.settings}/ai/chat`, { message, base64Image });
    }
}
