import { createContext, useState, Dispatch, SetStateAction } from "react";

type TiposContextoPagamento = {   
    setAbrirModalPagamento: Dispatch<SetStateAction<boolean>>,
    abrirModalPagamento: boolean,
    setTemQrCode: Dispatch<SetStateAction<boolean>>,
    temQrCode: boolean,
    idUltimoPix: number,
    setIdUltimoPix: Dispatch<SetStateAction<number>>,
    ultimoQrCode: string,
    setUltimoQrCode: Dispatch<SetStateAction<string>>
}

export const ContextoPagamento = createContext<TiposContextoPagamento>({
    setAbrirModalPagamento: () => {},
    abrirModalPagamento: false,
    setTemQrCode: () => {},
    temQrCode: false,
    idUltimoPix: 0,
    ultimoQrCode: "",
    setUltimoQrCode: () => {},
    setIdUltimoPix: () => {}
} as TiposContextoPagamento)


export const PagamentoProvider = ({children}: {children: React.ReactNode}) => {
    const [abrirModalPagamento, setAbrirModalPagamento] = useState<boolean>(false)
    const [temQrCode, setTemQrCode] = useState<boolean>(false)
    const [idUltimoPix, setIdUltimoPix] = useState<number>(0)
    const [ultimoQrCode, setUltimoQrCode] = useState<string>("")



    return (
        <ContextoPagamento.Provider value={{
            setAbrirModalPagamento,
            abrirModalPagamento,
            idUltimoPix,
            setIdUltimoPix,
            ultimoQrCode,
            setUltimoQrCode,
            setTemQrCode,
            temQrCode
        }}>
            {children}
        </ContextoPagamento.Provider>
    )
}