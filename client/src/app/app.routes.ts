import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { SignInFormComponent } from "./components/sign-in-form/sign-in-form.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomeComponent,
  },
  {
    path: "sign-in",
    component: SignInFormComponent,
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
