import { Injectable, signal } from "@angular/core";
import { zxcvbnDefaultResult } from "_server/constants/zxcvbn-default-result";
import { ZxcvbnInput } from "_server/types/zxcvbn-input";
import { ZxcvbnResult } from "_server/types/zxcvbn-result";

@Injectable({
  providedIn: "root",
})
export class PasswordStrengthService {
  #result = signal(zxcvbnDefaultResult);
  result = this.#result.asReadonly();
  readonly #worker = new Worker(
    new URL("../workers/password-strength.worker.js", import.meta.url),
    { type: "module" },
  );
  #workerInput: ZxcvbnInput | null = null;
  #workerIsBusy = signal(true);
  workerIsBusy = this.#workerIsBusy.asReadonly();
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

  validate(password: string, userInputs: string[]): void {
    if (this.#workerIsBusy() || !this.#workerIsInitialized) {
      this.#workerInput = { password, userInputs };
      return;
    }

    this.#workerIsBusy.set(true);
    this.#worker.postMessage({ password, userInputs });
  }
}
