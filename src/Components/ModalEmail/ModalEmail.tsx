
import { useContext, useState } from "react"
import Botao from "../Botao/Botao"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"


export default function ModalEmail(){

    const {setAbrirModalEmail, setTemAviso, setTextoAviso} = useContext(ContextoAviso)
    const [nome, setNome] = useState<string>("")
    const [mensagem, setMensagem] = useState<string>("")
    const [celular, setCelular] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [respostaEmail, setRespostaEmail] = useState<boolean>(false)
    const [mensagemTela, setMensagemTela] = useState<string>("")

    function cancelarModal(){
        setAbrirModalEmail(false)
    }


    function enviarEmail(){
        if(nome && email && mensagem){
            fetch("https://api.conexaoastralmistica.com.br/enviarEmail", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    nome,
                    celular,
                    email,
                    mensagem
                })
            }).then(res => res.json()).then(data => {
                if(data[0] == "erro"){
                    console.log(data[1])
                    setRespostaEmail(true)
                    setMensagemTela("ocorreu um erro, por favor, tente novamente mais tarde.")
                }else{
                    console.log(data[1])
                    setRespostaEmail(true)
                    setMensagemTela("Email enviado com sucesso")
                }
            })
        }else{
            setTemAviso(true)
            setTextoAviso("nome, email e mensagem precisam estar preenchidos")
        }
    }

    
    return (
        <div className="fixed bg-white/90 h-screen w-full top-0 left-0 flex justify-center items-center"> 
            <div className="flex flex-col gap-2: lg:gap-4 px-4 lg:px-8 py-3 lg:py-6 bg-roxoPrincipal w-[90%] lg:w-1/2 rounded-md text-white max-h-[90%] overflow-y-scroll">
                <div className="self-center text-center text-white lg:text-3xl text-xl">
                    Envie suas informações e entraremos em contato!
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                        <label htmlFor="nome">Nome</label>
                        <input type="text" name="" id="nome" className="w-4/5 rounded-md px-1 py-2 text-black" onChange={(e) => setNome(e.target.value)}/>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="" id="email" className="w-4/5 rounded-md px-1 py-2 text-black" onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="celular">Celular (opcional)</label>
                        <input type="text" name="" id="celular" className="w-4/5 rounded-md px-1 py-2 text-black" onChange={(e) => setCelular(e.target.value)}/>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="Mensagem">Mensagem</label>
                        <textarea id="mensagem" className="h-44 resize-none rounded-md text-black px-1 py-2" onChange={(e) => setMensagem(e.target.value)}/>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Botao texto="Enviar Email" onClickFn={enviarEmail}/>
                    <Botao texto="Cancelar" onClickFn={cancelarModal}/>
                </div>
                {
                    respostaEmail &&
                    <div className="font-bold text-center">
                        {mensagemTela}
                    </div>
                }
            </div>
        </div>
    )
}