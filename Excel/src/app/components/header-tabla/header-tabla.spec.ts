import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderTabla } from './header-tabla';

describe('HeaderTabla', () => {
  let component: HeaderTabla;
  let fixture: ComponentFixture<HeaderTabla>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderTabla],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderTabla);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
