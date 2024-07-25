// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:9000/api/users';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login?username=${username}&password=${password}`, {});
  }

  register(username: string, email: string, password: string, image: string, securityQuestion: string, securityAnswer: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      username,
      email,
      password,
      image,
      securityQuestion,
      securityAnswer
    });
  }

  getUserDetails(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${username}`);
  }

}
