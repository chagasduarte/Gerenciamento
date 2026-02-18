// importar-fatura.util.ts
import { TransacaoModel } from '../../shared/models/despesa.model';

export type CategoriaMap = Record<string, number>;

export interface ImportarFaturaOpts {
    cartaoId: number | null;
    categoriaMap: CategoriaMap;      // ex: { SUPERMERCADO: 3, RESTAURANTES: 5, OUTROS: 9 }
    statusPadrao?: string;           // ex: 'PAGO' | 'PENDENTE'
    tipoPadrao?: string;             // ex: 'SAIDA'
    isPayCartPadrao?: boolean;       // normalmente true pra fatura
}

export async function converterArquivoCsvParaTransacoes(
    file: File,
    opts: ImportarFaturaOpts
): Promise<TransacaoModel[]> {
    const texto = await lerArquivoComoTexto(file);

    // Remove BOM e normaliza quebras de linha
    const limpo = texto.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').trim();
    if (!limpo) return [];

    const linhas = limpo.split('\n').filter(l => l.trim().length > 0);
    if (linhas.length < 2) return [];

    const header = parseCsvLine(linhas[0]).map(h => h.trim().replace(/^"|"$/g, ''));
    const idxData = header.findIndex(h => normalizarHeader(h) === 'data');
    const idxLanc = header.findIndex(h => normalizarHeader(h) === 'lancamento');
    const idxCat = header.findIndex(h => normalizarHeader(h) === 'categoria');
    const idxTipo = header.findIndex(h => normalizarHeader(h) === 'tipo');
    const idxVal = header.findIndex(h => normalizarHeader(h) === 'valor');

    if ([idxData, idxLanc, idxCat, idxTipo, idxVal].some(i => i < 0)) {
        throw new Error('CSV inválido: cabeçalho esperado (Data, Lançamento, Categoria, Tipo, Valor).');
    }

    const transacoes: TransacaoModel[] = [];

    for (let i = 1; i < linhas.length; i++) {
        const cols = parseCsvLine(linhas[i]);
        if (cols.length === 0) continue;

        const dataStr = desquote(cols[idxData]);
        const descStr = desquote(cols[idxLanc]);
        const catStr = desquote(cols[idxCat]);
        const tipoStr = desquote(cols[idxTipo]);
        const valStr = desquote(cols[idxVal]);

        const data = parseDataBR(dataStr);
        const valor = parseMoedaBR(valStr);

        const catKey = (catStr || '').trim().toUpperCase();
        const t = new TransacaoModel();
        t.id = 0; // novo
        t.descricao = (descStr || '').trim();
        t.tipo = opts.tipoPadrao ?? inferirTipo(tipoStr);  // geralmente SAIDA
        t.valor = valor;

        // Se seu backend usa `categoria` como ID numérico:
        t.categoria = 0;
        t.idcategoria = 0;

        t.data = data;
        t.status = opts.statusPadrao ?? 'PAGO';
        t.criado_em = new Date();
        t.ispaycart = opts.isPayCartPadrao ?? true;
        t.cartaoid = opts.cartaoId ?? null;

        // Se você marca pagamento quando já está efetivado:
        t.pagamento = (t.status.toUpperCase() === 'PAGO') ? data : undefined;

        // Ignora linhas sem valor/descrição
        if (!t.descricao || !Number.isFinite(t.valor)) continue;

        transacoes.push(t);
    }

    return transacoes;
}

/** ============ helpers ============ */

function lerArquivoComoTexto(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(reader.error ?? new Error('Falha ao ler arquivo'));
        reader.readAsText(file, 'utf-8');
    });
}

// Parser simples para CSV com aspas (seu arquivo vem com "coluna","coluna"...)
function parseCsvLine(line: string): string[] {
    const out: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];

        if (ch === '"') {
            // aspas duplicadas dentro de campo: ""
            if (inQuotes && line[i + 1] === '"') {
                cur += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (ch === ',' && !inQuotes) {
            out.push(cur);
            cur = '';
            continue;
        }

        cur += ch;
    }

    out.push(cur);
    return out.map(s => s.trim());
}

function desquote(v: string): string {
    const t = (v ?? '').trim();
    return t.replace(/^"|"$/g, '');
}

function normalizarHeader(h: string): string {
    return (h || '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/\s+/g, '');
}

function parseDataBR(ddmmyyyy: string): Date {
    // ex: 15/02/2026
    const m = (ddmmyyyy || '').trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return new Date(NaN);
    const dd = Number(m[1]);
    const mm = Number(m[2]);
    const yyyy = Number(m[3]);
    return new Date(yyyy, mm - 1, dd);
}

function parseMoedaBR(valor: string): number {
    // ex: "R$ 12,00" (tem NBSP), "12,00", "-R$ 10,50"
    const s = (valor || '')
        .replace(/\u00A0/g, ' ')       // NBSP -> espaço normal
        .replace(/[R$\s]/g, '')        // remove R$, espaços
        .replace(/\./g, '')            // remove separador milhar
        .replace(',', '.')             // vírgula -> ponto
        .trim();

    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
}

function inferirTipo(tipoArquivo: string): string {
    const t = (tipoArquivo || '').toLowerCase();
    // na fatura do Inter, geralmente é compra (saída)
    if (t.includes('compra') || t.includes('pagamento')) return 'SAIDA';
    return 'SAIDA';
}
