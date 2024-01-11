import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../types/Recipe';
import { ApiService } from '../../api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../local-storage.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommentsComponent } from '../comments/comments.component';
import { Tags } from '../../../../assets/tags/tags';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CommentsComponent],
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
  tags: string[];
  selectedTags: string[];
  foundTags: string[];
  tagSearchQuery: string;
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
    this.tags = Tags;
    this.foundTags = this.tags;
    this.selectedTags = [];
    this.tagSearchQuery = '';
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
    tags: [''],
  };

  editRecipeForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    instructions: new FormControl('', [Validators.required]),
    ingredients: new FormControl('', [Validators.required]),
    tags: new FormControl(''),
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
        if (this.recipe.tags) {
          this.selectedTags = this.recipe.tags;
        } else {
          this.selectedTags = [];
        }
        
      }
    }, 100);
  }

  deleteRecipe(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.api.deleteRecipe(id).subscribe({
      next: (result) => {
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
          this.api.clearLoggedUserData;
          this.router.navigate(['home']);
        }
      },
    });
  }

  updateTags(): void {
    this.foundTags = [];
    if (this.editRecipeForm.controls.tags.value) {
      this.tagSearchQuery =
        this.editRecipeForm.controls.tags.value.toLowerCase();

      for (let entry of this.tags) {
        if (entry.toLowerCase().includes(this.tagSearchQuery)) {
          if (!this.foundTags.includes(entry)) {
            this.foundTags.push(entry);
          }
        }
      }
    } else {
      this.foundTags = this.tags;
    }
  }

  selectTag(tag: string): void {
    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
    }
  }

  removeSelectedTag(tag: string) {
    if (this.selectedTags.includes(tag)) {
      const indexToRemove = this.selectedTags.indexOf(tag);
      this.selectedTags.splice(indexToRemove, 1);
    }
  }

  submitChanges(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (this.editing && this.editRecipeForm) {
      const controls = this.editRecipeForm.controls;
      const title = controls.title.value;
      const image = controls.image.value;
      const description = controls.description.value;
      const instructions = controls.instructions.value;
      const ingredients = controls.ingredients.value;
      const tags = this.selectedTags;
      const updateParams = {
        title: title,
        images: [{ url: image }],
        description: description,
        ingredients: ingredients,
        instructions: instructions,
        tags: tags,
      };

      this.api.updateRecipe(id, updateParams).subscribe({
        next: (result) => {
          this.editing = false;
          this.loading = true;
          this.fetchRecipe();
        },
        error: (err) => {
          console.log(err.error.message);
          if (err.status == 401) {
            this.api.clearLoggedUserData();
            this.router.navigate(['home']);
          }
        },
      });
    }
  }
}
