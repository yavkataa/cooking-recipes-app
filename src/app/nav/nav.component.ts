import { Component, afterRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  api: ApiService;
  loggedIn: boolean;
  constructor(api: ApiService) {
    this.api = api;
    this.loggedIn = false;
    afterRender(() => {
      this.loggedIn = this.api.checkLogin();
      this.api.loggedIn = this.api.checkLogin();
    })
  }
}
