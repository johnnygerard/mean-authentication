/**
 * Prepare the request to the Pwned Passwords API.
 * @param digest - Full SHA-1 digest of the password in hexadecimal encoding.
 * @returns Absolute API URL and regex response validator.
 */
export const prepareRequest = (digest: string): [string, RegExp] => {
  const partialDigest = digest.slice(0, 5);
  const digestSuffix = digest.slice(partialDigest.length);
  const validator = new RegExp(`^${digestSuffix}`, "i");
  const url = `https://api.pwnedpasswords.com/range/${partialDigest}`;

  return [url, validator];
};

export const processResponse = (text: string, validator: RegExp): boolean => {
  return text
    .split("\r\n")
    .some((line: string): boolean => validator.test(line));
};
