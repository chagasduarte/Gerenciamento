import { TestBed } from '@angular/core/testing';

import { PlanejamentoService } from './planejamento.service';

describe('PlanejamentoService', () => {
  let service: PlanejamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanejamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
