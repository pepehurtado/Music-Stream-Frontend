import { ComponentFixture, TestBed } from '@angular/core/testing';

import {AlbumsListComponent } from './albums-list.component';

describe('ArtistsListComponent', () => {
  let component: AlbumsListComponent;
  let fixture: ComponentFixture<AlbumsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlbumsListComponent]
    });
    fixture = TestBed.createComponent(AlbumsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
