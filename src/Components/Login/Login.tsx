import { useState, MouseEvent, useContext, useEffect } from "react"
import { ContextoLogin } from "../../Contexts/ContextoLogin/ContextoLogin"
import { redirect } from "react-router-dom"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import imgOlho from "../../assets/images/olhoSenha.svg"
import ModalAviso from "../ModalAviso/ModalAviso"

type Props = {
    tipoLogin: "atendente" | "usuario" | "admGeral"
}

export default function Login({tipoLogin}: Props){
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")
    const [senha, setSenha] = useState<string>("")

    const {setAtendenteLogado, setAdmGeralLogado, setUsuarioLogado} = useContext(ContextoLogin)
    const {setTemAviso, setTextoAviso, temAviso, textoAviso} = useContext(ContextoAviso)

    useEffect(() => {
        setTemAviso(false)
        setTextoAviso("")
    }, [])


    function conferirUsuario(e: MouseEvent<HTMLInputElement>){
        e.preventDefault() //o preventDefault previne até que a conferencia do required seja feita, então vai ter que fazer essa conferência por JS

        if(email !== "" && senha !== ""){
            fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                senha,
                tipoLogin
            })
            }).then(resp => resp.json()).then(data => {
                if(data[0] == "erro"){
                    setTemAviso(true)
                    if(data[1]){
                        setTextoAviso(data[1])
                    }else{
                        setTextoAviso("ocorreu um erro, tente novamente. Caso persista, entre em contato com o suporte.")
                    }
                }else{
                    if(tipoLogin == "atendente"){

                    }else{
                        
                    }

                    switch(tipoLogin){
                        case "atendente":
                            localStorage.setItem('authToken', data[1].token)
                            if(localStorage.getItem("authToken")){
                                setAtendenteLogado(true)
                                redirect("/")
                            }
                            break

                        case "admGeral":
                            localStorage.setItem('authToken', data[1].token)
                            if(localStorage.getItem("authToken")){
                                setAdmGeralLogado(true)
                            }
                            break

                        case "usuario":
                            localStorage.setItem('authToken', data[1].token)
                            if(localStorage.getItem("authToken")){
                                setUsuarioLogado(true)
                            }
                    }

                } 
            }).catch(err => {
                setTemAviso(true)
                setTextoAviso("Ocorreu algum erro no fetch, por favor tente novamente. Erro: " + err)
            })
        }else{
            setTemAviso(true)
            setTextoAviso("email e senha não podem estar vazios")
        }
    }


    return(
        <div className="min-h-screen bg-roxoPrincipal flex flex-col justify-center items-center relative">
            <form className="p-3 backdrop-blur-xl bg-white/30 rounded-md flex flex-col gap-3 w-1/3 text-black">
                <div className="font-bold text-white text-3xl flex justify-center">Login {tipoLogin == "atendente"? "Atendentes": (tipoLogin == "admGeral"? "Administração" : "Usuários")}</div>
                <input type="email" placeholder="email" onChange={e => {setEmail(e.target.value)}} className="rounded-md p-2"/>
                <div className="rounded-md flex overflow-hidden bg-white">
                    <input type={showPassword ? "text" : "password"} placeholder="senha" onChange={e => {setSenha(e.target.value)}} className="p-2 flex-1 outline-none"/>
                    <img onClick={() => setShowPassword(!showPassword)} src={imgOlho} alt="imagem-para-ver-senha" className="h-10 w-auto p-1 cursor-pointer"/>
                </div>
                <input type="submit" onClick={e => {conferirUsuario(e)}} className="self-center p-2 rounded-md bg-white text-black cursor-pointer" value="Entrar"/>
            </form>
            {
                temAviso && 
                <ModalAviso/>
            }
        </div>
    )
}