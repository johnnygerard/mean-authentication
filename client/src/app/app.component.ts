import { Component, HostListener, inject } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: "./app.component.html",
  styles: [],
})
export class AppComponent {
  #authService = inject(AuthService);
  #http = inject(HttpClient);
  isAuthenticated = this.#authService.isAuthenticated;

  // Delay initialization to make sure the session cookie is sent with the request
  @HostListener("document:DOMContentLoaded")
  onDOMContentLoaded(): void {
    this.#authService.initAuthStatus();
  }

  deleteSession(): void {
    this.#http.delete(`${environment.apiUrl}/session`).subscribe({
      next: () => {
        this.#authService.isAuthenticated.set(false);
      },
      error: (e) => {
        throw e;
      },
    });
  }
}
