import { computed, inject, Injectable, signal } from "@angular/core";
import { ClientSession } from "_server/types/client-session";
import { StorageService } from "./storage.service";
import { isPlatformServer } from "../constants";

const SESSION_KEY = "session";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  #storage = inject(StorageService);
  #user = signal<ClientSession | null | undefined>(undefined);
  user = this.#user.asReadonly();

  isAuthenticated = computed<boolean | null>(() => {
    const user = this.#user();

    if (user === undefined) return null;
    return user !== null;
  });

  constructor() {
    if (isPlatformServer) return;

    // Restore session from storage
    const session = this.#storage.getItem(SESSION_KEY);
    this.#user.set(session === null ? null : JSON.parse(session));
  }

  clear(): void {
    this.#user.set(null);
    this.#storage.removeItem(SESSION_KEY);
  }

  store(user: ClientSession): void {
    this.#user.set(user);
    this.#storage.setItem(SESSION_KEY, JSON.stringify(user));
  }
}
