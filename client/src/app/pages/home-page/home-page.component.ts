import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { AuthStatusPipe } from "../../pipes/auth-status.pipe";

@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [AuthStatusPipe],
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  auth = inject(AuthService);
}
