import { Routes } from "@angular/router";

import { APP_NAME } from "_server/constants/app";
import { isAuthenticatedGuard } from "./guards/is-authenticated.guard";
import { isUnauthenticatedGuard } from "./guards/is-unauthenticated.guard";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { NotFoundPageComponent } from "./pages/not-found-page.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomePageComponent,
    title: APP_NAME,
  },
  {
    path: "user",
    canActivate: [isAuthenticatedGuard],
    children: [
      {
        path: "account",
        loadComponent: async () =>
          (await import("./pages/account-page/account-page.component"))
            .AccountPageComponent,
        title: "Account",
      },
      {
        path: "sessions",
        loadComponent: async () =>
          (await import("./pages/sessions-page/sessions-page.component"))
            .SessionsPageComponent,
        title: "Session Management",
      },
      {
        path: "change-password",
        loadComponent: async () =>
          (
            await import(
              "./pages/update-password-page/update-password-page.component"
            )
          ).UpdatePasswordPageComponent,
        title: "Update Password",
      },
    ],
  },
  {
    path: "sign-in",
    loadComponent: async () =>
      (await import("./pages/sign-in-page.component")).SignInPageComponent,
    canActivate: [isUnauthenticatedGuard],
    title: "Sign In",
  },
  {
    path: "register",
    loadComponent: async () =>
      (await import("./pages/register-page.component")).RegisterPageComponent,
    canActivate: [isUnauthenticatedGuard],
    title: "Register",
  },
  {
    path: "not-found",
    component: NotFoundPageComponent,
    title: "Not Found",
  },
  // Redirects for well-known URIs (see https://datatracker.ietf.org/doc/html/rfc8615)
  {
    path: ".well-known",
    children: [
      {
        path: "change-password",
        redirectTo: "/user/change-password",
      },
    ],
  },
  {
    path: "**",
    redirectTo: "not-found",
  },
];
