import { useContext, useEffect} from "react"
import { Outlet } from "react-router-dom"
import MenuAdm from "../MenuAdm/MenuAdm"
import ModalAviso from "../ModalAviso/ModalAviso"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import ModalDetalhes from "../ModalDetalhes/ModalDetalhes"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"
import Login from "../Login/Login"
import { ContextoLogin } from "../../Contexts/ContextoLogin/ContextoLogin"


export default function Adm(){

    const {temAviso} = useContext(ContextoAviso)
    const {abrirModalDetalhes} = useContext(ContextoProfissionais)
    const {admGeralLogado, setAdmGeralLogado} = useContext(ContextoLogin)

    useEffect(() => {
        console.log(temAviso)
    }, [temAviso])

    useEffect(() => {
        fetch("https://api.conexaoastralmistica.com.br/confereTokenAdmGeral", {
          headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}
        }).then(res => res.json()).then(data => {
          if(data[0] && data[0] == "erro"){
            setAdmGeralLogado(false)
            localStorage.setItem("authToken", "")
          }else if(data[0] && data[0] == "sucesso"){
              setAdmGeralLogado(true)
          }else{
            setAdmGeralLogado(false)
            localStorage.setItem("authToken", "") 
          }
        })
      }, [])

    return(
        <div className="relative min-h-screen bg-roxoPrincipal flex flex-col gap-4 text-white">
            {
                admGeralLogado ? 
                <>
                    {
                        abrirModalDetalhes ?
                        <ModalDetalhes/>
                        :
                        <>
                            <MenuAdm/>
                            <div className="flex flex-col gap-4">
                                <Outlet/>
                            </div>
                            {
                                temAviso &&
                                <ModalAviso />
                            }                        
                        </>
                        
                        
                    }                    
                </>
                :
                <Login tipoLogin="admGeral" />
            }
        </div>  
    )
}