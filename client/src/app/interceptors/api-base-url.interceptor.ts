import { HttpInterceptorFn } from "@angular/common/http";
import { environment } from "../../environments/environment";

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // Do not rewrite the base URL for non-API requests such as static assets
  if (req.url.startsWith("/api"))
    req = req.clone({ url: environment.apiBaseUrl + req.url });

  return next(req);
};
