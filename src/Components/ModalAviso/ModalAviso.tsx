import { Dispatch, SetStateAction, useContext } from "react"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"

type Props =  {
}

export default function ModalAviso(){


    const {setTemAviso, textoAviso} = useContext(ContextoAviso)

    function okClique(){
        setTemAviso(false)
    }

    return(
        <div className="fixed top-0 left-0 h-screen w-screen bg-black/80 flex flex-col justify-center items-center gap-10 z-50">
            <div className="text-xl text-white">{textoAviso}</div>
            <button className="px-4 py-2 rounded-md bg-white text-black" onClick={okClique}>OK</button>
        </div>
    )
}