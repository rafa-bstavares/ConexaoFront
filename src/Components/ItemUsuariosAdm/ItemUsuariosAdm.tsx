import { Dispatch, SetStateAction, useState } from "react"
import Botao from "../Botao/Botao"

type Props = {
    id: number,
    email: string, 
    nome: string,
    saldo: number,
    abrirModalCertezaFn: Dispatch<SetStateAction<boolean>>,
    idAtualFn: Dispatch<SetStateAction<number>>,
    saldoAtualFn: Dispatch<SetStateAction<number>>
}

export default function ItemUsuariosAdm({id, email, nome, saldo, abrirModalCertezaFn, idAtualFn, saldoAtualFn}: Props){
    const [novoSaldo, setNovoSaldo] = useState<number>(saldo)


    function certezaFn(){
        saldoAtualFn(novoSaldo)
        idAtualFn(id)
        abrirModalCertezaFn(true)
    }

    return (
        <div className="px-20 py-10 flex items-center gap-8 rounded-md bg-black">
            <div>Nome: {nome}</div>
            <div>Email: {email}</div>
            <div>Saldo Atual: {saldo}</div>
            <div className="flex gap-2 items-center">
                <label htmlFor="novoSaldo">Valor novo saldo:</label>
                <input className="text-black px-1 py-2" type="number" min={0} onChange={e => setNovoSaldo(Number(e.target.value))}/>
            </div>
            <Botao onClickFn={certezaFn} texto="Definir novo saldo"/> 
        </div>
    )
}