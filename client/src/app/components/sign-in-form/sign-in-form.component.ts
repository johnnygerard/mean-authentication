import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  model,
  signal,
} from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInput } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PasswordErrorPipe } from "../../pipes/password-error.pipe";
import { UsernameErrorPipe } from "../../pipes/username-error.pipe";
import { finalize } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NotificationService } from "../../services/notification.service";
import { UNAUTHORIZED } from "_server/http-status-code";
import { SessionService } from "../../services/session.service";
import { SessionUser } from "_server/types/session-user";

@Component({
  selector: "app-sign-in-form",
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatInput,
    RouterLink,
    MatIcon,
    PasswordErrorPipe,
    UsernameErrorPipe,
  ],
  templateUrl: "./sign-in-form.component.html",
  styleUrl: "./sign-in-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInFormComponent {
  #destroyRef = inject(DestroyRef);
  #http = inject(HttpClient);
  #notifier = inject(NotificationService);
  #router = inject(Router);
  #session = inject(SessionService);
  password = model("");
  username = model("");
  isLoading = signal(false);
  isPasswordVisible = signal(false);
  visibilityTooltip = computed(
    () => `${this.isPasswordVisible() ? "Hide" : "Show"} password`,
  );

  onSubmit(form: NgForm): void {
    if (form.invalid || this.isLoading()) return;
    this.isLoading.set(true);

    this.#http
      .post<SessionUser>("/api/session", {
        username: this.username(),
        password: this.password(),
      })
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
        error: (e: HttpErrorResponse) => {
          if (e.status === UNAUTHORIZED) {
            this.#notifier.send(
              "Sorry, these credentials are incorrect. Please try again.",
            );
            return;
          }

          window.console.error(e);
          this.#notifier.send("Sign-in failed. Please try again later.");
        },
      });
  }

  togglePasswordVisibility(event: MouseEvent): void {
    this.isPasswordVisible.update((value) => !value);

    // Avoid losing focus due to event bubbling to the password input
    event.stopPropagation();
  }
}
