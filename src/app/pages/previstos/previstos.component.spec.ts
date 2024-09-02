import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevistosComponent } from './previstos.component';

describe('PrevistosComponent', () => {
  let component: PrevistosComponent;
  let fixture: ComponentFixture<PrevistosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrevistosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrevistosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
