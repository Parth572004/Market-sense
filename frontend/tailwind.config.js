export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: '#ffffff',
        background: '#ffffff',
        primary: '#0f766e',
        'primary-container': '#14b8a6',
        secondary: '#6b7280',
        error: '#dc2626',
        'on-primary': '#f8fafc',
        'on-primary-container': '#f8fafc',
        'on-surface': '#111827',
        'on-surface-variant': '#374151',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f8fafc',
        'surface-container': '#f1f5f9',
        'surface-container-high': '#ffffff',
        'surface-container-highest': '#e5e7eb',
        'surface-variant': '#eef2f7',
        'outline-variant': '#e5e7eb'
      },
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif']
      },
      borderRadius: {
        xl: '0.5rem',
        '2xl': '0.5rem'
      },
      boxShadow: {
        glow: '0 18px 32px rgba(13, 148, 136, 0.18)',
        glass: '0 24px 50px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
};
