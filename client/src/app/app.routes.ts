import { Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { SignInPageComponent } from "./pages/sign-in-page.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomePageComponent,
  },
  {
    path: "sign-in",
    component: SignInPageComponent,
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
