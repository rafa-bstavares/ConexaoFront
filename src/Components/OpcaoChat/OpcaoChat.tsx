import { Dispatch, SetStateAction, useEffect, useState } from "react"

type Props = {
    nomeCliente: string,
    primeiro: boolean,
    ultimoClicadoFn: Dispatch<SetStateAction<number>>,
    setSalaAdm: Dispatch<SetStateAction<number>>,
    ultimoClicado: number,
    index: number,
    salaOpcao: number
}

export default function OpcaoChat({nomeCliente, primeiro, ultimoClicadoFn, setSalaAdm, ultimoClicado, index, salaOpcao}: Props){
    const [roxo, setRoxo] = useState<boolean>(primeiro)

    function aoClicar(){
        ultimoClicadoFn(index)
        setSalaAdm(salaOpcao)
    }


    useEffect(() => {
        if(roxo){
            if(ultimoClicado !== index){
                setRoxo(!roxo)
            }
        }else{
            if(ultimoClicado == index){
                setRoxo(!roxo)
            }
        }
    }, [ultimoClicado])

    return (
        <div onClick={aoClicar} className={`rounded-l-md px-8 py-4 flex justify-center items-center ${roxo ? "bg-roxoSecundario" : "bg-white"} ${roxo ? "text-white" : "text-black"} cursor-pointer transition-colors`}>{nomeCliente}</div>
    )
}