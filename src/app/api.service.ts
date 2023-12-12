import { ApplicationRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './types/User';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { Application } from 'express';
const { SERVER_ADDRESS, PORT } = require('../../server/server-config.js');

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http: HttpClient;
  loggedIn: boolean;
  router: Router;
  localStorage: LocalStorageService;
  ref: ApplicationRef;
  constructor(
    http: HttpClient,
    router: Router,
    localStorage: LocalStorageService,
    ref: ApplicationRef
  ) {
    this.http = http;
    this.router = router;
    this.loggedIn = false;
    this.localStorage = localStorage;
    this.ref = ref;
  }

  login(username: string, password: string): Observable<User> {
    const body = { username: username, password: password };
    return this.http.post<User>(`${SERVER_ADDRESS}/login`, body, {
      withCredentials: true,
    });
  }

  register(username: string, password: string): Observable<User> {
    const body = { username: username, password: password };
    return this.http.post<User>(`${SERVER_ADDRESS}/register`, body, {
      withCredentials: true,
    });
  }

  getRecipes(): Observable<[]> {
    return this.http.get<[]>(`${SERVER_ADDRESS}/recipes`, {
      withCredentials: true,
    });
  }

  storeLoggedUserData(data: User): void {
    this.localStorage.setItem('username', data.username);
    this.localStorage.setItem('_id', data._id);
    this.localStorage.setItem('loggedIn', 'true');
  }

  clearLoggedUserData(): void {
    this.localStorage.clear();
  }

  checkLogin(): boolean {
    let loggedIn = this.localStorage.getItem('loggedIn')

    if (loggedIn === "true") {
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
        console.log(err.status);
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
        this.ref.tick();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
