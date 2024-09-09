import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AccountData } from "_server/types/account-data";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NotificationService } from "../../services/notification.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-account-page",
  standalone: true,
  imports: [DatePipe],
  templateUrl: "./account-page.component.html",
  styleUrl: "./account-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPageComponent implements OnInit {
  #destroyRef = inject(DestroyRef);
  #http = inject(HttpClient);
  #notifier = inject(NotificationService);
  account = signal<AccountData | null>(null);
  createdAt = computed(() => this.account()?.createdAt);
  username = computed(() => this.account()?.username);

  ngOnInit(): void {
    this.#http
      .get<AccountData>("/api/account")
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (value) => this.account.set(value),
        error: (e) => {
          window.console.error(e);
          this.#notifier.send(
            "Failed to load account data. Please try reloading the page.",
          );
        },
      });
  }
}
