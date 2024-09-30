export const USERNAME_MIN_LENGTH = 1;
export const USERNAME_MAX_LENGTH = 100;

export const usernameHasValidType = (username: unknown): username is string => {
  return typeof username === "string";
};

export const usernameHasValidLength = (username: string): boolean => {
  return (
    username.length >= USERNAME_MIN_LENGTH &&
    username.length <= USERNAME_MAX_LENGTH
  );
};

/**
 * Check if the username has valid characters.
 *
 * All Unicode codepoints are permitted except those in the "Other" general
 * category.
 * @see https://unicode.org/reports/tr18/#General_Category_Property
 */
export const usernameHasValidCharacters = (username: string): boolean => {
  return /^\P{C}*$/u.test(username);
};

export const usernameHasValidValue = (username: string): boolean => {
  return (
    usernameHasValidLength(username) && usernameHasValidCharacters(username)
  );
};
