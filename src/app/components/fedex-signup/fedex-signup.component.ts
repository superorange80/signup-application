import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
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
  loading = false;
  feedbackMessage = '';
  showPassword = false;

  @ViewChild('form') form:any;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private fb: FormBuilder, private signUpService: SignupService) {
    this.signupForm = new FormGroup({});
  }

  ngOnInit() {
    this.signupForm = this.fb.group(
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
    this.showPassword = !this.showPassword;
  }

  signup(): void {
    if (!this.signupForm.valid) {
      return;
    }
    if (this.signupForm.valid) {
      this.loading = true;

      this.signUpService
        .signUp(this.signupForm.value)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => (this.loading = false))
        )
        .subscribe({
          next: (_signedUserResource: any) => {
            this.feedbackMessage = 'Signup is successfull';
            this.form.resetForm();
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.loading = false;
            this.feedbackMessage = errorResponse.error.message;
          },
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
