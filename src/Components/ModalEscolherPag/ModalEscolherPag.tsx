
import { useContext } from "react"
import Botao from "../Botao/Botao"
import { ContextoPagamento } from "../../Contexts/ContextoPagamento/ContextoPagamento"
import seta from "../../assets/images/setaSeletor.svg"

export default function ModalEscolherPag(){

    const {setAbrirModalPagamento, setAbrirModalCartao, setAbrirModalEscolher} = useContext(ContextoPagamento)

    return(
        <div className="fixed bg-white/90 h-screen w-full top-0 left-0 flex justify-center items-center">
            <div className="flex flex-col items-center justify-center gap-4 lg:gap-8 px-4 lg:px-8 py-3 lg:py-6 bg-roxoPrincipal rounded-xl w-[90%] lg:w-1/2 text-white">
                <div className="w-full flex gap-2 p-2" onClick={() => setAbrirModalEscolher(false)}>
                    <img src={seta} alt="seta voltar" className="h-6 w-auto rotate-90" />
                    <div>Voltar</div>
                </div>
                <div className="text-white text-xl lg:text-4xl text-center">
                    Escolha a forma de pagamento
                </div>
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-4">
                    <Botao  onClickFn={()  => {
                        setAbrirModalPagamento(true) 
                        setAbrirModalEscolher(false)
                        document.body.classList.add("modal-open")
                    }} texto="Pix"/>
                    <Botao onClickFn={() => {setAbrirModalCartao(true); setAbrirModalEscolher(false)}} texto="Cartão"/>
                </div>
            </div>
        </div>
    )
}