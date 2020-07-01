import { TestBed } from '@angular/core/testing';

import { ExitService } from './exit.service';

describe('ExitService', () => {
    let service: ExitService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ExitService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
