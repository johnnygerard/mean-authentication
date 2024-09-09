import { CanActivateFn } from "@angular/router";
import { authGuardFactory } from "./auth-guard-factory";

export const isAuthenticatedGuard: CanActivateFn = authGuardFactory(true);
