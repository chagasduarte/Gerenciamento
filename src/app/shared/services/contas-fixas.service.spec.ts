import { TestBed } from '@angular/core/testing';

import { ContasFixasService } from './contas-fixas.service';

describe('ContasFixasService', () => {
  let service: ContasFixasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContasFixasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
