import type { ZXCVBNResult } from "zxcvbn";

export type ZXCVBN = (password: string, userInputs?: string[]) => ZXCVBNResult;
