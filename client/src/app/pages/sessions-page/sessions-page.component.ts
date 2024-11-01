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
import { UserMessage } from "../../types/user-message.enum";

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
          this.#notifier.send(UserMessage.SESSIONS_PAGE_LOAD_FAILED);
        },
      });
  }

  confirmDeleteAllSessions(): void {
    const SHOULD_LOG_OUT = true;
    const dialogRef = this.#dialog.open(DeleteAllSessionsDialogComponent, {
      data: SHOULD_LOG_OUT,
    });

    dialogRef.afterClosed().subscribe((isConfirmed: boolean) => {
      if (isConfirmed) this.deleteAllSessions();
    });
  }

  confirmDeleteAllOtherSessions(): void {
    const SHOULD_LOG_OUT = false;
    const dialogRef = this.#dialog.open(DeleteAllSessionsDialogComponent, {
      data: SHOULD_LOG_OUT,
    });

    dialogRef.afterClosed().subscribe((isConfirmed: boolean) => {
      if (isConfirmed) this.deleteAllOtherSessions();
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
          this.#notifier.send(UserMessage.DELETE_ALL_SESSIONS_SUCCESS);
        },
        error: (e) => {
          console.error(e);
          this.#notifier.send(UserMessage.DELETE_ALL_SESSIONS_FAILED);
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
          this.#notifier.send(UserMessage.DELETE_ALL_OTHER_SESSIONS_SUCCESS);
        },
        error: (e) => {
          console.error(e);
          this.#notifier.send(UserMessage.DELETE_ALL_OTHER_SESSIONS_FAILED);
        },
      });
  }
}
