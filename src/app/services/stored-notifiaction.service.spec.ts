import { TestBed } from '@angular/core/testing';

import { StoredNotifiactionService } from './stored-notifiaction.service';

describe('StoredNotifiactionService', () => {
  let service: StoredNotifiactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoredNotifiactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
