import { createContext, useState, Dispatch, SetStateAction } from "react";

type TipoUsuario = {
    id: number,
    nome: string,
    email: string,
    saldo: number,
    dataNas: string
}

type UsuarioAdm = {
    id: number,
    nome: string,
    email: string,
    saldo: number,
}

type TiposContextoUsuario = {   
    setUsuario: Dispatch<SetStateAction<TipoUsuario>>,
    setArrUsuarios: Dispatch<SetStateAction<UsuarioAdm[]>>,
    usuario: TipoUsuario,
    arrUsuarios: UsuarioAdm[],
    salaAtual: number,
    setSalaAtual: Dispatch<SetStateAction<number>>,
    idMeuAtendente: number,
    setIdMeuAtendente: Dispatch<SetStateAction<number>>,
    precoTotalConsulta: number,
    setPrecoTotalConsulta: Dispatch<SetStateAction<number>>,
    tempoConsulta: number,
    setTempoConsulta: Dispatch<SetStateAction<number>>,
    loading: boolean,
    setLoading: Dispatch<SetStateAction<boolean>>
}

export const ContextoUsuario = createContext<TiposContextoUsuario>({
    setUsuario: () => {},
    setArrUsuarios: () => {},
    usuario: {id: 0, nome: "", email: "", saldo: 0, dataNas: ""},
    arrUsuarios: [{id: 0, nome: "", email: "", saldo: 0}],
    salaAtual: 0,
    setSalaAtual: () => {},
    idMeuAtendente: 0,
    setIdMeuAtendente: () => {},
    precoTotalConsulta: 0,
    setPrecoTotalConsulta: () => {},
    tempoConsulta: 0,
    setTempoConsulta: () => {},
    loading: false,
    setLoading: () => {}
} as TiposContextoUsuario)


export const UsuarioProvider = ({children}: {children: React.ReactNode}) => {

    const [usuario, setUsuario] = useState<TipoUsuario>({id: 0, nome: "", email: "", saldo: 0, dataNas: ""})
    const [arrUsuarios, setArrUsuarios] = useState<UsuarioAdm[]>([{id: 0, nome: "", email: "", saldo: 0}])
    const [salaAtual, setSalaAtual] = useState<number>(0)
    const [idMeuAtendente, setIdMeuAtendente] = useState<number>(0)
    const [precoTotalConsulta, setPrecoTotalConsulta] = useState<number>(0)
    const [tempoConsulta, setTempoConsulta] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)



    return (
        <ContextoUsuario.Provider value={{
            usuario,
            arrUsuarios,
            setUsuario,
            setArrUsuarios,
            salaAtual,
            setSalaAtual,
            idMeuAtendente,
            setIdMeuAtendente,
            precoTotalConsulta,
            setPrecoTotalConsulta,
            tempoConsulta,
            setTempoConsulta,
            loading,
            setLoading
        }}>
            {children}
        </ContextoUsuario.Provider>
    )
}