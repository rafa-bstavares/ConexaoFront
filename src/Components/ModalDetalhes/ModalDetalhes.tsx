import { useContext, useEffect, useState } from "react"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"
import Botao from "../Botao/Botao"
import ItemModalDetalhes from "../ItemModalDetalhes/ItemModalDetalhes"
import seta from "../../assets/images/setaSeletor.svg"
import xis from "../../assets/images/xisFechar.svg"




export default function ModalDetalhes(){

    const {detalhesProAdm, setAbrirModalDetalhes, idProfissionalDetalhes} = useContext(ContextoProfissionais)

    type ObjChatPalavra =  {temPalavra: boolean, idConversa: number, arrIdxPalavras: number[], historico: string, nomeCliente: string, nomeProfissional: string}


    const [frase, setFrase] = useState<string>("")
    const [finalPesquisa, setFinalPesquisa] = useState<boolean>(false)
    const [conversaAtual, setConversaAtual] = useState<number>(0)
    const [chatsPalavras, setChatsPalavras] = useState<ObjChatPalavra[]>([])



    useEffect(() => {
        console.log(detalhesProAdm)
    }, [])


    function pesquisarFrase(){
        if(frase){
            fetch("https://api.conexaoastralmistica.com.br/conversasFrase", {
                method: "POST",
                headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
                body: JSON.stringify({
                    frase,
                    id: idProfissionalDetalhes
                })
            }).then(res => res.json()).then(data => {
                console.log("ta voltando pelo menos")
                console.log(data)
                if(data[0] == "sucesso"){
                    console.log("AQUIIIIIII")
                    console.log(data[1])
                    setChatsPalavras(data[1])
                    setFinalPesquisa(true)
                }
            })
        }else{
            
        }
    }


    
    function proximaConversaFn(){
        if((conversaAtual + 1) < chatsPalavras.length){
            setConversaAtual(conversaAtual + 1)
        }
    }

    function conversaAnteriorFn(){
        if((conversaAtual + 1) > 1){
            setConversaAtual(conversaAtual - 1)
        }
    }



    return (
        <div className="  bg-roxoPrincipal flex items-center justify-center relative">
            <div className="h-full bg-roxoPrincipal rounded-xl flex flex-col px-12 py-8 gap-4 justify-center items-center">
        
                {
                    detalhesProAdm.length > 0 ?
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-3xl text-center">Pesquisar palavra:</div>
                        <input type="text" className="text-black px-2 py-1 rounded-mdb" onChange={(e) => setFrase(e.target.value)} />
                        <button onClick={pesquisarFrase} className="rounded-md p-2 bg-gray-800 text-white mb-10">Pesquisar</button>
                        {
                            detalhesProAdm.map(item => (
                                <ItemModalDetalhes nomeProfissional={item.nomeProfissional} nome={item.nomeCliente} valor={(item.precoConsulta * 0.3).toFixed(2)} inicio={item.inicio} final={item.fim} idHistorico={item.idHistorico} />
                            ))
                        }
                    </div>
                    :
                        <div className="text-xl text-white text-center">
                            Não foram detectadas atividades desse profissional
                        </div>
                }
                <div className="flex justify-center"> 
                    <Botao texto="voltar" onClickFn={() => setAbrirModalDetalhes(false)} />
                </div>
            </div>
            {
                finalPesquisa &&
                <div className="absolute h-screen w-screen top-0 left-0 bg-black/80 p-4">
                    <div className="h-[90%] flex flex-col gap-4 justify-center items-center">
                    <div className="w-[90%] flex justify-end">
                        <img src={xis} alt="fechar" onClick={() => setFinalPesquisa(false)} className="w-12 h-auto cursor-pointer"/>
                    </div>
                        {
                            chatsPalavras.length > 0?
                            <div>
                            <div className='p-4 overflow-y-scroll overflow-x-hidden bg-white rounded-md h-[60vh] text-black flex flex-col gap-4 w-[90vw]'>
                                    {chatsPalavras[conversaAtual].historico.split("||n||").map((item) => {
                                    if(item.slice(0, 5) == "[img]"){
                                        let arrImg:string[] = []
                                        if(item.split("[img]").length > 0 && item.split("[img]")[0] == ""){
                                        arrImg = item.split("[img]")
                                        arrImg.shift()
                                        }
                                        return <div className='grid grid-cols-3'>{arrImg.map(elem => <img src={elem} className='w-32 h-auto' />)}</div>
                                    }else{
                                        if(item.slice(0, 3) == "|U|"){
                                        return (<div  className='flex gap-2'>
                                                    <div className='self-start p-2 text-sm bg-roxoSecundario rounded-md text-white'>
                                                        {chatsPalavras[conversaAtual].nomeCliente}
                                                    </div>  
                                                    <div className="whitespace-pre-wrap text-black">
                                                    {item.slice(3)}
                                                    </div>
                                                </div>)
                                        }else if(item.slice(0, 3) == "|P|"){
                                        return (
                                            <div  className='flex gap-2'>
                                                <div className='self-start p-2 text-sm bg-roxoPrincipal rounded-md text-white'>
                                                    {chatsPalavras[conversaAtual].nomeProfissional}
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
                        </div>
                        :
                        <div className="w-full h-full flex justify-center items-center">
                            Palavra não encontrada
                        </div>
                        }
                        <div className="flex w-full justify-center gap-2 items-center">
                            <div>
                                <img src={seta} onClick={conversaAnteriorFn} className="w-10 h-auto rotate-90 cursor-pointer" alt="seta trás" />
                            </div>
                            <div>
                                {conversaAtual + 1}/{chatsPalavras.length}
                            </div>
                            <div>
                                <img src={seta} onClick={proximaConversaFn} className="w-10 h-auto -rotate-90 cursor-pointer" alt="seta frente" />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}