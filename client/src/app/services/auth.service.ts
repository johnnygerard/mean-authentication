import { Injectable, signal } from "@angular/core";
import ms from "ms";

const AUTH_KEY = "authenticatedUntil";
const SESSION_LIFETIME = "1h";

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
  #timeoutId = 0;

  constructor() {
    // Auth status is always null on the server (SSR check)
    if (typeof window === "undefined") return;
    const authenticatedUntil: null | string = window.localStorage[AUTH_KEY];

    if (authenticatedUntil === null) {
      this.#isAuthenticated.set(false);
    } else {
      const expirationTime = parseInt(authenticatedUntil, 10);
      const isAuthenticated = Date.now() < expirationTime;

      if (isAuthenticated) this.#scheduleEndOfSession(expirationTime);
      else window.localStorage.removeItem(AUTH_KEY);
      this.#isAuthenticated.set(isAuthenticated);
    }
  }

  setAuthStatus(isAuthenticated: boolean): void {
    if (isAuthenticated) {
      const expirationTime = Date.now() + this.#sessionLifetime;
      window.localStorage[AUTH_KEY] = expirationTime.toString(10);
      this.#scheduleEndOfSession(expirationTime);
    } else {
      window.localStorage.removeItem(AUTH_KEY);
    }
    this.#isAuthenticated.set(isAuthenticated);
  }

  #scheduleEndOfSession(expirationTime: number): void {
    window.clearTimeout(this.#timeoutId);
    this.#timeoutId = window.setTimeout(() => {
      this.setAuthStatus(false);
    }, expirationTime - Date.now());
  }
}
