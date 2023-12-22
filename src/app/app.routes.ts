import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecipesComponent } from './recipes/recipes.component';
import { NewRecipeComponent } from './recipes/new-recipe/new-recipe.component';
import { RecipeComponent } from './recipes/recipe/recipe.component';
import { AuthActivate } from './auth-guard.guard';
import { AuthActivateInverse } from './auth-guard-inverted.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'contacts',
    component: ContactsComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthActivateInverse]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthActivateInverse]
  },
  {
    path: 'recipes',
    component: RecipesComponent,
  },
  {
    path: 'recipes/new-recipe',
    component: NewRecipeComponent,
    canActivate: [AuthActivate],
  },
  {
    path: 'recipes/recipe/:id',
    component: RecipeComponent,
  },
];
