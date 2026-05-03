import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPermisos } from './modal-permisos';

describe('ModalPermisos', () => {
  let component: ModalPermisos;
  let fixture: ComponentFixture<ModalPermisos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPermisos],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPermisos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
