import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButton } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ServerSession } from "_server/types/server-session";
import { DeleteAllSessionsDialogComponent } from "../../components/delete-all-sessions-dialog/delete-all-sessions-dialog.component";
import { NotificationService } from "../../services/notification.service";
import { SessionService } from "../../services/session.service";

@Component({
  selector: "app-sessions-page",
  standalone: true,
  imports: [MatButton],
  templateUrl: "./sessions-page.component.html",
  styleUrl: "./sessions-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsPageComponent {
  sessionCount = signal(0);
  #destroyRef = inject(DestroyRef);
  #dialog = inject(MatDialog);
  #http = inject(HttpClient);
  #notifier = inject(NotificationService);
  #router = inject(Router);
  #session = inject(SessionService);

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

  confirmDeleteAllSessions(): void {
    const dialogRef = this.#dialog.open(DeleteAllSessionsDialogComponent);

    dialogRef.afterClosed().subscribe((isConfirmed: boolean) => {
      if (isConfirmed) this.deleteAllSessions();
    });
  }

  deleteAllSessions(): void {
    this.#http
      .delete<void>("/api/user/all-sessions")
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: async () => {
          this.#session.clear();
          await this.#router.navigateByUrl("/");
          this.#notifier.send("All sessions have been revoked.");
        },
        error: (e) => {
          console.error(e);
          this.#notifier.send(
            "Failed to revoke all sessions. Please try again later.",
          );
        },
      });
  }

  deleteAllOtherSessions(): void {
    this.#http
      .delete<void>("/api/user/all-other-sessions")
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.sessionCount.set(1);
          this.#notifier.send("All other sessions have been revoked.");
        },
        error: (e) => {
          console.error(e);
          this.#notifier.send(
            "Failed to revoke all other sessions. Please try again later.",
          );
        },
      });
  }
}
