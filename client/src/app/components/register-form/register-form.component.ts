import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { CONFLICT } from "../../http-status-code";

@Component({
  selector: "app-register-form",
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: "./register-form.component.html",
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  #http = inject(HttpClient);
  #router = inject(Router);
  username = model("");
  password = model("");
  isPending = false;

  onSubmit(): void {
    if (this.isPending) return;
    this.isPending = true;

    this.#http
      .post(
        `${environment.apiUrl}/account`,
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
          await this.#router.navigateByUrl("/");
        },
        error: (e: HttpErrorResponse) => {
          this.isPending = false;
          if (e.status === CONFLICT) {
            window.alert("Sorry, this username is not available.");
            return;
          }
          throw e;
        },
      });
  }
}
