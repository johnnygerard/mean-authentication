import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-not-found-page",
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  template: `
    <h1 class="mat-title-large">404 Not Found</h1>
    <p class="mat-body-medium">
      Sorry, the page you are looking for does not exist.
    </p>
    <a mat-button routerLink="/">Back to Home</a>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPageComponent {}
