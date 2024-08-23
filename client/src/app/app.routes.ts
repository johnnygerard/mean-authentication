import { Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomeComponent,
  },
  {
    path: "register",
    loadComponent: async () =>
      (await import("./components/register-form/register-form.component"))
        .RegisterFormComponent,
  },
  {
    path: "**",
    redirectTo: "",
  },
];
