import { useContext, useEffect } from "react"
import { ContextoUsuario } from "../../Contexts/ContextoUsuario/ContextoUsuario"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import { ContextoLogin } from "../../Contexts/ContextoLogin/ContextoLogin"
import { useNavigate, Link } from "react-router-dom"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"

type Props = {
    img: string,
    nome: string,
    descricaoMenor: string,
    id: number, 
    status: string,
    valorMin: number
}

export default function Profissional({img, nome, descricaoMenor, id, status, valorMin}: Props){

    const {setTemAviso, setTextoAviso, setAbrirModalTempo, setValorMinModal} = useContext(ContextoAviso)
    const { setUsuarioLogado, setAbrirModalLogUsuario} = useContext(ContextoLogin)
    const {setPerfilProAtual, perfilProAtual} = useContext(ContextoProfissionais)
    const {setIdMeuAtendente} = useContext(ContextoUsuario)

    const navigate = useNavigate()


useEffect(() => {
    console.log(perfilProAtual)
}, [perfilProAtual])


    function irParaChat(){
        fetch("http://167.88.32.149:8080/confereTokenUsuario", {headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}}).then(res => res.json()).then(data => {
            if(data[0] == "erro"){
              setUsuarioLogado(false)
              localStorage.setItem("authToken", "")
              setTemAviso(true)
              setTextoAviso("você precisa se logar para entrar no chat")
              setAbrirModalLogUsuario(true)
            }else{
                //abrir modal escolher tempo 
                setIdMeuAtendente(id)
                setAbrirModalTempo(true)
                setValorMinModal(valorMin)
            }
            console.log(data)
            
          }).catch(() => {
              setTemAviso(true)
              setTextoAviso("ocorreu algum erro, por favor, tente novamente")
          })


  
    }

    function irPerfil(){
        fetch("http://167.88.32.149:8080/irPerfil", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                id
            })
        }).then(res => res.json()).then(data => {
            if(data[0] == "sucesso"){
                setPerfilProAtual(data[1])
            }else{
                navigate("/")
                setTemAviso(true)
                setTextoAviso("Ocorreu um erro ao pegar as informações do profissional selecionado. Por favor, tente novamente.")
            }
        }).catch(() => {
            navigate("/")
            setTemAviso(true)
            setTextoAviso("Ocorreu um erro ao pegar as informações do profissional selecionado. Por favor, tente novamente.")
        })
    }


    return(
        <div className="flex flex-col py-4 lg:px-14 px-4 w-4/5 rounded-md border-white border-solid border-2 items-center gap-4 text-white bg-fundoProfissionais">
            <div className="w-full h-52 rounded-md overflow-hidden flex justify-center items-center">
                <img className="object-cover h-full" src={`http://167.88.32.149:8080/images/${img}`} alt="imagem-profissional"/>
            </div>
            <div className="font-bold text-2xl text-center">
                {nome}
            </div>
            <div className="text-lg"> 
                {descricaoMenor}
            </div>
            <div className={`rounded-md text-white text-sm text-center p-2 ${status == "online" ? "bg-green-500" : (status == "offline" ? "bg-red-500" : "bg-orange-500")}`}>
                {status}
            </div>
            <button onClick={irParaChat} className="bg-green-500 rounded-md text-white self-stretch p-2">Iniciar consulta R${valorMin}/min</button>
            <Link className="self-stretch" to={"/PerfilAtendente/" + id}>
                <button onClick={irPerfil} className="bg-roxoPrincipal rounded-md text-white w-full p-2">Ver perfil</button>
            </Link>
        </div>
    )
}