import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CirclePercentComponent } from './circle-percent.component';

describe('CirclePercentComponent', () => {
  let component: CirclePercentComponent;
  let fixture: ComponentFixture<CirclePercentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CirclePercentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CirclePercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
