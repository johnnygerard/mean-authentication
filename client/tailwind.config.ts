import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import formsPlugin from "@tailwindcss/forms";

export default {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        "valid-password": "linear-gradient(to right, #01D5E2, #114EF7)",
        "invalid-password": "linear-gradient(to right, #E2D901, #F76411 60%)",
      },
    },
  },
  plugins: [formsPlugin],
} satisfies Config;
