import { useContext, useEffect, useState } from "react"
import Login from "../Login/Login"
import { ContextoLogin } from "../../Contexts/ContextoLogin/ContextoLogin"
import Chat from "../Chat/Chat"
import ModalHistorico from "../ModalHistorico/ModalHistorico"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import { ContextoUsuario } from "../../Contexts/ContextoUsuario/ContextoUsuario"
import { socket } from "../../socket"
import { ContextoAtendimento } from "../../Contexts/ContextoAtendimento/ContextoAtendimento"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"
import ModalAviso from "../ModalAviso/ModalAviso"

export default function AdmChat(){
    const {infoSalas, setInfoSalas} = useContext(ContextoAtendimento)
    const {atendenteLogado, setAtendenteLogado} = useContext(ContextoLogin)
    const {setTemAviso, setTextoAviso, temAviso} = useContext(ContextoAviso)
    const {precoTotalConsulta, tempoConsulta, setPrecoTotalConsulta, setTempoConsulta} = useContext(ContextoUsuario)
    const {perfilProAtual} = useContext(ContextoProfissionais)
    const {setAbrirModalHistorico, abrirModalHistorico} = useContext(ContextoProfissionais)
    const [minutos, setMinutos] = useState<number>(0)
    const [segundos, setSegundos] = useState<number>(60)
    const [toOn, setToOn] =  useState<boolean>(true)
    const [saldoTotalCliente, setSaldoTotalCliente] = useState<number>(0)




    const arrStatus = [
      {status: "online", cor: "bg-green-600"},
      {status: "ocupado", cor: "bg-yellow-500"}
    ] 
  




    useEffect(() => {




        fetch("http://localhost:8080/confereTokenAtendente", {headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}}).then(res => res.json()).then(data => {
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

        


    }, [])



    /*useEffect(() => {
      if(infoSalas){
        if(infoSalas[0]){
          setMinutos(infoSalas[0].tempoConsulta - 1)
        }
      }
    }, [infoSalas])*/


    useEffect(() => {
      if(infoSalas.length > 0 && infoSalas[0].idSala !== 0){



        setTimeout(() => {
          if(minutos !== 0 || segundos !== 0){
            if(segundos == 0){
              setSegundos(59)
              setMinutos(minutos - 1)
            }else{
              setSegundos(segundos - 1)
            }
          }else{

          }

          
        }, 1000)
      }
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA")
    }, [infoSalas, segundos])


    useEffect(() => {
      if(infoSalas){
        if(infoSalas.length > 0){
          setSaldoTotalCliente(infoSalas[0].saldo)
        }else{
          setSaldoTotalCliente(0)
        }
      }
    }, [infoSalas])





    function encerrarAtendimento(){
      fetch("http://localhost:8080/encerrarAtendimento", {
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
      fetch("http://localhost:8080/setarStatus", {
        method: "POST",
        headers: {"Content-Type": "application/json", "authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""},
        body: JSON.stringify({
          status
        })
      }).then(res => res.json()).then(data => {
        if(data[0] == "status atualizado"){
          if(status == "online"){
            setToOn(true)
          }else{
            setToOn(false)
          }
        }else{
          setTemAviso(true)
          setTextoAviso("ocorreu um erro ao atualizar o status")
        }
      })
    }

    return(
        <div className="min-h-screen relative bg-roxoPrincipal text-white">
            {
                atendenteLogado ?
                      <>
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
                            <div onClick={abrirModalHistoricos} className="p-4 bg-gray-500 rounded-md cursor-pointer">
                              meus históricos
                            </div>
                            <button onClick={encerrarAtendimento} className="p-4 rounded-md bg-red-500 ">Encerrar antendimento</button>
                            <div className="flex rounded-md bg-roxoPrincipal items-center justify-center p-4">
                              tempo consulta: {tempoConsulta}
                            </div>
                            <div className="flex rounded-md bg-roxoPrincipal items-center justify-center p-4">
                              valor consulta: {precoTotalConsulta}
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
                          </div>
                        </div>
                        <Chat minutosAtendenteFn={setMinutos} segundosAtendenteFn={setSegundos} atendente={true}/>
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

        </div>
    )
}