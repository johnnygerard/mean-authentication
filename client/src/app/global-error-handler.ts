import { ErrorHandler } from "@angular/core";

/**
 * Handle uncaught client-side errors.
 */
export class GlobalErrorHandler implements ErrorHandler {
  handleError(e: unknown): void {
    window.console.error(e);
    window.alert(
      "Sorry about that! An unexpected error occurred in the application.",
    );
  }
}
