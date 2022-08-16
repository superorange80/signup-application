import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, finalize, Subject, takeUntil } from 'rxjs';
import { SignupService } from '@fedex/shared/services/signup.service';
import {
  lowerCaseUpperCaseValidator,
  passwordValidator,
} from '@fedex/shared/validators/custom-validators';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControlsEnum } from '@fedex/shared/enums/form-controls';

@Component({
  selector: 'fedex-signup',
  templateUrl: './fedex-signup.component.html',
  styleUrls: ['./fedex-signup.component.scss'],
})
export class FedexSignupComponent implements OnInit, OnDestroy {
  readonly FormControlsEnum = FormControlsEnum;
  title = 'Fedex.com Signup';
  signupForm: FormGroup;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  feedbackMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  showPassword$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @ViewChild('signUpformReference') signUpformReference:any;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private formBuilder: FormBuilder, private signUpService: SignupService) {
    this.signupForm = new FormGroup({});
  }

  ngOnInit() {
    this.signupForm = this.formBuilder.group(
      {
        [FormControlsEnum.FirstName]: ['', [Validators.required]],
        [FormControlsEnum.LastName]: ['', [Validators.required]],
        [FormControlsEnum.Email]: ['', [Validators.required, Validators.email]],
        [FormControlsEnum.Password]: ['', [Validators.required, lowerCaseUpperCaseValidator()]],
      },
      { validators: passwordValidator() }
    );
  }

  togglePasswordVisibility(): void {
    const passwordVisibility = this.showPassword$.getValue();
    this.showPassword$.next(!passwordVisibility);
  }

  signup(): void {
    if (!this.signupForm.valid) {
      return;
    }
    if (this.signupForm.valid) {
      this.isLoading$.next(true)

      this.signUpService
        .signUp(this.signupForm.value)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => (this.isLoading$.next(false)))
        )
        .subscribe({
          next: (_signedUserResource: any) => {
            this.feedbackMessage$.next('Signup is successfull');
            // By default, Angular/Material watch formControl's error state not only by touched but also submitted status of the form
            // For reason above, you also need to reset the form to unsubmitted status.
            // calling resetForm of FormGroupDirective(getting instance by ViewChild), it will reset both the form data and submit status.
            this.signUpformReference.resetForm();
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.isLoading$.next(false);
            this.feedbackMessage$.next(errorResponse.error.message);
          },
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
