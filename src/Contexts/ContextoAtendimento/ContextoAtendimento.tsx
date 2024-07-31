import { createContext, useState, Dispatch, SetStateAction } from "react";


type TipoInfoSala = {
    idSala: number,
    id_cliente: number,
    id_profissional: number,
    nome: string,
    tempoConsulta: number,
    precoConsulta: number,
    saldo: number,
    dataNas: string,
    finalConsulta: Date,
    minutosPassados: number
  }

type TiposContextoAtendimento = {   
    setInfoSalas: Dispatch<SetStateAction<TipoInfoSala[]>>,
    infoSalas: TipoInfoSala[],
    abrirModalChamandoAtendente: boolean,
    setAbrirModalChamandoAtendente: Dispatch<SetStateAction<boolean>>
}

export const ContextoAtendimento = createContext<TiposContextoAtendimento>({
    setInfoSalas: () => {},
    infoSalas: [],
    abrirModalChamandoAtendente: false,
    setAbrirModalChamandoAtendente: () => {}
} as TiposContextoAtendimento)


export const AtendimentoProvider = ({children}: {children: React.ReactNode}) => {

    const [infoSalas, setInfoSalas] = useState<TipoInfoSala[]>([])
    const [abrirModalChamandoAtendente, setAbrirModalChamandoAtendente] = useState<boolean>(false)



    return (
        <ContextoAtendimento.Provider value={{
            infoSalas,
            setInfoSalas,
            abrirModalChamandoAtendente,
            setAbrirModalChamandoAtendente
        }}>
            {children}
        </ContextoAtendimento.Provider>
    )
}