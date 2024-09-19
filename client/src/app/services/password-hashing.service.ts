import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PasswordHashingService {
  #textEncoder = new window.TextEncoder();

  async hash(password: string): Promise<string> {
    const buffer = await window.crypto.subtle.digest(
      "SHA-1",
      this.#textEncoder.encode(password),
    );

    let digest = "";
    for (const byte of new Uint8Array(buffer))
      digest += byte.toString(16).padStart(2, "0");

    return digest;
  }
}
