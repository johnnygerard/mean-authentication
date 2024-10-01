import { computed, inject, Injectable, signal } from "@angular/core";
import { ClientSession } from "_server/types/client-session";
import { isPlatformServer } from "../constants";
import { StorageService } from "./storage.service";

const SESSION_KEY = "session";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  user = signal<ClientSession | null | undefined>(undefined);
  isAuthenticated = computed<boolean | null>(() => {
    const user = this.user();

    if (user === undefined) return null;
    return user !== null;
  });
  #storage = inject(StorageService);

  constructor() {
    if (isPlatformServer) return;

    // Restore session from storage
    const session = this.#storage.getItem(SESSION_KEY);
    this.user.set(session === null ? null : JSON.parse(session));
  }

  clear(): void {
    this.user.set(null);
    this.#storage.removeItem(SESSION_KEY);
  }

  store(user: ClientSession): void {
    this.user.set(user);
    this.#storage.setItem(SESSION_KEY, JSON.stringify(user));
  }
}
