import { TestBed } from "@angular/core/testing";
import { PasswordHashingService } from "./password-hashing.service";

describe("PasswordHashingService", () => {
  let service: PasswordHashingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordHashingService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should hash passwords correctly", async () => {
    for (const [input, digest] of testData)
      await expectAsync(service.hash(input)).toBeResolvedTo(digest);
  });
});

// Generated with node:crypto.hash
const testData = [
  ["W4XMBjNaleYNzfL", "7b5f029b8aca7062b0f6f443979b216a79bd6c9f"],
  ["ThSqs0zTyH7m_F5", "eab6552fcb7d497e5bf4a7d47e82990beee44e18"],
  ["NwqiAEdS9VfA8rQ", "312698eaaf86d3449de87b8fa359a18919c4b03b"],
  ["83ArQFjYTe9KP7b", "31a4a472f394e0f3937a925bd972d4c327632bf8"],
  ["I1c6IpFjJVC_jNL", "4afd76def345dc47756d2a4f565ce1d91e8f3ffa"],
  ["yi2VHAD429DgbC0", "a230c528c48c37a060ac4a1ad9b04ba0562794ff"],
  ["KX5Gql2whXdhhI3", "08e0fecd8e8b255c8ae0f0b73462f0404914642b"],
  ["Oe2T3YwmwjqoloR", "e05bcdc5d59bb70eaf3b0a51e59d10f7a6010bd4"],
  ["pSNpJSf_zejKdFZ", "db4e09b64583f4bc31029f14ff3cfe6b5c42dc86"],
  ["fJ2XKWHhT8QI16o", "0ffe9d5a0cc549e0f6e0451e965200862b2b329e"],
];
