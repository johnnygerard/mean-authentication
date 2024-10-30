import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  model,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule, NgForm } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import { UNAUTHORIZED } from "_server/constants/http-status-code";
import { PASSWORD_MAX_LENGTH } from "_server/constants/password";
import { ApiError } from "_server/types/api-error.enum";
import { NotificationService } from "../../../services/notification.service";
import { SessionService } from "../../../services/session.service";

@Component({
  selector: "app-account-deletion-dialog",
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIcon,
    MatInput,
    MatTooltipModule,
  ],
  templateUrl: "./account-deletion-dialog.component.html",
  styleUrl: "./account-deletion-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDeletionDialogComponent {
  readonly PASSWORD_MAX_LENGTH = PASSWORD_MAX_LENGTH;
  isLoading = signal(false);
  isPasswordVisible = signal(false);
  password = model("");
  visibilityTooltip = computed(
    () => `${this.isPasswordVisible() ? "Hide" : "Show"} password`,
  );
  #destroyRef = inject(DestroyRef);
  #dialogRef = inject(MatDialogRef<AccountDeletionDialogComponent>);
  #http = inject(HttpClient);
  #notifier = inject(NotificationService);
  #router = inject(Router);
  #session = inject(SessionService);

  togglePasswordVisibility(event: MouseEvent): void {
    this.isPasswordVisible.update((value) => !value);

    // Avoid losing focus due to event bubbling to the password input
    event.stopPropagation();
  }

  deleteAccount(form: NgForm): void {
    if (form.invalid || this.isLoading()) return;
    this.isLoading.set(true);

    this.#http
      .delete<void>("/api/user/account", {
        body: { password: this.password() },
      })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        complete: async () => {
          this.#dialogRef.close();
          this.#session.clear();
          await this.#router.navigateByUrl("/");
          this.#notifier.send("Your account has been successfully deleted.");
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
          this.#notifier.send(
            "Account deletion failed. Please try again later.",
          );
        },
      });
  }
}
