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
    },
  },
  plugins: [formsPlugin],
} satisfies Config;
