import Banner from './Components/Banner/Banner'
import Servicos from './Components/Servicos/Servicos'
import Profissionais from './Components/Profissionais/Profissionais'
import ModalAviso from './Components/ModalAviso/ModalAviso'
import { useContext, useEffect } from 'react'
import { ContextoAviso } from './Contexts/ContextoAviso/ContextoAviso'
import { ContextoLogin } from './Contexts/ContextoLogin/ContextoLogin'
import ModalLogin from './Components/ModalLogin/ModalLogin'
import ModalCadastrarUsuario from './Components/ModalCadastrarUsuario/ModalCadastrarUsuario'
import ModalTempo from './Components/ModalTempo/ModalTempo'
import ModalPagamento from './Components/ModalPagamento/ModalPagamento'
import { ContextoUsuario } from './Contexts/ContextoUsuario/ContextoUsuario'
import { ContextoPagamento } from './Contexts/ContextoPagamento/ContextoPagamento'
import { initMercadoPago } from '@mercadopago/sdk-react'
import ModalCartao from './Components/ModalCartao/ModalCartao'
import ModalEscolherPag from './Components/ModalEscolherPag/ModalEscolherPag'
import { ContextoProfissionais } from './Contexts/ContextoProfissionais/ContextoProfissionais'
import Footer from './Components/Footer/Footer'
import Idealizadora from './Components/Idealizadora/Idealizadora'
import ModalEmail from './Components/ModalEmail/ModalEmail'


function App() {

  const {temAviso, setTemAviso, setTextoAviso, abrirModalTempo, abrirModalEmail} = useContext(ContextoAviso)
  const {abrirModalLogUsuario, abrirModalCadastroUsuario, setUsuarioLogado} = useContext(ContextoLogin)
  const {setUsuario} = useContext(ContextoUsuario)
  const {abrirModalPagamento, abrirModalCartao, abrirModalEscolher} = useContext(ContextoPagamento)
  const {nomeProModTempo} = useContext(ContextoProfissionais)


  
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

    initMercadoPago("APP_USR-f4a11f07-575f-4fd9-9e1a-2385bcf0f2ff")


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
  }, [])




  return (
    <div className='relative'>
      <Banner/>
      <Profissionais/>
      <Servicos/>
      <Idealizadora/>
      <Footer/>
      {
        temAviso &&
        <ModalAviso />
      }
      {
        abrirModalLogUsuario &&
        <ModalLogin/>
      }
      {
        abrirModalCadastroUsuario &&
        <ModalCadastrarUsuario/>
      }
      {
        abrirModalTempo &&
        <ModalTempo nomePro={nomeProModTempo}/>
      }
      {
        abrirModalPagamento &&
        <ModalPagamento/>
      }
      {
        abrirModalCartao &&
        <ModalCartao/>
      }
      {
        abrirModalEscolher &&
        <ModalEscolherPag/>
      }
      {
        abrirModalEmail &&
        <ModalEmail/>
      }
    </div>
  )
}

export default App
