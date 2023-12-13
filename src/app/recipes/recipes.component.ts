import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Recipe } from '../types/Recipe';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, RecipeCardComponent],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss'
})
export class RecipesComponent implements OnInit{
  api: ApiService
  recipes: Recipe[];
  constructor(api: ApiService) {
    this.api = api;
    this.recipes = [];
  }

  ngOnInit(): void {
    this.api.getRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
      },
      error: (err) => {
        if (err.status !== 0) {
          console.log(err);
        }
        
        if (err.status === 401) {
          this.api.clearLoggedUserData();
        }
      }
    })
  }
}
