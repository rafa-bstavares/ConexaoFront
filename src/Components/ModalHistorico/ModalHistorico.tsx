import { useContext, useEffect } from "react"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import ItemModalHistorico from "../ItemModalHistorico/ItemModalHistorico"
import Botao from "../Botao/Botao"


export default function ModalHistorico(){

    const {setArrHistoricosAtendente, arrHistoricosAtendente , perfilProAtual, setAbrirModalHistorico} = useContext(ContextoProfissionais)
    const {setTemAviso, setTextoAviso} = useContext(ContextoAviso)

    useEffect(() => {
        fetch("https://api.conexaoastralmistica.com.br/meusHistoricosAtendente", {
            headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}
        }).then(res => res.json()).then(data => {
            if(data[0] == "sucesso"){
                setArrHistoricosAtendente(data[1])
            }else{
                setTemAviso(true)
                setTextoAviso("Não foi possível carregar os históricos, por favor, tente novamente")
            }
        })
    }, [])


    return (
        <div className="bg-roxoPrincipal rounded-xl flex flex-col px-4 lg:px-12 lg:py-8 py-2 gap-4 justify-center items-center overflow-y-scroll">
            {
                arrHistoricosAtendente.map(item => (
                    <ItemModalHistorico historico={item.historico} nomeCliente={item.nomeCliente} data={item.data} nomeAtendente={perfilProAtual.nome}/>
                ))
            }
            <Botao onClickFn={() => setAbrirModalHistorico(false)} texto="Fechar" />
        </div>
    )
}