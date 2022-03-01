import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { FedexSignupComponent } from './fedex-signup.component';

describe('FedexSignupComponent', () => {
  let component: FedexSignupComponent;
  let fixture: ComponentFixture<FedexSignupComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      providers: [FormBuilder],
      declarations: [ FedexSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FedexSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
