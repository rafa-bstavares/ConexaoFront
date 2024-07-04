import { useContext, useEffect } from "react"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import ItemProfissionaisAdm from "../ItemProfissionaisAdm/ItemProfissionaisAdm"



export default function ControleAdm(){

    const {setProfissionais, profissionais} = useContext(ContextoProfissionais)
    const { setTemAviso, setTextoAviso} = useContext(ContextoAviso)

    useEffect(() => {
        fetch("http://localhost:8080/pegarInfoProfissionais").then(res => res.json()).then(data => {
            if(data[0] == "sucesso"){
                setProfissionais(data[1])
            }else{
                if(data[1]){
                    setTemAviso(true)
                    setTextoAviso(data[1])
                }else{
                    setTemAviso(true)
                    setTextoAviso("ocorreu um erro ao pegar as informações dos profissinais. Por favor, recarregue a página")
                }
            }
        })
    }, [])


    return(
        <div className="px-[var(--paddingXGeral)] py-[var(--paddingYGeral)] flex flex-col items-center gap-16">
            <div className="text-3xl font-bold text-center">Profissionais:</div>
            <div className="flex flex-col gap-8">
                {
                    profissionais.length > 0 &&
                    profissionais.map(item => (
                        <ItemProfissionaisAdm totalArrecadado={item.totalArrecadado} img={item.foto} nomeProfissional={item.nome} idProfissional={item.id}/>
                    ))
                }
            </div>
        </div>
    )
}