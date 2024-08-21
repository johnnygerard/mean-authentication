import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { AsyncPipe } from "@angular/common";
import { map } from "rxjs";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: "./home.component.html",
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  authStatus$ = inject(AuthService).isAuthenticated$.pipe(
    map((isAuthenticated: boolean | null): string => {
      if (isAuthenticated === null) return "Loading...";
      return isAuthenticated ? "Authenticated" : "Unauthenticated";
    }),
  );
}
