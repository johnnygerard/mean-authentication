import { Injectable, signal } from "@angular/core";
import { zxcvbnDefaultResult } from "_server/constants/zxcvbn-default-result";
import { ZxcvbnInput } from "_server/types/zxcvbn-input";
import { ZxcvbnResult } from "_server/types/zxcvbn-result";

@Injectable({
  providedIn: "root",
})
export class PasswordStrengthService {
  readonly #result = signal(zxcvbnDefaultResult);
  readonly #worker = new Worker(
    new URL("../workers/password-strength.worker.js", import.meta.url),
    { type: "module" },
  );
  #workerInput: ZxcvbnInput | null = null;
  readonly #workerIsBusy = signal(true);
  #workerIsInitialized = false;

  constructor() {
    const mainListener = (event: MessageEvent<ZxcvbnResult>): void => {
      this.#result.set(event.data);
      this.#checkWorkerInput();
    };

    // Set up initial listener
    this.#worker.onmessage = (event: MessageEvent<string>): void => {
      console.log(event.data);
      this.#workerIsInitialized = true;
      this.#worker.onmessage = mainListener; // Overwrite current listener
      this.#checkWorkerInput();
    };
  }

  #checkWorkerInput(): void {
    if (this.#workerInput) {
      this.#worker.postMessage(this.#workerInput);
      this.#workerInput = null;
      return;
    }

    this.#workerIsBusy.set(false);
  }

  get result() {
    return this.#result.asReadonly();
  }

  get workerIsBusy() {
    return this.#workerIsBusy.asReadonly();
  }

  validate(password: string, userInputs: string[]): void {
    if (this.#workerIsBusy() || !this.#workerIsInitialized) {
      this.#workerInput = { password, userInputs };
      return;
    }

    this.#workerIsBusy.set(true);
    this.#worker.postMessage({ password, userInputs });
  }
}
