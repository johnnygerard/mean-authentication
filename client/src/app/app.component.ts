import { Component, HostListener, inject } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: "./app.component.html",
  styles: [],
})
export class AppComponent {
  #authService = inject(AuthService);

  // Delay initialization to make sure the session cookie is sent with the request
  @HostListener("document:DOMContentLoaded")
  onDOMContentLoaded(): void {
    this.#authService.initAuthStatus();
  }
}
