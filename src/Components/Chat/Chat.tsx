import { useState, useEffect, useContext, ChangeEvent, Dispatch, SetStateAction, useRef } from 'react';
import { socket } from "../../socket"
import { ContextoUsuario } from '../../Contexts/ContextoUsuario/ContextoUsuario';
import { ContextoLogin } from '../../Contexts/ContextoLogin/ContextoLogin';
import OpcaoChat from '../OpcaoChat/OpcaoChat';
import { ContextoAviso } from '../../Contexts/ContextoAviso/ContextoAviso';
import ModalAviso from '../ModalAviso/ModalAviso';
import { useNavigate } from 'react-router-dom';
import Carta from '../Carta/Carta';
import { ContextoAtendimento } from '../../Contexts/ContextoAtendimento/ContextoAtendimento';
import ModalRecarregar from '../ModalRecarregar/ModalRecarregar';
import ModalChamandoAtendente from '../ModalChamandoAtendente/ModalChamandoAtendente';
import { ContextoProfissionais } from '../../Contexts/ContextoProfissionais/ContextoProfissionais';
import imgEnviar from "../../assets/images/enviarChat.svg"
import campainha from "../../assets/sounds/old-style-phone-ringer-37761.mp3"
import { ContextoPagamento } from '../../Contexts/ContextoPagamento/ContextoPagamento';
import PagamentoDentroConsulta from '../PagamentoDentroConsulta/PagamentoDentroConsulta';

type Props = {
  atendente: boolean,
  minutosAtendenteFn?: Dispatch<SetStateAction<number>>,
  segundosAtendenteFn?: Dispatch<SetStateAction<number>>,
  segundosAtendente?: number,
  ganhosAtualFn?:  Dispatch<SetStateAction<number>>
}

type TipoInfoSala = {
  idSala: number,
  id_cliente: number,
  id_profissional: number,
  nome: string,
  tempoConsulta: number,
  precoConsulta: number,
  saldo: number,
  dataNas: string,
  finalConsulta: Date,
  minutosPassados: number
}

type objBaralho = {
  nome: string,
  urls: string[]
}

