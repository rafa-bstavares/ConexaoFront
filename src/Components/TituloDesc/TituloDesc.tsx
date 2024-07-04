
type Props = {
    titulo: string,
    desc: string
}

export default function TituloDesc({titulo, desc}: Props){
    return (
        <div className="flex flex-col items-center gap-4 mb-6">
            <div className="text-6xl text-douradoPrincipal text-center">{titulo}</div>
            <div className="text-3xl text-white text-center" >{desc}</div>
        </div>
    )
}