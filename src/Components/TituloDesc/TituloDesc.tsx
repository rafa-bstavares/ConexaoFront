
type Props = {
    titulo: string,
    desc: string
}

export default function TituloDesc({titulo, desc}: Props){
    return (
        <div className="flex flex-col items-center gap-4 mb-6">
            <div className="lg:text-6xl text-4xl text-douradoPrincipal text-center">{titulo}</div>
            <div className="lg:text-3xl text-lg text-white text-center" >{desc}</div>
        </div>
    )
}