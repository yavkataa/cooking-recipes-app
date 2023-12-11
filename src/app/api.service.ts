import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const { SERVER_ADDRESS, PORT } = require('../../server/server-config.js');

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http: HttpClient;
  constructor(http: HttpClient, ) {
    this.http = http;
  }

  login(username: string, password: string): Observable<{}> {
    const body = { username: username, password: password };    
    return this.http.post(`${SERVER_ADDRESS}/login`, body, {withCredentials: true});
  }

  register(username: string, password: string): Observable<{}> {    
    const body = { username: username, password: password };
    return this.http.post(`${SERVER_ADDRESS}/register`, body, {withCredentials: true});
  }

  getRecipes(): Observable<[]> {
    return this.http.get<[]>(`${SERVER_ADDRESS}/recipes`, {withCredentials: true});
  }
}
