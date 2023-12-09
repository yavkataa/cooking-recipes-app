import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  router: Router;
  constructor(router: Router) {
    this.router = router;
  }

  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    passwordGroup: new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      repassword: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
    }),
  });

  submitForm() {
    if (this.registerForm.invalid) {
      return;
    }
    if (
      this.registerForm.controls.passwordGroup.controls.password.value !==
      this.registerForm.controls.passwordGroup.controls.repassword.value
    ) {
      return;
    }

    if (
      this.registerForm.controls.username.value?.match('.*\\s.*') ||
      this.registerForm.controls.passwordGroup.controls.password.value?.match(
        '.*\\s.*'
      ) ||
      this.registerForm.controls.passwordGroup.controls.repassword.value?.match(
        '.*\\s.*'
      )
    ) {
      return;
    }

    console.log(
      'Form submit successfully' +
        this.registerForm.value.username +
        '/' +
        this.registerForm.value.passwordGroup?.password +
        '|' +
        this.registerForm.value.passwordGroup?.repassword
    );

    this.router.navigate(['home']);
  }
}
