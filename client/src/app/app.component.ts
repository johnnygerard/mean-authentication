import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { RouterOutlet } from "@angular/router";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { progressActivity } from "./svg/progress-activity";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  #iconRegistry = inject(MatIconRegistry);
  #sanitizer = inject(DomSanitizer);

  constructor() {
    for (const name of ["error", "info", "visibility", "visibility_off"]) {
      this.#registerIcon(name);
    }

    // Register progress icon as HTML to avoid sending an extra HTTP request
    this.#iconRegistry.addSvgIconLiteral(
      "progress_activity",
      this.#sanitizer.bypassSecurityTrustHtml(progressActivity),
    );
  }

  #registerIcon(name: string): void {
    this.#iconRegistry.addSvgIcon(
      name,
      this.#sanitizer.bypassSecurityTrustResourceUrl(`/icons/${name}.svg`),
    );
  }
}
