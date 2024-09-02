import { HttpInterceptorFn } from "@angular/common/http";
import { environment } from "../../environments/environment";

const API_PREFIX = "/api";

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(API_PREFIX)) {
    const url = environment.apiBaseUrl + req.url.slice(API_PREFIX.length);
    req = req.clone({ url });
  }

  return next(req);
};
