import { ZXCVBNResult } from "zxcvbn";

/**
 * Extend the `ZXCVBNResult` type with the `password` property.
 *
 * Despite being absent from `ZXCVBNResult`, the `password` property is part of
 * the result object returned by the `zxcvbn` function.
 */
export type ZxcvbnResult = ZXCVBNResult & {
  password: string;
};
