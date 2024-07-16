import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getSongsByAlbum(album: string): Observable<any> {
    // Construir los parámetros de la consulta
    let params = new HttpParams().set('album', album);
    // Realizar la solicitud GET con los parámetros
    return this.http.get<any>(this.apiUrl, { params: params });
  }

}
