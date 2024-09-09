import { Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { isUnauthenticatedGuard } from "./guards/is-unauthenticated.guard";
import { NotFoundPageComponent } from "./pages/not-found-page.component";
import { isAuthenticatedGuard } from "./guards/is-authenticated.guard";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomePageComponent,
  },
  {
    path: "account",
    loadComponent: async () =>
      (await import("./pages/account-page/account-page.component"))
        .AccountPageComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: "sign-in",
    loadComponent: async () =>
      (await import("./pages/sign-in-page.component")).SignInPageComponent,
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
