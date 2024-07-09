import { useContext, useEffect } from "react"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"
import { useParams } from "react-router-dom"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import ModalAviso from "../ModalAviso/ModalAviso"



export default function Perfil(){

    const {id} = useParams()


    const {perfilProAtual, setPerfilProAtual} = useContext(ContextoProfissionais)
    const {setTemAviso, setTextoAviso, temAviso} = useContext(ContextoAviso)

    useEffect(() => {
        fetch("http://localhost:8080/infoIdAtendente", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                id
            })
        }).then(res => res.json()).then(data => {
            if(data[0] == "sucesso"){
                setPerfilProAtual(data[1])
            }else{
                setTemAviso(true)
                setTextoAviso("ocorreu um erro ao buscar informações desse profissional. Por favor, tente novamente.")
            }   
        })
    })

    return (
        <div className="min-h-screen bg-roxoPrincipal flex flex-col items-center text-white px-[var(--paddingXGeralCel)] lg:px-[var(--paddingXGeral)] py-[var(--paddingYGeral)] gap-8 relative">
            <div className="text-4xl font-bold text-center mb-10">
                Perfil detalhado do profissional
            </div>
            <div className="w-[20vw] h-[20vw] flex justify-center items-center">
                <img className="h-full object-cover" src={`http://localhost:8080/images/${perfilProAtual.foto}`} alt="foto perfil profissional" />
            </div>
            <div className="text-center text-xl">
                {perfilProAtual.nome}
            </div>
            <div className="text-center text-xl">
                {perfilProAtual.descricaoMaior}
            </div>
            {
                temAviso && 
                <ModalAviso/>
            }
        </div>
    )
}