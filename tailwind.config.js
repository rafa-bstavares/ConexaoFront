/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "bannerImg": "url('./src/assets/images/bannerConexao.jpg')",
        "fundoProfissionais": "url('./src/assets/images/fundoProfissionais.jpg')",
        "fundoChat": "url('./src/assets/images/fundoChat.jpg')",
        "fundoTextoChat": "url('./src/assets/images/fundoTextoChat.jpg')"
      },
      colors:{
        "roxoPrincipal": "#391240",
        "roxoSecundario": "#b764b3",
        "douradoPrincipal": "#C39A71"
      }
    },
  },
  plugins: [],
}

