import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { ArtistsListComponent } from "./components/artists-list/artists-list.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Artists",
      urls: [{ title: "Artists", url: "/artists" }, { title: "Artists" }],
    },
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
  ],
})
export class ArtistsModule {}
