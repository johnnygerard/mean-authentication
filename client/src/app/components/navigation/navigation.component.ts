import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
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
  #auth = inject(AuthService);
  #http = inject(HttpClient);
  title = inject(Title).getTitle();
  isAuthenticated = this.#auth.isAuthenticated;

  deleteSession(): void {
    this.#http.delete("/api/session").subscribe({
      next: () => {
        this.#auth.setAuthStatus(false);
      },
      error: (e) => {
        throw e;
      },
    });
  }
}
