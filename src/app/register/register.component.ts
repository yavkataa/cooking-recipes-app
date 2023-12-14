import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  router: Router;
  api: ApiService;
  constructor(router: Router, api: ApiService) {
    this.router = router;
    this.api = api;
  }

  registerForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
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
    const registerUser = this.registerForm.controls.username.value;
    const registerPassword =
      this.registerForm.controls.passwordGroup.controls.password.value;
    const registerName = this.registerForm.controls.name.value;

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

    if (!registerUser || !registerPassword || !registerName) {
      return;
    }

    let result = this.api.register(registerUser, registerPassword, registerName);

    result.subscribe({
      next: (result) => {
        this.api.clearLoggedUserData();
        this.api.storeLoggedUserData(result);
        this.router.navigate(['/']);
      }
    })

    // this.router.navigate(['home']);
  }
}
