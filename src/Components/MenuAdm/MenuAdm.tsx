import { Link } from "react-router-dom"
import logo from "../../assets/images/logoConexao.png"



export default function MenuAdm(){
    return(
        <div className="flex gap-5 h-32">
            <div>
                <img className="h-full" src={logo} alt="" />
            </div>
             <div className="h-full flex-1 flex justify-center p-5">
                <Link className="h-full flex justify-center items-center cursor-pointer border-solid border-transparent mb-2 hover:border-douradoPrincipal p-3 transition-colors ease-linear" to={"/adm/postarBlog"}>Postar Blog</Link>
             </div>
             <div className="h-full flex-1 flex justify-center p-5">
                <Link className="h-full flex justify-center items-center cursor-pointer border-solid border-transparent mb-2 hover:border-douradoPrincipal p-3 transition-colors ease-linear" to={"/adm/controleAdm"}>Balanço</Link>
             </div>
             <div className="h-full flex-1 flex justify-center p-5">
                <Link className="h-full flex justify-center items-center cursor-pointer border-solid border-transparent mb-2 hover:border-b-douradoPrincipal p-3 transition-colors ease-linear" to={"/adm/cadastrarProfissional"}>Cadastrar Profissional</Link>
             </div>
        </div>
    )
}