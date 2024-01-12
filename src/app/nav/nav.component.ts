import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { LocalStorageService } from '../local-storage.service';
import { LoaderComponent } from '../shared/loader/loader.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
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
