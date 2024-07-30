import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { SongsListComponent } from "./components/songs-list/songs-list.component";
import { SongsFormComponent } from "./components/songs-form/songs-form.component";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";


const routes: Routes = [
  {
    path: "create-song",
    component: SongsFormComponent
  },

  {
    path: "edit/:id",
    component: SongsFormComponent
  },

  {
    path: "",
    component: SongsListComponent,
  },
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    NgbPaginationModule,
  ],
  declarations: [
    SongsListComponent,
    SongsFormComponent
  ],
})
export class SongsModule {}
