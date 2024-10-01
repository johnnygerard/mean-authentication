import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AccountData } from "_server/types/account-data";
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: "app-account-page",
  standalone: true,
  imports: [DatePipe],
  templateUrl: "./account-page.component.html",
  styleUrl: "./account-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPageComponent implements OnInit {
  account = signal<AccountData | null>(null);
  createdAt = computed(() => this.account()?.createdAt);
  username = computed(() => this.account()?.username);
  #destroyRef = inject(DestroyRef);
  #http = inject(HttpClient);
  #notifier = inject(NotificationService);

  ngOnInit(): void {
    this.#http
      .get<AccountData>("/api/user/account")
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (value) => this.account.set(value),
        error: (e) => {
          console.error(e);
          this.#notifier.send(
            "Failed to load account data. Please try reloading the page.",
          );
        },
      });
  }
}
