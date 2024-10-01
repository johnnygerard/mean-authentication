import { inject } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { CanActivateFn, Router } from "@angular/router";
import { filter, map } from "rxjs";
import { isPlatformServer } from "../constants";
import { SessionService } from "../services/session.service";

export function authGuardFactory(isAuthenticatedGuard: boolean): CanActivateFn {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (route, state) => {
    if (isPlatformServer) return false;

    const router = inject(Router);
    const session = inject(SessionService);

    return toObservable(session.isAuthenticated).pipe(
      filter((value) => value !== null),
      map((isAuthenticated) => {
        if (isAuthenticatedGuard)
          return isAuthenticated ? true : router.parseUrl("/sign-in");

        return isAuthenticated ? router.parseUrl("/") : true;
      }),
    );
  };
}
