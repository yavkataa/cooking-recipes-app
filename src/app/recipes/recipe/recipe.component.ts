import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../types/Recipe';
import { ApiService } from '../../api.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../local-storage.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export class RecipeComponent implements OnInit {
  api: ApiService;
  activatedRoute: ActivatedRoute;
  localStorage: LocalStorageService;
  deletePrompt: boolean;
  editing: boolean;
  loading: boolean;
  router: Router;
  constructor(
    api: ApiService,
    activatedRoute: ActivatedRoute,
    localStorage: LocalStorageService,
    router: Router
  ) {
    this.api = api;
    this.activatedRoute = activatedRoute;
    this.localStorage = localStorage;
    this.router = router;
    this.deletePrompt = false;
    this.editing = false;
    this.loading = true;
  }

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
  };

  editRecipeForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    instructions: new FormControl('', [Validators.required]),
    ingredients: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.fetchRecipe();
  }

  loadRecipeDetails(): void {
    setTimeout(() => {
      if (this.editing && this.editRecipeForm) {
        const controls = this.editRecipeForm.controls;
        controls['title'].setValue(this.recipe.title);
        controls['image'].setValue(this.recipe.images[0].url);
        controls['description'].setValue(this.recipe.description);
        controls['instructions'].setValue(this.recipe.instructions);
        controls['ingredients'].setValue(this.recipe.ingredients);
      }
    }, 100);
  }

  deleteRecipe(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.api.deleteRecipe(id).subscribe({
      next: (result) => {
        console.log(result);
        this.router.navigate(['recipes']);
      },
      error: (err) => {
        if (err.status === 401) {
          this.api.clearLoggedUserData();
        }
      },
    });
  }

  fetchRecipe(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.api.getOneRecipe(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.loading = false;
      },
      error: (err) => {
        if (err.status !== 0) {
          console.log(err);
        }

        if (err.status == 401) {
          this.api.clearLoggedUserData
          this.router.navigate(['/']);
        }
      },
    });
  }

  submitChanges(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (this.editing && this.editRecipeForm) {
      const controls = this.editRecipeForm.controls;
      const title = controls.title.value;
      const image = controls.image.value;
      const description = controls.description.value;
      const instructions = controls.instructions.value;
      const ingredients = controls.instructions.value;
      const updateParams = {
        title: title,
        images: [{url:image}],
        description: description,
        instructions: instructions,
        ingredients: ingredients,
      };

      this.api.updateRecipe(id, updateParams).subscribe({
        next: (result) => {
          this.editing = false;
          this.loading = true;
          this.fetchRecipe();
        }, 
        error: (err) => {
          console.log(err);
          if (err.status == 401) {
            this.api.clearLoggedUserData();
            this.router.navigate(['/']);
          }
        }
      })
    }

    
  }
}
