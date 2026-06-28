/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Identity: cool ink base, amber signal accent, mint for "live" graph state only.
        ink: "#0B0E13",
        panel: "#12161F",
        panel2: "#0E121A",
        line: "#232A38",
        paper: "#E7EAF0",
        muted: "#8B93A4",
        signal: "#F2B24A",
        live: "#6EE7B7",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      animation: {
        'border-move': 'border-move 4s ease infinite',
        shimmer: "shimmer 3s ease-in-out infinite",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        'gradient': 'gradient 8s linear infinite',
        'edge-dash': 'edge-dash 1s linear infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
      keyframes: {
        'border-move': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        spotlight: {
          "0%": {
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'edge-dash': {
          to: { strokeDashoffset: '-12' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 0.35 },
          '50%': { opacity: 0.7 },
        },
      },
      backgroundImage: {
        'dot-white': 'radial-gradient(circle at center, #E2E8F0 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-pattern': '24px 24px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  important: true,
}
