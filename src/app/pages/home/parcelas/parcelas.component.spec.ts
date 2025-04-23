import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelasComponent } from './parcelas.component';

describe('ParcelasComponent', () => {
  let component: ParcelasComponent;
  let fixture: ComponentFixture<ParcelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
