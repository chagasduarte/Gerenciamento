import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanejamentoCompComponent } from './planejamento-comp.component';

describe('PlanejamentoCompComponent', () => {
  let component: PlanejamentoCompComponent;
  let fixture: ComponentFixture<PlanejamentoCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanejamentoCompComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanejamentoCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
