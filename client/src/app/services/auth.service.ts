import { Injectable, signal } from "@angular/core";
import ms from "ms";
import { SESSION_LIFETIME } from "_server/middleware/session";

const AUTH_KEY = "authenticatedUntil";

/**
 * Track user's authentication status via persistent web storage.
 */
@Injectable({
  providedIn: "root",
})
export class AuthService {
  #isAuthenticated = signal<boolean | null>(null);
  isAuthenticated = this.#isAuthenticated.asReadonly();
  #sessionLifetime = ms(SESSION_LIFETIME);

  constructor() {
    // Auth status is always null on the server (SSR check)
    if (typeof window === "undefined") return;
    const authenticatedUntil: null | string = window.localStorage[AUTH_KEY];

    if (authenticatedUntil === null) {
      this.#isAuthenticated.set(false);
    } else {
      const expirationTime = parseInt(authenticatedUntil, 10);
      const isAuthenticated = Date.now() < expirationTime;

      if (!isAuthenticated) window.localStorage.removeItem(AUTH_KEY);
      this.#isAuthenticated.set(isAuthenticated);
    }
  }

  setAuthStatus(isAuthenticated: boolean): void {
    if (isAuthenticated) {
      const expirationTime = Date.now() + this.#sessionLifetime;
      window.localStorage[AUTH_KEY] = expirationTime.toString(10);
    } else {
      window.localStorage.removeItem(AUTH_KEY);
    }
    this.#isAuthenticated.set(isAuthenticated);
  }
}
