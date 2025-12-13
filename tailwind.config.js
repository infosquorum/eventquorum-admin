const config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}', // ← ajoute cette ligne si tu utilises l'app router
  ],
  safelist: [
    'bg-green-50',
    'bg-white',
    'bg-pink-50',
    'bg-blue-50',
    'text-yellow-400',
    'text-green-400',
    'text-red-400',
    'text-blue-400',
    'text-amber-700',
    'text-amber-100',
    'dark:bg-gray-900',
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false, // si tu veux garder CssBaseline de MUI
  },
  plugins: [],
};

export default config;
