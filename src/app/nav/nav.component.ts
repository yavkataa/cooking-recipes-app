import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  api: ApiService;
  localStorage: LocalStorageService;
  constructor(api: ApiService, localStorage: LocalStorageService) {
    this.api = api;
    this.localStorage = localStorage;
  }
}
