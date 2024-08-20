import { Dispatch, SetStateAction } from "react"


type Props = {
    deletarFn: (idItem: number) => void,
    idItem: number,
    setQueroDeletar: Dispatch<SetStateAction<boolean>>
}

export default function ModalDeletarCarta({deletarFn, idItem, setQueroDeletar}: Props){

    return (
        <div className="fixed top-0 left-0 h-screen w-screen bg-black/80 flex flex-col justify-center items-center gap-10 z-50 p-2">
            <div className="text-xl text-white">Tem certeza que deseja deletar esse baralho?</div>
            <div className="flex gap-2">
                <button className="px-4 py-2 rounded-md bg-white text-black" onClick={() => deletarFn(idItem)}>Sim</button>
                <button className="px-4 py-2 rounded-md bg-white text-black" onClick={() => setQueroDeletar(false)}>Voltar</button>
            </div>
        </div>
    )
}