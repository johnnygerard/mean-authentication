import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { AuthStatusPipe } from "../../pipes/auth-status.pipe";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [AsyncPipe, AuthStatusPipe],
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  isAuthenticated = inject(AuthService).isAuthenticated;
}
