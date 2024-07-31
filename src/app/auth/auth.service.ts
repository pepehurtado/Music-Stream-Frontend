import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:9000/api/users';
  private tokenExpiredSubject = new Subject<void>();
  tokenExpired$ = this.tokenExpiredSubject.asObservable();
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('jwt');
  }

  login(username: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.apiUrl}/login?username=${username}&password=${password}`, {})
        .subscribe((response: any) => {
          if (response && response.token) {
            localStorage.setItem('jwt', response.token);
            this.token = response.token;
            observer.next(response);
          } else {
            observer.error('No token found in response');
          }
          observer.complete();
        }, (error) => {
          observer.error(error);
        });
    });
  }

  register(username: string, email: string, password: string, image: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      username,
      email,
      password,
      image
    });
  }

  getUserDetails(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${username}`);
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  softDeleteUser(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/delete/${id}`, {});
  }

  activateUser(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/activate/${id}`, {});
  }

  getRoles(): string[] {
    this.token = localStorage.getItem('jwt');
    if (!this.token) return [];

    try {
      const decodedToken: any = jwtDecode(this.token);
      console.log('Decoded token:', decodedToken);
      return decodedToken.roles ? decodedToken.roles : [];
    } catch (error) {
      console.error('Error decoding token:', error);
      return [];
    }
  }

  hasRole(role: string): boolean {
    console.log('Roles:', this.getRoles());
    return this.getRoles().includes(role);
  }

  isTokenExpired(): boolean {
    this.token = localStorage.getItem('jwt');
    console.log('Tokennnnnnnnnn:', this.token);
    if (!this.token) return true;

    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const expiration = payload.exp;
      const now = Date.now() / 1000;
      console.log('Token expiration:', expiration);
      console.log('Now:', now);
      console.log('Token expired:', now > expiration);
      return now > expiration;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }

  handleTokenExpiration() {
    localStorage.removeItem('jwt');
    this.tokenExpiredSubject.next();
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

}
