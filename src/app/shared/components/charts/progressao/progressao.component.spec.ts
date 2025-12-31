import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressaoComponent } from './progressao.component';

describe('ProgressaoComponent', () => {
  let component: ProgressaoComponent;
  let fixture: ComponentFixture<ProgressaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
