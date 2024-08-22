import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "authStatus",
  standalone: true,
})
export class AuthStatusPipe implements PipeTransform {
  transform(isAuthenticated: boolean | null): string {
    if (isAuthenticated === null) return "Loading...";
    return isAuthenticated ? "Authenticated" : "Unauthenticated";
  }
}
