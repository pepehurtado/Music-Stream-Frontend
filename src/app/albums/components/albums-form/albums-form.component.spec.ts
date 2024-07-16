import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongsFormComponent } from './albums-form.component';

describe('ArtistsFormComponent', () => {
  let component: SongsFormComponent;
  let fixture: ComponentFixture<SongsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SongsFormComponent]
    });
    fixture = TestBed.createComponent(SongsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
