import { inject, Injectable } from "@angular/core";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";
import { Title } from "@angular/platform-browser";

/**
 * Service that updates the title of the page based on the current route.
 * @see https://angular.dev/guide/routing/common-router-tasks#setting-the-page-title
 */
@Injectable({
  providedIn: "root",
})
export class TitleStrategyService extends TitleStrategy {
  #title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);

    if (title !== undefined) {
      this.#title.setTitle(title + " | AuthMEAN");
    }
  }
}
