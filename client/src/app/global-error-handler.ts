import { ErrorHandler, inject } from "@angular/core";
import { NotificationService } from "./services/notification.service";

/**
 * Handle uncaught client-side errors.
 */
export class GlobalErrorHandler implements ErrorHandler {
  #notificationService = inject(NotificationService);

  handleError(e: unknown): void {
    window.console.error(e);
    this.#notificationService.send(
      "An unknown error has occurred. Please try again later.",
    );
  }
}
