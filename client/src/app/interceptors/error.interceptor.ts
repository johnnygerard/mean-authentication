import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { delay, EMPTY, of, retry, throwError } from "rxjs";
import { NotificationService } from "../services/notification.service";
import { inject } from "@angular/core";
import { formatRateLimit } from "./format-rate-limit";
import {
  SERVICE_UNAVAILABLE,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "_server/http-status-code";
import { Router } from "@angular/router";
import { SessionService } from "../services/session.service";
import ms from "ms";

const NON_HTTP_ERROR = 0; // Network or connection error
const baseDelay = ms("50 milliseconds");

/**
 * Compute the delay in milliseconds for the next retry attempt
 * @param retryCount - The number of retry attempts (1-based)
 * @returns The delay in milliseconds
 */
const computeDelay = (retryCount: number): number => {
  const multiplier = 2 ** (retryCount - 1);
  const delay = baseDelay * multiplier;
  const jitter = Math.random() * delay;

  return Math.floor(delay + jitter);
};

/**
 * HTTP error interceptor
 * @see https://angular.dev/guide/http/making-requests#handling-request-failure
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifier = inject(NotificationService);
  const router = inject(Router);
  const session = inject(SessionService);

  return next(req).pipe(
    retry({
      count: 5,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        switch (error.status) {
          case NON_HTTP_ERROR:
            window.console.error(
              `Retrying failed request: attempt #${retryCount}`,
            );
            return of(true).pipe(delay(computeDelay(retryCount)));

          case SERVICE_UNAVAILABLE:
            notifier.send(
              "Sorry, the server is currently unavailable. Please try again later.",
            );
            break;

          case TOO_MANY_REQUESTS:
            notifier.send(formatRateLimit(error.headers));
            break;

          case UNAUTHORIZED:
            session.clear();
            router.navigateByUrl("/sign-in");
            break;

          default:
            // Propagate other HTTP errors
            return throwError(() => error);
        }

        // The HTTP error has been handled; complete the observable
        return EMPTY;
      },
    }),
  );
};
