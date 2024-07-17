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


  getArtist(): Observable<Artist[]> {
    return this.http.get<Artist[]>(this.apiUrl);
  }

  getArtists(page: number, size: number, sortColumn: string, sortDirection: string, filters: any): Observable<Artist[]> {
    const body = {
      listOrderCriteria: [
        {
          sortBy: sortColumn,
          valuesorOrder: sortDirection.toUpperCase()
        }
      ],
      listSearchCriteria: Object.keys(filters).map(key => ({

        key: key,
        //si la key es 'age' entonces la operación es EQUALS, si no es CONTAINS
        operation: key === 'age' ? 'EQUALS' : 'CONTAINS',
        value: filters[key]
      })).filter(criteria => criteria.value), // Filtrar criterios vacíos
      page: {
        pageIndex: page,
        pageSize: size
      }
    };

    return this.http.post<Artist[]>(this.apiUrl + '/filter', body);
  }

  createArtist(artistData: Artist): Observable<any> {
    return this.http.post(this.apiUrl, artistData);
  }
}
