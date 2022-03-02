import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function passwordValidator() {
  return (form: FormGroup): ValidationErrors | null => {
    const firstName = form.get('firstName')?.value;
    const lastName = form.get('lastName')?.value;
    const password = form.get('password')?.value;

    const isInvalidPassword =
      (firstName !== '' && password.includes(firstName)) ||
      (lastName !== '' && password.includes(lastName));

    if (isInvalidPassword) {
      form.get('password')?.setErrors({ invalidPassword: { value: password } });
      return { invalidPassword: { value: password } };
    } else {
      return null;
    }
  };
}

export function lowerCaseUpperCaseValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlValue = control.value;
    const hasUpper = /[A-Z]/.test(controlValue);
    const hasLower = /[a-z]/.test(controlValue);

    const isInvalid = !(hasUpper && hasLower);

    return isInvalid
      ? { lowerCaseUpperCaseLetters: { value: controlValue } }
      : null;
  };
}
