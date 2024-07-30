import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { RolesFormComponent } from "./components/roles-form/roles-form.component";
import { RolesListComponent } from "./components/roles-list/roles-list.component";


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
  ],
  declarations: [
    RolesFormComponent,
    RolesListComponent,
  ],
})
export class RolesModule {}
