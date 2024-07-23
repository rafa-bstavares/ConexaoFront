import { useContext } from "react"
import { ContextoBlog } from "../../Contexts/ContextoBlog/ContextoBlog"
import { useNavigate } from "react-router-dom"

type Props  =  {
    img: string,
    titulo: string,
    desc: string
    data: Date,
    id: number
}

export default function PostPreview({img, titulo, desc, data, id}: Props){

    const {setImgBlog, setTituloBlog} = useContext(ContextoBlog)

    const navigate = useNavigate()

    function queroPost(){
        setImgBlog(img)
        setTituloBlog(titulo)
        navigate(`Blog/pedirPost/${id}`)
    }

    return(
        <div className="flex gap-4 text-white cursor-pointer" onClick={queroPost}>
            {
                img && 
                <div className="w-1/4 rounded-md overflow-hidden">
                    <img className="w-full h-auto object-cover  " src={img} alt="imagem post" />
                </div>
            }
            <div className="flex flex-col gap-4">
                <div>
                    Post por Conexão / {new Date(data).toLocaleString("pt-br")} 
                </div>
                <div className="font-bold text-3xl w-1/2">
                    {titulo}
                </div>
                <div className="text-xl">
                    {desc}
                </div>
                <div>Leia mais</div>
            </div>
        </div>
    )
}