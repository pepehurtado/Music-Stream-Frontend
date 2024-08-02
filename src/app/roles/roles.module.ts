import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { RolesFormComponent } from "./components/roles-form/roles-form.component";
import { RolesListComponent } from "./components/roles-list/roles-list.component";
import { DragDropModule } from "@angular/cdk/drag-drop";


const routes: Routes = [
  {
    path: "create-role",
    component: RolesFormComponent
  },
  {
    path: "edit/:id",
    component: RolesFormComponent
  },
  {
    path: "",
    component: RolesListComponent,
  },
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    DragDropModule
  ],
  declarations: [
    RolesFormComponent,
    RolesListComponent,
  ],
})
export class RolesModule {}
