import { useContext, useEffect, useState } from "react"
import Login from "../Login/Login"
import { ContextoLogin } from "../../Contexts/ContextoLogin/ContextoLogin"
import Chat from "../Chat/Chat"
import ModalHistorico from "../ModalHistorico/ModalHistorico"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import { ContextoUsuario } from "../../Contexts/ContextoUsuario/ContextoUsuario"
import { ContextoAtendimento } from "../../Contexts/ContextoAtendimento/ContextoAtendimento"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"
import ModalAviso from "../ModalAviso/ModalAviso"
import configImg from "../../assets/images/configImg.svg"
import ModalRedefinirSenha from "../ModalRedefinirSenha/ModalRedefinirSenha"
import { socket } from "../../socket"

export default function AdmChat(){
    const {infoSalas} = useContext(ContextoAtendimento)
    const {atendenteLogado, setAtendenteLogado, abrirModalRedefinir, setAbrirModalRedefinir} = useContext(ContextoLogin)
    const {setTemAviso, setTextoAviso, temAviso} = useContext(ContextoAviso)
    const {precoTotalConsulta, tempoConsulta} = useContext(ContextoUsuario)
    const {setAbrirModalHistorico, abrirModalHistorico, perfilProAtual} = useContext(ContextoProfissionais)
    const [minutos, setMinutos] = useState<number>(0)
    const [segundos, setSegundos] = useState<number>(60)
    const [toOn, setToOn] =  useState<boolean>(true)
    const [saldoTotalCliente, setSaldoTotalCliente] = useState<number>(0)
    const [abrirMenu, setAbrirMenu] = useState<boolean>(false)
    const [ganhosAtual, setGanhosAtual] = useState<number>((perfilProAtual.valorMin)*perfilProAtual.percentualPro/100)






    const arrStatus = [
      {status: "online", cor: "bg-green-600"},
      {status: "ocupado", cor: "bg-yellow-500"}
    ] 
  

    useEffect(() => {
      if(minutos){
        if(Math.floor(saldoTotalCliente / perfilProAtual.valorMin) - minutos >= 0){
          let quantTempoPassado = Math.floor(saldoTotalCliente / perfilProAtual.valorMin) - minutos
          if(quantTempoPassado == 0){
            quantTempoPassado = 1
          }
          setGanhosAtual(((quantTempoPassado)*perfilProAtual.valorMin)*perfilProAtual.percentualPro/100)
        }
      }
    }, [minutos])



    useEffect(() => {


        fetch("https://api.conexaoastralmistica.com.br/confereTokenAtendente", {headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}}).then(res => res.json()).then(data => {
          if(data[0] == "erro"){
            setAtendenteLogado(false)
            localStorage.setItem("authToken", "")
          }else{
            setAtendenteLogado(true)
          }
          console.log(data)
        }).catch(() => {
            setTemAviso(true)
            setTextoAviso("ocorreu algum erro, por favor, tente novamente")
        })

        if(infoSalas.length > 0){
          if(infoSalas[0].minutosPassados){
            setGanhosAtual(((infoSalas[0].minutosPassados)*perfilProAtual.valorMin)*perfilProAtual.percentualPro/100)
          }
        }

    }, [])



    /*useEffect(() => {
      if(infoSalas){
        if(infoSalas[0]){
          setMinutos(infoSalas[0].tempoConsulta - 1)
        }
      }
    }, [infoSalas])*/




    useEffect(() => {
      if(infoSalas){
        if(infoSalas.length > 0){
          setSaldoTotalCliente(infoSalas[0].saldo)
        }else{
          setSaldoTotalCliente(0)
        }
      }
      console.log("infosalaassss")
      console.log(infoSalas)
    }, [infoSalas])





    function encerrarAtendimento(){
      fetch("https://api.conexaoastralmistica.com.br/encerrarAtendimento", {
        method: "POST",
    headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
        body: JSON.stringify({
          idCliente: infoSalas[0].id_cliente,
        })
      }).then(res => res.json()).then(data => {
        console.log(data)
      }).catch((err) => {
        console.log(err)
      })
    }


    function abrirModalHistoricos(){
      setAbrirModalHistorico(true)
    }

    function setarStatus(status: string){
      fetch("https://api.conexaoastralmistica.com.br/setarStatus", {
        method: "POST",
        headers: {"Content-Type": "application/json", "authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""},
        body: JSON.stringify({
          status
        })
      }).then(res => res.json()).then(data => {
        if(data[0] == "status atualizado"){
          if(status == "online"){
            setToOn(true)
            socket.emit("acionaMudStatus", {status: "online", id: perfilProAtual.id})
          }else{
            setToOn(false)
            socket.emit("acionaMudStatus", {status: "ocupado", id: perfilProAtual.id})
          }
        }else{
          setTemAviso(true)
          setTextoAviso("ocorreu um erro ao atualizar o status")
        }
      })
    }

    function sairFn(){
        fetch("https://api.conexaoastralmistica.com.br/SetarOffline", {headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}}).then(res => res.json()).then(data => {
          console.log(data)
          if(data[0] == "sucesso"){
            localStorage.setItem("authToken", "")
            setAtendenteLogado(false)
          }else{
            setTemAviso(true)
            setTextoAviso("Ocorreu um erro ao tentar deixar o usuário offline")
          }
        }).catch(() => {
          setTemAviso(true)
          setTextoAviso("Ocorreu um erro ao tentar deixar o usuário offline")
        })

    }

    useEffect(() => {
      if(minutos){
        fetch("https://api.conexaoastralmistica.com.br/atualizarMinutosPassados", {
          method: "POST",
          headers: {"Content-Type": "application/json", "authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""},
          body: JSON.stringify({
            tempoDeConsulta: tempoConsulta - minutos
          })
        }).then(res => res.json()).then(() => {
          
        })
      }
    }, [minutos])




    return(
        <div className="min-h-screen relative bg-roxoPrincipal text-white">
            {
                atendenteLogado ?
                      <>
                        {/* Menu lateral */}
                        <div className={`fixed top-0 left-0 w-96 h-screen z-50 flex transition-all ${abrirMenu? "translate-x-[0]" : "translate-x-[-90%]"}`}>
                          <div className="w-[90%] h-full bg-white flex flex-col px-4 py-8 gap-4 ">
                            <div onClick={abrirModalHistoricos} className="px-4 py-2 bg-gray-500 rounded-md cursor-pointer">
                                Meus históricos
                            </div>
                            <div onClick={() => {setAbrirModalRedefinir(true)}} className="px-4 py-2 bg-gray-500 rounded-md cursor-pointer">
                                Redefinir senha
                            </div>
                            <div onClick={sairFn} className="px-4 py-2 bg-red-600 rounded-md cursor-pointer self-start">
                                Sair
                            </div>
                          </div>
                          <div className=" mt-36 self-start flex-1 bg-white p-1 rounded-r-md cursor-pointer" onClick={() => setAbrirMenu(!abrirMenu)}>
                            <img className=" w-full h-auto" src={configImg} alt="" />
                          </div>
                        </div>
                        {/* Fim Menu lateral */}
                        <div className="fixed top-0 left-0 w-screen h-screen bg-fundoChat bg-cover"></div>
                        <div className="flex flex-col relative ">
                          <div className="flex justify-center items-center gap-8 pt-4 flex-wrap">
                            <div className="flex flex-col items-center">
                              <div className="px-4 py-2 rounded-t-md bg-white/30 backdrop-blur-md">
                                Meu status:
                              </div>
                              <div className="p-4 rounded-md flex bg-white/30 backdrop-blur-md">
                                {
                                  arrStatus.map((item, index) => (
                                    <div onClick={() => setarStatus(item.status)} className={`text-white px-6 py-2 cursor-pointer ${toOn? (item.status == "online"? item.cor : "bg-gray-400") : (item.status == "online"? "bg-gray-400" : item.cor)} ${index == 0? "rounded-l-md": ""} ${index == (arrStatus.length - 1)? "rounded-r-md" : ""} transition-colors`}>
                                      {item.status}
                                    </div>
                                  ))
                                }
                                {/*<div className={`bg-green-600 text-white px-6 py-2 rounded-l-md cursor-pointer`}>
                                  Online
                                </div>
                                <div className={`bg-gray-400 text-white px-6 py-2 rounded-r-md cursor-pointer`}>
                                  Offline
                                </div>*/}
                              </div>
                            </div>
                            <div className="flex rounded-md bg-roxoPrincipal items-center justify-center p-4">
                                  Valor Total: R${perfilProAtual.totalArrecadado}
                            </div>
                            {
                              infoSalas.length > 0 && 
                              <>
                                <button onClick={encerrarAtendimento} className="p-4 rounded-md bg-red-500 ">
                                  Encerrar antendimento
                                </button>
                                <div className="flex rounded-md bg-roxoPrincipal items-center justify-center p-4">
                                  tempo consulta: {tempoConsulta}
                                </div>
                                <div className="flex rounded-md bg-roxoPrincipal items-center justify-center p-4">
                                  valor consulta: {precoTotalConsulta}
                                </div>
                                <div className="flex rounded-md bg-roxoPrincipal items-center justify-center p-4">
                                  Ganhos consulta: R${ganhosAtual.toFixed(2)}
                                </div>
                                <div className="flex rounded-md bg-roxoPrincipal items-center justify-center p-4 font-bold text-xl">
                                  {minutos}:{segundos}
                                </div>
                                <div className="flex flex-col rounded-md bg-roxoPrincipal items-center justify-center p-4 text-lg">
                                  <div className="text-center">
                                    Tempo Total Cliente:
                                  </div>
                                  <div>  
                                    {Math.floor(saldoTotalCliente / perfilProAtual.valorMin)} minutos
                                  </div>
                                </div>
                              </>
                            }
                          </div>
                        </div>
                        <Chat minutosAtendenteFn={setMinutos} segundosAtendenteFn={setSegundos} atendente={true} segundosAtendente={segundos}/>
                      </>
                    :
                    <Login tipoLogin="atendente"/>
            }
            {
              abrirModalHistorico && 
              <ModalHistorico />
            }
            {
              temAviso && 
              <ModalAviso/>
            }
            {
              abrirModalRedefinir &&
              <ModalRedefinirSenha tipo="Atendente"/>
            }

        </div>
    )
}