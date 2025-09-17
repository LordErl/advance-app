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

        // Enhanced Light Theme - Darker, more sophisticated colors
        'light-bg': '#0F1419', // Deep charcoal
        'light-bg-secondary': '#1A202C', // Darker charcoal
        'light-bg-gradient-start': '#0F1419',
        'light-bg-gradient-end': '#2D3748',
        'light-cardBg': 'rgba(26, 32, 44, 0.95)', // Dark with high opacity
        'light-cardBg-secondary': 'rgba(45, 55, 72, 0.90)',
        'light-textPrimary': '#F7FAFC', // Pure white for maximum contrast
        'light-textSecondary': '#E2E8F0', // Light gray for secondary text
        'light-textTertiary': '#CBD5E0', // Medium gray for tertiary text
        'light-primary': '#00F5FF', // Electric cyan
        'light-accentBlue': '#0FF0FC', // Bright cyan
        'light-accentGold': '#FFD700', // Bright gold
        'light-accentMagenta': '#FF10F0', // Electric magenta
        'light-accentLime': '#32FF32', // Electric lime

        // Enhanced Dark Theme - Lighter, more ethereal colors
        'dark-bg': '#FFFFFF', // Pure white
        'dark-bg-secondary': '#F8F9FA', // Off-white
        'dark-bg-gradient-start': '#FFFFFF',
        'dark-bg-gradient-end': '#F1F3F4',
        'dark-cardBg': 'rgba(255, 255, 255, 0.95)', // White with high opacity
        'dark-cardBg-secondary': 'rgba(248, 249, 250, 0.90)',
        'dark-textPrimary': '#1A202C', // Deep charcoal for maximum contrast
        'dark-textSecondary': '#2D3748', // Dark gray for secondary text
        'dark-textTertiary': '#4A5568', // Medium gray for tertiary text
        'dark-accentBlue': '#0066FF', // Deep blue neon
        'dark-accentGold': '#FF8C00', // Deep orange-gold
        'dark-accentMagenta': '#CC00CC', // Deep magenta
        'dark-accentLime': '#00AA00', // Deep lime
        'dark-primary': '#0052CC', // Deep royal blue

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
        
        // Enhanced 3D gradients
        'light-3d': 'linear-gradient(145deg, #0F1419 0%, #2D3748 50%, #1A202C 100%)',
        'light-3d-card': 'linear-gradient(145deg, #1A202C 0%, #2D3748 50%, #4A5568 100%)',
        'dark-3d': 'linear-gradient(145deg, #FFFFFF 0%, #F1F3F4 50%, #E8E9EA 100%)',
        'dark-3d-card': 'linear-gradient(145deg, #F8F9FA 0%, #E8E9EA 50%, #DEE2E6 100%)',
        
        // Neon gradients
        'neon-cyan': 'linear-gradient(90deg, #00F5FF 0%, #0FF0FC 100%)',
        'neon-magenta': 'linear-gradient(90deg, #FF10F0 0%, #CC00CC 100%)',
        'neon-lime': 'linear-gradient(90deg, #32FF32 0%, #00AA00 100%)',
        'neon-gold': 'linear-gradient(90deg, #FFD700 0%, #FF8C00 100%)',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        
        // 3D shadows
        '3d-light': `
          0 1px 3px rgba(0, 0, 0, 0.4),
          0 4px 8px rgba(0, 0, 0, 0.3),
          0 8px 16px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        '3d-dark': `
          0 1px 3px rgba(0, 0, 0, 0.1),
          0 4px 8px rgba(0, 0, 0, 0.08),
          0 8px 16px rgba(0, 0, 0, 0.06),
          inset 0 1px 0 rgba(0, 0, 0, 0.05)
        `,
        '3d-pressed-light': `
          inset 0 2px 4px rgba(0, 0, 0, 0.4),
          inset 0 1px 2px rgba(0, 0, 0, 0.3)
        `,
        '3d-pressed-dark': `
          inset 0 2px 4px rgba(0, 0, 0, 0.1),
          inset 0 1px 2px rgba(0, 0, 0, 0.08)
        `,
        
        // Enhanced neon glows
        'neon-cyan': '0 0 5px #00F5FF, 0 0 10px #00F5FF, 0 0 20px #00F5FF, 0 0 40px #00F5FF',
        'neon-magenta': '0 0 5px #FF10F0, 0 0 10px #FF10F0, 0 0 20px #FF10F0, 0 0 40px #FF10F0',
        'neon-lime': '0 0 5px #32FF32, 0 0 10px #32FF32, 0 0 20px #32FF32, 0 0 40px #32FF32',
        'neon-gold': '0 0 5px #FFD700, 0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 40px #FFD700',
        
        // Soft neon for dark theme
        'neon-blue-soft': '0 0 5px #0066FF, 0 0 10px #0066FF, 0 0 15px #0066FF',
        'neon-magenta-soft': '0 0 5px #CC00CC, 0 0 10px #CC00CC, 0 0 15px #CC00CC',
        'neon-lime-soft': '0 0 5px #00AA00, 0 0 10px #00AA00, 0 0 15px #00AA00',
        'neon-gold-soft': '0 0 5px #FF8C00, 0 0 10px #FF8C00, 0 0 15px #FF8C00',
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
        'pulse-neon': 'pulse-neon 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 6s ease-in-out infinite',
        'glow-rotate': 'glow-rotate 4s linear infinite',
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
            boxShadow: '0 0 5px rgba(0, 245, 255, 0.5)' 
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(0, 245, 255, 0.8), 0 0 30px rgba(255, 16, 240, 0.3)' 
          },
        },
        'pulse-neon': {
          '0%, 100%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor' 
          },
          '50%': { 
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' 
          },
        },
        'float': {
          '0%, 100%': { 
            transform: 'translateY(0) rotateX(0deg)' 
          },
          '50%': { 
            transform: 'translateY(-10px) rotateX(5deg)' 
          },
        },
        'float-delayed': {
          '0%, 100%': { 
            transform: 'translateY(0) rotateX(0deg)' 
          },
          '50%': { 
            transform: 'translateY(-15px) rotateX(-5deg)' 
          },
        },
        'glow-rotate': {
          '0%': { 
            filter: 'hue-rotate(0deg)' 
          },
          '100%': { 
            filter: 'hue-rotate(360deg)' 
          },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      perspective: {
        '500': '500px',
        '1000': '1000px',
        '1500': '1500px',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities, addBase }) {
      const newUtilities = {
        // Enhanced glass effects
        '.glass-light': {
          backgroundColor: 'rgba(26, 32, 44, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1rem',
          border: '1px solid rgba(0, 245, 255, 0.3)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(0, 245, 255, 0.2)
          `,
        },
        '.glass-dark': {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1rem',
          border: '1px solid rgba(0, 102, 255, 0.3)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(0, 102, 255, 0.2)
          `,
        },
        
        // 3D perspective utilities
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        
        // Enhanced neon borders
        '.neon-border-cyan': {
          boxShadow: '0 0 5px #00F5FF, 0 0 10px #00F5FF, 0 0 15px #00F5FF',
          border: '1px solid #00F5FF',
        },
        '.neon-border-magenta': {
          boxShadow: '0 0 5px #FF10F0, 0 0 10px #FF10F0, 0 0 15px #FF10F0',
          border: '1px solid #FF10F0',
        },
        '.neon-border-lime': {
          boxShadow: '0 0 5px #32FF32, 0 0 10px #32FF32, 0 0 15px #32FF32',
          border: '1px solid #32FF32',
        },
        '.neon-border-gold': {
          boxShadow: '0 0 5px #FFD700, 0 0 10px #FFD700, 0 0 15px #FFD700',
          border: '1px solid #FFD700',
        },
        
        // Soft neon for dark theme
        '.neon-border-blue-soft': {
          boxShadow: '0 0 3px #0066FF, 0 0 6px #0066FF, 0 0 9px #0066FF',
          border: '1px solid #0066FF',
        },
        '.neon-border-magenta-soft': {
          boxShadow: '0 0 3px #CC00CC, 0 0 6px #CC00CC, 0 0 9px #CC00CC',
          border: '1px solid #CC00CC',
        },
        
        // 3D button effects  
        '.btn-3d-light': {
          background: 'linear-gradient(145deg, #2D3748, #1A202C)',
          boxShadow: `
            0 4px 8px rgba(0, 0, 0, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          transition: 'all 0.2s ease',
        },
        '.btn-3d-light:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `
            0 6px 12px rgba(0, 0, 0, 0.4),
            0 3px 6px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15)
          `,
        },
        '.btn-3d-light:active': {
          transform: 'translateY(0)',
          boxShadow: `
            inset 0 2px 4px rgba(0, 0, 0, 0.3),
            inset 0 1px 2px rgba(0, 0, 0, 0.2)
          `,
        },
        
        '.btn-3d-dark': {
          background: 'linear-gradient(145deg, #FFFFFF, #F1F3F4)',
          boxShadow: `
            0 4px 8px rgba(0, 0, 0, 0.08),
            0 2px 4px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(0, 0, 0, 0.05)
          `,
          transition: 'all 0.2s ease',
        },
        '.btn-3d-dark:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `
            0 6px 12px rgba(0, 0, 0, 0.12),
            0 3px 6px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(0, 0, 0, 0.08)
          `,
        },
        '.btn-3d-dark:active': {
          transform: 'translateY(0)',
          boxShadow: `
            inset 0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 2px rgba(0, 0, 0, 0.08)
          `,
        },
        
        // Enhanced text utilities
        '.text-glow-cyan': {
          color: '#00F5FF',
          textShadow: '0 0 5px #00F5FF, 0 0 10px #00F5FF, 0 0 15px #00F5FF',
        },
        '.text-glow-magenta': {
          color: '#FF10F0',
          textShadow: '0 0 5px #FF10F0, 0 0 10px #FF10F0, 0 0 15px #FF10F0',
        },
        '.text-glow-lime': {
          color: '#32FF32',
          textShadow: '0 0 5px #32FF32, 0 0 10px #32FF32, 0 0 15px #32FF32',
        },
        '.text-glow-gold': {
          color: '#FFD700',
          textShadow: '0 0 5px #FFD700, 0 0 10px #FFD700, 0 0 15px #FFD700',
        },
        
        // High contrast text for readability
        '.text-high-contrast-light': {
          color: '#F7FAFC',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.8)',
        },
        '.text-high-contrast-dark': {
          color: '#1A202C',
          textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8), -1px -1px 2px rgba(255, 255, 255, 0.8)',
        },
        
        '.transition-all-300': {
          transition: 'all 0.3s ease',
        },
        '.text-outline-black': {
          'text-shadow': '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
        },
      };
      
      addUtilities(newUtilities);
      
      // Add base styles for improved readability
      addBase({
        'html': {
          fontSize: '16px',
          lineHeight: '1.6',
        },
        'body': {
          fontWeight: '400',
          letterSpacing: '0.025em',
        },
        'h1, h2, h3, h4, h5, h6': {
          fontWeight: '600',
          letterSpacing: '-0.025em',
          lineHeight: '1.2',
        },
        'p, span, div': {
          lineHeight: '1.6',
        }
      });
    }),
  ],
};

export default config;