import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Recipe } from '../types/Recipe';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { ActivatedRoute } from '@angular/router';
import { RecipeTagsFilterComponent } from './recipe-tags-filter/recipe-tags-filter.component';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, RecipeCardComponent, RecipeTagsFilterComponent],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
})
export class RecipesComponent implements OnInit {
  api: ApiService;
  recipes: Recipe[];
  allRecipes: Recipe[];
  activatedRoute: ActivatedRoute;
  tags: string[];
  appliedTags: string[];
  constructor(api: ApiService, activatedRoute: ActivatedRoute) {
    this.api = api;
    this.recipes = [];
    this.allRecipes = [];
    this.activatedRoute = activatedRoute;
    this.tags = [];
    this.appliedTags = [];
  }

  findUniqueRecipeTags(recipes: Recipe[]): string[] {
    const tagArray: string[] = [];
    for (let recipe of recipes) {
      for (let i = 0; i < recipes.length; i++) {
        if (recipe.tags) {
          const element = recipe.tags[i];
          if (!tagArray.includes(element) && element) {
            tagArray.push(element);
          }
        }
      }
    }
    return tagArray;
  }

  addTagToDisplay(tag: any) {
    if (!this.appliedTags.includes(tag)) {
      this.appliedTags.push(tag);
    } else {
      const index = this.appliedTags.indexOf(tag);
      this.appliedTags.splice(index, 1);
    }
  }

  checkArrayIncludes(arr: string[], values: string[]): boolean {
    if (!arr || !values) {
      return false;
    }
    return values.some(v => arr.includes(v));
  }

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.params['id'];

    if (!userId) {
      this.api.loading = true;
      this.api.getRecipes().subscribe({
        next: (recipes) => {
          this.allRecipes = recipes;
          this.recipes = recipes;
          this.tags = this.findUniqueRecipeTags(recipes);
          this.api.loading = false;
        },
        error: (err) => {
          if (err.status !== 0) {
            console.log(err);
            this.api.loading = false;
          }
        },
      });
    }

    if (userId) {
      this.api.loading = true;
      this.api.getUserRecipes(userId).subscribe({
        next: (recipes) => {
          this.api.loading = false;
          this.tags = this.findUniqueRecipeTags(recipes);
          this.recipes = recipes;
          this.allRecipes = recipes;
        },
        error: (err) => {
          this.api.loading = false;
          if (err.status !== 0) {
            console.log(err);
          }
        },
      });
    }
  }
}
