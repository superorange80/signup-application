import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'fedex-signup',
  templateUrl: './fedex-signup.component.html',
  styleUrls: ['./fedex-signup.component.scss']
})
export class FedexSignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder) { 
     this.signupForm = new FormGroup({});
  }

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  // getter for easy access to form fields
  get signupFormControls() {
    return this.signupForm.controls;
  }

  signup(): void {
    console.log('signup submitted');
  }

  ngOnDestroy() {
  }

}
