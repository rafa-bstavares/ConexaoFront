import { useEffect, useState } from "react"



export default function AdmBlog(){

    const [imgPost, setImgPost] = useState<File>()
    const [titulo, setTitulo] = useState<string>("")
    const [desc, setDesc] = useState<string>("")

    useEffect(() => {
        fetch("api.conexaoastralmistica.com.br/").then(res => res.json()).then(data => console.log(data)).catch(() => console.log("deu algo errado no fetch"))
    }, [])

    function postarFn(){
        let formData = new FormData()
        if(imgPost){
            formData.append("imgPost", imgPost)
        }
        formData.append("titulo", titulo)
        formData.append("desc", desc)
        fetch("api.conexaoastralmistica.com.br/postarBlog", {
            method: "POST",
            body: formData
        }).then(res => res.json()).then(data => console.log(data)).catch(() => console.log("deu algo errado no fetch"))
    }
    
    return(
        <div className="flex flex-col gap-5 p-10">
                <div>Escolha a imagem no botão abaixo:</div>
                <input type="file" onChange={(e) => {if(e.target.files){setImgPost(e.target.files[0])}}}  className=""/> {/* e.target.files[0].name */}
                <input placeholder="digite o título..." maxLength={200} type="text" className="w-1/3  px-4 py-2 outline-none text-black" onChange={(e) => setTitulo(e.target.value)}/>
                <div className="relative w-1/3">
                    <textarea placeholder="digite o texto..." maxLength={5000} className="w-full min-h-[70vh] px-4 py-2 outline-none text-black" onChange={(e) => setDesc(e.target.value)}/>
                    <div className="absolute bottom-2 right-2 text-gray-500">
                        {desc.length}/5000
                    </div>
                </div>
                
                <button className="self-start px-4 py-2 rounded-md bg-white text-black" onClick={postarFn}>Postar</button>
            </div>
    )
}