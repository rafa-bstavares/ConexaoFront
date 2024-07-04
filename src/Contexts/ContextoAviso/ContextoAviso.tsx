import { createContext, useState, Dispatch, SetStateAction } from "react";

type TiposContextoAviso = {   
    setTemAviso: Dispatch<SetStateAction<boolean>>,
    temAviso: boolean,
    textoAviso: string,
    setTextoAviso: Dispatch<SetStateAction<string>>,
    setAbrirModalTempo: Dispatch<SetStateAction<boolean>>,
    setAbrirModalRecarregar: Dispatch<SetStateAction<boolean>>,
    abrirModalTempo: boolean,
    abrirModalRecarregar: boolean,
    valorMinModal: number,
    setValorMinModal: Dispatch<SetStateAction<number>>,
}

export const ContextoAviso = createContext<TiposContextoAviso>({
    setTemAviso: () => {},
    temAviso: false,
    setAbrirModalTempo: () => {},
    setAbrirModalRecarregar: () => {},
    abrirModalTempo: false,
    abrirModalRecarregar: false,
    textoAviso: "",
    setTextoAviso: () => {},
    setValorMinModal: () => {},
    valorMinModal: 1
    
} as TiposContextoAviso)


export const AvisoProvider = ({children}: {children: React.ReactNode}) => {

    const [temAviso, setTemAviso] = useState<boolean>(false)
    const [abrirModalTempo, setAbrirModalTempo] = useState<boolean>(false)
    const [abrirModalRecarregar, setAbrirModalRecarregar] = useState<boolean>(false)
    const [textoAviso, setTextoAviso] = useState<string>("")
    const [valorMinModal, setValorMinModal] = useState<number>(1)



    return (
        <ContextoAviso.Provider value={{
            temAviso,
            setTemAviso,
            textoAviso,
            setTextoAviso,
            abrirModalTempo,
            abrirModalRecarregar,
            setAbrirModalTempo,
            setAbrirModalRecarregar,
            valorMinModal,
            setValorMinModal
        }}>
            {children}
        </ContextoAviso.Provider>
    )
}