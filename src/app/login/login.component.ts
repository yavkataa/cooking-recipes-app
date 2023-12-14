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
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [ApiService, CookieService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  router: Router;
  api: ApiService;
  constructor(router: Router, api: ApiService) {
    this.router = router;
    this.api = api;
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

  submitForm(): void {
    const loginUser = this.loginForm.controls.username.value;
    const loginPassword = this.loginForm.controls.password.value;

    if (this.loginForm.invalid) {
      return;
    }

    if (loginUser?.match('.*\\s.*') || loginPassword?.match('.*\\s.*')) {
      return;
    }

    if (!loginUser || !loginPassword) {
      return;
    }

    let result = this.api.login(loginUser, loginPassword);     

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
