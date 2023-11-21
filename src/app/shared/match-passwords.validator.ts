import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchPasswordsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
   if (control.value.passwordGroup.password === control.value.passwordGroup.repassword) {
    return {MatchPassword: false}
   } else {
    return null;
   }
  }
}




// export function confirmPasswordValidator(): ValidatorFn (
//   control: AbstractControl
// ): ValidationErrors | null => {
//   return control.value.passwordGroup.password ===
//     control.value.passwordGroup.repassword
//     ? null
//     : { PasswordNoMatch: true };
// };
