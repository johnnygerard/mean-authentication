import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Title } from "@angular/platform-browser";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-navigation",
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule],
  templateUrl: "./navigation.component.html",
  styleUrl: "./navigation.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  #authService = inject(AuthService);
  #http = inject(HttpClient);
  title = inject(Title).getTitle();
  isAuthenticated = this.#authService.isAuthenticated;

  deleteSession(): void {
    this.#http.delete(`${environment.apiUrl}/session`).subscribe({
      next: () => {
        this.#authService.isAuthenticated.set(false);
      },
      error: (e) => {
        throw e;
      },
    });
  }
}
