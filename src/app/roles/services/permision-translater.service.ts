import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PermissionTranslater } from '../interfaces/permission-translater.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PermissionTranslaterService {
  private apiUrl = 'http://localhost:9000/api/translaters';

  constructor(private http: HttpClient) { }

  getPermissionsByLanguage(language: string): Observable<PermissionTranslater[]> {
    return this.http.get<PermissionTranslater[]>(`${this.apiUrl}/language/${language}`);
  }

  getPermissionByLanguageAndPermissionId(id: number, language: string): Observable<PermissionTranslater> {
    return this.http.get<PermissionTranslater>(`${this.apiUrl}/permission/${id}/language/${language}`);
  }
}
