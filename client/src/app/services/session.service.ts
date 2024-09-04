import { computed, inject, Injectable, signal } from "@angular/core";
import { SessionUser } from "_server/types/session-user";
import { StorageService } from "./storage.service";

const SESSION_KEY = "session";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  #isPlatformServer = typeof window === "undefined";
  #storage = inject(StorageService);
  #user = signal<SessionUser | null | undefined>(undefined);
  user = this.#user.asReadonly();

  isAuthenticated = computed<boolean | null>(() => {
    const user = this.#user();

    if (user === undefined) return null;
    return user !== null;
  });

  constructor() {
    if (this.#isPlatformServer) return;

    // Restore session from storage
    const session = this.#storage.getItem(SESSION_KEY);
    this.#user.set(session === null ? null : JSON.parse(session));
  }

  clear(): void {
    this.#user.set(null);
    this.#storage.removeItem(SESSION_KEY);
  }

  store(user: SessionUser): void {
    this.#user.set(user);
    this.#storage.setItem(SESSION_KEY, JSON.stringify(user));
  }
}
