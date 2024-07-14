import { Link } from "react-router-dom"
import logo from "../../assets/images/logoConexao.png"
import { useContext } from "react"
import { ContextoLogin } from "../../Contexts/ContextoLogin/ContextoLogin"



export default function MenuAdm(){


    const {setAdmGeralLogado} = useContext(ContextoLogin)


    function sairFn(){
        localStorage.setItem("authToken", "")
        setAdmGeralLogado(false)
    }

    return(
        <div className="flex gap-5 h-32 px-10">
            <div>
                <img className="h-full" src={logo} alt="logotipo-conexao" />
            </div>
             <div className="h-full flex justify-center p-5">
                <Link className="h-full flex justify-center items-center cursor-pointer border-solid border-transparent mb-2 hover:border-douradoPrincipal p-3 transition-colors ease-linear" to={"/adm/postarBlog"}>Postar Blog</Link>
             </div>
             <div className="h-full flex justify-center p-5">
                <Link className="h-full flex justify-center items-center cursor-pointer border-solid border-transparent mb-2 hover:border-douradoPrincipal p-3 transition-colors ease-linear" to={"/adm/controleAdm"}>Balanço</Link>
             </div>
             <div className="h-full flex justify-center p-5">
                <Link className="h-full flex justify-center items-center cursor-pointer border-solid border-transparent mb-2 hover:border-b-douradoPrincipal p-3 transition-colors ease-linear" to={"/adm/cadastrarProfissional"}>Cadastrar Profissional</Link>
             </div>
             <div className="h-full flex justify-center p-5">
                <Link className="h-full flex justify-center items-center cursor-pointer border-solid border-transparent mb-2 hover:border-b-douradoPrincipal p-3 transition-colors ease-linear" to={"/adm/meusDadosAdm"}>Meus Dados</Link>
             </div>
             <div onClick={sairFn} className="bg-red-600 rounded-md px-4 py-2 self-center">
                Sair
             </div>
        </div>
    )
}