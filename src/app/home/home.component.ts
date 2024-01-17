import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
import { ShowcaseComponent } from './showcase/showcase.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ShowcaseComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  api: ApiService;
  localStorage: LocalStorageService;
  constructor(api: ApiService, localStorage: LocalStorageService) {
    this.api = api;
    this.localStorage = localStorage;
  }

  logs() {
    console.log(this.api.loggedIn);
  }
}
