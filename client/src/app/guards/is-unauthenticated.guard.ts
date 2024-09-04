import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { filter, map } from "rxjs";
import { SessionService } from "../services/session.service";

const isPlatformServer = typeof window === "undefined";

export const isUnauthenticatedGuard: CanActivateFn = (_route, _state) => {
  if (isPlatformServer) return false;

  const router = inject(Router);
  const session = inject(SessionService);

  return toObservable(session.isAuthenticated).pipe(
    filter((value) => value !== null),
    map((isAuthenticated) => (isAuthenticated ? router.parseUrl("/") : true)),
  );
};
