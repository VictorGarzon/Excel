import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLogin } from './modal-login';

describe('ModalLogin', () => {
  let component: ModalLogin;
  let fixture: ComponentFixture<ModalLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
