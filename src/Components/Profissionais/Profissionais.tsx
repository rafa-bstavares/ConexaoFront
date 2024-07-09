import Profissional from "../Profissional/Profissional"
import fotoExm from "../../assets/images/logoConexao.png"
import { useContext, useEffect } from "react"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import { socket } from "../../socket"

export default function Profissionais(){ 

    const {setProfissionais, profissionais} = useContext(ContextoProfissionais)
    const {setTemAviso,setTextoAviso} = useContext(ContextoAviso)

    socket.on("mudStatus", (data) => {
        const cloneInfos = [...profissionais]
        const idxPro =  cloneInfos.findIndex((item) => item.id == data.id)
        if(idxPro >= 0 ){
            cloneInfos[idxPro].status = data.status
            setProfissionais(cloneInfos)
        }
    })

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


    const Profs = [ 
        {foto: fotoExm, nome: "Nome 1", desc: ["baralho 1", "baralho 2", "baralho 3"], id: "16", status: "online"},
        {foto: fotoExm, nome: "Nome 1", desc: ["baralho 1", "baralho 2", "baralho 3"], id: "16", status: "online"},
        {foto: fotoExm, nome: "Nome 1", desc: ["baralho 1", "baralho 2", "baralho 3"], id: "16", status: "online"},
        {foto: fotoExm, nome: "Nome 1", desc: ["baralho 1", "baralho 2", "baralho 3"], id: "16", status: "online"},
        {foto: fotoExm, nome: "Nome 1", desc: ["baralho 1", "baralho 2", "baralho 3"], id: "16", status: "online"},
    ]

    return(
        <div className="lg:grid lg:grid-cols-3 lg:justify-items-center items-center flex flex-col lg:gap-14 gap-4 px-[var(--paddingXGeralCel)] lg:px-[var(--paddingXGeral)] py-[var(--paddingYGeral)] bg-roxoPrincipal">
            {profissionais.map(item => <Profissional img={item.foto} descricaoMenor={item.descricaoMenor} nome={item.nome} id={item.id} status={item.status} valorMin={item.valorMin}/>)}
        </div>
    )
}