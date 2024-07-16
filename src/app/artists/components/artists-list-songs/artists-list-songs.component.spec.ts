import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistListSongsComponent } from './artists-list-songs.component';

describe('ArtistsListSongsComponent', () => {
  let component: ArtistListSongsComponent;
  let fixture: ComponentFixture<ArtistListSongsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtistListSongsComponent]
    });
    fixture = TestBed.createComponent(ArtistListSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
