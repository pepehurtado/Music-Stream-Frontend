import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { ArtistsListComponent } from "./components/artists-list/artists-list.component";
import { ArtistsFormComponent } from './components/artists-form/artists-form.component';

const routes: Routes = [
  {
    path: "create-artist",
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
  ],
  declarations: [

    ArtistsFormComponent
  ],
})
export class ArtistsModule {}
