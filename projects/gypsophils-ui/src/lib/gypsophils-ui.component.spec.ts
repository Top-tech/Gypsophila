import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GypsophilsUiComponent } from './gypsophils-ui.component';

describe('GypsophilsUiComponent', () => {
  let component: GypsophilsUiComponent;
  let fixture: ComponentFixture<GypsophilsUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GypsophilsUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GypsophilsUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
