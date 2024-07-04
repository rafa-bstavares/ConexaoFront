import { useContext, useEffect, useState } from "react"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"
import Botao from "../Botao/Botao"
import ItemModalDetalhes from "../ItemModalDetalhes/ItemModalDetalhes"




export default function ModalDetalhes(){

    const {detalhesProAdm, setAbrirModalDetalhes} = useContext(ContextoProfissionais)



    useEffect(() => {
        console.log(detalhesProAdm)
    }, [])



    return (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center">
            <div className="h-5/6 bg-roxoPrincipal rounded-xl flex flex-col px-12 py-8 gap-4 justify-center items-center overflow-y-scroll ">
        
                {
                    detalhesProAdm.length > 0 ?
                        detalhesProAdm.map(item => (
                            <ItemModalDetalhes nomeProfissional={item.nomeProfissional} nome={item.nomeCliente} valor={(item.precoConsulta * 0.3).toFixed(2)} inicio={item.inicio} final={item.fim} idHistorico={item.idHistorico} />
                        ))
                    :
                        <div className="text-xl text-white text-center">
                            Não foram detectadas atividades desse profissional
                        </div>
                }
                <div className="flex justify-center"> 
                    <Botao texto="voltar" onClickFn={() => setAbrirModalDetalhes(false)} />
                </div>
            </div>
        </div>
    )
}