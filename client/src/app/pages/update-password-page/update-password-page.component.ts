import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { Router } from "@angular/router";
import { BAD_REQUEST, UNAUTHORIZED } from "_server/constants/http-status-code";
import { PASSWORD_MAX_LENGTH } from "_server/constants/password";
import { ApiError } from "_server/types/api-error.enum";
import { finalize } from "rxjs";
import { PasswordFieldComponent } from "../../components/password-field/password-field.component";
import { PasswordStrengthMeterComponent } from "../../components/password-strength-meter/password-strength-meter.component";
import { NotificationService } from "../../services/notification.service";
import { PasswordStrengthService } from "../../services/password-strength.service";
import { UserMessage } from "../../types/user-message.enum";
import { confirmNewPasswordValidator } from "../../validators/confirm-new-password-validator";
import { distinctPasswordValidator } from "../../validators/distinct-password-validator";
import { passwordValidatorFactory } from "../../validators/password-validator-factory";

@Component({
  selector: "app-update-password-page",
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    PasswordFieldComponent,
    PasswordStrengthMeterComponent,
    ReactiveFormsModule,
    MatIcon,
  ],
  templateUrl: "./update-password-page.component.html",
  styleUrl: "./update-password-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePasswordPageComponent {
  isLoading = signal(false);

  #oldPasswordControl = new FormControl("", {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.maxLength(PASSWORD_MAX_LENGTH),
    ],
  });

  form = inject(NonNullableFormBuilder).group({
    oldPassword: this.#oldPasswordControl,
    newPassword: [
      "",
      [
        Validators.required,
        Validators.maxLength(PASSWORD_MAX_LENGTH),
        distinctPasswordValidator,
      ],
      passwordValidatorFactory(
        inject(PasswordStrengthService),
        this.#oldPasswordControl,
      ),
    ],
    confirmNewPassword: [
      "",
      [
        Validators.required,
        Validators.maxLength(PASSWORD_MAX_LENGTH),
        confirmNewPasswordValidator,
      ],
    ],
  });

  #destroyRef = inject(DestroyRef);
  #http = inject(HttpClient);
  #notifier = inject(NotificationService);
  #router = inject(Router);

  constructor() {
    // Re-evaluate the password strength whenever the old password changes
    this.#oldPasswordControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.form.controls.newPassword.updateValueAndValidity();
      });

    // Re-evaluate the password confirmation whenever the new password changes
    this.form.controls.newPassword.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.form.controls.confirmNewPassword.updateValueAndValidity();
      });
  }

  onSubmit(): void {
    if (!this.form.valid || this.isLoading()) return;
    this.isLoading.set(true);
    const body = {
      oldPassword: this.form.value.oldPassword,
      newPassword: this.form.value.newPassword,
    };

    this.#http
      .put<void>("/api/user/password", body)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: async () => {
          this.#notifier.send(UserMessage.PASSWORD_UPDATE_SUCCESS);
          await this.#router.navigateByUrl("/user/account");
        },
        error: (response: HttpErrorResponse) => {
          if (
            response.status === BAD_REQUEST &&
            response.error === ApiError.LEAKED_PASSWORD
          ) {
            this.#notifier.send(response.error);
            return;
          }

          if (
            response.status === UNAUTHORIZED &&
            response.error === ApiError.WRONG_PASSWORD
          ) {
            this.#notifier.send(response.error);
            return;
          }

          console.error(response);
          this.#notifier.send(UserMessage.PASSWORD_UPDATE_FAILED);
        },
      });
  }
}
