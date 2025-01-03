import { inject, Injectable } from "@angular/core";
import { ZxcvbnInput } from "_server/types/zxcvbn-input";
import { ZxcvbnResult } from "_server/types/zxcvbn-result";
import { Observable, Subject } from "rxjs";
import { Queue } from "../types/queue.class";
import { UserMessage } from "../types/user-message.enum";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class PasswordStrengthService {
  result$ = new Subject<ZxcvbnResult>();
  #isWorkerInitialized = false;
  #notifier = inject(NotificationService);
  #worker = this.#createWorker();

  #queue = new Queue<{
    input: ZxcvbnInput;
    result$: Subject<ZxcvbnResult>;
  }>();

  validate(
    password: string,
    userInputs: string[] = [],
  ): Observable<ZxcvbnResult> {
    const input: ZxcvbnInput = { password, userInputs };
    const result$ = new Subject<ZxcvbnResult>();

    this.#queue.enqueue({ input, result$ });

    if (this.#queue.size === 1 && this.#isWorkerInitialized)
      this.#worker.postMessage(input);

    return result$.asObservable();
  }

  #createWorker(): Worker {
    const worker = new Worker(
      new URL("../workers/password-strength.worker.js", import.meta.url),
      { type: "module" },
    );

    const mainListener = (event: MessageEvent<ZxcvbnResult>): void => {
      this.result$.next(event.data);

      if (this.#queue.size === 1) {
        const { result$ } = this.#queue.dequeue();

        result$.next(event.data);
        result$.complete();
        return;
      }

      this.#handleWork();
    };

    worker.onmessage = (event: MessageEvent<string>): void => {
      console.log(event.data);
      this.#worker.onmessage = mainListener;
      this.#isWorkerInitialized = true;

      if (this.#queue.isEmpty) return;
      this.#handleWork();
    };

    worker.onerror = (): void => {
      this.#notifier.send(UserMessage.UNEXPECTED_WORKER_ERROR);
    };

    return worker;
  }

  /**
   * Handle work items that were enqueued while the worker was busy.
   */
  #handleWork(): void {
    // Abort all previous requests
    while (this.#queue.size > 1) this.#queue.dequeue().result$.complete();

    // Send the last user input to the worker
    this.#worker.postMessage(this.#queue.peek().input);
  }
}
