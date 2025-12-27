/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        bg: {
          primary: '#0A0A0B',
          secondary: '#121214',
          tertiary: '#1A1A1D',
          elevated: '#212124',
        },
        // Text colors
        text: {
          primary: '#E8E8E9',
          secondary: '#B4B4B6',
          muted: '#6E6E73',
          inverse: '#0A0A0B',
        },
        // Border colors
        border: {
          DEFAULT: '#2C2C30',
          muted: '#1F1F23',
          focus: '#3D3D42',
        },
        // Accent colors
        accent: {
          purple: '#8B5CF6',
          'purple-hover': '#7C3AED',
          blue: '#3B82F6',
          'blue-hover': '#2563EB',
          green: '#10B981',
          'green-hover': '#059669',
          red: '#EF4444',
          'red-hover': '#DC2626',
          amber: '#F59E0B',
          'amber-hover': '#D97706',
          yellow: '#EAB308',
          'yellow-hover': '#CA8A04',
          orange: '#F97316',
          'orange-hover': '#EA580C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
