import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FedexSignupComponent } from './fedex-signup.component';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { SignupService } from '@fedex/shared/services/signup.service';

describe('FedexSignupComponent', () => {
  let component: FedexSignupComponent;
  let fixture: ComponentFixture<FedexSignupComponent>;
  let signUpForm: FormGroup;
  let signupService: SignupService;
  let signUpFormElement: DebugElement;
  let inputElements: Array<DebugElement>;

  const formGroupValue = {
    firstName: 'John',
    lastName: 'Lennon',
    email: 'john.lennon@test.com',
    password: 'helloWorld2!@3',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [FormBuilder],
      declarations: [FedexSignupComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FedexSignupComponent);
    component = fixture.componentInstance;
    signupService = TestBed.inject(SignupService);
    fixture.detectChanges();

    signUpFormElement = fixture.debugElement.query(
      By.css('.fedex-signup-container form')
    );
    inputElements = signUpFormElement.queryAll(By.css('input'));
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should render all form elements', () => {
    expect(inputElements.length).toEqual(4);
  });

  it('should check form elements default values', () => {
    signUpForm = component.signupForm;
    const signupFormValues = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };

    expect(signUpForm.value).toEqual(signupFormValues);
  });

  it('should check if email is invalid', async () => {
    const formControlEmail = component.signupForm.get('email');
    formControlEmail?.setValue('test$Test');
    formControlEmail?.markAsTouched();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(formControlEmail?.errors).not.toBeNull();
    expect(formControlEmail?.errors?.['email']).toBeTruthy();

    const matErrorEl: HTMLElement = fixture.debugElement.query(
      By.css('#emailInvalidError')
    ).nativeElement;
    expect(matErrorEl).toBeTruthy();
    expect(matErrorEl.innerText).toBe('Email is invalid');
  });

  describe('Password validation::', () => {
    let formControlPassword: AbstractControl | null;
    beforeEach(() => {
      formControlPassword = component.signupForm.get('password');
    });
    it('should show "minimum 8 characters" error if password is less than 8 letters', async () => {
      formControlPassword?.setValue('hello');
      formControlPassword?.markAsTouched();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(formControlPassword?.errors).not.toBeNull();
      expect(formControlPassword?.errors?.['minlength']).toBeTruthy();

      const matErrorEl: HTMLElement = fixture.debugElement.query(
        By.css('#passwordLessThanMinimumLetters')
      ).nativeElement;
      expect(matErrorEl).toBeTruthy();
      expect(matErrorEl.innerText).toBe(
        'Password should be minimum 8 characters'
      );
    });

    it('should not show "minimum 8 characters" error if password is 8 letters or more', async () => {
      formControlPassword?.setValue('helloworld');
      formControlPassword?.markAsTouched();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(formControlPassword?.errors?.['minlength']).toBeFalsy();

      const matErrorEl: HTMLElement = fixture.debugElement.query(
        By.css('#passwordLessThanMinimumLetters')
      )?.nativeElement;
      expect(matErrorEl).toBeUndefined();
    });

    it('should show "lower case and upper case letters" error if password does not contain them', async () => {
      const formControlPassword = component.signupForm.get('password');
      formControlPassword?.setValue('helloworld');
      formControlPassword?.markAsTouched();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(formControlPassword?.errors).not.toBeNull();
      expect(
        formControlPassword?.errors?.['lowerCaseUpperCaseLetters']
      ).toBeTruthy();

      const matErrorEl: HTMLElement = fixture.debugElement.query(
        By.css('#passwordWithLowerCaseUppercase')
      ).nativeElement;
      expect(matErrorEl).toBeTruthy();
      expect(matErrorEl.innerText).toBe(
        'Password should contain lower case and upper case letters'
      );
    });

    it('should not show "lower case and upper case letters" error if password contains them', async () => {
      const formControlPassword = component.signupForm.get('password');
      formControlPassword?.setValue('helloWORLD');
      formControlPassword?.markAsTouched();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(
        formControlPassword?.errors?.['lowerCaseUpperCaseLetters']
      ).toBeFalsy();

      const matErrorEl: HTMLElement = fixture.debugElement.query(
        By.css('#passwordWithLowerCaseUppercase')
      )?.nativeElement;
      expect(matErrorEl).toBeUndefined();
    });

    it('should show "first name or last name" error if password is contains them', async () => {
      const formControlFirstName = component.signupForm.get('firstName');
      formControlFirstName?.setValue('John');
      formControlFirstName?.markAsTouched();

      formControlPassword?.setValue('helloJohn');
      formControlPassword?.markAsTouched();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(formControlPassword?.errors).not.toBeNull();
      expect(formControlPassword?.errors?.['invalidPassword']).toBeTruthy();

      const matErrorEl: HTMLElement = fixture.debugElement.query(
        By.css('#passwordWithFirstOrLastName')
      ).nativeElement;
      expect(matErrorEl).toBeTruthy();
      expect(matErrorEl.innerText).toBe(
        'Password should not contain first name or last name'
      );
    });

    it('should not show "first name or last name" error if password does not contain them', async () => {
      const formControlFirstName = component.signupForm.get('firstName');
      formControlFirstName?.setValue('John');
      formControlFirstName?.markAsTouched();

      formControlPassword?.setValue('helloWorld');
      formControlPassword?.markAsTouched();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(formControlPassword?.errors).toBeNull();
      expect(formControlPassword?.errors?.['invalidPassword']).toBeFalsy();

      const matErrorEl: HTMLElement = fixture.debugElement.query(
        By.css('#passwordWithFirstOrLastName')
      )?.nativeElement;
      expect(matErrorEl).toBeUndefined();
    });
  });

  describe('Sign up::', () => {
    let signUpFormSubmitSpy: jasmine.Spy;

    beforeEach(() => {
      signUpFormSubmitSpy = spyOn(signupService, 'signUp').and.callThrough();

      inputElements = signUpFormElement.queryAll(By.css('input'));
      inputElements[0].nativeElement.value = formGroupValue.firstName;
      inputElements[1].nativeElement.value = formGroupValue.lastName;
      inputElements[2].nativeElement.value = formGroupValue.email;
      inputElements[3].nativeElement.value = formGroupValue.password;

      inputElements.forEach((inputElement: DebugElement) => {
        inputElement.nativeElement.dispatchEvent(new Event('input'));
      });

      signUpFormElement.triggerEventHandler('submit', null);
      fixture.detectChanges();
    });

    it('should check if form is valid when all validations are fulfilled', () => {
      const isSignupFormValid = component.signupForm.valid;
      expect(isSignupFormValid).toBeTruthy();
    });

    it('should submit succesfully when form data is valid', () => {
      const isSignupFormValid = component.signupForm.valid;
      expect(isSignupFormValid).toBeTruthy();
      expect(signUpFormSubmitSpy).toHaveBeenCalledOnceWith(formGroupValue);
    });
  });
});
