import { createContext, useState, Dispatch, SetStateAction } from "react";


type TipoProfissionais = {
    foto: string,
    nome: string,
    descricaoMenor: string,
    descricaoMaior: string,
    id: number,
    email: string,
    status: string,
    valorMin: number,
    totalArrecadado: number,
    percentualPro: number
}

type TipoProfEditar = {
    foto: string,
    nome: string,
    descricaoMenor: string,
    descricaoMaior: string,
    email: string,
    valorMin: number,
    id: number
}

type TipoObjDetalhe = {
    nomeCliente: string,
    precoConsulta: number,
    inicio: Date,
    fim: Date,
    idHistorico: number,
    nomeProfissional: string
}

type TipoObjHistorico = {
    historico: string,
    id_cliente: number,
    nomeCliente: string,
    data: Date
}



type TiposContextoProfissionais = {   
    setProfissionais: Dispatch<SetStateAction<TipoProfissionais[]>>,
    profissionais: TipoProfissionais[],
    setProfEditar: Dispatch<SetStateAction<TipoProfEditar>>,
    profEditar: TipoProfEditar,
    setIdProfissionalApagar: Dispatch<SetStateAction<number>>,
    idProfissionalApagar: number,
    setPerfilProAtual: Dispatch<SetStateAction<TipoProfissionais>>,
    perfilProAtual: TipoProfissionais,
    detalhesProAdm: TipoObjDetalhe[],
    setDetalhesProAdm: Dispatch<SetStateAction<TipoObjDetalhe[]>>,
    abrirModalDetalhes: boolean,
    setAbrirModalDetalhes: Dispatch<SetStateAction<boolean>>,
    abrirModalCertezaApagar: boolean,
    setAbrirModalCertezaApagar: Dispatch<SetStateAction<boolean>>,
    abrirModalHistorico: boolean,
    setAbrirModalHistorico: Dispatch<SetStateAction<boolean>>,
    arrHistoricosAtendente: TipoObjHistorico[],
    setArrHistoricosAtendente: Dispatch<SetStateAction<TipoObjHistorico[]>>,
    nomeProModTempo: string,
    setNomeProModTempo: Dispatch<SetStateAction<string>>,
    abrirModalEditar: boolean,
    setAbrirModalEditar: Dispatch<SetStateAction<boolean>>,
    idProfissionalDetalhes: number,
    setIdProfissionalDetalhes: Dispatch<SetStateAction<number>>
}

export const ContextoProfissionais = createContext<TiposContextoProfissionais>({
    setProfissionais: () => {},
    profissionais: [{foto: "", nome: "", email: "", descricaoMenor: "", descricaoMaior: "", id: 0, status: "", valorMin: 0, totalArrecadado: 0, percentualPro: 30}],
    idProfissionalApagar: 0,
    setIdProfissionalApagar: () => {},
    setProfEditar: () => {},
    profEditar: {foto: "", nome: "", email: "", descricaoMenor: "", descricaoMaior: "",  valorMin: 0, id: 0},
    setPerfilProAtual: () => {},
    perfilProAtual: {foto: "", nome: "", email: "", descricaoMaior: "", descricaoMenor: "", id: 0, status: "", valorMin: 0, totalArrecadado: 0, percentualPro: 30},
    detalhesProAdm: [{nomeCliente: "", precoConsulta: 0, inicio: new Date(), fim: new Date(), idHistorico: 0, nomeProfissional: "" }],
    setDetalhesProAdm: () => {},
    abrirModalDetalhes: false,
    setAbrirModalDetalhes: () => {},
    abrirModalCertezaApagar: false,
    setAbrirModalCertezaApagar: () => {},
    abrirModalHistorico: false,
    setAbrirModalHistorico: () => {},
    arrHistoricosAtendente: [{historico: "", id_cliente: 0, nomeCliente: "", data: new Date()}],
    setArrHistoricosAtendente: () => {},
    nomeProModTempo: "",
    setNomeProModTempo: () => {},
    abrirModalEditar: false,
    setAbrirModalEditar: () => {},
    idProfissionalDetalhes: 0,
    setIdProfissionalDetalhes: () => {}
} as TiposContextoProfissionais)


export const ProfissionaisProvider = ({children}: {children: React.ReactNode}) => {

    const [profissionais, setProfissionais] = useState<TipoProfissionais[]>([{foto: "", nome: "", email: "", descricaoMenor: "", descricaoMaior: "", id: 0, status: "", valorMin: 0, totalArrecadado: 0, percentualPro: 30}])
    const [perfilProAtual, setPerfilProAtual] = useState<TipoProfissionais>({foto: "", nome: "", email: "", descricaoMaior: "", descricaoMenor: "", id: 0, status: "", valorMin: 0, totalArrecadado: 0, percentualPro: 30})
    const [detalhesProAdm, setDetalhesProAdm] = useState<TipoObjDetalhe[]>([{nomeCliente: "", precoConsulta: 0, inicio: new Date(), fim: new Date(), idHistorico: 0, nomeProfissional: "" }])
    const [abrirModalDetalhes, setAbrirModalDetalhes] = useState<boolean>(false)
    const [profEditar, setProfEditar] = useState<TipoProfEditar>({foto: "", nome: "", email: "", descricaoMenor: "", descricaoMaior: "", valorMin: 0, id: 0})
    const [abrirModalCertezaApagar, setAbrirModalCertezaApagar] = useState<boolean>(false)
    const [abrirModalHistorico, setAbrirModalHistorico] = useState<boolean>(false)
    const [arrHistoricosAtendente, setArrHistoricosAtendente] = useState<TipoObjHistorico[]>([{historico: "", id_cliente: 0, nomeCliente: "", data: new Date()}])
    const [idProfissionalApagar, setIdProfissionalApagar] = useState<number>(0)
    const [idProfissionalDetalhes, setIdProfissionalDetalhes] = useState<number>(0)
    const [nomeProModTempo, setNomeProModTempo] = useState<string>("")
    const [abrirModalEditar, setAbrirModalEditar] = useState<boolean>(false)



    return (
        <ContextoProfissionais.Provider value={{
            profissionais,
            setProfissionais,
            profEditar,
            setProfEditar,
            setPerfilProAtual,
            perfilProAtual,
            detalhesProAdm,
            setDetalhesProAdm,
            abrirModalDetalhes,
            setAbrirModalDetalhes,
            abrirModalCertezaApagar,
            setAbrirModalCertezaApagar,
            abrirModalHistorico,
            setAbrirModalHistorico,
            arrHistoricosAtendente,
            setArrHistoricosAtendente,
            idProfissionalApagar,
            setIdProfissionalApagar,
            nomeProModTempo,
            setNomeProModTempo,
            abrirModalEditar,
            setAbrirModalEditar,
            idProfissionalDetalhes,
            setIdProfissionalDetalhes
        }}>
            {children}
        </ContextoProfissionais.Provider>
    )
}