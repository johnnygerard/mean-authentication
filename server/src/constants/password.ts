/**
 * Password maximum length
 *
 * This limit protects against denial-of-service attacks.
 * @see https://github.com/dropbox/zxcvbn?tab=readme-ov-file#runtime-latency
 */
export const PASSWORD_MAX_LENGTH = 100;

/**
 * `zxcvbn` minimum strength score
 * @see https://github.com/dropbox/zxcvbn?tab=readme-ov-file#usage
 */
export const ZXCVBN_MIN_SCORE = 3;
