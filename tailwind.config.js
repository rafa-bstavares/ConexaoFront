/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "bannerImg": "url('./assets/images/bannerConexao.jpg')",
        "fundoProfissionais": "url('./assets/images/fundoProfissionais.jpg')",
        "fundoChat": "url('./assets/images/fundoChat.jpg')",
        "fundoTextoChat": "url('./assets/images/fundoTextoChat.jpg')"
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

