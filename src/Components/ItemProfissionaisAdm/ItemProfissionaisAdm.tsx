import { useContext} from "react"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"

type Props = {
    nomeProfissional: string,
    img: string,
    idProfissional: number,
    totalArrecadado: number
}



export default function ItemProfissionaisAdm({nomeProfissional, img, idProfissional, totalArrecadado}: Props){

    const { setTemAviso, setTextoAviso} = useContext(ContextoAviso)
    const { setDetalhesProAdm, setAbrirModalDetalhes} = useContext(ContextoProfissionais)

    function maisDetalherProfissional(){

        console.log(idProfissional)

        fetch("api.conexaoastralmistica.com.br/detalheProfissional", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                idProfissional 
            })
        }).then(res => res.json()).then(data => {
            console.log(data)
            if(data[0] == "sucesso"){
                setAbrirModalDetalhes(true)
                const arrDetalhes = data[1]
                for(let i = 0; i < arrDetalhes.length; i++){
                    const elem = arrDetalhes[i]
                    elem.nomeProfissional = nomeProfissional
                }
                setDetalhesProAdm(arrDetalhes)
            }else if(data[0] == "sem dados"){
                setAbrirModalDetalhes(true)
                setDetalhesProAdm([])
            }else{
                setTemAviso(true)
                setTextoAviso("Não foi possível pegar as informações do profissional. Tente novamente e verifique sua conexão com a internet, por favor")
            }
        })
    }


    return (
        <div className="px-20 py-10 flex items-center gap-8 rounded-md bg-black">
            <div className="h-40 w-40 overflow-hidden ">
                <img className="object-cover" src={`api.conexaoastralmistica.com.br/images/${img}`} alt="foto perfil profissional" />
            </div>
            <div className="text-xl">{nomeProfissional}</div>
            <div className="px-4 py-2 rounded-md bg-slate-500 cursor-pointer" onClick={maisDetalherProfissional}>
                Mais Detalhes
            </div>
            <div>Total a pagar: {0.3 * totalArrecadado}</div>
        </div>
    )
}