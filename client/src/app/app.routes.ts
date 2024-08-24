import { Routes } from "@angular/router";
import { SignInFormComponent } from "./components/sign-in-form/sign-in-form.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomePageComponent,
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
