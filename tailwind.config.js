/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './pages/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './features/**/*.{js,jsx,ts,tsx,mdx}',
    './components/ui/**/*.{js,jsx,ts,tsx,mdx}',
    './components/layout/**/*.{js,jsx,ts,tsx,mdx}',
    './components/shared/**/*.{js,jsx,ts,tsx,mdx}',
    './components/homepage/**/*.{js,jsx,ts,tsx,mdx}',
    './features/homepage/**/*.{js,jsx,ts,tsx,mdx}',
    './features/productpage/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E58904',
          50: '#FFE7C7',
          100: '#FFDDB3',
          200: '#FFC98A',
          300: '#FFB562',
          400: '#FFA139',
          500: '#E58904',
          600: '#BD7203',
          700: '#955B02',
          800: '#6D4302',
          900: '#452C01'
        },
        secondary: {
          DEFAULT: '#81AEDB',
          50: '#F5F8FC',
          100: '#E6EEF6',
          200: '#C8DBEE',
          300: '#AAC8E5',
          400: '#8CB5DD',
          500: '#81AEDB',
          600: '#5390CF',
          700: '#3272B7',
          800: '#26578C',
          900: '#1A3B5E'
        },
        accent: {
          DEFAULT: '#F6CE32',
          50: '#FEF7D9',
          100: '#FEF3C5',
          200: '#FDEB9C',
          300: '#FCE374',
          400: '#FBDB4B',
          500: '#F6CE32',
          600: '#E1B60B',
          700: '#AB8A08',
          800: '#755E06',
          900: '#3F3203'
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        },
        cream: {
          50: '#FFFBF5',
          100: '#FFF7EB',
          200: '#FFF0DC',
          300: '#FFE8CD',
          400: '#FFE1BE',
          500: '#FFD9AF',
          600: '#FFB05C',
          700: '#FF8709',
          800: '#B85D00',
          900: '#703800'
        },
        brown: {
          DEFAULT: '#3a3a3e',
          50: '#F5F5F5',
          100: '#E0E0E0',
          200: '#C2C2C2',
          300: '#A3A3A3',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, var(--tw-colors-primary-500), var(--tw-colors-primary-600))',
        'gradient-secondary': 'linear-gradient(to right, var(--tw-colors-secondary-500), var(--tw-colors-secondary-600))',
      },
      fontFamily: {
        'step': ['Step', 'sans'],
      },
    },
  },
  plugins: [],
};
