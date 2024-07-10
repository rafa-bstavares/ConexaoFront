import { useContext, useState } from "react"
import Botao from "../Botao/Botao"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import ModalAviso from "../ModalAviso/ModalAviso"

type Props = {
    tipo: "Atendente" | "Usuario" | "AdmGeral"
}

export default function MeusDados({tipo}: Props){

    const {temAviso, setTemAviso, setTextoAviso } = useContext(ContextoAviso)

    const [novaSenha1, setNovaSenha1] = useState<string>("")
    const [novaSenha2, setNovaSenha2] = useState<string>("")
    const [senhaAntiga, setSenhaAntiga] = useState<string>("")


    function redefinirSenha(){

        if(novaSenha1 == novaSenha2 && novaSenha1 !== ""){
            fetch("http://167.88.32.149:8080/redefinirSenha" + tipo, {
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
        <div className={`flex flex-col gap-4 relative`}>
            <div className="flex flex-col gap-2">
                <label htmlFor="senhaNova1">Digite a nova senha</label>
                <input className="text-black outline-none p-2 w-1/2" type="password" name="" id="senhaNova1" onChange={e => setNovaSenha1(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="senhaNova2">Repita a nova senha</label>
                <input className="text-black outline-none p-2 w-1/2" type="password" name="" id="senhaNova2" onChange={e => setNovaSenha2(e.target.value)}/>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="senhaAntiga">Digite a senha antiga</label>
                <input className="text-black outline-none p-2 w-1/2" type="password" name="" id="senhaAntiga" onChange={e => setSenhaAntiga(e.target.value)}/>
            </div>
            <Botao onClickFn={redefinirSenha} texto="Redefinir senha"/>
            {
                temAviso &&
                <ModalAviso/>
            }
        </div>
    )
}