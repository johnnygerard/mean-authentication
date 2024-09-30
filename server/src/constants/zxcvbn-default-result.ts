import { ZxcvbnResult } from "../types/zxcvbn-result.js";

export const zxcvbnDefaultResult: ZxcvbnResult = {
  password: "",
  guesses: 1,
  guesses_log10: 0,
  sequence: [],
  calc_time: 0,
  crack_times_seconds: {
    online_throttling_100_per_hour: 36,
    online_no_throttling_10_per_second: 0.1,
    offline_slow_hashing_1e4_per_second: 0.0001,
    offline_fast_hashing_1e10_per_second: 1e-10,
  },
  crack_times_display: {
    online_throttling_100_per_hour: "36 seconds",
    online_no_throttling_10_per_second: "less than a second",
    offline_slow_hashing_1e4_per_second: "less than a second",
    offline_fast_hashing_1e10_per_second: "less than a second",
  },
  score: 0,
  feedback: {
    warning: "",
    suggestions: [
      "Use a few words, avoid common phrases",
      "No need for symbols, digits, or uppercase letters",
    ],
  },
};
