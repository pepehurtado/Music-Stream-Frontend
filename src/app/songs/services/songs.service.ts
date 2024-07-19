import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from '../components/interfaces/song.interfaces';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = 'http://localhost:9000/songs';

  constructor(private http: HttpClient) { }

  getSongs(page: number, size: number, sortColumn: string, sortDirection: string, filters: any): Observable<Song[]> {
    const body = {
      listOrderCriteria: [
        {
          sortBy: sortColumn,
          valuesorOrder: sortDirection.toUpperCase()
        }
      ],
      listSearchCriteria: Object.keys(filters).map(key => ({
        key: key,
        //Si la key es 'time' entonces la operación es EQUALS, si no es CONTAINS
        operation: key === 'time' ? 'EQUALS' : 'CONTAINS',
        value: filters[key]
      })).filter(criteria => criteria.value),
      page: {
        pageIndex: page,
        pageSize: size
      }
    };

    return this.http.post<Song[]>(this.apiUrl + '/filter', body);
  }

  createSong(songData: Song): Observable<any> {
    //ver el objeto en json
    console.log(JSON.stringify(songData));
    return this.http.post(this.apiUrl, songData);
  }

  getSongsByAlbum(album: string): Observable<any> {
    // Construir los parámetros de la consulta
    let params = new HttpParams().set('album', album);
    // Realizar la solicitud GET con los parámetros
    return this.http.get<any>(this.apiUrl, { params: params });
  }
}
