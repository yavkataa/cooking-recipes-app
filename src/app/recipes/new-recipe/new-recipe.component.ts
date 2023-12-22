import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { LocalStorageService } from '../../local-storage.service';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-recipe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-recipe.component.html',
  styleUrl: './new-recipe.component.scss',
})
export class NewRecipeComponent {
  localStorage: LocalStorageService;
  api: ApiService;
  router: Router;
  constructor(
    api: ApiService,
    localStorage: LocalStorageService,
    router: Router
  ) {
    this.localStorage = localStorage;
    this.api = api;
    this.router = router;
  }

  newRecipeForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    instructions: new FormControl('', [Validators.required]),
    ingredients: new FormControl('', [Validators.required]),
  });

  submitForm(): void {
    const recipeFormControls = this.newRecipeForm.controls;
    const recipeTitle = recipeFormControls.title.value;
    const recipeImage = recipeFormControls.image.value;
    const recipeDescription = recipeFormControls.description.value;
    const recipeInstructions = recipeFormControls.instructions.value;
    const recipeIngredients = recipeFormControls.ingredients.value;
    const recipeAuthor = this.localStorage.getItem('name');
    const recipeAuthorId = this.localStorage.getItem('_id');

    if (this.newRecipeForm.invalid) {
      return;
    }

    if (
      !recipeTitle ||
      !recipeImage ||
      !recipeDescription ||
      !recipeInstructions ||
      !recipeIngredients ||
      !recipeAuthor ||
      !recipeAuthorId
    ) {
      return;
    }

    this.api
      .postRecipe(
        recipeTitle,
        [{ url: recipeImage }],
        recipeDescription,
        recipeInstructions,
        recipeIngredients,
        recipeAuthor,
        recipeAuthorId
      )
      .subscribe({
        next: (result) => {
          this.router.navigate([`recipes/recipe/${result._id}`]);
        },
        error: (err) => {
          if ((err.status = 401)) {
            this.api.clearLoggedUserData();
            this.router.navigate(['/']);
          }
          console.log(err);
        },
      });
  }
}
