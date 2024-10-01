import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";

import { APP_NAME } from "_server/constants/app";
import { SessionService } from "../../services/session.service";

@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  #session = inject(SessionService);
  isAuthenticated = this.#session.isAuthenticated;

  heading = computed(() => {
    const user = this.#session.user();

    switch (user) {
      case undefined:
        return "Welcome";
      case null:
        return `Welcome to ${APP_NAME}`;
      default:
        return `Welcome back, ${user.username}!`;
    }
  });
}
