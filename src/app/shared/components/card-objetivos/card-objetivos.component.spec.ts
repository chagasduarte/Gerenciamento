import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardObjetivosComponent } from './card-objetivos.component';

describe('CardObjetivosComponent', () => {
  let component: CardObjetivosComponent;
  let fixture: ComponentFixture<CardObjetivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardObjetivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardObjetivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
