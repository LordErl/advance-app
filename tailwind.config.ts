import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Glass Theme Colors
        light: {
          bg: '#FFFFFF',
          bgTranslucent: 'rgba(255, 255, 255, 0.7)',
          cardBg: 'rgba(255, 255, 255, 0.8)',
          gradientStart: '#E3F2FD',
          gradientEnd: '#FCE4EC',
          textPrimary: '#1E1E1E',
          textSecondary: '#555555',
          accentBlue: '#1976D2',
          accentPink: '#D81B60',
        },
        // Dark Futuristic Theme Colors
        dark: {
          bg: '#000000',
          cardBg: 'rgba(30, 30, 30, 0.6)',
          gradientBlue: '#00CFFF',
          gradientPurple: '#8E24AA',
          textPrimary: '#FFFFFF',
          textSecondary: '#AAAAAA',
          accentBlue: '#00CFFF',
          accentPurple: '#8E24AA',
        },
        // Original colors preserved
        blue: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      backgroundImage: {
        // Original gradients
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-top': 'linear-gradient(180deg, var(--tw-gradient-stops))',
        'gradient-card': 'linear-gradient(90deg, #0284c7 0%, #0ea5e9 100%)',
        
        // New theme gradients
        'light-glass': 'linear-gradient(135deg, #E3F2FD 0%, #FCE4EC 100%)',
        'dark-futuristic': 'radial-gradient(circle at center, #00CFFF 0%, #8E24AA 100%)',
        'dark-glow': 'linear-gradient(90deg, #00CFFF 0%, #8E24AA 100%)',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        
        // New theme shadows
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.15)',
        'neon': '0 0 5px rgba(0, 207, 255, 0.5)',
        'neon-hover': '0 0 15px rgba(0, 207, 255, 0.8), 0 0 30px rgba(142, 36, 170, 0.3)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#334155',
            a: {
              color: '#0284c7',
              '&:hover': {
                color: '#0369a1',
              },
            },
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'pulse-glow': 'pulse-glow 2s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(0, 207, 255, 0.5)' 
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(0, 207, 255, 0.8), 0 0 30px rgba(142, 36, 170, 0.3)' 
          },
        },
        'float': {
          '0%, 100%': { 
            transform: 'translateY(0)' 
          },
          '50%': { 
            transform: 'translateY(-10px)' 
          },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          backgroundColor: 'rgba(30, 30, 30, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          border: '1px solid rgba(142, 36, 170, 0.3)',
        },
        '.neon-border': {
          boxShadow: '0 0 5px rgba(0, 207, 255, 0.5)',
          border: '1px solid rgba(0, 207, 255, 0.7)',
        },
        '.neon-border-hover': {
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 0 15px rgba(0, 207, 255, 0.8), 0 0 30px rgba(142, 36, 170, 0.3)',
          },
        },
        '.transition-all-300': {
          transition: 'all 0.3s ease',
        },
      };
      
      addUtilities(newUtilities);
    }),
  ],
};

export default config;