import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Funcion } from './funcion';

describe('Funcion', () => {
  let component: Funcion;
  let fixture: ComponentFixture<Funcion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Funcion],
    }).compileComponents();

    fixture = TestBed.createComponent(Funcion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
