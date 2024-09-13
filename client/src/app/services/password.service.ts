import { Injectable, signal } from "@angular/core";
import type { ZXCVBNResult } from "zxcvbn";

declare global {
  interface Window {
    zxcvbn: (password: string, userInputs?: string[]) => ZXCVBNResult;
  }
}

/**
 * This service's main purpose is to share password strength results between
 * the password validator directive and the password strength meter component.
 */
@Injectable({
  providedIn: "root",
})
export class PasswordService {
  #defaultResult: ZXCVBNResult = {
    guesses: 1,
    guesses_log10: 0,
    sequence: [],
    calc_time: 1,
    crack_times_seconds: {
      online_throttling_100_per_hour: 36,
      online_no_throttling_10_per_second: 0.1,
      offline_slow_hashing_1e4_per_second: 0.0001,
      offline_fast_hashing_1e10_per_second: 1e-10,
    },
    crack_times_display: {
      online_throttling_100_per_hour: "36 seconds",
      online_no_throttling_10_per_second: "less than a second",
      offline_slow_hashing_1e4_per_second: "less than a second",
      offline_fast_hashing_1e10_per_second: "less than a second",
    },
    score: 0,
    feedback: {
      warning: "",
      suggestions: [
        "Use a few words, avoid common phrases",
        "No need for symbols, digits, or uppercase letters",
      ],
    },
  };

  isLoaded = signal(false);
  result = signal(this.#defaultResult);
  #isPlatformBrowser = typeof window === "object";

  constructor() {
    if (this.#isPlatformBrowser) this.#loadLibrary();
  }

  #loadLibrary(): void {
    const script = window.document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/zxcvbn@4.4.2/dist/zxcvbn.js";
    script.defer = true;
    script.integrity = "sha256-9CxlH0BQastrZiSQ8zjdR6WVHTMSA5xKuP5QkEhPNRo=";
    script.crossOrigin = "anonymous";
    script.onload = () => {
      this.isLoaded.set(true);
    };

    window.document.body.appendChild(script);
  }
}
