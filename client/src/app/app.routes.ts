import { Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { SignInPageComponent } from "./pages/sign-in-page.component";
import { isUnauthenticatedGuard } from "./guards/is-unauthenticated.guard";
import { NotFoundPageComponent } from "./pages/not-found-page.component";

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
    path: "not-found",
    component: NotFoundPageComponent,
  },
  {
    path: "**",
    redirectTo: "not-found",
  },
];
