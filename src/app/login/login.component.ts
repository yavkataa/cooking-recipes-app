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
  providers: [],
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
    let loginUser = this.loginForm.controls.username.value;
    let loginPassword = this.loginForm.controls.password.value;

    if (this.loginForm.invalid) {
      return;
    }

    if (loginUser?.match('.*\\s.*') || loginPassword?.match('.*\\s.*')) {
      return;
    }

    console.log(
      'Form submit successfully' +
        this.loginForm.value.username +
        '/' +
        this.loginForm.value.password
    );

    this.router.navigate(['home']);
  }
}
