import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { AuthStatusPipe } from "../../pipes/auth-status.pipe";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [AuthStatusPipe],
  templateUrl: "./home.component.html",
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  auth = inject(AuthService);
}
