import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Album } from '../components/interfaces/album.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private apiUrl = 'https://musicstream.onrender.com/albums';

  constructor(private http: HttpClient) { }

  getAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(this.apiUrl);
  }

  createAlbum(albumData: Album): Observable<any> {
    return this.http.post(this.apiUrl, albumData);
  }

  getAlbumById(id: number): Observable<Album> {
    return this.http.get<Album>(`${this.apiUrl}/${id}`);
  }
}
