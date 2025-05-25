/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        success: 'var(--success)',
        error: 'var(--error)',
        background: 'var(--background)',
        'background-alt': 'var(--background-alt)',
        foreground: 'var(--foreground)',
        'foreground-alt': 'var(--foreground-alt)',
        border: 'var(--border)',
      },
    },
  },
  plugins: [],
}
