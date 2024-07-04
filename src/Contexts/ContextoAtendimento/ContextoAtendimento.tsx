import { createContext, useState, Dispatch, SetStateAction } from "react";


type TipoInfoSala = {
    idSala: number,
    id_cliente: number,
    id_profissional: number,
    nome: string,
    tempoConsulta: number,
    precoConsulta: number
  }

type TiposContextoAtendimento = {   
    setInfoSalas: Dispatch<SetStateAction<TipoInfoSala[]>>,
    infoSalas: TipoInfoSala[]
}

export const ContextoAtendimento = createContext<TiposContextoAtendimento>({
    setInfoSalas: () => {},
    infoSalas: []
} as TiposContextoAtendimento)


export const AtendimentoProvider = ({children}: {children: React.ReactNode}) => {

    const [infoSalas, setInfoSalas] = useState<TipoInfoSala[]>([])



    return (
        <ContextoAtendimento.Provider value={{
            infoSalas,
            setInfoSalas
        }}>
            {children}
        </ContextoAtendimento.Provider>
    )
}