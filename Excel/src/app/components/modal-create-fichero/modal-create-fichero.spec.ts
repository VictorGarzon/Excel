import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateFichero } from './modal-create-fichero';

describe('ModalCreateFichero', () => {
  let component: ModalCreateFichero;
  let fixture: ComponentFixture<ModalCreateFichero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateFichero],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCreateFichero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
