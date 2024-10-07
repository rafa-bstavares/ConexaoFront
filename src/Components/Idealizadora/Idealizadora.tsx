import fotoAdriana from "../../assets/images/fotoAdriana.png"
import flor from "../../assets/images/florDourada (1).png"
import estrelas from "../../assets/images/estrelas.svg"

export default function Idealizadora(){
    return (
        <div className="flex flex-col lg:flex-row gap-4 lg:py-[var(--paddingYGeral)] lg:px-[var(--paddingXGeral)] py-[var(--paddingYGeralCel)] px-[var(--paddingXGeralCel)] bg-roxoPrincipal relative">
            <img src={flor} alt="imagem flor" className="absolute w-[10%] h-auto left-2 bottom-2 hidden lg:flex"/>
            <img src={estrelas} alt="imagem estrelas" className="absolute w-[10%] h-auto right-2 top-2"/>
            <div className="lg:w-1/2 w-full flex justify-center lg:items-center">
                <img className="w-4/5 h-auto" src={fotoAdriana} alt="foto idealizadora Adriana" />
            </div> 
            <div className="lg:w-1/2 w-full flex flex-col gap-4 text-white justify-center">
                <div className="lg:text-6xl text-4xl text-douradoPrincipal text-center self-center mb-2">Idealizadora</div>
                <div className="text-lg">
                    Conheça Adriana D'Oxum, a fundadora da Conexão Mística, uma especialista em espiritualidade com vasta experiência e um profundo entendimento dos mistérios do universo. Combinando intuição, sabedoria ancestral e práticas espirituais.
                </div>
                <div className="text-lg">
                Com sua experiência e sensibilidade, Adriana D'Oxum oferece leituras de oráculos profundas e esclarecedoras para ajudá-lo(a) a navegar pelas questões da vida e encontrar o caminho para o autoconhecimento e a realização pessoal. Além disso domina rituais para cura, equilíbrio dos chackras, abertura de caminhos, prosperidade e alinhamento de harmonização ( seja no amor ou ambiente de trabalho).
                </div>
                <div className="text-lg">
                    Vamos guiá-lo em sua jornada de auto descoberta e crescimento espiritual.
                </div>
            </div>
        </div>
    )
}