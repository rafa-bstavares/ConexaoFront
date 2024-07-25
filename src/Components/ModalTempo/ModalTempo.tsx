import { useContext, useEffect, useState } from "react"
import imgLogo from "../../assets/images/logoConexao.png"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import Botao from "../Botao/Botao"
import { ContextoUsuario } from "../../Contexts/ContextoUsuario/ContextoUsuario"
import { ContextoLogin } from "../../Contexts/ContextoLogin/ContextoLogin"
import { useNavigate } from "react-router-dom"
import ModalChamando from "../ModalChamando/ModalChamando"
import { socket } from "../../socket"


export default function ModalTempo({nomePro}: {nomePro: string}){

    const {setTemAviso, setTextoAviso, setAbrirModalTempo, valorMinModal} = useContext(ContextoAviso)
    const {usuario, setSalaAtual, idMeuAtendente, setPrecoTotalConsulta, setTempoConsulta, loading, setLoading} = useContext(ContextoUsuario)
    const {setUsuarioLogado} = useContext(ContextoLogin)


    /*const [temErro, setTemErro] = useState<boolean>(false)
    const [textoErro, setTextoErro] = useState<string>("") SE DER RUIM TIRA ESSE COMENTARIO*/
    const [tempoConsultaVar, setTempoConsultaVar] = useState<number>(5)
    const [precoConsultaVar, setPrecoConsultaVar] = useState<number>(tempoConsultaVar * valorMinModal)
    const [respAtendente, setRespAtendente] = useState<string>("")


    const navigate = useNavigate()


    function aoCancelar(){
        setAbrirModalTempo(false)
    }

    useEffect(() => {
        //aqui só usuário tem acesso
        socket.on("respostaAtendente", (data) => {
            setRespAtendente(data.msg)
        })
    }, [socket])


    useEffect(() => {
        if(loading && respAtendente){
            console.log("TA VINDO PRA DENTRO DO IF LOADING")
            setLoading(false)
            if(respAtendente == "Aceitar"){
                console.log("ta crianddo a sala")
                criarSala()
            }else if(respAtendente == "Rejeitado"){
                setTemAviso(true)
                setTextoAviso("O profissional não pode te atendente no momento. Por favor, tente novamente mais tarde.")
            }
        }
    }, [respAtendente])

    useEffect(() => {
        setPrecoConsultaVar(usuario.saldo)
    }, [])


    
    function criarSala(){
        fetch("https://api.conexaoastralmistica.com.br/criarSala", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                idCliente: usuario.id,
                idProfissional: Number(idMeuAtendente),
                precoConsultaVar,
                tempoConsultaVar
            })
        }).then(res => res.json()).then(data => {
            if(data[0] == "sucesso" && data[1].idSala){
                setSalaAtual(data[1].idSala)
                setPrecoTotalConsulta(precoConsultaVar)
                setTempoConsulta(tempoConsultaVar)
                navigate("/Chat")
            }else{
                setTemAviso(true)
                if(data[1] && typeof data[1] == "string"){
                    setTextoAviso(data[1])
                }else{
                    setTextoAviso("Ocorreu um erro não esperado no servidor")
                }
            }
        }).catch(err => {
            setTemAviso(true)
            setTextoAviso("Ocorreu um erro, por favor tente novamnete. Erro: " + err)
        })
    }

    function efetivarPedido(){
        if(usuario.saldo >= precoConsultaVar){
            //criar sala e enviar o preco consultaVar pra setar os cronômetros
                console.log("saldo suficiente")
                fetch("https://api.conexaoastralmistica.com.br/mudarSaldo", {
                    method: "POST" ,
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""
                    },
                    body: JSON.stringify({
                        previsaoSaldo: usuario.saldo - precoConsultaVar
                    })
                }).then(res => res.json()).then(data => {
                    if(data[0] == "erro"){
                        setTemAviso(true)
                        if(data[1]){
                            setTextoAviso(data[1])
                        }else{
                            setTextoAviso("Ocorreu um erro, por favor tente novamente")
                        }
                    }else if(data[0] == "sucesso"){
                                fetch("https://api.conexaoastralmistica.com.br/confereSalas", {
                                    method: "POST",
                                    headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
                                    body: JSON.stringify({
                                        idProfissional: idMeuAtendente
                                    })
                                }).then(res => res.json()).then(data => {
                                if(data[0] == "erro"){
                                    setTemAviso(true)
                                    if(data[1]){
                                        setTextoAviso(data[1])
                                    }else{
                                        setTextoAviso("Ocorreu um erro, por favor tente novamente")
                                    }
                                }else if(data[0] == "sucesso"){
                                    switch(data[1]){
                                        case "criar sala":
                                            console.log("caiu no criar sala")
                                            setUsuarioLogado(true)
                                            //ENVIAR PARA MODAL "CHAMANDO ATENDENTE....."
                                            /*criarSala()*/
                                            socket.emit("chamarAtendente", {idProfissional: idMeuAtendente, nomeCliente: usuario.nome, idCliente: usuario.id})
                                            setLoading(true)
                                            break
                
                                        case "sala existente":
                                            console.log("caiu no sala existente")
                                            setSalaAtual(Number(data[2]))
                                            navigate("/Chat")
                                            break

                                        case "profissional ocupado":
                                            console.log("profissional ocupado")
                                            setTemAviso(true)
                                            setTextoAviso("O profissional se encontra ocupado no momento. Por favor, tente novamente mais tarde.")
                                            break

                                        case "profissional não disponível":
                                            console.log("profissional não disponivel")
                                            setTemAviso(true)
                                            setTextoAviso("O profissional não se encontra disponível. Por favor, tente novamente mais tarde.")
                                            break
                                    }
                                }else{
                                    setTemAviso(true)
                                    setTextoAviso("Ocorreu um erro, por favor tente novamente")
                                }
                            }).catch(() => {
                                setTemAviso(true)
                                setTextoAviso("ocorreu algum erro, por favor, tente novamente")
                            })
                    }else{
                        setTemAviso(true)
                        setTextoAviso("Ocorreu um erro, por favor tente novamente")
                    }
                }).catch(() => {
                    setTemAviso(true)
                    setTextoAviso("ocorreu algum erro, por favor, tente novamente")
                })

        }else{
            //dar opção para ele adicionar saldo ou fazer a consultaVar com o tempo sugerido que ele consegue
            console.log("saldo INNNNsuficiente")
        }
    }


    useEffect(() => {
        setTempoConsultaVar(precoConsultaVar / valorMinModal)
    }, [precoConsultaVar])

    return(
        <div className="fixed bg-white/90 h-screen w-full top-0 left-0 flex justify-center items-center">
            <div className="flex flex-col gap-2 lg:gap-4 px-4 lg:px-8 py-3 lg:py-6 bg-roxoPrincipal w-[90%] lg:w-1/2 rounded-md text-white">
                <div className="w-2/3 lg:w-1/4 self-center">
                    <img src={imgLogo} alt="logo" className="w-full h-auto" />
                </div>
                <div className="self-center text-xl lg:text-3xl font-bold">Deseja abrir um chat com {nomePro}</div>
                {/*
                <div className="flex flex-col gap-2">
                    <label htmlFor="tempoConsulta">Tempo (mínimo 5 minutos):</label>
                    <input className="p-2 flex-1 outline-none text-black rounded-md" type="number" min={5} id="tempoConsulta" value={tempoConsultaVar} onChange={e => setTempoConsultaVar(Number(e.target.value))}/>
                </div>
                <div>
                    valor consulta: {precoConsultaVar}
                </div>
                
                    temErro &&
                    <div className="self-center text-red-600 font-bold text-xl">{textoErro}</div>
                SE DER RUIM TIRA ESSE COMENTARIO*/
                }
                {
                    loading && 
                    <ModalChamando/>
                }
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 self-center mt-3 lg:mt-5">
                    <Botao onClickFn={efetivarPedido} texto="Ir para consulta"/>
                    <Botao onClickFn={aoCancelar} texto="Cancelar"/>
                </div>
            </div>
        </div>
    )
}