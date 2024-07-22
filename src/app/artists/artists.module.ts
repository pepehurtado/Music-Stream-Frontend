import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { ArtistsListComponent } from "./components/artists-list/artists-list.component";
import { ArtistsFormComponent } from './components/artists-form/artists-form.component';
import { ArtistListSongsComponent } from "./components/artists-list-songs/artists-list-songs.component";
import { BrowserModule } from "@angular/platform-browser";
import { PipesModule } from "../pipes/pipes.module";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";

const routes: Routes = [
  {
    path: "create-artist",
    component: ArtistsFormComponent,
  },
  {
    path: "artists-list-songs",
    component: ArtistListSongsComponent,
  },
  {
    path: "edit/:id",
    component: ArtistsFormComponent,
  },
  {
    path: "",
    component: ArtistsListComponent,
  },
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    PipesModule,
    NgbPaginationModule,
  ],
  declarations: [

    ArtistsFormComponent,
      ArtistListSongsComponent,
  ],
  exports: [ArtistListSongsComponent],
})
export class ArtistsModule {}
