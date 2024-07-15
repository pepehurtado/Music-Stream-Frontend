import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../components/interfaces/artists.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private apiUrl = 'https://fsqafbuiyjdphfmlwdqx.supabase.co/rest/v1/artist?select=*';
  private apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzcWFmYnVpeWpkcGhmbWx3ZHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAxNzczMDYsImV4cCI6MjAzNTc1MzMwNn0.Q-0U0dp3Ad-GtNiyoGvXrB0Zxx-e7-chSp_szRunJ3A';

  constructor(private http: HttpClient) { }

  getArtists(rangeStart: number, rangeEnd: number, filters: any = {}): Observable<Artist[]> {
    let headers = new HttpHeaders({
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Range': `${rangeStart}-${rangeEnd}`
    });

    let params = new HttpParams();
    for (const key in filters) {
      if (filters[key]) {
        params = params.set(key, `eq.${filters[key]}`);
      }
    }

    return this.http.get<Artist[]>(this.apiUrl, { headers, params });
  }

  createArtist(artistData: Artist): Observable<any> {
    const headers = new HttpHeaders({
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`
    });

    return this.http.post(this.apiUrl, artistData, { headers });
  }

}
