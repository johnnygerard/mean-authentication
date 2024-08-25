import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  signal,
} from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { FORBIDDEN } from "../../http-status-code";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInput } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

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
  ],
  templateUrl: "./sign-in-form.component.html",
  styleUrl: "./sign-in-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInFormComponent {
  #auth = inject(AuthService);
  #http = inject(HttpClient);
  #router = inject(Router);
  password = model("");
  username = model("");
  isPending = false;
  areCredentialsInvalid = signal(false);
  isPasswordVisible = signal(false);
  visibilityTooltip = computed(
    () => `${this.isPasswordVisible() ? "Hide" : "Show"} password`,
  );

  onSubmit(form: NgForm): void {
    if (form.invalid || this.isPending) return;
    this.isPending = true;
    this.areCredentialsInvalid.set(false);

    this.#http
      .post(
        `${environment.apiUrl}/session`,
        {
          username: this.username(),
          password: this.password(),
        },
        {
          withCredentials: true,
        },
      )
      .subscribe({
        next: async () => {
          this.#auth.isAuthenticated.set(true);
          await this.#router.navigate(["/"]);
        },
        error: (e: HttpErrorResponse) => {
          this.isPending = false;

          if (e.status === FORBIDDEN) {
            this.areCredentialsInvalid.set(true);
            return;
          }

          throw e;
        },
      });
  }

  togglePasswordVisibility(event: MouseEvent): void {
    this.isPasswordVisible.update((value) => !value);

    // Avoid losing focus due to event bubbling to the password input
    event.stopPropagation();
  }
}
