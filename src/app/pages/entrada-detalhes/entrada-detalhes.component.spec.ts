import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaDetalhesComponent } from './entrada-detalhes.component';

describe('EntradaDetalhesComponent', () => {
  let component: EntradaDetalhesComponent;
  let fixture: ComponentFixture<EntradaDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntradaDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
