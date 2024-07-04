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
    totalArrecadado: number
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
    setPerfilProAtual: Dispatch<SetStateAction<TipoProfissionais>>,
    perfilProAtual: TipoProfissionais,
    detalhesProAdm: TipoObjDetalhe[],
    setDetalhesProAdm: Dispatch<SetStateAction<TipoObjDetalhe[]>>,
    abrirModalDetalhes: boolean,
    setAbrirModalDetalhes: Dispatch<SetStateAction<boolean>>,
    abrirModalHistorico: boolean,
    setAbrirModalHistorico: Dispatch<SetStateAction<boolean>>,
    arrHistoricosAtendente: TipoObjHistorico[],
    setArrHistoricosAtendente: Dispatch<SetStateAction<TipoObjHistorico[]>>
}

export const ContextoProfissionais = createContext<TiposContextoProfissionais>({
    setProfissionais: () => {},
    profissionais: [{foto: "", nome: "", email: "", descricaoMenor: "", descricaoMaior: "", id: 0, status: "", valorMin: 0, totalArrecadado: 0}],
    setPerfilProAtual: () => {},
    perfilProAtual: {foto: "", nome: "", email: "", descricaoMaior: "", descricaoMenor: "", id: 0, status: "", valorMin: 0, totalArrecadado: 0},
    detalhesProAdm: [{nomeCliente: "", precoConsulta: 0, inicio: new Date(), fim: new Date(), idHistorico: 0, nomeProfissional: "" }],
    setDetalhesProAdm: () => {},
    abrirModalDetalhes: false,
    setAbrirModalDetalhes: () => {},
    abrirModalHistorico: false,
    setAbrirModalHistorico: () => {},
    arrHistoricosAtendente: [{historico: "", id_cliente: 0, nomeCliente: "", data: new Date()}],
    setArrHistoricosAtendente: () => {}
} as TiposContextoProfissionais)


export const ProfissionaisProvider = ({children}: {children: React.ReactNode}) => {

    const [profissionais, setProfissionais] = useState<TipoProfissionais[]>([{foto: "", nome: "", email: "", descricaoMenor: "", descricaoMaior: "", id: 0, status: "", valorMin: 0, totalArrecadado: 0}])
    const [perfilProAtual, setPerfilProAtual] = useState<TipoProfissionais>({foto: "", nome: "", email: "", descricaoMaior: "", descricaoMenor: "", id: 0, status: "", valorMin: 0, totalArrecadado: 0})
    const [detalhesProAdm, setDetalhesProAdm] = useState<TipoObjDetalhe[]>([{nomeCliente: "", precoConsulta: 0, inicio: new Date(), fim: new Date(), idHistorico: 0, nomeProfissional: "" }])
    const [abrirModalDetalhes, setAbrirModalDetalhes] = useState<boolean>(false)
    const [abrirModalHistorico, setAbrirModalHistorico] = useState<boolean>(false)
    const [arrHistoricosAtendente, setArrHistoricosAtendente] = useState<TipoObjHistorico[]>([{historico: "", id_cliente: 0, nomeCliente: "", data: new Date()}])



    return (
        <ContextoProfissionais.Provider value={{
            profissionais,
            setProfissionais,
            setPerfilProAtual,
            perfilProAtual,
            detalhesProAdm,
            setDetalhesProAdm,
            abrirModalDetalhes,
            setAbrirModalDetalhes,
            abrirModalHistorico,
            setAbrirModalHistorico,
            arrHistoricosAtendente,
            setArrHistoricosAtendente
        }}>
            {children}
        </ContextoProfissionais.Provider>
    )
}