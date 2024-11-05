import { Injectable, signal } from "@angular/core";
import { ValidationErrors } from "@angular/forms";
import { ZXCVBN_MIN_SCORE } from "_server/constants/password";
import { zxcvbnDefaultResult } from "_server/constants/zxcvbn-default-result";
import { ZxcvbnResult } from "_server/types/zxcvbn-result";
import { BehaviorSubject, first } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PasswordStrengthService {
  result = signal(zxcvbnDefaultResult);
  #isReady$ = new BehaviorSubject(false);

  #worker = new Worker(
    new URL("../workers/password-strength.worker.js", import.meta.url),
    { type: "module" },
  );

  constructor() {
    this.#worker.onmessage = (event: MessageEvent<string>): void => {
      console.log(event.data);
      this.#isReady$.next(true);
    };
  }

  getValidationErrors(result: ZxcvbnResult): ValidationErrors | null {
    return result.score >= ZXCVBN_MIN_SCORE
      ? null
      : { strength: result.feedback.warning || "Vulnerable password" };
  }

  async validate(
    password: string,
    userInputs: string[] = [],
  ): Promise<ValidationErrors | null> {
    return new Promise((resolve, reject) => {
      this.#isReady$.pipe(first((isReady) => isReady)).subscribe(() => {
        this.#isReady$.next(false);

        this.#worker.onmessage = (event: MessageEvent<ZxcvbnResult>): void => {
          const result = event.data;

          this.result.set(result);
          resolve(this.getValidationErrors(result));
          this.#isReady$.next(true);
        };

        this.#worker.onerror = (error: ErrorEvent): void => {
          reject(error);
          this.#isReady$.next(true);
        };

        this.#worker.postMessage({ password, userInputs });
      });
    });
  }
}
