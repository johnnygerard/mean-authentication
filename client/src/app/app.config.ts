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

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([errorInterceptor])),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
};
