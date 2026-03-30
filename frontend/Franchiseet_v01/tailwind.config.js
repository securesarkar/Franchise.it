/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand colors — premium dark SaaS palette
        gold: {
          900: '#1a1508',
          800: '#352a10',
          700: '#6b5520',
          600: '#a8832f',
          500: '#d4a83a',
          400: '#e8b84b',
          300: '#f0cc7a',
          200: '#f8e0a8',
          100: '#fdf3d8',
        },
        violet: {
          900: '#0e0719',
          800: '#1e1035',
          700: '#3b1f6e',
          600: '#5b30a8',
          500: '#7c3aed',
          400: '#9d6ef5',
          300: '#a78bfa',
          200: '#c4b5fd',
          100: '#ede9fe',
        },
        navy: {
          950: '#05070f',
          900: '#090c18',
          800: '#0d1120',
          700: '#111628',
          600: '#161d34',
          500: '#1e2642',
        },
        wine: {
          900: '#070707',
          800: '#0e0e0e',
          700: '#161616',
          600: '#1d1d1d',
          500: '#242424',
          400: '#505050',
          300: '#7c7c7c',
          200: '#a7a7a7',
          100: '#d3d3d3',
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['DM Sans', 'Poppins', 'sans-serif'],
        script: ['Qwitcher Grypen', 'cursive'],
      },
      fontSize: {
        'display': ['5.5rem', { lineHeight: '1.1' }],
        'h1': ['4.5rem', { lineHeight: '1.15' }],
        'h2': ['3.6rem', { lineHeight: '1.2' }],
        'h3': ['2.5rem', { lineHeight: '1.25' }],
        'h4': ['2rem', { lineHeight: '1.3' }],
        'h5': ['1.5rem', { lineHeight: '1.4' }],
        'h6': ['1.25rem', { lineHeight: '1.5' }],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        glow: "0 0 20px rgba(212, 168, 58, 0.25)",
        'glow-violet': "0 0 20px rgba(124, 58, 237, 0.25)",
        'glow-lg': "0 0 40px rgba(212, 168, 58, 0.35)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "orb-float-1": {
          "0%, 100%": { transform: "translate(-15%, 5%)" },
          "33%": { transform: "translate(5%, -10%)" },
          "66%": { transform: "translate(-5%, 15%)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "slide-in-left": "slide-in-left 0.7s ease-out forwards",
        "slide-in-right": "slide-in-right 0.7s ease-out forwards",
        "scale-in": "scale-in 0.6s ease-out forwards",
        "marquee": "marquee 40s linear infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
