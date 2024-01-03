import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './types/User';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { Recipe } from './types/Recipe';
import { Comment } from './types/Comment';
const { SERVER_ADDRESS } = require('../../server/server-config.js');

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http: HttpClient;
  loggedIn: boolean;
  router: Router;
  localStorage: LocalStorageService;
  constructor(
    http: HttpClient,
    router: Router,
    localStorage: LocalStorageService
  ) {
    this.http = http;
    this.router = router;
    this.loggedIn = false;
    this.localStorage = localStorage;
  }

  login(username: string, password: string): Observable<User> {
    const body = { username: username, password: password };
    return this.http.post<User>(`${SERVER_ADDRESS}/login`, body, {
      withCredentials: true,
    });
  }

  register(username: string, password: string, name: string): Observable<User> {
    const body = { username: username, password: password, name: name };
    return this.http.post<User>(`${SERVER_ADDRESS}/register`, body, {
      withCredentials: true,
    });
  }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${SERVER_ADDRESS}/recipes`, {
      withCredentials: true,
    });
  }

  getOneRecipe(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${SERVER_ADDRESS}/recipes/${id}`, {
      withCredentials: true,
    });
  }

  getUserRecipes(id: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${SERVER_ADDRESS}/recipes/user/${id}`);
  }

  getUserDetails(id: string): Observable<User> {
    return this.http.get<User>(`${SERVER_ADDRESS}/user/${id}`);
  }

  postRecipe(
    title: string,
    image: {}[],
    description: string,
    instructions: string,
    ingredients: string,
    author: string,
    authorId: string
  ): Observable<{ _id: string }> {
    let body = {
      title: title,
      images: image,
      description: description,
      instructions: instructions,
      ingredients: ingredients,
      author: author,
      authorId: authorId,
    };
    return this.http.post<{ _id: string }>(
      `${SERVER_ADDRESS}/post-recipe`,
      body,
      {
        withCredentials: true,
      }
    );
  }

  deleteRecipe(id: string): Observable<{}> {
    return this.http.delete(`${SERVER_ADDRESS}/recipes/delete/${id}`, {
      withCredentials: true,
    });
  }

  updateRecipe(id: string, payload: {}): Observable<{}> {
    return this.http.put(`${SERVER_ADDRESS}/recipes/recipe/${id}`, payload, {
      withCredentials: true,
    });
  }

  getComments(id: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${SERVER_ADDRESS}/comments/${id}`);
  }

  storeLoggedUserData(data: User): void {
    this.localStorage.setItem('username', data.username);
    this.localStorage.setItem('_id', data._id);
    this.localStorage.setItem('loggedIn', 'true');
    this.localStorage.setItem('name', data.name);
  }

  clearLoggedUserData(): void {
    this.localStorage.clear();
  }

  checkLogin(): boolean {
    let loggedIn = this.localStorage.getItem('loggedIn');

    if (loggedIn === 'true') {
      return true;
    }
    return false;
  }

  checkLoginState(): boolean {
    let status = this.http.get<User>(`${SERVER_ADDRESS}/login-verify`, {
      withCredentials: true,
    });
    status.subscribe({
      next: (result) => {
        return true;
      },
      error: (err) => {
        if (err.status !== 0) {
          console.log(err);
        }
        return false;
      },
    });
    return false;
  }

  logout(): void {
    let result = this.http.get(`${SERVER_ADDRESS}/logout`, {
      withCredentials: true,
    });
    result.subscribe({
      next: () => {
        console.log(result);
        this.clearLoggedUserData();
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status !== 0) {
          console.log(err);
        }
      },
    });
  }
}
