import { TestBed } from '@angular/core/testing';

import { StockHistoryService } from './stock-history.service';

describe('StockHistoryService', () => {
  let service: StockHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
