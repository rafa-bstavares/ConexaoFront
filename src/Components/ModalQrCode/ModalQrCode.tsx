import { useContext, useState } from "react"
import { ContextoPagamento } from "../../Contexts/ContextoPagamento/ContextoPagamento"
import Botao from "../Botao/Botao"
import xisFechar from "../../assets/images/xisFechar.svg"



export default function ModalQrCode(){

    const {ultimoQrCode, chaveQr, setTemQrCode} = useContext(ContextoPagamento)
    const [respostaStatus, setRespostaStatus] = useState<string>("")
    const [temRespostaStatus, setTemRespostaStatus] = useState<boolean>(false)


    function statusPagamento(){
        fetch("https://api.conexaoastralmistica.com.br/statusPagamento", {
            headers: {
                "authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""
            }
        }).then(res => res.json()).then(data => {
            console.log(data)
            setTemRespostaStatus(true)
            if(data[0] == "pago"){
                setRespostaStatus("pagamento realizado com sucesso")
            }else if(data[0] == "pagamento em aberto"){
                setRespostaStatus("pagamento em  aberto")
            }else{
                setRespostaStatus("você não tem pendências de pagamento")
            }
            /*if(data[0] == "sucesso"){
                console.log(data[1])
            }else if(data[0] == "sem pagamentos"){
                console.log("sem pagamentos")
            }else{
                console.log("erro")

            }*/
        })
    }

    return(
        <div className="fixed bg-white/90 h-auto w-[40%] top-2 right-2 flex justify-center items-center">
            <div className="flex flex-col gap-2 lg:gap-4 px-4 lg:px-8 py-3 lg:py-6 bg-roxoPrincipal w-[90%] max-h-[90%] overflow-y-scroll rounded-md text-white relative">
                <img className="w-10 cursor-pointer aspect-square absolute top-2 right-2" src={xisFechar} alt="xis para fechar" onClick={() => {
                    setTemQrCode(false)
                    window.location.reload()
                }}/>
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center">
                        <div className="text-center">Leia o Qr Code abaixo com o seu aplicativo do banco</div>
                        <div className="text-gray-500 text-center">*Após realizar o pagamento clique no botão "Checar status último pagamento" para conferir os status do mesmo</div>
                    </div>
                    <div className="w-32 lg:w-40 h-32 lg:h-40">
                        <img className="w-full h-full" src={`data:image/jpeg;base64,${ultimoQrCode}`}/>
                    </div>
                    <div className="flex flex-col items-start">
                        <div>Chave:</div>
                        <div>{chaveQr}</div>
                    </div>
                    <div className="flex justify-center gap-4">
                        <Botao onClickFn={statusPagamento} texto="Checar status último pagamento"/>
                        <Botao onClickFn={() => {
                            fetch("https://api.conexaoastralmistica.com.br/cancelarPagamento", {
                                headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}
                            }).then(res => res.json()).then(data => {
                                if(data.length > 0){
                                    if(data[0] == "sucesso"){
                                        console.log("pagamento cancelado com sucesso")
                                    }else{
                                        console.log("ocorreu um erro ao cancelar o pagamento")
                                    }
                                }

                            }).catch(() => console.log("ocorreu um erro ao enviar a requisição de cancelamento do pagamento"))
                            setTemQrCode(false)
                            window.location.reload()
                            document.body.classList.remove("modal-open")
                        }
                            
                        } texto="Cancelar Pagamento"/>
                    </div>
                    {
                        temRespostaStatus &&
                        <div className={`self-center ${respostaStatus == "pagamento realizado com sucesso"? "text-green-600": (respostaStatus == "pagamento em aberto"? "text-red-600" : "text-blue-600")} font-bold text-sm lg:text-xl`}>{respostaStatus}</div>
                    }
                </div>
            </div>
        </div>
    )
}