import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'background-light': 'var(--background-light)',
        'text-light': 'var(--text-light)',
        'background-dark': 'var(--background-dark)',
        'text-dark': 'var(--text-dark)',

        // Light Royal Theme
        'light-bg': '#FAFBFF', // Soft white with blue tint
        'light-bg-gradient-start': '#F0F4FF',
        'light-bg-gradient-end': '#FFF9F0',
        'light-cardBg': 'rgba(255, 255, 255, 0.85)',
        'light-textPrimary': '#1A237E', // Deep royal blue
        'light-textSecondary': '#3949AB', // Medium royal blue
        'light-primary': '#1565C0', // Royal blue
        'light-accentBlue': '#2196F3', // Bright blue
        'light-accentGold': '#FFB300', // Elegant gold

        // Dark Royal Navy Theme
        'dark-bg': 'linear-gradient(135deg, #0A1628 0%, #1A237E 100%)', // Navy gradient
        'dark-cardBg': 'rgba(25, 39, 126, 0.15)', // Royal blue with transparency
        'dark-textPrimary': '#E8EAF6', // Light blue-white
        'dark-textSecondary': '#C5CAE9', // Soft blue-gray
        'dark-accentBlue': '#40C4FF', // Neon blue
        'dark-accentGold': '#FFD54F', // Soft gold
        'dark-primary': '#1976D2', // Royal blue

        // Fintech Mobile Theme (Light)
        'fintech-light-bg': '#F5F5F5',
        'fintech-light-accent': '#4A90E2',

        // Fintech Mobile Theme (Dark)
        'fintech-dark-bg': '#121212',
        'fintech-dark-card': '#1E1E1E',
        'fintech-dark-accent': '#A2C0FF',
        'fintech-dark-text': '#E0E0E0',
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
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
        'neon-glow-primary': '0 0 3px theme(colors.dark-accent-primary), 0 0 6px theme(colors.dark-accent-primary), 0 0 9px theme(colors.dark-accent-primary)',
        'neon-glow-secondary': '0 0 3px theme(colors.dark-accent-secondary), 0 0 6px theme(colors.dark-accent-secondary), 0 0 9px theme(colors.dark-accent-secondary)',
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
            color: 'hsl(var(--primary))',
            a: {
              color: 'hsl(var(--primary))',
              '&:hover': {
                color: 'hsl(var(--primary-dark))',
              },
            },
          },
        },
        dark: {
          DEFAULT: {
            css: {
              color: 'hsl(var(--primary-dark))',
              a: {
                color: 'hsl(var(--primary-dark))',
                '&:hover': {
                  color: 'hsl(var(--primary))',
                },
              },
            },
          },
        },
        foreground: {
          DEFAULT: {
            css: {
              color: 'hsl(var(--primary-foreground))',
              a: {
                color: 'hsl(var(--primary-foreground))',
                '&:hover': {
                  color: 'hsl(var(--primary-foreground))',
                },
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
        '.text-outline-black': {
          'text-shadow': '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
        },
      };
      
      addUtilities(newUtilities);
    }),
  ],
};

export default config;