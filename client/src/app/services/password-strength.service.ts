import { Injectable, signal } from "@angular/core";
import { ValidationErrors } from "@angular/forms";
import { ZXCVBN_MIN_SCORE } from "_server/constants/password";
import { zxcvbnDefaultResult } from "_server/constants/zxcvbn-default-result";
import { ZxcvbnResult } from "_server/types/zxcvbn-result";

@Injectable({
  providedIn: "root",
})
export class PasswordStrengthService {
  result = signal(zxcvbnDefaultResult);

  get #worker(): Worker {
    return new Worker(
      new URL("../workers/password-strength.worker.js", import.meta.url),
      { type: "module" },
    );
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
    const worker = this.#worker;

    return new Promise((resolve, reject) => {
      const validationListener = (event: MessageEvent<ZxcvbnResult>): void => {
        this.result.set(event.data);
        resolve(this.getValidationErrors(event.data));
        worker.terminate();
      };

      const errorListener = (error: ErrorEvent): void => {
        reject(error);
        worker.terminate();
      };

      // Wait for the worker to initialize
      worker.onmessage = (event: MessageEvent<string>): void => {
        console.log(event.data);
        worker.onmessage = validationListener;
        worker.onerror = errorListener;
        worker.postMessage({ password, userInputs });
      };
    });
  }
}
