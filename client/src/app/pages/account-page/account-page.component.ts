import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatAnchor, MatButton } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { RouterLink } from "@angular/router";
import { AccountData } from "_server/types/account-data";
import { NotificationService } from "../../services/notification.service";
import { UserMessage } from "../../types/user-message.enum";
import { AccountDeletionDialogComponent } from "./account-deletion-dialog/account-deletion-dialog.component";

@Component({
  selector: "app-account-page",
  standalone: true,
  imports: [DatePipe, MatAnchor, MatButton, RouterLink],
  templateUrl: "./account-page.component.html",
  styleUrl: "./account-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPageComponent {
  account = signal<AccountData | null>(null);
  createdAt = computed(() => this.account()?.createdAt);
  username = computed(() => this.account()?.username);
  #dialog = inject(MatDialog);
  #http = inject(HttpClient);
  #notifier = inject(NotificationService);

  constructor() {
    this.#http
      .get<AccountData>("/api/user/account")
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (value) => this.account.set(value),
        error: (e) => {
          console.error(e);
          this.#notifier.send(UserMessage.ACCOUNT_PAGE_LOAD_FAILED);
        },
      });
  }

  openAccountDeletionDialog(): void {
    this.#dialog.open(AccountDeletionDialogComponent);
  }
}
