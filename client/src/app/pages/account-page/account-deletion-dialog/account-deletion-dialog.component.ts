import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { UNAUTHORIZED } from "_server/constants/http-status-code";
import { ApiError } from "_server/types/api-error.enum";
import { PasswordFieldComponent } from "../../../components/password-field/password-field.component";
import { NotificationService } from "../../../services/notification.service";
import { SessionService } from "../../../services/session.service";
import { UserMessage } from "../../../types/user-message.enum";

@Component({
  selector: "app-account-deletion-dialog",
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    PasswordFieldComponent,
    ReactiveFormsModule,
  ],
  templateUrl: "./account-deletion-dialog.component.html",
  styleUrl: "./account-deletion-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDeletionDialogComponent {
  isLoading = signal(false);
  form = inject(FormBuilder).group({
    password: ["", Validators.required],
  });

  #destroyRef = inject(DestroyRef);
  #dialogRef = inject(MatDialogRef<AccountDeletionDialogComponent>);
  #http = inject(HttpClient);
  #notifier = inject(NotificationService);
  #router = inject(Router);
  #session = inject(SessionService);

  deleteAccount(): void {
    if (this.form.invalid || this.isLoading()) return;
    this.isLoading.set(true);

    this.#http
      .delete<void>("/api/user/account", { body: this.form.value })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        complete: async () => {
          this.#dialogRef.close();
          this.#session.clear();
          await this.#router.navigateByUrl("/");
          this.#notifier.send(UserMessage.ACCOUNT_DELETION_SUCCESS);
        },
        error: (response: HttpErrorResponse) => {
          if (
            response.status === UNAUTHORIZED &&
            response.error === ApiError.WRONG_PASSWORD
          ) {
            this.#notifier.send(response.error);
            this.isLoading.set(false);
            return;
          }

          console.error(response);
          this.#notifier.send(UserMessage.ACCOUNT_DELETION_FAILED);
        },
      });
  }
}
