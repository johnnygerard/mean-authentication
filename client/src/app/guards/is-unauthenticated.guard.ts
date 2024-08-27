import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { toObservable } from "@angular/core/rxjs-interop";
import { filter, map } from "rxjs";

export const isUnauthenticatedGuard: CanActivateFn = (route, state) => {
  if (typeof window === "undefined") return false;

  const auth = inject(AuthService);
  const router = inject(Router);

  return toObservable(auth.isAuthenticated).pipe(
    filter((value) => value !== null),
    map((isAuthenticated) => (isAuthenticated ? router.parseUrl("/") : true)),
  );
};
