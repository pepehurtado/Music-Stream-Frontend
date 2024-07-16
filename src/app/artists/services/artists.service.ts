import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../components/interfaces/artists.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private apiUrl = 'https://musicstream.onrender.com/artists';

  constructor(private http: HttpClient) { }

  getArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(this.apiUrl);
  }

  createArtist(artistData: Artist): Observable<any> {
    return this.http.post(this.apiUrl, artistData);
  }
}
