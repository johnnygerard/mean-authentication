import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { SessionService } from "../services/session.service";

const CSRF_HEADER = "X-CSRF-Token";
const safeMethods = ["GET", "HEAD", "OPTIONS", "TRACE"];

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const isPrivateApiRequest = req.url.startsWith("/api/user");
  const isSafeMethod = safeMethods.includes(req.method);

  if (isPrivateApiRequest && !isSafeMethod) {
    const session = inject(SessionService);
    const csrfToken = session.user()!.csrfToken;
    const headers = req.headers.append(CSRF_HEADER, csrfToken);

    req = req.clone({ headers });
  }

  return next(req);
};
