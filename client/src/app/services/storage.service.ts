import { inject, Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  #isPlatformServer = typeof window === "undefined";
  #notifier = inject(NotificationService);

  constructor() {
    if (this.#isPlatformServer) return;

    try {
      if (!window.localStorage) {
        this.#notifier.send(
          "Your browser does not support local storage." +
            " Data will not be saved.",
        );
        return;
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "SecurityError") {
        window.console.error(e);
        this.#notifier.send(
          "Your browser or site settings do not allow local storage." +
            " Data will not be saved.",
        );
        return;
      }

      throw e;
    }
  }

  getItem(key: string): string | null {
    return window.localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        this.#notifier.send(
          "Insufficient storage space. Please clear browser or site data.",
        );
        return;
      }

      throw e;
    }
  }

  removeItem(key: string): void {
    window.localStorage.removeItem(key);
  }
}
