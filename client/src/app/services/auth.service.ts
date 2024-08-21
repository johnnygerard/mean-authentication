import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  #http = inject(HttpClient);
  isAuthenticated$ = new BehaviorSubject<boolean | null>(null);

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
