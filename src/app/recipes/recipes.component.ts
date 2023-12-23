import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Recipe } from '../types/Recipe';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, RecipeCardComponent],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent implements OnInit {
  api: ApiService;
  recipes: Recipe[];
  activatedRoute: ActivatedRoute;
  constructor(api: ApiService, activatedRoute: ActivatedRoute) {
    this.api = api;
    this.recipes = [];
    this.activatedRoute = activatedRoute;
  }

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.params['id'];

    if (!userId) {
      this.api.getRecipes().subscribe({
        next: (recipes) => {
          this.recipes = recipes;
        },
        error: (err) => {
          if (err.status !== 0) {
            console.log(err);
          }
        },
      });
    }

    if (userId) {
      this.api.getUserRecipes(userId).subscribe({
        next: (recipes) => {
          this.recipes = recipes;
        },
        error: (err) => {
          if (err.status !== 0) {
            console.log(err);
          }
        },
      });
    }
  }
}
