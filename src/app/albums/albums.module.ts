import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { AlbumsListComponent} from "./components/albums-list/albums-list.component";
import { AlbumsFormComponent } from "./components/albums-form/albums-form.component";
import { Album } from './components/interfaces/album.interfaces';


const routes: Routes = [
  {
    path: "create-album",
    component: AlbumsFormComponent
  },
  {
    path: "",
    component: AlbumsListComponent,
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
    AlbumsListComponent,
    AlbumsFormComponent,
  ],
})
export class AlbumsModule {}
