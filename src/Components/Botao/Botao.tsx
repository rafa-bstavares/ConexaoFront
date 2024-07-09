
type Props = {
    texto: string,
    onClickFn: () => void
}


export default function Botao({texto, onClickFn}: Props){
    return (
        <button onClick={onClickFn} className="bg-white rounded-full lg:px-6 px-3 py-3 self-center text-roxoPrincipal font-bold ">{texto}</button>
    )
}