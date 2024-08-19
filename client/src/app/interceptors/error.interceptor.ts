import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { delay, EMPTY, of, retry, throwError } from "rxjs";

/**
 * HTTP error interceptor
 * @see https://angular.dev/guide/http/making-requests#handling-request-failure
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
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

        // Handle unexpected server-side errors
        if (error.status === 500) {
          window.alert(
            "Sorry about that! Our servers encountered an unexpected error.\n" +
              "Please try again later or contact support if the problem persists.",
          );

          return EMPTY;
        }

        // Propagate other HTTP errors
        return throwError(() => true);
      },
    }),
  );
};
