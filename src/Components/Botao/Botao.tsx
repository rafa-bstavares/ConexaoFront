
type Props = {
    texto: string,
    onClickFn: () => void
}


export default function Botao({texto, onClickFn}: Props){
    return (
        <button onClick={onClickFn} className="bg-white rounded-full px-6 py-3 self-center text-roxoPrincipal font-bold">{texto}</button>
    )
}