import { Injectable } from "@angular/core";
import { ZxcvbnResult } from "_server/types/zxcvbn-result";
import {
  BehaviorSubject,
  first,
  Observable,
  Subject,
  switchMap,
  tap,
} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PasswordStrengthService {
  result$ = new Subject<ZxcvbnResult>();
  #isReady$ = new BehaviorSubject(false);
  #worker = new Worker(
    new URL("../workers/password-strength.worker.js", import.meta.url),
    { type: "module" },
  );

  constructor() {
    this.#worker.onmessage = (event: MessageEvent<string>): void => {
      console.log(event.data);

      this.#worker.onmessage = (event: MessageEvent<ZxcvbnResult>): void => {
        this.result$.next(event.data);
      };

      this.#isReady$.next(true);
    };
  }

  validate(
    password: string,
    userInputs: string[] = [],
  ): Observable<ZxcvbnResult> {
    return this.#isReady$.pipe(
      first(Boolean),
      switchMap(() => {
        this.#isReady$.next(false);
        this.#worker.postMessage({ password, userInputs });

        return this.result$.pipe(
          first(),
          tap(() => this.#isReady$.next(true)),
        );
      }),
    );
  }
}
