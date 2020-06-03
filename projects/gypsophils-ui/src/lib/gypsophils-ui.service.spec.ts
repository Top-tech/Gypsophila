import { TestBed } from '@angular/core/testing';

import { GypsophilsUiService } from './gypsophils-ui.service';

describe('GypsophilsUiService', () => {
  let service: GypsophilsUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GypsophilsUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
