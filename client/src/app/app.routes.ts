import { Routes } from "@angular/router";
import { RegisterFormComponent } from "./components/register-form/register-form.component";
import { HomeComponent } from "./components/home/home.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomeComponent,
  },
  {
    path: "register",
    component: RegisterFormComponent,
  },
  {
    path: "**",
    redirectTo: "",
  },
];
