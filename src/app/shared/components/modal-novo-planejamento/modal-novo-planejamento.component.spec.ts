import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNovoPlanejamentoComponent } from './modal-novo-planejamento.component';

describe('ModalNovoPlanejamentoComponent', () => {
  let component: ModalNovoPlanejamentoComponent;
  let fixture: ComponentFixture<ModalNovoPlanejamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNovoPlanejamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNovoPlanejamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
