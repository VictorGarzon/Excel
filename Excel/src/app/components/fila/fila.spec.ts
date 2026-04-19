import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fila } from './fila';

describe('Fila', () => {
  let component: Fila;
  let fixture: ComponentFixture<Fila>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fila],
    }).compileComponents();

    fixture = TestBed.createComponent(Fila);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
