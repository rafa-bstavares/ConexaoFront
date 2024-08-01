import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ContextoBlog } from "../../Contexts/ContextoBlog/ContextoBlog"



export default function PostBlog(){
    const [textoComp, setTextoComp] = useState<string>("")

    const {imgBlog, tituloBlog} = useContext(ContextoBlog)

    const {id} = useParams()

    useEffect(() => {
        fetch("https://api.conexaoastralmistica.com.br/pegarTextoPost", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                idPost: id
            })
        }).then(res => res.json()).then(data => {
            if(data[0] == "sucesso"){
                setTextoComp(data[1])
            }else{
                setTextoComp("houve um erro ao pegar o texto, por favor, tente novamente.")
            }
        })
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center gap-4 bg-roxoPrincipal px-[var(--paddingXGeralCel)] lg:px-[var(--paddingXGeral)] py-[var(--paddingYGeral)]">
            {
                imgBlog &&
                <div className="w-[90%] h-1/3">
                    <img src={imgBlog} alt="imagem Blog" className="w-full h-full object-cover" />
                </div>
            }
            <div className="text-white text-xl lg:text-4xl text-center">{tituloBlog}</div>
            <div className="text-white">{textoComp}</div>
        </div>
    )
}