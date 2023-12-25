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
import { ProfileComponent } from './user/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'CooksCooks',
    component: HomeComponent,
  },
  {
    path: 'home',
    title: 'CooksCooks',
    component: HomeComponent,
  },
  {
    path: 'contacts',
    title: 'Contacts',
    component: ContactsComponent,
  },
  {
    path: 'about',
    title: 'About',
    component: AboutComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    canActivate: [AuthActivateInverse],
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
    canActivate: [AuthActivateInverse],
  },
  {
    path: 'recipes',
    title: 'Recipes',
    component: RecipesComponent,
  },
  {
    path: 'recipes/new-recipe',
    component: NewRecipeComponent,
    title: 'New Recipe',
    canActivate: [AuthActivate],
  },
  {
    path: 'recipes/recipe/:id',
    title: 'Recipe',
    component: RecipeComponent,
  },
  {
    path: 'recipes/user/:id',
    title: 'User',
    component: RecipesComponent,
  },
  {
    path: 'user/profile',
    component: ProfileComponent,
    title: 'Profile',
    canActivate: [AuthActivate],
  },
  {
    path: 'user/profile/:id',
    title: 'Profile',
    component: ProfileComponent,
  },
];
