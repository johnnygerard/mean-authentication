import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";

@Component({
  selector: "app-delete-all-sessions-dialog",
  standalone: true,
  imports: [MatDialogModule, MatButton],
  templateUrl: "./delete-all-sessions-dialog.component.html",
  styleUrl: "./delete-all-sessions-dialog.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAllSessionsDialogComponent {
  shouldLogOut = inject<boolean>(MAT_DIALOG_DATA);
}