export default function Chat({atendente, minutosAtendenteFn, segundosAtendenteFn, segundosAtendente, ganhosAtualFn}: Props){

  const {infoSalas, setInfoSalas, abrirModalChamandoAtendente, setAbrirModalChamandoAtendente} = useContext(ContextoAtendimento)
  const {abrirPagamentoDentroConsulta} = useContext(ContextoPagamento)


  /*const [infoSalas, setInfoSalas] = useState<TipoInfoSala[]>()*/
  const [msg, setMsg] = useState<string>("") //mensagem enviada para o servidor
  const [messages, setMessages] = useState<string[]>([])
  const [ultimoClicado, setUltimoClicado] = useState<number>(0)
  const [salaAtualAdm, setSalaAtualAdm] = useState<number>(0)
  const [idAtendenteAtual, setIdAtendenteAtual] = useState<number>(0)
  const [baralhos, setBaralhos] = useState<objBaralho[]>([{nome: "", urls: [""]}])
  const [baralhosUrls, setBaralhosUrls] = useState<string[]>([""])
  const [opSelecionada, setOpSelecionada] = useState<number>(0)
  const [cartasSelecionadas, setCartasSelecionadas] = useState<string[]>([])
  const [historico, setHistorico] = useState<string[]>([""])
  const {salaAtual, setSalaAtual, precoTotalConsulta, tempoConsulta, setPrecoTotalConsulta, setTempoConsulta, usuario, setUsuario} = useContext(ContextoUsuario)
  const {setUsuarioLogado} = useContext(ContextoLogin)
  const {setTemAviso, setTextoAviso, temAviso, abrirModalRecarregar, setAbrirModalRecarregar} = useContext(ContextoAviso)
  const [minutos, setMinutos] = useState<number>(0)
  const [segundos, setSegundos] = useState<number>(60)
  const [minutosRestantes, setMinutosRestantes] = useState<number>(0)
  const [usuarioChamando, setUsuarioChamando] = useState<string>("")
  const [idUsuarioChamando, setIdUsuarioChamando] = useState<number>(0)
  const [finalConsulta, setFinalConsulta] = useState<Date>()
  const [dataNascimento, setDataNascimento] = useState<string>("")

  const audio = useRef<HTMLAudioElement>(null)
  const divScroll = useRef<HTMLDivElement>(null)


  const {setPerfilProAtual, perfilProAtual} = useContext(ContextoProfissionais)


  const navigate = useNavigate()

  function enviarFn(){
    socket.emit("clientMsg", {msg: atendente? "|P|" + msg : "|U|" + msg, room: atendente? (infoSalas? salaAtualAdm.toString() : "") : salaAtual.toString()})
    setMsg("")
    console.log("você está na sala: " + salaAtualAdm) 
  }


    socket.on("connect", () => {

    })

    /*async function pegarInfoCliente(id: string): Promise<{ nome: string; email: string; }> {
      fetch("https://api.conexaoastralmistica.com.br/pegarInfoCliente", {
        method: "POST",
        headers: {"Content-Type": "application/json", "authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""},
        body: JSON.stringify({
          idCliente: id
        })
      }).then(res => res.json()).then(data => {
        console.log(data)
        if(data[0] == "erro" || data[0] == "sucesso"){
          if(data[1]){
            return data[1]
          }else{
            return {nome: "Usuário", email: ""}
          }
        }else{
          return {nome: "Usuário", email: ""}
        }
      }).catch(() => {
        return {nome: "Usuário", email: ""}
      })
      return {nome: "Usuário", email: ""}
    }
*/

    function pegarInfoUsuario(){
      fetch("https://api.conexaoastralmistica.com.br/pegarInfoUsuario", {
          headers: { "authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}
      }).then(res => res.json()).then(data => {
          if(data[0] && data[0] == "erro"){
              setTemAviso(true)
              if(data[1]){
                  setTextoAviso(data[1])
              }else{
                  setTextoAviso("Ocorreu um erro inesperado. Por favor, tente novamente")
              }
          }else if(data[0] && data[0] == "sucesso"){
              if(data[1].id && data[1].email && data[1].nome && data[1].saldo >= 0){
                  setUsuario(data[1])
              }else{
                  setTemAviso(true)
                  setTextoAviso("Ocorreu um erro inesperado. Por favor, tente novamente")
              }
          }else{
              setTemAviso(true)
              setTextoAviso("Ocorreu um erro inesperado. Por favor, tente novamente")
          }
      })
  }

  useEffect(() => {
    if(historico.length > 0){
      if(divScroll.current?.scrollTop){
        divScroll.current.scrollTop = divScroll.current.scrollHeight
      }
    }
  }, [historico])




    useEffect(() => {
      socket.on("serverMsg", (data) => {
          console.log("menssagem recebida: " + data.msg)
          const pastMsg = [...messages]
          pastMsg.push(data.msg)
          setMessages(pastMsg)
      })

      socket.on("atualizarAdm", () => {
        if(atendente){
          window.location.reload()
        }
      })

      socket.on("novaSala", async (data) => {
        const {newRoom, createdById, idProfissional} = data
        if(atendente && idProfissional == idAtendenteAtual){
          console.log(createdById)
          fetch("https://api.conexaoastralmistica.com.br/pegarInfoCliente", {
            method: "POST",
            headers: {"Content-Type": "application/json", "authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""},
            body: JSON.stringify({
              idCliente: createdById.toString()
            })
          }).then(res => res.json()).then(data => {
            let objCliente = {nome: "Usuário", email: "", tempoConsulta: 0, precoConsulta: 0, saldo: 0, dataNas: "", finalConsulta: new Date(), minutosPassados: 0}
            console.log(data)
            if(data[0] == "erro" || data[0] == "sucesso"){
              if(data[1]){
                objCliente =  data[1]
              }
            }
            if(infoSalas){
              const infoSalasClone: TipoInfoSala[] = [...infoSalas]
              infoSalasClone.push({idSala: Number(newRoom), id_cliente: Number(createdById), id_profissional: idAtendenteAtual, nome: objCliente.nome, precoConsulta: objCliente.precoConsulta, tempoConsulta: objCliente.tempoConsulta, saldo: objCliente.saldo, dataNas: objCliente.dataNas, finalConsulta: objCliente.finalConsulta, minutosPassados: objCliente.minutosPassados})
              setInfoSalas(infoSalasClone)
            }
          }).catch(() => {
            return {nome: "Usuário", email: ""}
          })
  
        }
        
      })


      if(atendente){
        infoSalas?.forEach(item => {
          console.log("entrei na sala: " + item.idSala.toString())
          socket.emit("adicionarNaSala", {room: item.idSala.toString()})
          console.log("atendente entrou na sala: " + item.idSala.toString())
        })
      }else{
        console.log("sala atual: " + salaAtual)
        socket.emit("adicionarNaSala", {room: salaAtual.toString()})
      }



      socket.on("novaMensagem", (data) => {
        console.log(data)
        setHistorico(data.novoHistorico.split("||n||"))
      })

      socket.on("salaEncerrada", (data) => {
        if(atendente && infoSalas){
         /* let infoSalasClone = [...infoSalas]
          infoSalasClone = infoSalasClone.filter(item => item.idSala !== Number(data.idSala))
          setInfoSalas(infoSalasClone)*/
          fetch("https://api.conexaoastralmistica.com.br/buscarSalasAtendente", {
            headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}
          }).then(res => res.json()).then(data => {
            console.log(data)
            if(data[0] !== "erro"){
              console.log("BUSCAR ASALAS DPS DE ENCERRARRRRR")
              console.log(data)
              setInfoSalas(data[1])
              setHistorico([""])
            }
          }).catch((err) => {
            console.log("ocorreu o seguinte erro: " + err)
          })

          setTemAviso(true)
          if(data.msg == "cliente"){
            setTextoAviso("A sala foi encerrada pelo cliente")
          }else{
            setTextoAviso("A sala foi encerrada")
          }

          
          
        }else{
          if(!atendente){
            navigate("/")
          }
        }
      })


      socket.on("erroMsg", (data) => {
        setTemAviso(true)
        setTextoAviso(data.erroMsg)
      })


      socket.on("clienteChamando", (data) => {
        console.log("recebi o socket")
        if(atendente){
          console.log("recebi o socket e sou atendente")


          fetch("https://api.conexaoastralmistica.com.br/infoAtendente", {
            headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}
          }).then(res => res.json()).then(dataFetch => {
            if(dataFetch[0] == "erro"){
              setTemAviso(true)
              setTextoAviso("Ocorreu um erro na função de buscar o id do atendente atual, por favor, tente novamente. Caso o erro persista contate o suporte")
            }else if(dataFetch[0] == "sucesso" && dataFetch[1].idAtendente && dataFetch[1].baralhos){

              console.log(data.idProfissional)
              console.log(dataFetch[1].idAtendente)
              if(data.idProfissional == dataFetch[1].idAtendente){
                //abrir modal tocando
                setUsuarioChamando(data.nomeCliente)
                setIdUsuarioChamando(data.idCliente)
                setAbrirModalChamandoAtendente(true)
              }
  
              setIdAtendenteAtual(Number(dataFetch[1].idAtendente))
            }else{
              setTemAviso(true)
              setTextoAviso("Ocorreu um erro na função de buscar o id do atendente atual, por favor, tente novamente. Caso o erro persista contate o suporte")
            }
          })


        }
      })

      if(atendente){
        socket.on("respostaAtendente", (data) => {
          if(atendente){

            fetch("https://api.conexaoastralmistica.com.br/infoAtendente", {
              headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}
            }).then(res => res.json()).then(dataFetch => {
              if(dataFetch[0] == "erro"){
                setTemAviso(true)
                setTextoAviso("Ocorreu um erro na função de buscar o id do atendente atual, por favor, tente novamente. Caso o erro persista contate o suporte")
              }else if(dataFetch[0] == "sucesso" && dataFetch[1].idAtendente && dataFetch[1].baralhos){

                console.log(data.idProfissional)
                console.log(dataFetch[1].idAtendente)
                if(data.idProfissional == dataFetch[1].idAtendente){
                  setAbrirModalChamandoAtendente(false)
                  window.location.reload()
                }
    
                setIdAtendenteAtual(Number(dataFetch[1].idAtendente))
              }else{
                setTemAviso(true)
                setTextoAviso("Ocorreu um erro na função de buscar o id do atendente atual, por favor, tente novamente. Caso o erro persista contate o suporte")
              }
            })

          }

        })
      }


    }, [socket, messages, atendente, infoSalas, salaAtual, tempoConsulta])



    useEffect(() => { 


      if(atendente){

        fetch("https://api.conexaoastralmistica.com.br/buscarSalasAtendente", {
          headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}
        }).then(res => res.json()).then(data => {
          console.log(data)
          if(data[0] !== "erro"){
            console.log("tempo consulta vindo do banco de dadso " + data[1].tempoConsulta)
            console.log(data[1])
            setInfoSalas(data[1])
          }
        })
        fetch("https://api.conexaoastralmistica.com.br/infoAtendente", {
          headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}
        }).then(res => res.json()).then(data => {
          if(data[0] == "erro"){
            setTemAviso(true)
            setTextoAviso("Ocorreu um erro na função de buscar o id do atendente atual, por favor, tente novamente. Caso o erro persista contate o suporte")
          }else if(data[0] == "sucesso" && data[1].idAtendente && data[1].baralhos){

            setIdAtendenteAtual(Number(data[1].idAtendente))
            setBaralhos(data[1].baralhos)
          }else{
            setTemAviso(true)
            setTextoAviso("Ocorreu um erro na função de buscar o id do atendente atual, por favor, tente novamente. Caso o erro persista contate o suporte")
          }
        })

        fetch("https://api.conexaoastralmistica.com.br/minhasInfosAtendente", {
          headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}
        }).then(res => res.json()).then(data => {
          if(data[0] == "sucesso"){
            setPerfilProAtual(data[1])
            console.log(data[1])
          }else{
            setTemAviso(true)
            setTextoAviso("ocorreu um erro ao pegar as informações do atendente")
          }
        }).catch(() => {
          setTemAviso(true)
          setTextoAviso("ocorreu um erro ao pegar as informações do atendente. Por favor, cheque sua internet.")
        })


      }else{

        fetch("https://api.conexaoastralmistica.com.br/confereTokenUsuario", {
          headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}
        }).then(res => res.json()).then(data => {
          if(data[0] && data[0] == "erro"){
            setUsuarioLogado(false)
            localStorage.setItem("authToken", "")
          }else if(data[0] && data[0] == "sucesso"){
              setUsuarioLogado(true)
              pegarInfoUsuario()
          }else{
            setUsuarioLogado(false)
            localStorage.setItem("authToken", "") 
          }
        })


        socket.emit("tempoPreco", {preco: precoTotalConsulta, tempo: tempoConsulta, room: salaAtual.toString()})
        fetch("https://api.conexaoastralmistica.com.br/confereTokenUsuario", {headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}}).then(res => res.json()).then(data => {
          if(data[0] == "erro"){
            setUsuarioLogado(false)
            localStorage.setItem("authToken", "")
            navigate("/")
          }else{
            setUsuarioLogado(true)
          }
          console.log(data)
        }).catch(() => {
          navigate("/")
            setTemAviso(true)
            setTextoAviso("ocorreu algum erro, por favor, tente novamente")
        })



          fetch("https://api.conexaoastralmistica.com.br/buscarSalaUsuario", {headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}}).then(res => res.json()).then(data => {
            console.log("RESPOSTA BUSCANDO SALA USUARIOO0OOOO")
            console.log(data)
            if(data[0] == "erro"){
              setTemAviso(true)/*  */
              if(data[1]){
                setTextoAviso(data[1])
              }else{
                setTextoAviso("Ocorreu algum erro. Por favor, tente novamente")
              }
            }else{
              if(data[0] == "sucesso"){
                if(data[1] && data[1].idSala){
                  socket.emit("adicionarNaSala", {room: data[1].idSala})
                  setSalaAtual(Number(data[1].idSala))
                  console.log("ta chegando na parte de setarrrr")
                  console.log("TEMPO CONSULTA: " + data[1].tempoConsulta)
                  setTempoConsulta(data[1].tempoConsulta)
                  setPrecoTotalConsulta(data[1].precoConsulta)
                  setFinalConsulta(data[1].finalConsulta)
                  /*setMinutos(data[1].tempoConsulta)*///AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
                  /*setSegundos(0)*/
                }else{
                  setTemAviso(true)
                  setTextoAviso("Ocorreu um erro não esperado. Por favor, tente novamente")
                }
              }else{
                setTemAviso(true)
                setTextoAviso("Ocorreu um erro não esperado. Por favor, tente novamente")
              }
            }
            console.log(data)
          })
        


        fetch("https://api.conexaoastralmistica.com.br/infoMeuAtendente", {headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}}).then(res => res.json()).then(data => {
          if(data[0] == "sucesso"){
            setPerfilProAtual(data[1])
            console.log(data[1])
          }else{
            setTemAviso(true)
            setTextoAviso("ocorreu um erro ao pegar os dados do profissional. Por favor, tente recarregar a página ou fazer login novamente")
          }
        }).catch(() => {
          setTemAviso(true)
          setTextoAviso("ocorreu um erro ao pegar os dados do profissional. Por favor, tente recarregar a página ou fazer login novamente")
        })

        
      }

      console.log("a sala ao carregar é: " + salaAtual)


      iniciarCronometro()

    }, [])

    useEffect(() => {
      console.log("Meu id como atendente é: " + idAtendenteAtual)
    }, [idAtendenteAtual])



    useEffect(() => {
      setBaralhosUrls(baralhos[0].urls)
    }, [baralhos])

    useEffect(() => {
      setBaralhosUrls(baralhos[opSelecionada].urls)
    }, [opSelecionada])




    useEffect(() => {
      if(infoSalas){
        if(infoSalas.length > 0){
          setSalaAtualAdm(infoSalas[0].idSala)
          setPrecoTotalConsulta(infoSalas[0].precoConsulta)
          setTempoConsulta(infoSalas[0].tempoConsulta)
          setDataNascimento(infoSalas[0].dataNas)
          if(ganhosAtualFn){
            ganhosAtualFn((infoSalas[0].minutosPassados)*(perfilProAtual.valorMin)*perfilProAtual.percentualPro/100)
          }
          /*setMinutos(infoSalas[0].precoConsulta)*/
        }else{
          setPrecoTotalConsulta(0)
          setTempoConsulta(0)
          setDataNascimento("")
        }
      }
    }, [infoSalas])

    useEffect(() => {
      if(atendente){
        socket.emit("clientMsg", {msg: "", room: salaAtualAdm.toString()})
      }else{
        socket.emit("clientMsg", {msg: "", room: salaAtual.toString()})
      }
    }, [salaAtualAdm, salaAtual])


    useEffect(() => {
      console.log("MINUTOS: " + minutos)
    }, [minutos])

    useEffect(() => {
      if(tempoConsulta){



        setTimeout(() => {
          /*if(minutos !== 0 || segundos !== 0){
            if(segundos == 0){
              setSegundos(59)
              setMinutos(minutos - 1)
            }else{
              setSegundos(segundos - 1)
            }
          }else{

          }*/
         atualizarCronometro()

          
        }, 1000)

        if(minutos == 2 && segundos == 0){
          setMinutosRestantes(2)
          setAbrirModalRecarregar(true)
        }

        if(minutos == 1 && segundos == 0){
          setMinutosRestantes(1)
          setAbrirModalRecarregar(true)
        }

        if(segundos == 0 && minutos == 0){
          encerrarAtendimentoCliente()
        }
      }
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA")
    }, [segundos, segundosAtendente])



