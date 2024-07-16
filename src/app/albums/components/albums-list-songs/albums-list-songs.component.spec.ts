import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumsListSongsComponent } from './albums-list-songs.component';

describe('AlbumsListSongsComponent', () => {
  let component: AlbumsListSongsComponent;
  let fixture: ComponentFixture<AlbumsListSongsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlbumsListSongsComponent]
    });
    fixture = TestBed.createComponent(AlbumsListSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
