import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { delay, EMPTY, of, retry, throwError } from "rxjs";
import { NotificationService } from "../services/notification.service";
import { inject } from "@angular/core";
import { formatRateLimit } from "./format-rate-limit";
import {
  SERVICE_UNAVAILABLE,
  TOO_MANY_REQUESTS,
} from "_server/http-status-code";

/**
 * HTTP error interceptor
 * @see https://angular.dev/guide/http/making-requests#handling-request-failure
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    retry({
      count: 4,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        // Retry non-HTTP errors after 1, 10, 100, and 1000 ms
        if (error.status === 0) {
          window.console.error(
            `Retrying failed request: attempt #${retryCount}`,
          );
          return of(true).pipe(delay(10 ** (retryCount - 1)));
        }

        if (error.status === SERVICE_UNAVAILABLE) {
          notificationService.notify(
            "Sorry, the server is currently unavailable. Please try again later.",
          );
          return EMPTY;
        }

        if (error.status === TOO_MANY_REQUESTS) {
          notificationService.notify(formatRateLimit(error.headers));
          return EMPTY;
        }

        // Propagate other HTTP errors
        return throwError(() => error);
      },
    }),
  );
};
