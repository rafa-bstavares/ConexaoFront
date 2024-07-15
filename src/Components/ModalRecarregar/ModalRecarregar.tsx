import { useContext, useEffect, useState } from "react"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import Botao from "../Botao/Botao"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"


type Props= {
    minutosRestantes: number,
    atualizarCronFn: () => void
}


export default function ModalRecarregar({minutosRestantes, atualizarCronFn}: Props){


    const {setAbrirModalRecarregar} = useContext(ContextoAviso)
    const {perfilProAtual} = useContext(ContextoProfissionais)
    const [temErro, setTemErro] = useState<boolean>(false)
    const [textoErro, setTextoErro] = useState<string>("")
    const [querRecarregar, setQuerRecarregar] = useState<boolean>(false)
    const [tempoAdicionalConsulta, setTempoAdicionalConsulta] = useState<number>(2)
    const [precoAdicionalConsulta, setPrecoAdicionalConsulta] = useState<number>(tempoAdicionalConsulta * perfilProAtual.valorMin)


    useEffect(() => {
        console.log("O valor do minuto da consulta do atendente vale: " + perfilProAtual.valorMin)
    }, [perfilProAtual.valorMin])


    function aoCancelar(){
        setAbrirModalRecarregar(false)
    }

    function prolongarConsulta(){
        setQuerRecarregar(true)
    }


    function confereSaldo(){
        fetch("https://api.conexaoastralmistica.com.br/pegarPrevSaldo", {headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"}}).then(res => res.json()).then(data => {
            if(data[0] == "sucesso"){
                if(data[1]){
                    if(data[1].previsaoSaldo){
                        if(data[1].previsaoSaldo >= precoAdicionalConsulta){
                            //mudar o previsao saldo e continuar consulta (tem saldo)
                            console.log("salda exxtra suficienteeeeeeeeee")
                            fetch("https://api.conexaoastralmistica.com.br/atualizarTempoConsulta", {
                                method: "POST",
                                headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
                                body: JSON.stringify({
                                    precoAdd: precoAdicionalConsulta,
                                    tempoAdd: tempoAdicionalConsulta
                                })
                            }).then(res => res.json()).then(data => {
                                if(data[0] == "sucesso"){
                                    console.log("dados atualizados com sucesso")
                                    atualizarCronFn()
                                    setAbrirModalRecarregar(false)
                                }else{
                                    setTemErro(true)
                                    setTextoErro("ocorreu um erro ao atualizar os dados, por favor, tente novamente")
                                }
                            }).catch(() => {
                                setTemErro(true)
                                setTextoErro("ocorreu um erro ao atualizar os dados, por favor, tente novamente e verifique sua conexão com a internet.")
                            })
                        }else{
                            //mandar pro pagamento ou reduzir o tempo
                            setTemErro(true)
                            setTextoErro(`Você não tem saldo o suficiente para continuar com o tempo que escolheu. Caso queira comprar mais saldo você pode esperar a consulta acabar ou encerrá-la, comprar mais saldo na página principal e entrar no chat novamente (O atendente terá acesso ao histórico da conversa atual, logo, as informações não serão perdidas). Como temos que considerar que você utilizará todo o saldo que reservou para a consulta atual (mesmo que ela ainda não tenha terminado) o seu saldo disponível para gosto no momento é de: R$${data[1].previsaoSaldo}`)
                        }
                    }else{
                        setTemErro(true)
                        setTextoErro("ocorreu um erro ao checar o saldo, por favor, tente novamente")

                    }
                }else{
                    setTemErro(true)
                    setTextoErro("ocorreu um erro ao checar o saldo, por favor, tente novamente")
                }
            }else{
                setTemErro(true)
                setTextoErro("ocorreu um erro ao checar o saldo, por favor, tente novamente")
            }
        })
    }

    useEffect(() => {
        setPrecoAdicionalConsulta(tempoAdicionalConsulta * perfilProAtual.valorMin)
    }, [tempoAdicionalConsulta])

    return(
        <div className="fixed bg-white/90 h-screen w-full top-0 left-0 flex justify-center items-center">
            <div className="flex flex-col gap-2 lg:gap-4 px-4 lg:px-8 py-3 lg:py-6 bg-roxoPrincipal w-[90%] lg:w-1/2 rounded-md text-white">
                <div>Faltam {minutosRestantes} minutos para acabar sua consulta, deseja prolongar o tempo da consulta?</div>
                <div>*Será calculado o valor para o tempo adicional e ele será retirado do seu saldo.</div>
                {
                    temErro &&
                    <div className="self-center text-red-600 font-bold text-xl">{textoErro}</div>
                }
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 self-center mt-3 lg:mt-5">
                    <Botao onClickFn={aoCancelar} texto="Não prolongar"/>
                    <Botao onClickFn={prolongarConsulta} texto="Quero prolongar consulta"/>
                </div>
                {
                    querRecarregar &&
                    <div className="flex flex-col">
                        <div className="self-center text-xl lg:text-3xl font-bold">Deseja uma consulta de quanto tempo?</div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="emailUsuario">Tempo (mínimo 5 minutos):</label>
                            <input className="p-2 flex-1 outline-none text-black rounded-md" type="number" min={5} id="emailUsuario" value={tempoAdicionalConsulta} onChange={e => setTempoAdicionalConsulta(Number(e.target.value))}/>
                        </div>
                        <div>
                            valor consulta: {precoAdicionalConsulta}
                        </div>
                        <div className="flex gap-4 self-center mt-3 lg:mt-5">
                            <Botao onClickFn={confereSaldo} texto="Prolongar Consulta"/>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}