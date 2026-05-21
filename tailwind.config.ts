import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Palette — Moon Garden Fantasy
        sage:      { DEFAULT: '#8FBF9F', light: '#B5D4BF', dark: '#6A9B7D' },
        lavender:  { DEFAULT: '#B7A7D9', light: '#D3C9EC', dark: '#8E79C0' },
        peach:     { DEFAULT: '#FFB997', light: '#FFD4BE', dark: '#E0906A' },
        mint:      { DEFAULT: '#B8F2D0', light: '#D6F9E6', dark: '#7DDCAA' },
        cream:     { DEFAULT: '#F7F4ED' },
        frost:     { DEFAULT: '#FCFBF8' },
        fog:       { DEFAULT: '#EAE7E1' },
        midnight:  { DEFAULT: '#1F2937' },
        'deep-slate': { DEFAULT: '#2D3748' },
        'moon-white': { DEFAULT: '#F8FAFC' },

        // Nutrient Colors
        protein:   { DEFAULT: '#F4978E' },
        vitamins:  { DEFAULT: '#C8B6FF' },
        hydration: { DEFAULT: '#7BDFF2' },
        minerals:  { DEFAULT: '#95D5B2' },
        fiber:     { DEFAULT: '#FFCB77' },
        calories:  { DEFAULT: '#FFD166' },

        // Alert Colors
        'coral-alert':  { DEFAULT: '#E07A7A', glow: '#FFE5E5', strong: '#D46A6A' },

        // XP Colors
        'xp-bar':  { DEFAULT: '#BDB2FF' },
        'xp-glow': { DEFAULT: '#A78BFA' },

        // Social Colors
        'like':    { DEFAULT: '#FFAAA5' },
        'friend':  { DEFAULT: '#A0C4FF' },
        'group':   { DEFAULT: '#CDB4DB' },

        // Text
        slate:     { DEFAULT: '#374151' },
        muted:     { DEFAULT: '#6B7280' },
        highlight: { DEFAULT: '#9D79D6' },
      },
      fontFamily: {
        sans:    ['Nunito', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'velune-gradient': 'linear-gradient(135deg, rgba(183,167,217,0.25) 0%, rgba(143,191,159,0.2) 50%, rgba(255,185,151,0.2) 100%)',
        'xp-gradient':     'linear-gradient(90deg, #BDB2FF, #A78BFA)',
        'level-gradient':  'linear-gradient(135deg, #B8F2D0, #FFD166)',
        'garden-gradient': 'linear-gradient(160deg, rgba(184,242,208,0.3) 0%, rgba(183,167,217,0.2) 40%, rgba(123,223,242,0.15) 70%, rgba(255,185,151,0.2) 100%)',
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'pulse-glow':   'pulseGlow 2s ease-in-out infinite',
        'sparkle':      'sparkle 2s ease-in-out infinite',
        'bounce-soft':  'bounceSoft 3s ease-in-out infinite',
        'sway':         'sway 4s ease-in-out infinite',
        'ring-fill':    'ringFill 1.5s cubic-bezier(0.4,0,0.2,1) forwards',
        'slide-up':     'slideUp 0.4s ease-out',
        'fade-in':      'fadeIn 0.3s ease-out',
        'xp-shimmer':   'xpShimmer 2s ease-in-out infinite',
      },
      keyframes: {
        float:       { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseGlow:   { '0%,100%': { boxShadow: '0 0 8px rgba(167,139,250,0.4)' }, '50%': { boxShadow: '0 0 20px rgba(167,139,250,0.8)' } },
        sparkle:     { '0%,100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' }, '50%': { opacity: '0.5', transform: 'scale(1.2) rotate(20deg)' } },
        bounceSoft:  { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        sway:        { '0%,100%': { transform: 'rotate(-5deg)' }, '50%': { transform: 'rotate(5deg)' } },
        ringFill:    { from: { strokeDashoffset: '175.93' }, to: {} },
        slideUp:     { from: { transform: 'translateY(20px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        fadeIn:      { from: { opacity: '0' }, to: { opacity: '1' } },
        xpShimmer:   { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
      },
      boxShadow: {
        'velune':    '0 4px 20px rgba(183,167,217,0.25)',
        'velune-lg': '0 8px 30px rgba(183,167,217,0.35)',
        'glow-sage': '0 0 20px rgba(143,191,159,0.4)',
        'glow-lav':  '0 0 20px rgba(183,167,217,0.4)',
        'glow-coral':'0 0 15px rgba(224,122,122,0.4)',
        'card':      '0 2px 12px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
