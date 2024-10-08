import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withNoXsrfProtection,
} from "@angular/common/http";
import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from "@angular/core";
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBar,
} from "@angular/material/snack-bar";
import { provideClientHydration } from "@angular/platform-browser";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter, TitleStrategy } from "@angular/router";

import { routes } from "./app.routes";
import { prefersReducedMotion } from "./constants";
import { GlobalErrorHandler } from "./global-error-handler";
import { apiBaseUrlInterceptor } from "./interceptors/api-base-url.interceptor";
import { credentialsInterceptor } from "./interceptors/credentials.interceptor";
import { csrfInterceptor } from "./interceptors/csrf.interceptor";
import { errorInterceptor } from "./interceptors/error.interceptor";
import { TitleStrategyService } from "./services/title-strategy.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withNoXsrfProtection(),
      withInterceptors([
        credentialsInterceptor,
        csrfInterceptor,
        errorInterceptor,
        // The apiBaseUrlInterceptor must be the last one because other
        // interceptors use relative URLs.
        apiBaseUrlInterceptor,
      ]),
    ),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    provideAnimationsAsync(prefersReducedMotion ? "noop" : "animations"),
    MatSnackBar,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5_000 } },
    {
      provide: TitleStrategy,
      useClass: TitleStrategyService,
    },
  ],
};
