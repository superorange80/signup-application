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
import { SignedupUserResponse } from '@fedex/shared/models/signed-up-user-response';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControlsEnum } from '@fedex/shared/enums/form-controls';

describe('FedexSignupComponent', () => {
  let component: FedexSignupComponent;
  let fixture: ComponentFixture<FedexSignupComponent>;
  let signUpForm: FormGroup;
  let signupService: SignupService;
  let signUpFormElement: DebugElement;
  let inputElements: Array<DebugElement>;

  const formGroupValue = {
    [FormControlsEnum.FirstName]: 'John',
    [FormControlsEnum.LastName]: 'Lennon',
    [FormControlsEnum.Email]: 'john.lennon@test.com',
    [FormControlsEnum.Password]: 'helloWorld2!@3',
  };

  const responseMock: Array<SignedupUserResponse> = [
    {
      _id: '2ec1d5a7-2836-4c87-9228-88e2b29ad4d1',
      email: 'john.lennon@test.com',
      firstName: 'John',
      lastName: 'Lennon',
    },
  ];

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
      By.css('.fedex-signup__container form')
    );
    inputElements = signUpFormElement.queryAll(By.css('input'));
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should have title "Fedex.com Signup"', () => {
    const titleElement: HTMLElement = fixture.debugElement.query(
      By.css('.fedex-signup__container h1')
    ).nativeElement;
    expect(titleElement.innerText).toEqual('Fedex.com Signup');
  });

  it('should render all form elements', () => {
    expect(inputElements.length).toEqual(4);
  });

  it('should check form elements default values', () => {
    signUpForm = component.signupForm;
    const signupFormValues = {
      [FormControlsEnum.FirstName]: '',
      [FormControlsEnum.LastName]: '',
      [FormControlsEnum.Email]: '',
      [FormControlsEnum.Password]: '',
    };

    expect(signUpForm.value).toEqual(signupFormValues);
  });

  it('should check "required" validations for form elements', async () => {
    signUpForm = component.signupForm;
    signUpFormElement.triggerEventHandler('submit', null);
    fixture.detectChanges();
    await fixture.whenStable();

    inputElements.forEach((inputElement: DebugElement) => {
      let formControlName = inputElement.attributes[
        'formControlName'
      ] as string;
      let formControl = signUpForm?.get(formControlName);

      expect(formControl?.errors).not.toBeNull();
    });
  });

  it('should check if email is invalid', async () => {
    const formControlEmail = component.signupForm.get(FormControlsEnum.Email);
    formControlEmail?.setValue('test$Test');
    formControlEmail?.markAsTouched();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(formControlEmail?.errors).not.toBeNull();
    expect(formControlEmail?.errors?.[FormControlsEnum.Email]).toBeTruthy();

    const matErrorEl: HTMLElement = fixture.debugElement.query(
      By.css('#emailInvalidError')
    ).nativeElement;
    expect(matErrorEl).toBeTruthy();
    expect(matErrorEl.innerText).toBe('Email is invalid');
  });

  describe('Password validation::', () => {
    let formControlPassword: AbstractControl | null;
    beforeEach(() => {
      formControlPassword = component.signupForm.get(FormControlsEnum.Password);
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
        'Password must be minimum 8 characters'
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
      const formControlPassword = component.signupForm.get(FormControlsEnum.Password);
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
        'Password must contain at least 1 upper case letter, 1 lower case letter. Ex: HelloWorld'
      );
    });

    it('should not show "lower case and upper case letters" error if password contains them', async () => {
      const formControlPassword = component.signupForm.get(FormControlsEnum.Password);
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
      const formControlFirstName = component.signupForm.get(FormControlsEnum.FirstName);
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
        'Password must not contain first name or last name'
      );
    });

    it('should not show "first name or last name" error if password does not contain them', async () => {
      const formControlFirstName = component.signupForm.get(FormControlsEnum.FirstName);
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
      inputElements = signUpFormElement.queryAll(By.css('input'));
      inputElements[0].nativeElement.value = formGroupValue.firstName;
      inputElements[1].nativeElement.value = formGroupValue.lastName;
      inputElements[2].nativeElement.value = formGroupValue.email;
      inputElements[3].nativeElement.value = formGroupValue.password;

      inputElements.forEach((inputElement: DebugElement) => {
        inputElement.nativeElement.dispatchEvent(new Event('input'));
      });
    });

    it('should reset form when all validations are fulfilled and form is submitted successfully', () => {
      signUpFormSubmitSpy = spyOn(signupService, 'signUp').and.returnValue(
        of(responseMock)
      );
      signUpFormElement.triggerEventHandler('submit', null);
      fixture.detectChanges();
      const isSignupFormValid = component.signupForm.valid;
      expect(isSignupFormValid).toBeFalsy();
    });

    it('should submit succesfully when form data is valid', async () => {
      signUpFormSubmitSpy = spyOn(signupService, 'signUp').and.returnValue(
        of(responseMock)
      );
      signUpFormElement.triggerEventHandler('submit', null);
      fixture.detectChanges();
      await fixture.whenStable();

      const feedbackMessageElement = fixture.debugElement.query(
        By.css('.fedex-signup__feedback')
      );
      expect(signUpFormSubmitSpy).toHaveBeenCalledOnceWith(formGroupValue);

      expect(feedbackMessageElement.nativeElement.innerText).toEqual(
        'Signup is successfull'
      );
    });

    it('should show custom error message when error returned by the service', async () => {
      const errorResponse = new HttpErrorResponse({
        error: {
          code: 'some code',
          message: 'Something bad happened. please try again later.',
        },
        status: 400,
        statusText: 'Bad Request',
      });

      signUpFormSubmitSpy = spyOn(signupService, 'signUp').and.returnValue(
        throwError(() => errorResponse)
      );

      signUpFormElement.triggerEventHandler('submit', null);
      fixture.detectChanges();
      await fixture.whenStable();

      const feedbackMessageElement = fixture.debugElement.query(
        By.css('.fedex-signup__feedback')
      );
      expect(signUpFormSubmitSpy).toHaveBeenCalledOnceWith(formGroupValue);

      expect(feedbackMessageElement.nativeElement.innerText).toEqual(
        'Something bad happened. please try again later.'
      );
    });

    it('should check that button is disabled when "loading" is true', async () => {
      signUpFormSubmitSpy = spyOn(signupService, 'signUp').and.returnValue(
        of(responseMock)
      );
      signUpFormElement.triggerEventHandler('submit', null);
      component.loading = true;
      fixture.detectChanges();
      await fixture.whenStable();

      expect(
        fixture.debugElement.nativeElement
          .querySelector('button')
          .getAttribute('disabled')
      ).toBeDefined();
    });
    it('should check that button is not disabled when "loading" is false', async () => {
      signUpFormSubmitSpy = spyOn(signupService, 'signUp').and.returnValue(
        of(responseMock)
      );
      signUpFormElement.triggerEventHandler('submit', null);
      component.loading = false;
      fixture.detectChanges();
      await fixture.whenStable();

      expect(
        fixture.debugElement.nativeElement
          .querySelector('button')
          .getAttribute('disabled')
      ).toBeNull();
    });
  });
});
