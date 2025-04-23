import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContasDetalheComponent } from './contas-detalhe.component';

describe('ContasDetalheComponent', () => {
  let component: ContasDetalheComponent;
  let fixture: ComponentFixture<ContasDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContasDetalheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContasDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
