import { Component, HostListener, inject } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
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
