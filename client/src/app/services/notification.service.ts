import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  #snackBar = inject(MatSnackBar);

  /**
   * Display a notification message
   * @param message - Notification message
   */
  send(message: string): void {
    this.#snackBar.open(message, "Close", {
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }
}
