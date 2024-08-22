import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  #http = inject(HttpClient);
  isAuthenticated = signal<boolean | null>(null);

  initAuthStatus(): void {
    this.#http
      .get<{ isAuthenticated: boolean }>(`${environment.apiUrl}/auth-status`, {
        withCredentials: true,
      })
      .subscribe({
        next: ({ isAuthenticated }) => {
          this.isAuthenticated.set(isAuthenticated);
        },
        error: (e) => {
          this.isAuthenticated.set(false);
          throw e;
        },
      });
  }
}
