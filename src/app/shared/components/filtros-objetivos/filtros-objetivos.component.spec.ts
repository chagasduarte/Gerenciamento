import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosObjetivosComponent } from './filtros-objetivos.component';

describe('FiltrosObjetivosComponent', () => {
  let component: FiltrosObjetivosComponent;
  let fixture: ComponentFixture<FiltrosObjetivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosObjetivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosObjetivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
