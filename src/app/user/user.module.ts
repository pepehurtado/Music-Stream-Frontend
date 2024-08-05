import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { UserListComponent } from "./user-list/user-list.component";
import { UserDetailsComponent } from './user-details/user-details.component';
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";


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
    NgbModalModule,
    TranslateModule
  ],
  declarations: [
    UserListComponent,
    UserDetailsComponent
  ],
})
export class UsersModule {}
