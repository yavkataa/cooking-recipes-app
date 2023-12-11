import { Injectable, afterRender } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './types/User';
import { Router } from '@angular/router';
const { SERVER_ADDRESS, PORT } = require('../../server/server-config.js');

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http: HttpClient;
  loggedIn: boolean;
  router: Router;
  constructor(http: HttpClient, router: Router) {
    this.http = http;
    this.router = router;
    this.loggedIn = false;
    afterRender(() => {
      this.loggedIn = this.checkLogin();
    })
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
    localStorage.setItem('username', data.username);
    localStorage.setItem('_id', data._id);
    this.loggedIn = true;
  }

  clearLoggedUserData(): void {
    localStorage.clear();
    this.loggedIn = false;
  }

  checkLogin(): boolean {
    let username = localStorage.getItem('username');
    let _id = localStorage.getItem('_id');

    if (username && _id) {
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
    let result = this.http.get(`${SERVER_ADDRESS}/logout`);
    result.subscribe({
      next: () => {
        this.clearLoggedUserData();
      },
    });
  }
}
