import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { UserListComponent } from "./user-list/user-list.component";


const routes: Routes = [
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "user-list",
    component: UserListComponent
  },

  {
    path: "",
    component: LoginComponent,
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
    RegisterComponent,
    LoginComponent,
    UserListComponent
  ],
})
export class UsersModule {}
