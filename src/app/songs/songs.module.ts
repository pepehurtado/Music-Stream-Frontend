import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { SongsListComponent } from "./components/songs-list/songs-list.component";
import { SongsFormComponent } from "./components/songs-form/songs-form.component";


const routes: Routes = [
  {
    path: "create-song",
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
  ],
  declarations: [
    SongsListComponent,
    SongsFormComponent
  ],
})
export class SongsModule {}
