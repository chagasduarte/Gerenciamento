import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumoObjetivosComponent } from './resumo-objetivos.component';

describe('ResumoObjetivosComponent', () => {
  let component: ResumoObjetivosComponent;
  let fixture: ComponentFixture<ResumoObjetivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumoObjetivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumoObjetivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
