import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartaoComponent } from './cartao.component';
import { CartaoService } from '../../../shared/services/cartao.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { Cartao } from '../../../shared/models/cartao.model';

// Mock Services
class MockCartaoService {
  listar() {
    return of([]);
  }
  criar(cartao: any) {
    return of({});
  }
}

class MockToastrService {
  success(msg: string) { }
  error(msg: string) { }
  warning(msg: string) { }
}

describe('CartaoComponent', () => {
  let component: CartaoComponent;
  let fixture: ComponentFixture<CartaoComponent>;
  let cartaoService: CartaoService;
  let toastrService: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartaoComponent],
      providers: [
        { provide: CartaoService, useClass: MockCartaoService },
        { provide: ToastrService, useClass: MockToastrService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartaoComponent);
    component = fixture.componentInstance;
    cartaoService = TestBed.inject(CartaoService);
    toastrService = TestBed.inject(ToastrService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cards on init', () => {
    const mockCartoes: Cartao[] = [
      { id: 1, nome: 'Test Card', limite: 1000, dia_fatura: 5, dia_vencimento: 10, userid: 1 }
    ];
    spyOn(cartaoService, 'listar').and.returnValue(of(mockCartoes));

    component.ngOnInit();

    expect(cartaoService.listar).toHaveBeenCalled();
    expect(component.cartoes).toEqual(mockCartoes);
  });

  it('should not save if fields are empty', () => {
    spyOn(toastrService, 'warning');
    spyOn(cartaoService, 'criar');

    component.novoCartao = { nome: '', limite: 0, dia_fatura: undefined, dia_vencimento: undefined };
    component.salvar();

    expect(toastrService.warning).toHaveBeenCalledWith('Preencha os campos obrigatórios (Nome, Limite, Dia da Fatura)');
    expect(cartaoService.criar).not.toHaveBeenCalled();
  });

  it('should save new card and reload list', () => {
    const newCard = { nome: 'New Card', limite: 5000, dia_fatura: 15, dia_vencimento: 20 };
    component.novoCartao = { ...newCard };

    spyOn(cartaoService, 'criar').and.returnValue(of({}));
    spyOn(toastrService, 'success');
    spyOn(component, 'carregarCartoes');

    component.salvar();

    expect(cartaoService.criar).toHaveBeenCalledWith(component.novoCartao);
    expect(toastrService.success).toHaveBeenCalledWith('Cartão adicionado com sucesso');
    expect(component.carregarCartoes).toHaveBeenCalled();
    expect(component.novoCartao.nome).toBe(''); // Form reset
  });

  it('should handle error when loading cards', () => {
    spyOn(cartaoService, 'listar').and.returnValue(throwError(() => new Error('Error')));
    spyOn(toastrService, 'error');

    component.carregarCartoes();

    expect(toastrService.error).toHaveBeenCalledWith('Erro ao carregar cartões');
  });

  it('should handle error when saving card', () => {
    component.novoCartao = { nome: 'Error Card', limite: 100, dia_fatura: 1 };
    spyOn(cartaoService, 'criar').and.returnValue(throwError(() => new Error('Error')));
    spyOn(toastrService, 'error');

    component.salvar();

    expect(toastrService.error).toHaveBeenCalledWith('Erro ao salvar cartão');
  });
});
