import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit{
  api: ApiService;
  router: Router
  constructor(api: ApiService, router: Router) {
    this.api = api;
    this.router = router;
  }

  ngOnInit(): void {
    this.api.loggedIn = false;
    this.api.clearLoggedUserData();
    this.api.logout();
    this.router.navigate(['/']);
  }
}
