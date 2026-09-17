import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 90%+ LUMINOUS WHITE DOMINANT CANVAS, SELECTIVE BLACK ACCENTS & METALLIC GOLD HIGHLIGHTS
        neutral: {
          DEFAULT: '#FFFFFF', // 90%+ Dominant White Canvas
          soft: '#FAFAFA',
          card: '#FFFFFF',
          border: '#E5E7EB',
        },
        black: {
          DEFAULT: '#0A0A0A',
          pure: '#000000',
          rich: '#0F0F0F',
          card: '#141414',
          surface: '#1E1E1E',
          border: '#2A2A2A',
        },
        gold: {
          DEFAULT: '#D4AF37', // Metallic Gold for Unique Fonts & Design Elements
          light: '#F5E6AD',
          dark: '#B8860B',
          hover: '#C5A059',
          50: '#FDFBF0',
          100: '#FAF3D1',
          200: '#F5E6AD',
          300: '#EECD73',
          400: '#E5BD46',
          500: '#D4AF37',
          600: '#B8860B',
          700: '#8C6C1B',
          800: '#634B12',
          900: '#3D2D0B',
        },
        metallic: {
          DEFAULT: '#D4AF37',
          light: '#F5E6AD',
          dark: '#B8860B',
          hover: '#C5A059',
        },
        charcoal: {
          DEFAULT: '#111827',
          dark: '#0A0A0A',
          light: '#4B5563',
        },
        sage: {
          DEFAULT: '#E5E7EB', // Soft light border
          dark: '#0A0A0A',    // Black accent
          light: '#F9FAFB',
          muted: '#FFFFFF',   // Bright Luminous White Background
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Noto Serif Ethiopic', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Noto Sans Ethiopic', 'Inter', 'sans-serif'],
        script: ['var(--font-script)', 'Great Vibes', 'Noto Serif Ethiopic', 'cursive'],
        ethiopicSerif: ['Noto Serif Ethiopic', 'Abyssinica SIL', 'serif'],
        ethiopicSans: ['Noto Sans Ethiopic', 'sans-serif'],
        ethiopicScript: ['Noto Serif Ethiopic', 'Great Vibes', 'serif'],
      },
      boxShadow: {
        gold: '0 10px 30px -10px rgba(212, 175, 55, 0.35)',
        accent: '0 10px 30px -10px rgba(212, 175, 55, 0.35)',
        glass: '0 8px 30px 0 rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
