import { inject, Injectable } from "@angular/core";
import { isPlatformServer } from "../constants";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  readonly #isNotSupported = false;
  #notifier = inject(NotificationService);

  constructor() {
    if (isPlatformServer) return;

    try {
      this.#isNotSupported = !window.localStorage;

      if (this.#isNotSupported)
        this.#notifier.send(
          "Your browser does not support local storage. Data will not be saved.",
        );
    } catch (e) {
      if (e instanceof DOMException && e.name === "SecurityError") {
        this.#handleSecurityError(e);
        return;
      }

      throw e;
    }
  }

  get #localStorage(): Storage | null {
    if (this.#isNotSupported) return null;

    try {
      return window.localStorage;
    } catch (e) {
      if (e instanceof DOMException && e.name === "SecurityError") {
        this.#handleSecurityError(e);
        return null;
      }

      throw e;
    }
  }

  /**
   * Get an item from local storage
   * @param key - Item key
   * @returns Item value if local storage is available and has the item, otherwise null
   */
  getItem(key: string): string | null {
    return this.#localStorage?.getItem(key) ?? null;
  }

  /**
   * Set an item in local storage
   * @param key - Item key
   * @param value - Item value
   */
  setItem(key: string, value: string): void {
    try {
      this.#localStorage?.setItem(key, value);
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

  /**
   * Remove an item from local storage
   * @param key
   */
  removeItem(key: string): void {
    this.#localStorage?.removeItem(key);
  }

  #handleSecurityError(e: DOMException): void {
    console.error(e);
    this.#notifier.send(
      "Your browser or site settings do not allow local storage." +
        " Data will not be saved.",
    );
  }
}
