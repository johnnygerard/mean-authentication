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
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Router, RouterLink } from "@angular/router";
import { UNAUTHORIZED } from "_server/constants/http-status-code";
import { PASSWORD_MAX_LENGTH } from "_server/constants/password";
import { ApiError } from "_server/types/api-error.enum";
import { ClientSession } from "_server/types/client-session";
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "_server/validation/username";
import { finalize } from "rxjs";
import { UsernameValidatorDirective } from "../../directives/username-validator.directive";
import { UsernameErrorPipe } from "../../pipes/username-error.pipe";
import { NotificationService } from "../../services/notification.service";
import { SessionService } from "../../services/session.service";
import { UserMessage } from "../../types/user-message.enum";
import { PasswordFieldComponent } from "../password-field/password-field.component";

@Component({
  selector: "app-sign-in-form",
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    PasswordFieldComponent,
    ReactiveFormsModule,
    RouterLink,
    UsernameErrorPipe,
    UsernameValidatorDirective,
  ],
  templateUrl: "./sign-in-form.component.html",
  styleUrl: "./sign-in-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInFormComponent {
  readonly USERNAME_MAX_LENGTH = USERNAME_MAX_LENGTH;
  form = inject(FormBuilder).group({
    username: [
      "",
      [
        Validators.required,
        Validators.minLength(USERNAME_MIN_LENGTH),
        Validators.maxLength(USERNAME_MAX_LENGTH),
      ],
    ],
    password: [
      "",
      [Validators.required, Validators.maxLength(PASSWORD_MAX_LENGTH)],
    ],
  });
  isLoading = signal(false);

  #destroyRef = inject(DestroyRef);
  #http = inject(HttpClient);
  #notifier = inject(NotificationService);
  #router = inject(Router);
  #session = inject(SessionService);

  onSubmit(): void {
    if (this.form.invalid || this.isLoading()) return;
    this.isLoading.set(true);

    this.#http
      .post<ClientSession>("/api/session", this.form.value)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe({
        next: async (user) => {
          this.#session.store(user);
          await this.#router.navigateByUrl("/");
        },
        error: (response: HttpErrorResponse) => {
          if (
            response.status === UNAUTHORIZED &&
            response.error === ApiError.BAD_CREDENTIALS
          ) {
            this.#notifier.send(response.error);
            return;
          }

          console.error(response);
          this.#notifier.send(UserMessage.LOGIN_FAILED);
        },
      });
  }
}
