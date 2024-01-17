import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { LocalStorageService } from '../../local-storage.service';
import { User } from '../../types/User';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  api: ApiService;
  localStorage: LocalStorageService;
  user: User;
  router: Router;
  activatedRoute: ActivatedRoute;
  specificUser: boolean;
  constructor(
    api: ApiService,
    localStorage: LocalStorageService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    this.api = api;
    this.localStorage = localStorage;
    this.router = router;
    this.activatedRoute = activatedRoute;
    this.specificUser = false;
    this.user = {
      username: '',
      _id: '',
      name: '',
    };
  }

  ngOnInit(): void {
    if (this.api.loading) {
      this.api.loading = false;
    }
    const userId = this.activatedRoute.snapshot.params['id'];
    if (userId) {
      this.specificUser = true;
      this.api.loading = true;
      this.api.getUserDetails(userId).subscribe({
        next: (user) => {
          this.api.loading = false;
          this.user = user;
        },
        error: (err) => {
          // if ((err.status = 400)) {
          //   console.log(err);
          // }
        },
      });
    }
  }

  viewUserRecipes(): void {
    const userId = this.user._id;
    if (userId) {
      this.router.navigate([`recipes/user/${userId}`]);
    } else {
      this.router.navigate([
        `recipes/user/${this.localStorage.getItem('_id')}`,
      ]);
    }
  }
}
