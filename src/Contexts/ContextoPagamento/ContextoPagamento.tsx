import { createContext, useState, Dispatch, SetStateAction } from "react";

type TiposContextoPagamento = {   
    setAbrirModalPagamento: Dispatch<SetStateAction<boolean>>,
    setAbrirPagamentoDentroConsulta: Dispatch<SetStateAction<boolean>>,
    abrirPagamentoDentroConsulta: boolean,
    abrirModalPagamento: boolean,
    setAbrirModalCartao: Dispatch<SetStateAction<boolean>>,
    abrirModalCartao: boolean,
    setAbrirModalEscolher: Dispatch<SetStateAction<boolean>>,
    abrirModalEscolher: boolean,
    setTemQrCode: Dispatch<SetStateAction<boolean>>,
    temQrCode: boolean,
    idUltimoPix: number,
    setIdUltimoPix: Dispatch<SetStateAction<number>>,
    ultimoQrCode: string,
    setUltimoQrCode: Dispatch<SetStateAction<string>>,
    chaveQr: string,
    setChaveQr: Dispatch<SetStateAction<string>>,
}

export const ContextoPagamento = createContext<TiposContextoPagamento>({
    setAbrirModalPagamento: () => {},
    setAbrirPagamentoDentroConsulta: () => {},
    abrirPagamentoDentroConsulta: false,
    abrirModalPagamento: false,
    setAbrirModalCartao: () => {},
    abrirModalCartao: false,
    setAbrirModalEscolher: () => {},
    abrirModalEscolher: false,
    setTemQrCode: () => {},
    temQrCode: false,
    idUltimoPix: 0,
    ultimoQrCode: "",
    setUltimoQrCode: () => {},
    setIdUltimoPix: () => {},
    chaveQr: "",
    setChaveQr: () => {},
} as TiposContextoPagamento)


export const PagamentoProvider = ({children}: {children: React.ReactNode}) => {
    const [abrirModalPagamento, setAbrirModalPagamento] = useState<boolean>(false)
    const [abrirPagamentoDentroConsulta, setAbrirPagamentoDentroConsulta] = useState<boolean>(false)
    const [abrirModalCartao, setAbrirModalCartao] = useState<boolean>(false)
    const [abrirModalEscolher, setAbrirModalEscolher] = useState<boolean>(false)
    const [temQrCode, setTemQrCode] = useState<boolean>(false)
    const [idUltimoPix, setIdUltimoPix] = useState<number>(0)
    const [ultimoQrCode, setUltimoQrCode] = useState<string>("")
    const [chaveQr, setChaveQr] = useState<string>("")



    return (
        <ContextoPagamento.Provider value={{
            setAbrirModalPagamento,
            setAbrirPagamentoDentroConsulta,
            abrirPagamentoDentroConsulta,
            abrirModalPagamento,
            setAbrirModalCartao,
            abrirModalCartao,
            setAbrirModalEscolher,
            abrirModalEscolher,
            idUltimoPix,
            setIdUltimoPix,
            ultimoQrCode,
            setUltimoQrCode,
            setTemQrCode,
            temQrCode,
            chaveQr,
            setChaveQr,
        }}>
            {children}
        </ContextoPagamento.Provider>
    )
}