import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Album } from '../components/interfaces/album.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private apiUrl = 'http://localhost:9000/albums';

  constructor(private http: HttpClient) { }
  getAlbum(): Observable<Album[]> {
    return this.http.get<Album[]>(this.apiUrl);
  }

  getAlbums(page: number, size: number, sortColumn: string, sortDirection: string, filters: any): Observable<Album[]> {
    const body = {
      listOrderCriteria: [
        {
          sortBy: sortColumn,
          valuesorOrder: sortDirection.toUpperCase()
        }
      ],
      listSearchCriteria: Object.keys(filters).map(key => ({
        key: key,
        operation: filters[key] ? 'CONTAINS' : 'EQUALS',
        value: filters[key]
      })).filter(criteria => criteria.value),
      page: {
        pageIndex: page,
        pageSize: size
      }
    };

    return this.http.post<Album[]>(this.apiUrl + '/filter', body);
  }

  createAlbum(albumData: Album): Observable<any> {
    console.log(JSON.stringify(albumData));
    return this.http.post(this.apiUrl, albumData);
  }

  getAlbumById(id: string): Observable<Album> {
    return this.http.get<Album>(`${this.apiUrl}/${id}`);
  }

  deleteAlbum(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateAlbum(id: string, albumData: Album): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, albumData);
  }
}
