import PostPreview from "../PostPreview/PostPreview"
import { useContext, useEffect, useState } from "react"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import ModalAviso from "../ModalAviso/ModalAviso"


export default function Blog(){

    type TipoPreviews = {
        titulo: string,
        texto: string,
        img: string,
        data_postagem: Date,
        id: number
    }

    const [previews, setPreviews] = useState<TipoPreviews[]>([])
    const {setTextoAviso, temAviso, setTemAviso} = useContext(ContextoAviso)

    useEffect(() => {
        fetch("https://api.conexaoastralmistica.com.br/pegarPreviews").then(res => res.json()).then(data => {
            if(data[0] == "sucesso"){
                setPreviews(data[1])
            }else{
                setTemAviso(true)
                setTextoAviso("ocorreu um erro ao buscar as informações dos posts, perdão. Tente novamente mais tarde.")
            }
        })
    }, [])

    return  (
        <div className="px-[var(--paddingXGeralCel)] lg:px-[var(--paddingXGeral)] flex flex-col min-h-screen bg-roxoPrincipal gap-16">
            {
                previews.map(item => <PostPreview titulo={item.titulo} desc={item.texto} data={item.data_postagem} id={item.id} img={item.img}/>)
            }
            {
                temAviso &&
                <ModalAviso/>
            }
        </div>
    )
}