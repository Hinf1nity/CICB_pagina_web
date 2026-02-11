/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "primary": "#0f3e33",
        "secondary": "#0f3e33",
        "accent": "#3c8d50",
        "background-light": "#f6f8f7",
        "background-dark": "#131f1c",
        "card-dark": "#1a2824", // El fondo oscuro del header/inputs
        "border-light": "#dde4e2",
        "border-dark": "#2a3a36",
        "input-text": "#67837d",
      },
      
      // 4. Tus fuentes (Nota importante abajo*)
      fontFamily: {
        "display": ["PublicSans_400Regular", "System"],
        "body": ["PublicSans_400Regular", "System"],
        "bold": ["PublicSans_700Bold", "System"],
      },

      // 5. Tus bordes
      borderRadius: {
        "DEFAULT": "0.25rem", // NativeWind convierte esto a ~4px
        "lg": "0.5rem",       // ~8px
        "xl": "0.75rem",      // ~12px
        "full": "9999px"
      },
    },
  },
  plugins: [],
}