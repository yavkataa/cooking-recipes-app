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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  router: Router;
  constructor(router: Router) {
    this.router = router;
  }

  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
  });

  submitForm() {
    if (this.loginForm.invalid) {
      return
    }

    if (this.loginForm.controls.username.value?.match(".*\\s.*") || this.loginForm.controls.password.value?.match(".*\\s.*")) {return}
    console.log(
      'Form submit successfully' +
        this.loginForm.value.username +
        '/' +
        this.loginForm.value.password
    );

    this.router.navigate(['home']);
  }
}
