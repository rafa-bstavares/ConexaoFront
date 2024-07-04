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
    const {setAbrirModalHistorico, abrirModalHistorico} = useContext(ContextoProfissionais)
    const [minutos, setMinutos] = useState<number>(0)
    const [segundos, setSegundos] = useState<number>(60)
  




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
      if(infoSalas.length > 0){



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

    return(
        <div className="min-h-screen relative bg-roxoPrincipal text-white">
            {
                atendenteLogado ?
                      <>
                        <div className="fixed top-0 left-0 w-screen h-screen bg-fundoChat bg-cover"></div>
                        <div className="flex flex-col relative ">
                          <div className="flex justify-center gap-8 pt-4">
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