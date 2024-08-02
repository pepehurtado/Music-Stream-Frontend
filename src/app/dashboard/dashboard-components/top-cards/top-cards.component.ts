import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../service/history.service';

export interface Topcard {
  bgcolor: string,
  icon: string,
  title: string,
  subtitle: string
}

@Component({
  selector: 'app-top-cards',
  templateUrl: './top-cards.component.html',
})
export class TopCardsComponent implements OnInit {

  topcards: Topcard[] = [];

  constructor(private historyService: HistoryService) { }

  ngOnInit(): void {
    this.historyService.getCounts().subscribe((data) => {
      this.topcards = [
        {
          bgcolor: 'info',
          icon: 'bi bi-person-badge',
          title: data.artists.toString(),
          subtitle: 'Artistas'
        },
        {
          bgcolor: 'success',
          icon: 'bi bi-music-note-beamed',
          title: data.songs.toString(),
          subtitle: 'Canciones'
        },
        {
          bgcolor: 'warning',
          icon: 'bi bi-music-note-list',
          title: data.albums.toString(),
          subtitle: 'Álbumes'
        },
        {
          bgcolor: 'danger',
          icon: 'bi bi-vinyl',
          title: data.genres.toString(),
          subtitle: 'Géneros'
        }
      ];
    });
  }
}
