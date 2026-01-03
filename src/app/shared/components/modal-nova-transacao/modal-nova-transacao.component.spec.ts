import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNovaTransacaoComponent } from './modal-nova-transacao.component';

describe('ModalNovaTransacaoComponent', () => {
  let component: ModalNovaTransacaoComponent;
  let fixture: ComponentFixture<ModalNovaTransacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNovaTransacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNovaTransacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
