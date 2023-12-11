import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-landing.component.html',
  styleUrl: './login-landing.component.scss',
})
export class LoginLandingComponent {
  api: ApiService;
  router: Router;
  constructor(api: ApiService, router: Router) {
    this.api = api;
    this.router = router;
  }

  ngOnInit(): void {
    this.api.loggedIn = true;
    this.router.navigate(['/']);
  }
}
