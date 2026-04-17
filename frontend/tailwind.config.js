export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: '#101419',
        background: '#101419',
        primary: '#47eaed',
        'primary-container': '#00ced1',
        secondary: '#b4cad3',
        error: '#ffb4ab',
        'on-primary': '#003738',
        'on-primary-container': '#003738',
        'on-surface': '#e0e2ea',
        'on-surface-variant': '#bac9c9',
        'surface-container-lowest': '#0a0e13',
        'surface-container-low': '#181c21',
        'surface-container': '#1c2025',
        'surface-container-high': '#262a30',
        'surface-container-highest': '#31353b',
        'surface-variant': '#31353b',
        'outline-variant': '#3b4949'
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
        glow: '0 0 12px rgba(71, 234, 237, 0.4)',
        glass: '0 20px 40px rgba(0, 0, 0, 0.4)'
      }
    }
  },
  plugins: []
};
