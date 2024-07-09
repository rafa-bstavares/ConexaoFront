
import { useContext } from "react"
import Botao from "../Botao/Botao"
import { ContextoPagamento } from "../../Contexts/ContextoPagamento/ContextoPagamento"

export default function ModalEscolherPag(){

    const {setAbrirModalPagamento, setAbrirModalCartao, setAbrirModalEscolher} = useContext(ContextoPagamento)

    return(
        <div className="fixed bg-white/90 h-screen w-full top-0 left-0 flex justify-center items-center">
            <div className="flex flex-col items-center justify-center gap-8 px-8 py-6 bg-roxoPrincipal rounded-xl w-1/2 text-white">
                <div className="text-white text-4xl text-center">
                    Escolha a forma de pagamento
                </div>
                <div className="flex gap-4">
                    <Botao  onClickFn={()  => {setAbrirModalPagamento(true); setAbrirModalEscolher(false)}} texto="Pix"/>
                    <Botao onClickFn={() => {setAbrirModalCartao(true); setAbrirModalEscolher(false)}} texto="Cartão"/>
                </div>
            </div>
        </div>
    )
}