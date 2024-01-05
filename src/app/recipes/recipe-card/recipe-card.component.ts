import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../types/Recipe';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
})
export class RecipeCardComponent {
  @Input('recipe') recipe: Recipe = {
    _id: '',
    title: '',
    author: '',
    description: '',
    ingredients: '',
    images: [{ url: '' }],
    date: new Date(),
    meta: {
      likes: 0,
      favourites: 0,
    },
    instructions: '',
    authorId: '',
    tags: [''],
  };
}
