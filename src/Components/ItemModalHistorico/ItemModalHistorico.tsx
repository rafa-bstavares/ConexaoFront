import { useState } from "react"

type Props = {
    historico: string,
    nomeCliente: string,
    data: Date,
    nomeAtendente: string
}


export default function ItemModalHistorico({historico, nomeCliente, data, nomeAtendente}:  Props){
    const [mostrarHistorico, setMostrarHistorico] = useState<boolean>(false)



    return (
        <div className="px-8 py-4 rounded-md bg-black text-white flex flex-col gap-4">
                                <div className="flex items-center gap-6">
                                    <div>
                                        Nome: {nomeCliente}
                                    </div>
                                    <div>
                                        data: {new Date(data).toLocaleString("pt-br")}
                                    </div>
                                    <div onClick={() => setMostrarHistorico(!mostrarHistorico)} className=" p-2 bg-gray-500 rounded-md cursor-pointer">
                                        {mostrarHistorico? "Esconder histórico": "Mostrar histórico"}
                                    </div>
                                </div>
                                {
                                    mostrarHistorico && 
                                        <div className='p-4 overflow-y-scroll overflow-x-hidden bg-white rounded-md h-96 text-black flex flex-col gap-4'>
                                            {historico.split("||n||").map(item => {
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
                                                                {nomeCliente}
                                                            </div>  
                                                            <div className="whitespace-pre-wrap text-black">
                                                            {item.slice(3)}
                                                            </div>
                                                        </div>)
                                                }else if(item.slice(0, 3) == "|P|"){
                                                return (
                                                    <div className='flex gap-2'>
                                                        <div className='self-start p-2 text-sm bg-roxoPrincipal rounded-md text-white'>
                                                            {nomeAtendente}
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