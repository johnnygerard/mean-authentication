import { Injectable, signal } from "@angular/core";
import type { ZXCVBNResult } from "zxcvbn";
import { APP_NAME } from "_server/constants/app";

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

  // dictionary: string[] = [];
  // dictionaryLength = 0;
  isLoaded = signal(false);
  result = signal(this.#defaultResult);
  #dictionary: string[] = [];
  #libraryBlobUrl = "";
  #isPlatformBrowser = typeof window === "object";
  #worker: Worker | null = null;
  #workerIsBusy = false;

  constructor() {
    if (this.#isPlatformBrowser) {
      this.#initialize();
    }
  }

  async zxcvbn(
    password: string,
    ...userInputs: string[]
  ): Promise<ZXCVBNResult> {
    const worker = this.#worker;
    if (!worker) throw new Error("Uninitialized worker");
    if (this.#workerIsBusy) await this.#restartWorker();
    else this.#workerIsBusy = true;

    return new Promise((resolve) => {
      const listener = (event: MessageEvent): void => {
        const result = event.data as ZXCVBNResult;

        this.result.set(result);
        worker.removeEventListener("message", listener);
        this.#workerIsBusy = false;
        resolve(result);
      };

      worker.addEventListener("message", listener);
      worker.postMessage([password, userInputs]);
    });
  }

  async #initialize(): Promise<void> {
    const [dictionary, libraryBlobUrl] = await Promise.all([
      this.#loadDictionary(),
      this.#loadLibrary(),
    ]);

    this.#dictionary = dictionary;
    this.#libraryBlobUrl = libraryBlobUrl;

    await this.#startWorker();
  }

  async #restartWorker(): Promise<void> {
    if (!this.#worker) throw new Error("Uninitialized worker");

    this.#worker.terminate();
    await this.#startWorker();
  }

  async #startWorker(): Promise<void> {
    const worker = new Worker(new URL("zxcvbn.worker.js", import.meta.url), {
      type: "module",
    });

    this.#worker = worker;

    await new Promise<void>((resolve) => {
      const listener = (event: MessageEvent): void => {
        console.log(event.data);
        worker.removeEventListener("message", listener);
        resolve();
      };

      worker.addEventListener("message", listener);
      worker.postMessage([this.#dictionary, this.#libraryBlobUrl]);
    });

    this.isLoaded.set(true);
  }

  async #loadDictionary(): Promise<string[]> {
    const response = await fetch("app-dictionary.txt");
    const text = await response.text();
    const dictionary = text.split("\n");

    dictionary.push(APP_NAME);
    return dictionary;
  }

  async #loadLibrary(): Promise<string> {
    const response = await fetch(
      "https://cdn.jsdelivr.net/npm/zxcvbn@4.4.2/dist/zxcvbn.js",
      {
        integrity: "sha256-9CxlH0BQastrZiSQ8zjdR6WVHTMSA5xKuP5QkEhPNRo=",
      },
    );
    const blob = await response.blob();

    return URL.createObjectURL(blob);
  }

  // getDictionary(...userInputs: string[]): string[] {
  //   // Truncate the dictionary to its original length
  //   this.dictionary.length = this.dictionaryLength;
  //
  //   for (const userInput of userInputs)
  //     if (userInput) this.dictionary.push(userInput);
  //
  //   return this.dictionary;
  // }
}
