import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ServerSession } from "_server/types/server-session";
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: "app-sessions-page",
  standalone: true,
  imports: [],
  templateUrl: "./sessions-page.component.html",
  styleUrl: "./sessions-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsPageComponent {
  sessionCount = signal(0);
  #http = inject(HttpClient);
  #notifier = inject(NotificationService);

  constructor() {
    this.#http
      .get<Record<string, ServerSession>>("/api/user/all-sessions")
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (value) => {
          this.sessionCount.set(Object.keys(value).length);
        },
        error: (e) => {
          console.error(e);
          this.#notifier.send(
            "Failed to load session data. Please try reloading the page.",
          );
        },
      });
  }
}
