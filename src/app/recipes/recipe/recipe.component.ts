import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../types/Recipe';
import { ApiService } from '../../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export class RecipeComponent implements OnInit {
  api: ApiService;
  activatedRoute: ActivatedRoute;
  constructor(api: ApiService, activatedRoute: ActivatedRoute) {
    this.api = api;
    this.activatedRoute = activatedRoute;
  }

  @Input('recipe') recipe: Recipe = {
    _id: '',
    title: '',
    author: '',
    description: '',
    ingredients: '',
    images: [{url: ''}],
    date: new Date(),
    meta: {
      likes: 0,
      favourites: 0,
    },
    instructions: '',
  };

  ngOnInit(): void {
    this.fetchRecipe();
  }

  fetchRecipe() {
    const id = this.activatedRoute.snapshot.params['id']
    this.api.getOneRecipe(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
      },
      error: (err) => {
        if (err.status !== 0) {
          console.log(err);
        }
      }
    })
  }
}
