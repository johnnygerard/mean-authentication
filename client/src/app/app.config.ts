import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideClientHydration } from "@angular/platform-browser";
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from "@angular/common/http";
import { errorInterceptor } from "./interceptors/error.interceptor";
import { GlobalErrorHandler } from "./global-error-handler";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBar,
} from "@angular/material/snack-bar";
import { apiBaseUrlInterceptor } from "./interceptors/api-base-url.interceptor";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([errorInterceptor, apiBaseUrlInterceptor]),
    ),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    provideAnimationsAsync(prefersReducedMotion ? "noop" : "animations"),
    MatSnackBar,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5_000 } },
  ],
};
