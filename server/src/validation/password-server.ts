import {
  getZXCVBNResult,
  passwordIsStrong as _passwordIsStrong,
} from "./password.js";
import zxcvbn from "zxcvbn";

export const passwordIsStrong = (
  password: string,
  ...userInputs: string[]
): boolean => {
  return _passwordIsStrong(getZXCVBNResult(zxcvbn, password, ...userInputs));
};
