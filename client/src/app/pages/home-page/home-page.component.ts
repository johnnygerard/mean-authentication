import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { SessionService } from "../../services/session.service";
import { Title } from "@angular/platform-browser";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

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
  #title: string = inject(Title).getTitle();
  isAuthenticated = this.#session.isAuthenticated;

  heading = computed(() => {
    const user = this.#session.user();

    switch (user) {
      case undefined:
        return "Welcome";
      case null:
        return `Welcome to ${this.#title}`;
      default:
        return `Welcome back, ${user.username}!`;
    }
  });
}
