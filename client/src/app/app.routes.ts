import { Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { SignInPageComponent } from "./pages/sign-in-page.component";
import { isUnauthenticatedGuard } from "./guards/is-unauthenticated.guard";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomePageComponent,
  },
  {
    path: "sign-in",
    component: SignInPageComponent,
    canActivate: [isUnauthenticatedGuard],
  },
  {
    path: "register",
    loadComponent: async () =>
      (await import("./pages/register-page.component")).RegisterPageComponent,
    canActivate: [isUnauthenticatedGuard],
  },
  {
    path: "**",
    redirectTo: "",
  },
];
