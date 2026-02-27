import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiAssistantService } from '../../services/ai-assistant.service';
import { TransacoesService } from '../../services/transacoes.service';
import { AiTransaction } from '../../models/ai-transaction.model';
import { TransacaoModel } from '../../models/despesa.model';
import { ToastrService } from 'ngx-toastr';

interface Message {
    role: 'user' | 'ai';
    content: string;
    transaction?: AiTransaction;
}

@Component({
    selector: 'app-ai-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './ai-chat.component.html',
    styleUrl: './ai-chat.component.css'
})
export class AiChatComponent {
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    isOpen = false;
    userInput = '';
    isTyping = false;
    messages: Message[] = [
        { role: 'ai', content: 'Olá! Sou seu assistente financeiro. Como posso ajudar hoje? Você pode digitar uma despesa ou enviar uma foto de um comprovante.' }
    ];

    constructor(
        private readonly aiService: AiAssistantService,
        private readonly transacoesService: TransacoesService,
        private readonly toastr: ToastrService
    ) { }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            setTimeout(() => this.scrollToBottom(), 100);
        }
    }

    sendMessage() {
        if (!this.userInput.trim()) return;

        const userMsg = this.userInput;
        this.messages.push({ role: 'user', content: userMsg });
        this.userInput = '';
        this.scrollToBottom();

        this.processAi(userMsg);
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const base64 = e.target.result;
                this.messages.push({ role: 'user', content: '[Imagem de comprovante enviada]' });
                this.processAi('Processando comprovante da imagem...', base64);
            };
            reader.readAsDataURL(file);
        }
    }

    private processAi(text: string, image?: string) {
        this.isTyping = true;
        this.scrollToBottom();

        this.aiService.processMessage(text, image).subscribe({
            next: (transaction) => {
                this.isTyping = false;
                if (transaction) {
                    this.messages.push({
                        role: 'ai',
                        content: `Entendi! Encontrei uma transação de ${transaction.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}. Deseja adicionar?`,
                        transaction: transaction
                    });
                } else {
                    this.messages.push({ role: 'ai', content: 'Desculpe, não consegui identificar os detalhes da transação. Pode tentar descrever de outra forma?' });
                }
                this.scrollToBottom();
            },
            error: (err) => {
                this.isTyping = false;
                const errMsg = err.message || 'Ocorreu um erro ao processar sua solicitação. Verifique o console do navegador.';
                this.messages.push({ role: 'ai', content: errMsg });
                this.scrollToBottom();
            }
        });
    }

    confirmTransaction(aiTx: AiTransaction) {
        const model: TransacaoModel = {
            id: 0,
            descricao: aiTx.descricao,
            valor: aiTx.valor,
            tipo: aiTx.tipo,
            categoria: aiTx.categoria_id || 0,
            data: aiTx.data ? new Date(aiTx.data) : new Date(),
            status: 'pago',
            criado_em: new Date(),
            ispaycart: false,
            cartaoid: null
        };

        this.transacoesService.PostTransacao(model).subscribe({
            next: () => {
                this.toastr.success('Transação adicionada com sucesso!');
                this.messages.push({ role: 'ai', content: 'Pronto! A transação foi salva no sistema.' });
                this.messages = this.messages.map(m => {
                    if (m.transaction === aiTx) return { ...m, transaction: undefined };
                    return m;
                });
                this.scrollToBottom();
                this.transacoesService.notificarAlteracao();
            },
            error: () => {
                this.toastr.error('Erro ao salvar transação.');
            }
        });
    }

    cancelTransaction(msg: Message) {
        msg.transaction = undefined;
        this.messages.push({ role: 'ai', content: 'Entendido. Cancelado.' });
        this.scrollToBottom();
    }

    private scrollToBottom() {
        try {
            if (this.scrollContainer) {
                this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
            }
        } catch (err) { }
    }
}
