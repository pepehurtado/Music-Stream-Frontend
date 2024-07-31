import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { UserListComponent } from "./user-list/user-list.component";
import { UserDetailsComponent } from './user-details/user-details.component';


const routes: Routes = [
  {
    path: "user-details",
    component: UserDetailsComponent
  },
  {
    path: "",
    component: UserListComponent
  }
];

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    UserListComponent,
    UserDetailsComponent
  ],
})
export class UsersModule {}
