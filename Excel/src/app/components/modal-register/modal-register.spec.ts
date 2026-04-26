import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRegister } from './modal-register';

describe('ModalRegister', () => {
  let component: ModalRegister;
  let fixture: ComponentFixture<ModalRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRegister],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
