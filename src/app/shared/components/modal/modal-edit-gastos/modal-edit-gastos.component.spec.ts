import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditGastosComponent } from './modal-edit-gastos.component';

describe('ModalEditGastosComponent', () => {
  let component: ModalEditGastosComponent;
  let fixture: ComponentFixture<ModalEditGastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditGastosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditGastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
