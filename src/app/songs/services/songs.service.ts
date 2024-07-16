import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from '../components/interfaces/song.interfaces';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = 'https://musicstream.onrender.com/songs';
  constructor(private http: HttpClient) { }

  getSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(this.apiUrl);
  }

  createSong(artistData: Song): Observable<any> {
    return this.http.post(this.apiUrl, artistData);
  }
}
