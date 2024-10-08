import { CanActivateFn } from "@angular/router";
import { authGuardFactory } from "./auth-guard-factory";

export const isUnauthenticatedGuard: CanActivateFn = authGuardFactory(false);
