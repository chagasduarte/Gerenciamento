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
    private apiKey: string;
    private apiUrl: string;
    private modelText: string;
    private modelVision: string;

    constructor(
        private readonly http: HttpClient,
        private readonly appSettingService: AppSettingsService,
        private readonly categoriaService: CategoriaService
    ) {
        const settings = this.appSettingService.get();
        this.apiKey = settings.AiApiKey;
        this.apiUrl = settings.AiApiUrl;
        this.modelText = settings.AiModelText || 'llama-3.3-70b-versatile';
        this.modelVision = settings.AiModelVision || 'llama-3.2-11b-vision-preview';
    }

    processMessage(message: string, base64Image?: string): Observable<AiTransaction | null> {
        return this.categoriaService.listar().pipe(
            switchMap(categories => {
                const categoriesList = categories.map(c => `- ID ${c.id}: ${c.nome}`).join('\n');

                const currentDate = new Date().toISOString().split('T')[0];
                const systemPrompt = `Você é um assistente financeiro altamente preciso. Sua tarefa é extrair detalhes de transações de mensagens de texto ou imagens de comprovantes.
        Responda APENAS com o objeto JSON. Não inclua explicações ou texto adicional.
        
        Data de hoje: ${currentDate}
        Categorias disponíveis:
        ${categoriesList}
        
        Estrutura esperada:
        {
          "descricao": "breve descrição",
          "valor": 120.50,
          "data": "AAAA-MM-DD", // Se não houver data mencionada ou visível, pode deixar como null.
          "categoria_id": ID_DA_CATEGORIA,
          "tipo": "saida" ou "entrada"
        }`;

                const userContent: any[] = [{ type: 'text', text: message }];
                let selectedModel = this.modelText;

                if (base64Image) {
                    selectedModel = this.modelVision;
                    userContent.push({
                        type: 'image_url',
                        image_url: {
                            url: `data:image/jpeg;base64,${base64Image.split(',')[1] || base64Image}`
                        }
                    });
                }

                const body: any = {
                    model: selectedModel,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userContent }
                    ],
                    temperature: 0.1
                };

                const headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                });

                return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
                    map(response => {
                        console.log('Resposta bruta da IA:', response);
                        try {
                            let content = response.choices[0].message.content;

                            // Limpar blocos de raciocínio (caso o modelo use)
                            content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

                            if (content.includes('```')) {
                                content = content.split('```')[1];
                                if (content.startsWith('json')) content = content.substring(4);
                                if (content.includes('```')) content = content.split('```')[0];
                            }

                            const firstBrace = content.indexOf('{');
                            const lastBrace = content.lastIndexOf('}');
                            if (firstBrace !== -1 && lastBrace !== -1) {
                                content = content.substring(firstBrace, lastBrace + 1);
                            }

                            return JSON.parse(content.trim()) as AiTransaction;
                        } catch (e) {
                            console.error('Erro de parsing JSON:', e);
                            throw new Error('Falha ao processar os dados da IA.');
                        }
                    }),
                    catchError(err => {
                        console.error('Erro na chamada da API:', err);
                        let msg = 'Erro desconhecido na IA.';
                        if (err.status === 401) msg = 'Chave de API inválida (401).';
                        if (err.status === 404) msg = 'Modelo não encontrado ou desativado (404).';
                        if (err.status === 400) msg = 'Requisição inválida (400). Detalhes: ' + (err.error?.error?.message || '');
                        if (err.status === 0) msg = 'Erro de rede ou CORS.';
                        return throwError(() => new Error(msg));
                    })
                );
            })
        );
    }
}
