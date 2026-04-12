import { TestBed } from '@angular/core/testing';

import { DataTable } from './data-table';

describe('DataTable', () => {
  let service: DataTable;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataTable);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
