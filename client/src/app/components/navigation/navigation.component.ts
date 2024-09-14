import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { HttpClient } from "@angular/common/http";
import { SessionService } from "../../services/session.service";
import { NotificationService } from "../../services/notification.service";
import { AppComponent } from "../../app.component";

@Component({
  selector: "app-navigation",
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule],
  templateUrl: "./navigation.component.html",
  styleUrl: "./navigation.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  readonly APP_NAME = AppComponent.APP_NAME;
  #http = inject(HttpClient);
  #notifier = inject(NotificationService);
  #router = inject(Router);
  #session = inject(SessionService);
  isAuthenticated = this.#session.isAuthenticated;

  onLogout(): void {
    this.#http.delete("/api/session").subscribe({
      next: () => {
        this.#session.clear();
        this.#router.navigateByUrl("/");
      },
      error: (e) => {
        window.console.error(e);
        this.#notifier.send("Logout failed. Please try again later.");
      },
    });
  }
}
