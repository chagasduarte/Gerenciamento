import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetivosDetalhesComponent } from './objetivos-detalhes.component';

describe('ObjetivosDetalhesComponent', () => {
  let component: ObjetivosDetalhesComponent;
  let fixture: ComponentFixture<ObjetivosDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjetivosDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjetivosDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