/*
    function setarOffline(){
      fetch("https://api.conexaoastralmistica.com.br/SetarOffline", {headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}}).then(res => res.json()).then(data => {
        console.log(data)
        if(data[0] == "sucesso"){
          return "sucesso"
        }else{
          return "erro"
        }
      }).catch(() => {
        return "erro"
      })
    }

    function sairFn(){

      if(atendente){
        fetch("https://api.conexaoastralmistica.com.br/SetarOffline", {headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}}).then(res => res.json()).then(data => {
          console.log(data)
          if(data[0] == "sucesso"){
            localStorage.setItem("authToken", "")
            if(atendente){
              setUsuarioLogado(false)
            }
          }else{
            setTemAviso(true)
            setTextoAviso("Ocorreu um erro ao tentar deixar o usuário offline")
          }
        }).catch(() => {
          setTemAviso(true)
          setTextoAviso("Ocorreu um erro ao tentar deixar o usuário offline")
        })
      }else{
        localStorage.setItem("authToken", "")
        if(atendente){
          setUsuarioLogado(false)
        }
      }
    }

*/

    function onChangeSelect(e: ChangeEvent<HTMLSelectElement>){
      setOpSelecionada(e.target.selectedIndex)
      setCartasSelecionadas([])
    }


    function enviarImagens(){
      let mensagemFotos = ""

      cartasSelecionadas.forEach(item => {
        mensagemFotos += "[img]" + item
      })

      socket.emit("clientMsg", {msg: mensagemFotos, room: infoSalas? salaAtualAdm.toString() : ""})

      setCartasSelecionadas([])
    }



    useEffect(() => {
      console.log("atualizarcron pra djcknsavjkadnsvjklnaslvnasdjklvn")
      atualizarCronometro()
    }, [infoSalas, finalConsulta])


    useEffect(() => {

    }, [])


    function atualizarCronometro(){
      console.log("acionou atualizar cronometro")

      if(atendente){
        console.log(infoSalas.length)
        if(infoSalas.length > 0){
          console.log("finalConsulta atendente")
          console.log(infoSalas[0].finalConsulta)
          if(infoSalas[0].finalConsulta && minutosAtendenteFn && segundosAtendenteFn){
            const time = new Date()
            console.log(new Date(infoSalas[0].finalConsulta).getTime())
            console.log("Faltam: " + Math.abs(new Date(infoSalas[0].finalConsulta).getTime() - time.getTime()))
            const tempoBruto = Math.abs(new Date(infoSalas[0].finalConsulta).getTime() - time.getTime())/60000
            const arrTempos = tempoBruto.toFixed(2).toString().split(".")
            console.log(arrTempos)
            const minutosRestantes = Number(arrTempos[0])
            const segundosRestantes = Number(arrTempos[1])*60/100
            minutosAtendenteFn(minutosRestantes)
            if(segundosAtendente == Number(segundosRestantes.toFixed(0))){
              segundosAtendenteFn(Number(segundosRestantes.toFixed(0)) - 1)
            }else{
              segundosAtendenteFn(Number(segundosRestantes.toFixed(0)))
            }
            console.log(Number(segundosRestantes.toFixed(0)))
          }
        }
      }else{
        console.log("final consulta do if")
        console.log(finalConsulta)
          if(finalConsulta){
            const time = new Date()
            console.log(time)
            console.log(time.getTime())
            console.log(finalConsulta)
            console.log("PROBLEMA É NO GFINAL CONSULTA")
            console.log(finalConsulta)
            const finalConsultaDate = new Date(finalConsulta)
            console.log("Faltam: " + Math.abs(finalConsultaDate.getTime() - time.getTime()))
            const tempoBruto = Math.abs(finalConsultaDate.getTime() - time.getTime())/60000
            const arrTempos = tempoBruto.toFixed(2).toString().split(".")

            const minutosRestantes = Number(arrTempos[0])
            const segundosRestantes = Number(arrTempos[1])*60/100
            setMinutos(minutosRestantes)

            if(segundos == Number(segundosRestantes.toFixed(0))){
              setSegundos(Number(segundosRestantes.toFixed(0)) - 1)
            }else{
              setSegundos(Number(segundosRestantes.toFixed(0)))
            }
          }
      }
    }


    function iniciarCronometro(){
      fetch("https://api.conexaoastralmistica.com.br/quantoFalta" + (atendente? "Atendente": "Cliente"), {headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}}).then(res => res.json()).then(data => {
        if(data[0] == "sucesso"){

          console.log(data[1])
          if(atendente && minutosAtendenteFn && segundosAtendenteFn){
            minutosAtendenteFn(data[1].minutosRestantes)
            segundosAtendenteFn(data[1].segundosRestantes.toFixed(0))
          }else{
            if(!atendente){
              setMinutos(data[1].minutosRestantes)
              setSegundos(data[1].segundosRestantes.toFixed(0))
            }else{
              setTemAviso(true)
              setTextoAviso("ocorreu um erro. Por favor, tentar novamente")
            }
          }
        }else if(data[0] == "sem sala"){
          setTemAviso(true)
          setTextoAviso("Você não tem nenhuma sala aberta no momento")
        }else{
          setTemAviso(true)
          setTextoAviso("ocorreu um erro. Por favor, tentar novamente")
        }
      }).catch(() => {
          setTemAviso(true)
          setTextoAviso("ocorreu um erro. Por favor, tentar novamente")
      })
    }


    function handleKeyPress(event: React.KeyboardEvent<HTMLTextAreaElement>) {
      console.log("ativou key down")
      if (event.key === "Enter") {
        console.log("é enter")
        event.preventDefault()
        enviarFn()
      }
    }

    function encerrarAtendimentoCliente(){
      fetch("https://api.conexaoastralmistica.com.br/encerrarAtendimentoCliente", {
        method: "POST",
    headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
        body: JSON.stringify({
          idProfissional: perfilProAtual.id,
        })
      }).then(res => res.json()).then(data => {
        console.log(data)
      }).catch((err) => {
        console.log(err)
      })
    }


    return(
        <div className={`min-h-screen ${atendente? "" : "bg-fundoChat bg-cover"}  h-screen flex ${atendente? "" : "flex-col"} justify-center relative ${atendente ? "py-4" : "py-[var(--paddingYGeral)]"}`}>
          {
            atendente &&
            <div className='w-1/2 flex justify-center'>
              <div className='w-1/2 flex flex-col justify-center gap-8'>
                <select className='text-black' name="" id="" onChange={(e) => {onChangeSelect(e)}}>
                  {
                    baralhos.map((item, index) => <option className='text-black' selected={index == 0} value={item.nome}>{item.nome}</option>)
                  }
                </select>
                <div className=' bg-white/30 backdrop-blur-md p-4 grid grid-cols-3 gap-4 items-center justify-items-center max-h-[700px] overflow-y-scroll'>
                  {
                    baralhosUrls && 
                    baralhosUrls.map((item, index) => {
                      return <Carta urlImg={`https://api.conexaoastralmistica.com.br/images/${item}`} cartasSelecionadas={cartasSelecionadas} setCartasSelecionadas={setCartasSelecionadas} idxCarta={index} />
                    })
                  }
                </div>
                {
                 cartasSelecionadas.length > 0 &&
                 <div onClick={enviarImagens} className='py-4 bg-roxoPrincipal rounded-b-md flex justify-center cursor-pointer'>
                    Enviar foto(s)
                  </div>
                }
              </div>
              <audio ref={audio} src={campainha}></audio>
            </div>
          }
          {
            !atendente &&
            <div className='flex flex-col items-center gap-3 md:justify-center md:gap-8 text-white mb-8'>
              <div  className='flex justify-center items-center text-xl'> 
                tempo consulta: {tempoConsulta}
              </div >
              <div className='flex justify-center items-center text-xl'>
                valor consulta: {precoTotalConsulta}
              </div>
              <div className='text-white px-10 py-4 rounded-md text-3xl font-bold bg-roxoPrincipal'>
                {minutos}:{segundos}
              </div>
              <button onClick={encerrarAtendimentoCliente} className="p-4 rounded-md bg-red-500 ">
                  Encerrar antendimento
                </button>              
            </div>
          }
          <div className={` ${atendente? "w-1/2 mr-10 h-4/5 self-start mt-8" : "w-2/3 mx-10 h-4/5 self-center"} flex `}>
            <div className='flex flex-col mt-16 rounded-md bg-white h-fit'>
              {infoSalas &&
                infoSalas.map((item, index) => <OpcaoChat dataNascimento={dataNascimento} salaOpcao={item.idSala} setSalaAdm={setSalaAtualAdm} nomeCliente={item.nome} primeiro={index == 0} ultimoClicado={ultimoClicado} ultimoClicadoFn={setUltimoClicado} index={index}/>)
              }
            </div>
            <div className='h-full flex-1 bg-fundoTextoChat bg-cover rounded-md  flex flex-col justify-end'>
              <div ref={divScroll} className='p-4 overflow-y-scroll overflow-x-hidden flex flex-col gap-4'>
                {historico.map(item => {
                  if(item.slice(0, 5) == "[img]"){
                    let arrImg:string[] = []
                    if(item.split("[img]").length > 0 && item.split("[img]")[0] == ""){
                      arrImg = item.split("[img]")
                      arrImg.shift()
                    }
                    return <div className='grid grid-cols-3'>{arrImg.map(elem => <img src={elem} className='w-32 h-auto' />)}</div>
                  }else{
                    if(item.slice(0, 3) == "|U|"){
                      return (<div className='flex gap-2'>
                        <div className='self-start p-2 text-sm bg-roxoSecundario rounded-md text-white'>
                          {atendente ? infoSalas[0].nome : usuario.nome}
                        </div>  
                        <div className='text-black whitespace-pre-wrap'>
                          {item.slice(3)}
                        </div>
                      </div>)
                    }else if(item.slice(0, 3) == "|P|"){
                      return (
                        <div className='flex gap-2'>
                          <div className='self-start p-2 text-sm bg-roxoPrincipal rounded-md text-white'>
                            {perfilProAtual.nome}
                          </div>  
                          <div className='text-black whitespace-pre-wrap'>
                            {item.slice(3)}
                          </div>
                        </div>
                      )
                    }

                    return <div className='text-black'>{item}</div>
                  }

                })}
              </div>
              <div className='flex rounded-b-md overflow-hidden'>
                <textarea onKeyDown={e => {handleKeyPress(e)}} disabled={cartasSelecionadas.length > 0} className='bg-roxoPrincipal w-full px-4 py-2 outline-none text-white resize-none min-h-14' value={msg} onChange={(e) => setMsg(e.target.value)} placeholder='mensagem'/>
                <button disabled={cartasSelecionadas.length > 0} onClick={enviarFn} className='bg-roxoPrincipal px-8 h-full flex justify-center items-center'>
                  <img className='h-auto w-7' src={imgEnviar} alt="enviar mensagem" />
                </button>
              </div>
            </div>
          </div>

          {
            temAviso && 
            <ModalAviso/>
          }
          {
            abrirModalRecarregar &&
            <ModalRecarregar atualizarCronFn={iniciarCronometro} minutosRestantes={minutosRestantes}/>
          }
          {
            abrirModalChamandoAtendente &&
            <ModalChamandoAtendente idUsuario={idUsuarioChamando} usuario={usuarioChamando}/>
          }
          {
            abrirPagamentoDentroConsulta &&
            <PagamentoDentroConsulta/>
          }
        </div>
    )
}