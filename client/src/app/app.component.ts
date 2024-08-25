import { Component, HostListener, inject, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { RouterOutlet } from "@angular/router";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  #authService = inject(AuthService);
  #iconRegistry = inject(MatIconRegistry);
  #sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    for (const name of ["visibility", "visibility-off", "error"])
      this.#registerIcon(name);
  }

  // Delay initialization to make sure the session cookie is sent with the request
  @HostListener("document:DOMContentLoaded")
  onDOMContentLoaded(): void {
    this.#authService.initAuthStatus();
  }

  #registerIcon(name: string): void {
    this.#iconRegistry.addSvgIcon(
      name,
      this.#sanitizer.bypassSecurityTrustResourceUrl(`/icons/${name}.svg`),
    );
  }
}
