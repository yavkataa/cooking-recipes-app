import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  api: ApiService;
  constructor(api: ApiService) {
    this.api = api;
  }

  logs() {
    console.log(this.api.loggedIn);
  }
}
