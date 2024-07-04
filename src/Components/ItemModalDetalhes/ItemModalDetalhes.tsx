import { useEffect, useState } from "react"


type Props = {
    nome: string,
    valor: string,
    inicio: Date,
    final: Date,
    idHistorico: number,
    nomeProfissional: string
}

export default function ItemModalDetalhes({nome, valor, inicio, final, idHistorico, nomeProfissional}: Props){
    const [historico, setHistorico] = useState<string[]>([""])
    const [mostrarHistorico, setMostrarHistorico] = useState<boolean>(false)
    const [inicioTela, setInicioTela] = useState<Date>(new Date(inicio))
    const [finalTela, setFinalTela] = useState<Date>(new Date(final))


    
    useEffect(() => {
        if(mostrarHistorico){
            fetch("http://localhost:8080/pegarHistorico", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    idHistorico
                })
            }).then(res => res.json()).then(data => {
                if(data[0] == "sucesso"){
                    setHistorico(data[1].split("||n||"))
                }else{
                    setMostrarHistorico(false)
                }
            }).catch(() => {
                setMostrarHistorico(false)
            })
        }
    }, [mostrarHistorico])
    
    return (
        <div className="px-8 py-4 rounded-md bg-black text-white flex flex-col gap-4">
                                <div className="flex items-center gap-6">
                                    <div>
                                        Nome: {nome}
                                    </div>
                                    <div>
                                        Valor: {valor}
                                    </div>
                                    <div>
                                        momento de início: {inicioTela.toLocaleString("pt-br")}
                                    </div>
                                    <div>
                                        momento do final: {finalTela.toLocaleString("pt-br")}
                                    </div>
                                    <div onClick={() => setMostrarHistorico(!mostrarHistorico)} className=" p-2 bg-gray-500 rounded-md cursor-pointer">
                                        {mostrarHistorico? "Esconder histórico": "Mostrar histórico"}
                                    </div>
                                </div>
                                {
                                    mostrarHistorico && 
                                        <div className='p-4 overflow-y-scroll overflow-x-hidden bg-white rounded-md h-96 text-black flex flex-col gap-4'>
                                            {historico.map(item => {
                                            if(item.slice(0, 5) == "[img]"){
                                                let arrImg:string[] = []
                                                if(item.split("[img]").length > 0 && item.split("[img]")[0] == ""){
                                                arrImg = item.split("[img]")
                                                arrImg.shift()
                                                }
                                                return <div className='grid grid-cols-3'>{arrImg.map(elem => <img src={elem} className='w-32 h-auto' />)}</div>
                                            }else{
                                                if(item.slice(0, 3) == "|U|"){
                                                return (<div className='flex gap-2'>
                                                            <div className='self-start p-2 text-sm bg-roxoSecundario rounded-md text-white'>
                                                                {nome}
                                                            </div>  
                                                            <div className="whitespace-pre-wrap text-black">
                                                            {item.slice(3)}
                                                            </div>
                                                        </div>)
                                                }else if(item.slice(0, 3) == "|P|"){
                                                return (
                                                    <div className='flex gap-2'>
                                                        <div className='self-start p-2 text-sm bg-roxoPrincipal rounded-md text-white'>
                                                            {nomeProfissional}
                                                        </div>  
                                                        <div className="whitespace-pre-wrap text-black">
                                                            {item.slice(3)}
                                                        </div>
                                                    </div>
                                                )
                                                }

                                                return <div className='text-black'>{item}</div>
                                            }

                                            })}
                                    </div>
                                    
                                }
                            </div>
    )
}