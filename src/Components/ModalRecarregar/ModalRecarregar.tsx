import { useContext, useEffect} from "react"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import Botao from "../Botao/Botao"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"
import { ContextoPagamento } from "../../Contexts/ContextoPagamento/ContextoPagamento"


type Props= {
    minutosRestantes: number,
    atualizarCronFn: () => void
}


export default function ModalRecarregar({minutosRestantes}: Props){


    const {setAbrirModalRecarregar} = useContext(ContextoAviso)
    const {perfilProAtual} = useContext(ContextoProfissionais)

    const {setAbrirPagamentoDentroConsulta} = useContext(ContextoPagamento)


    useEffect(() => {
        console.log("O valor do minuto da consulta do atendente vale: " + perfilProAtual.valorMin)
    }, [perfilProAtual.valorMin])


    function aoCancelar(){
        setAbrirModalRecarregar(false)
    }

    function prolongarConsulta(){
        setAbrirPagamentoDentroConsulta(true)
        setAbrirModalRecarregar(false)
    }


    

    return(
        <div className="fixed bg-white/90 lg:h-[30%] lg:w-[40%] w-full h-auto top-2 left-2 flex justify-center items-center">
            <div className="flex flex-col gap-2 lg:gap-4 px-4 lg:px-8 py-3 lg:py-6 bg-roxoPrincipal w-[90%] max-h-[90%] overflow-y-scroll rounded-md text-white">
                <div>Faltam {minutosRestantes} minutos para acabar sua consulta, deseja prolongar o tempo da consulta?</div>
                <div>*Será calculado o valor para o tempo adicional e ele será retirado do seu saldo.</div>
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 self-center mt-3 lg:mt-5">
                    <Botao onClickFn={aoCancelar} texto="Não prolongar"/>
                    <Botao onClickFn={prolongarConsulta} texto="Quero prolongar consulta"/>
                </div>
            </div>
        </div>
    )
}