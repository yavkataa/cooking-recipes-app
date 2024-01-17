import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { Recipe } from '../../types/Recipe';

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss',
})
export class ShowcaseComponent implements OnInit {
  api: ApiService;
  recipes: Recipe[];
  constructor(api: ApiService) {
    this.api = api;
    this.recipes = [];
  }

  ngOnInit(): void {
    this.api.loading = true;
    this.api.getRandomRecipes(3).subscribe({
      next: (recipes) => {
        this.api.loading = false;
        this.recipes = recipes;
      },
      error: (err) => {
        if (err.status !== 0) {
          this.api.loading = false;
          console.log(err);
        }
      },
    });
  }
}
