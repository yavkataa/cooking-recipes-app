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
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'recipes',
    component: RecipesComponent,
    canActivate: [AuthActivate],
  },
  {
    path: 'recipes/new-recipe',
    component: NewRecipeComponent,
    canActivate: [AuthActivate],
  },
  {
    path: 'recipes/recipe/:id',
    component: RecipeComponent,
    canActivate: [AuthActivate],
  },
];
