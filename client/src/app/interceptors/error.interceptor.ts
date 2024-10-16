import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import {
  BAD_REQUEST,
  SERVICE_UNAVAILABLE,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "_server/constants/http-status-code";
import { ApiError } from "_server/types/api-error.enum";
import ms from "ms";
import { delay, EMPTY, of, retry, throwError } from "rxjs";
import { NotificationService } from "../services/notification.service";
import { SessionService } from "../services/session.service";

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
      delay: (response: HttpErrorResponse, retryCount: number) => {
        switch (response.status) {
          case NON_HTTP_ERROR:
            console.error(`Retrying failed request: attempt #${retryCount}`);
            return of(true).pipe(delay(computeDelay(retryCount)));

          case BAD_REQUEST:
            console.error("Input validation mismatch", response);
            notifier.send(response.error);
            break;

          case UNAUTHORIZED:
            if (response.error !== ApiError.UNAUTHENTICATED)
              return throwError(() => response);
            session.clear();
            router.navigateByUrl("/sign-in");
            notifier.send(response.error);
            break;

          case TOO_MANY_REQUESTS:
            notifier.send(response.error);
            break;

          case SERVICE_UNAVAILABLE:
            notifier.send(
              "Sorry, the server is currently unavailable. Please try again later.",
            );
            break;

          default:
            // Propagate other HTTP errors
            return throwError(() => response);
        }

        // The HTTP error has been handled; complete the observable
        return EMPTY;
      },
    }),
  );
};
