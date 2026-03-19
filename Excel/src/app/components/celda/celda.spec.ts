import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Celda } from './celda';

describe('Celda', () => {
  let component: Celda;
  let fixture: ComponentFixture<Celda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Celda],
    }).compileComponents();

    fixture = TestBed.createComponent(Celda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
