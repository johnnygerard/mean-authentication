import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { ReplaySubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  #http = inject(HttpClient);
  isAuthenticated$ = new ReplaySubject<boolean>(1);

  initAuthStatus(): void {
    this.#http
      .get<{ isAuthenticated: boolean }>(`${environment.apiUrl}/auth-status`, {
        withCredentials: true,
      })
      .subscribe({
        next: ({ isAuthenticated }) => {
          this.isAuthenticated$.next(isAuthenticated);
        },
        error: (e) => {
          this.isAuthenticated$.next(false);
          throw e;
        },
      });
  }
}
