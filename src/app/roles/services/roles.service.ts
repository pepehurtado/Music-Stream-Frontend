import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../interfaces/role.interfaces';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:9000/api/roles';

  constructor(private http: HttpClient) { }
  getRole(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  createRole(roleData: Role): Observable<any> {
    console.log(JSON.stringify(roleData));
    return this.http.post(this.apiUrl, roleData);
  }

  getRoleById(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  deleteRole(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateRole(id: string, roleData: Role): Observable<any> {
    console.log(JSON.stringify(roleData));
    return this.http.put(`${this.apiUrl}/${id}`, roleData);
  }
}
