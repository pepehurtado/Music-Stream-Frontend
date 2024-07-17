import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumsFormComponent } from './albums-form.component';

describe('ArtistsFormComponent', () => {
  let component: AlbumsFormComponent;
  let fixture: ComponentFixture<AlbumsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlbumsFormComponent]
    });
    fixture = TestBed.createComponent(AlbumsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
