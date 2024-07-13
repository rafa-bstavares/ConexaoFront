import { useContext, useEffect, useState } from "react"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import Botao from "../Botao/Botao"
import { ContextoLogin } from "../../Contexts/ContextoLogin/ContextoLogin"

type Props = {
    tipo: "Atendente" | "Usuario" | "AdmGeral"
}

export default function ModalRedefinirSenha({tipo}: Props){

    const {setAbrirModalRedefinir} = useContext(ContextoLogin) 
    const {setTemAviso, setTextoAviso} = useContext(ContextoAviso)

    const [novaSenha1, setNovaSenha1] = useState<string>("")
    const [novaSenha2, setNovaSenha2] = useState<string>("")
    const [senhaAntiga, setSenhaAntiga] = useState<string>("")

    useEffect(() => {

    }, [])

    
    function redefinirSenha(){

        if(novaSenha1 == novaSenha2 && novaSenha1 !== ""){
            fetch("https://api.conexaoastralmistica.com.br/redefinirSenha" + tipo, {
                method: "POST",
                headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
                body: JSON.stringify({
                    senhaNova: novaSenha1,
                    senhaAntiga
                })
            }).then(res => res.json()).then(data => {
                if(data.length > 0){
                    if(data[0] == "sucesso"){
                        setTemAviso(true)
                        setTextoAviso("senha redefinida com sucesso!")                    
                    }else{
                        if(data[0]=="erro"){
                            setTemAviso(true)
                            if(data.length > 1){
                                setTextoAviso(data[1])
                            }else{
                                setTextoAviso("ocorreu um erro ao definir a nova senha. Caso persista, faça o login novamente")
                            }
                        }else{
                            setTextoAviso("ocorreu um erro ao definir a nova senha. Caso persista, faça o login novamente")
                        }
                    }
                }
            })
        }else{
            setTemAviso(true)
            if(novaSenha1 !== novaSenha2){
                setTextoAviso("Os dois campos da senha nova precisam estar iguais e não estão.")
            }else{
                setTextoAviso("Os dois campos da senha nova estão vazios, por favor, preencha-os com a nova senha.")
            }
        }

    }



    return (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center">
            <div className="h-5/6 w-1/2 bg-roxoPrincipal rounded-xl flex flex-col px-12 py-8 gap-4 justify-center items-center overflow-y-scroll">
                <div className="text-3xl">
                    Redefinir Senha
                </div>
                <div className="w-4/5 flex flex-col gap-1">
                    <label htmlFor="senhaNova1" className="text-2xl ">Digite a nova senha</label>
                    <input type="password" className="w-full rounded-md outline-none text-black p-2 " id="senhaNova1" onChange={e => setNovaSenha1(e.target.value)}/>
                </div>
                <div className="w-4/5 flex flex-col gap-1">
                    <label htmlFor="senhaNova2" className="text-2xl ">Repita a nova senha</label>
                    <input type="password" className="w-full rounded-md outline-none text-black p-2 " id="senhaNova2" onChange={e => setNovaSenha2(e.target.value)}/>
                </div>
                <div className="w-4/5 flex flex-col gap-1">
                    <label htmlFor="senhaAntiga" className="text-2xl ">Digite sua senha antiga</label>
                    <input type="password" className="w-full rounded-md outline-none text-black p-2 " id="senhaAntiga" onChange={e => setSenhaAntiga(e.target.value)}/>
                </div>
                <Botao onClickFn={redefinirSenha} texto="Redefinir Senha" />
                <Botao onClickFn={() => setAbrirModalRedefinir(false)} texto="Fechar" />
            </div>
        </div>
    )
}