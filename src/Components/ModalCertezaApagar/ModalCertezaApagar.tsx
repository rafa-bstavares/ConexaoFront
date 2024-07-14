import { useContext } from "react"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"




export default function ModalCertezaApagar(){


    const {setAbrirModalCertezaApagar, idProfissionalApagar} = useContext(ContextoProfissionais)
    const {setTemAviso, setTextoAviso} = useContext(ContextoAviso)


    function removerProfissional(){
        fetch("https://api.conexaoastralmistica.com.br/apagarProfissional", {
            method: "POST",
            headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
            body: JSON.stringify({
                idProfissionalApagar
            })
        }).then(res => res.json()).then(data => {
            if(data[0] == "sucesso"){
                setAbrirModalCertezaApagar(false)
                setTemAviso(true)
                setTextoAviso("Profissional removido com sucesso!")
            }else{
                setAbrirModalCertezaApagar(false)
                setTemAviso(true)
                setTextoAviso("Ocorreu um erro e o profissional não foi removido. Por favor, tenten novamente. Caso persista, considere fazer o login novamente.")
            }

            if(data[1]){
                console.log(data[1])
            }
        }).catch(() => {
            setAbrirModalCertezaApagar(false)
            setTemAviso(true)
            setTextoAviso("Ocorreu um erro e o profissional não foi removido. Por favor, tenten novamente. Considere verificar a sua conexão com internet ou fazer o login novamente.")
        })
    }



    return (
        <div className="fixed top-0 left-0 h-screen w-screen bg-black/80 flex flex-col justify-center items-center gap-10 z-50">
            <div className="text-xl text-white">Tem certeza que deseja remover completamente esse profissional? Os históricos relativos a ele se mantém guardados e serão apagados normalmente após 30 dias como todos os outros.</div>
            <div className="flex gap-2">
                <button className="px-4 py-2 rounded-md bg-white text-black" onClick={removerProfissional}>Sim</button>
                <button className="px-4 py-2 rounded-md bg-white text-black" onClick={() => setAbrirModalCertezaApagar(false)}>Voltar</button>
            </div>
        </div>
    )
}