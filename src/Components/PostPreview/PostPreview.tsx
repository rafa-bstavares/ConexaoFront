
type Props  =  {
    img: string,
    titulo: string,
    desc: string
    data: string,
    id: number
}

export default function PostPreview({img, titulo, desc, data, id}: Props){
    return(
        <div className="flex gap-4 text-white">
            {
                img && 
                <div className="w-1/4 rounded-md overflow-hidden">
                    <img className="w-full h-auto object-cover  " src={img} alt="imagem post" />
                </div>
            }
            <div className="flex flex-col gap-4">
                <div>
                    Post por Conexão / {data} 
                </div>
                <div className="font-bold text-3xl w-1/2">
                    {titulo}
                </div>
                <div className="text-xl">
                    {desc}
                </div>
                <a href={`urlbase/pedirPost/${id}`}>Leia mais</a>
            </div>
        </div>
    )
}