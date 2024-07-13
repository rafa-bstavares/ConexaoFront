import { useContext, useState } from "react"
import imgOlho from "../../assets/images/olhoSenha.svg"
import Botao from "../Botao/Botao"
import imgLogo from "../../assets/images/logoConexao.png"
import { ContextoLogin } from "../../Contexts/ContextoLogin/ContextoLogin"
import { ContextoUsuario } from "../../Contexts/ContextoUsuario/ContextoUsuario"

export default function ModalLogin(){
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [emailUsuario, setEmailUsuario] = useState<string>("")
    const [senhaUsuario, setSenhaUsuario] = useState<string>("")
    const [temErro, setTemErro] = useState<boolean>(false)
    const [textoErro, setTextoErro] = useState<string>("")

    const {setAbrirModalLogUsuario, setUsuarioLogado} = useContext(ContextoLogin)
    const {setUsuario} = useContext(ContextoUsuario)
    const tipoLogin = "usuario"


    function aoCancelar(){
        setAbrirModalLogUsuario(false)
    }



  function pegarInfoUsuario(){
    fetch("https://167.88.32.149:8080/pegarInfoUsuario", {
        headers: { "authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}
    }).then(res => res.json()).then(data => {
        if(data[0] && data[0] == "erro"){
            if(data[1]){
                setTextoErro(data[1])
            }else{
                setTextoErro("Ocorreu um erro inesperado. Por favor, tente novamente")
            }
        }else if(data[0] && data[0] == "sucesso"){
            if(data[1].id && data[1].email && data[1].nome && data[1].saldo >= 0){
                setUsuario(data[1])
            }else{
                setTemErro(true)
                setTextoErro("Ocorreu um erro inesperado. Por favor, tente novamente")
            }
        }else{
            setTemErro(true)
            setTextoErro("Ocorreu um erro inesperado. Por favor, tente novamente")
        }
    })
}

    function logar(){
        fetch("https://167.88.32.149:8080/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: emailUsuario,
                senha: senhaUsuario,
                tipoLogin
            })
        }).then(res => res.json()).then(data => {
            if(data[0] && data[0] == "erro"){
                setTemErro(true)
                if(data[1]){
                    setTextoErro(data[1])
                }else{
                    setTextoErro("Ocorreu um erro inesperado. Por favor, tente novamente")
                }
            }else if(data[0] && data[0] == "sucesso"){
                if(data[1].token){
                    localStorage.setItem("authToken", data[1].token)
                    if(localStorage.getItem("authToken")){
                        setUsuarioLogado(true)
                        setAbrirModalLogUsuario(false)
                        pegarInfoUsuario()
                    }else{
                        setTemErro(true)
                        setTextoErro("Ocorreu um erro inesperado. Por favor, tente novamente")
                    }
                }else{
                    setTemErro(true)
                    setTextoErro("Ocorreu um erro inesperado. Por favor, tente novamente")
                }
            }else{
                setTemErro(true)
                setTextoErro("Ocorreu um erro inesperado. Por favor, tente novamente")
            }
        })
    }



    return(
        <div className="fixed bg-white/90 h-screen w-full top-0 left-0 flex justify-center items-center">
            <div className="flex flex-col gap-4 px-8 py-6 bg-roxoPrincipal w-1/2 rounded-md text-white">
                <div className="w-1/4 self-center">
                    <img src={imgLogo} alt="logo" className="w-full h-auto" />
                </div>
                <div className="self-center text-3xl font-bold">Faça login</div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="emailUsuario">Email:</label>
                    <input className="p-2 flex-1 outline-none text-black rounded-md" type="text" id="emailUsuario" onChange={e => {setEmailUsuario(e.target.value)}} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="senhaUsuario">Senha:</label>
                    <div className="rounded-md flex overflow-hidden bg-white">
                        <input type={showPassword ? "text" : "password"} onChange={e => {setSenhaUsuario(e.target.value)}} className="p-2 flex-1 outline-none text-black rounded-md"/>
                        <img onClick={() => setShowPassword(!showPassword)} src={imgOlho} alt="imagem-para-ver-senha" className="h-10 w-auto p-1 cursor-pointer"/>
                    </div>
                </div>
                {
                    temErro &&
                    <div className="self-center text-red-600 font-bold text-xl">{textoErro}</div>
                }
                <div className="flex gap-4 self-center mt-5">
                    <Botao onClickFn={logar} texto="Efetuar Login"/>
                    <Botao onClickFn={aoCancelar} texto="Cancelar"/>
                </div>
            </div>
        </div>
    )
}