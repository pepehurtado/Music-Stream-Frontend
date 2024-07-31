import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TokenExpiredModalComponent } from "./token-expired/token-expired.component";


const routes: Routes = [
  {
    path: "register",
    component: RegisterComponent
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
    NgbModule,
  ],
  declarations: [
    RegisterComponent,
    LoginComponent,
  ],
})
export class AuthModule {}
