import type { Config } from "tailwindcss";

const config: Config = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'primary-bg-color': 'var(--primary-bg-color)',
        'secondary-bg-color': 'var(--secondary-bg-color)',
        'primary-accent-color': 'var(--primary-accent-color)',
        'secondary-accent-color': 'var(--secondary-accent-color)',
      },
    },
  },
  plugins: [],
};
export default config;
