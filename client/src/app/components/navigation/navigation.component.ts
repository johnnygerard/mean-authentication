import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { APP_NAME } from "_server/constants/app";
import { UNAUTHORIZED } from "_server/constants/http-status-code";
import { NotificationService } from "../../services/notification.service";
import { SessionService } from "../../services/session.service";
import { UserMessage } from "../../types/user-message.enum";

@Component({
  selector: "app-navigation",
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule],
  templateUrl: "./navigation.component.html",
  styleUrl: "./navigation.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  readonly APP_NAME = APP_NAME;
  session = inject(SessionService);
  #http = inject(HttpClient);
  #notifier = inject(NotificationService);
  #router = inject(Router);

  onLogout(): void {
    this.#http.delete("/api/user/session").subscribe({
      next: () => this.#logout(),
      error: (response: HttpErrorResponse) => {
        if (response.status === UNAUTHORIZED) {
          this.#logout();
          return;
        }

        console.error(response);
        this.#notifier.send(UserMessage.LOGOUT_FAILED);
      },
    });
  }

  #logout(): void {
    this.session.clear();
    this.#router.navigateByUrl("/");
    this.#notifier.send(UserMessage.LOGOUT_SUCCESS);
  }
}
