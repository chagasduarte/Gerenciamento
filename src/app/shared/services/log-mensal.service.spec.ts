import { TestBed } from '@angular/core/testing';

import { LogMensalService } from './log-mensal.service';

describe('LogMensalService', () => {
  let service: LogMensalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogMensalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
