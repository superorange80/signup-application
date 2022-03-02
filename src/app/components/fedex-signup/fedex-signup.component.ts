import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SignupService } from '@fedex/shared/services/signup.service';
import {
  lowerCaseUpperCaseValidator,
  passwordValidator,
} from '@fedex/shared/validators/custom-validators';

@Component({
  selector: 'fedex-signup',
  templateUrl: './fedex-signup.component.html',
  styleUrls: ['./fedex-signup.component.scss'],
})
export class FedexSignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  loading = false;
  submitSuccessful = false;
  successMessage = 'Signup is successfull';
  showPassword = false;

  // @ViewChild('form') form: any;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private fb: FormBuilder, private signUpService: SignupService) {
    this.signupForm = new FormGroup({});
  }

  ngOnInit() {
    this.signupForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, lowerCaseUpperCaseValidator()]],
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

      // TODO: update response type
      this.signUpService
        .signUp(this.signupForm.value)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => (this.loading = false))
        )
        .subscribe({
          next: (signedUserResource: any) => {
            this.submitSuccessful = true;
            // this.form.resetForm();
            // TODO: do not show displaying validation messages on reset
            this.signupForm.reset();
          },
          error: (error) => {
            this.loading = false;
            console.log('error::', error);
          },
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
