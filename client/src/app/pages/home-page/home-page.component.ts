import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AuthStatusPipe } from "../../pipes/auth-status.pipe";
import { AsyncPipe } from "@angular/common";
import { SessionService } from "../../services/session.service";

@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [AsyncPipe, AuthStatusPipe],
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  isAuthenticated = inject(SessionService).isAuthenticated;
}
