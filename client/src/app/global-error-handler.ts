import { ErrorHandler, inject } from "@angular/core";
import { NotificationService } from "./services/notification.service";
import { UserMessage } from "./types/user-message.enum";

/**
 * Handle uncaught client-side errors.
 */
export class GlobalErrorHandler implements ErrorHandler {
  #notifier = inject(NotificationService);

  handleError(e: unknown): void {
    console.error(e);
    this.#notifier.send(UserMessage.UNEXPECTED_ERROR);
  }
}
