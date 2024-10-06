import { HttpInterceptorFn } from "@angular/common/http";

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith("/api")) req = req.clone({ withCredentials: true });

  return next(req);
};
