import { Component, HostListener, inject } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  #authService = inject(AuthService);

  // Delay initialization to make sure the session cookie is sent with the request
  @HostListener("document:DOMContentLoaded")
  onDOMContentLoaded(): void {
    this.#authService.initAuthStatus();
  }
}
