import { useContext, useState } from "react"
import imgLogo from "../../assets/images/logoConexao.png"
import Botao from "../Botao/Botao"
import { ContextoPagamento } from "../../Contexts/ContextoPagamento/ContextoPagamento"
import { ContextoUsuario } from "../../Contexts/ContextoUsuario/ContextoUsuario"
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom"
import { socket } from "../../socket"



export default function PagamentoDentroConsulta(){

    const [temErro, setTemErro] = useState<boolean>(false)
    const [temRespostaStatus, setTemRespostaStatus] = useState<boolean>(false)
    const [textoErro, setTextoErro] = useState<string>("")
    const [respostaStatus, setRespostaStatus] = useState<string>("")
    const [saldoAdicionar, setSaldoAdicionar] = useState<number>(1)
    const [cpf, setCpf] = useState<string>("")
    const [chaveQr, setChaveQr] = useState<string>("")

    const {setAbrirPagamentoDentroConsulta, setIdUltimoPix, setUltimoQrCode, ultimoQrCode, setTemQrCode, temQrCode} = useContext(ContextoPagamento)
    const {usuario, salaAtual} = useContext(ContextoUsuario)

    const navigate = useNavigate()


    function confereCpf(cpf: string): "inválido" | "válido"{
        if(cpf.length == 11){
            const arrNovePrimeiros = cpf.slice(0, 9).split("")
            const arrDigtsVer = cpf.slice(9, 11).split("")

            let somaMult = 0

            for(let i = 0; i < arrNovePrimeiros.length; i++){
                const numMult = 10 - i
                const mult = Number(arrNovePrimeiros[i]) * numMult
                somaMult += mult
            }

            const mod11 = somaMult % 11
            let primeiroDigVer
            if(mod11 == 0){
                primeiroDigVer = 0
            }else{
                primeiroDigVer =  11 - mod11
            }


            if(primeiroDigVer.toString() == arrDigtsVer[0]){
                const arrDezPrimeiros = [...arrNovePrimeiros, primeiroDigVer.toString()]
                let somaMult2 = 0

                for(let i = 0; i < arrDezPrimeiros.length; i++){
                    const numMult2 = 11 - i
                    const mult2 = Number(arrDezPrimeiros[i]) * numMult2
                    somaMult2 += mult2
                }
    
                const mod11 = somaMult2 % 11
                let segundoDigVer
                if(mod11 == 0){
                    segundoDigVer = 0
                }else{
                    segundoDigVer =  11 - mod11
                }

                if(segundoDigVer.toString() == arrDigtsVer[1]){
                    return "válido"
                }else{
                    return "inválido"
                }
            }else{
                return "inválido"
            }
            
        }

        return "inválido"
    }



    function pagarComPix(){
                
        if(cpf.length == 11){
            if(cpf.split("").every(item => item !== "." && item !== ",")){
                setTextoErro("")
                const statusCpf = confereCpf(cpf)
                if(statusCpf == "válido"){
                    console.log("cpf válido")
                    fetch("https://api.conexaoastralmistica.com.br/pagamentoPix", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""
                        },
                        body: JSON.stringify({
                            transaction_amount: saldoAdicionar,
                            description: "Aumento de saldo na plataforma Conexão Mística",
                            paymentMethodId: "pix",
                            email: usuario.email,
                            identificationType: "cpf",
                            number: cpf,
                            idempotencyKey: uuidv4()
                        })
                    }).then(res => res.json()).then(data => {
                        console.log("ocorreu a resposta do fetch")
                        console.log(data)
                        if(data[0] == "sucesso"){
                            setIdUltimoPix(data[1].id)
                            setUltimoQrCode(data[1].point_of_interaction.transaction_data.qr_code_base64)
                            setChaveQr(data[1].point_of_interaction.transaction_data.qr_code)
                            console.log(data[1].point_of_interaction.transaction_data.qr_code)
                            setTemQrCode(true)
                        }else if(data[0] == "pagamento aberto"){
                            setIdUltimoPix(data[1].id)
                            setUltimoQrCode(data[1].point_of_interaction.transaction_data.qr_code_base64)
                            setChaveQr(data[1].point_of_interaction.transaction_data.qr_code)
                            console.log(data[1].point_of_interaction.transaction_data.qr_code)
                            setTemQrCode(true)
                            setTemErro(true)
                            setTextoErro("você já tem um pagamento em aberto")
                        }else{
                            setTemErro(true)
                            if(data[1]){
                                if(typeof data[1] == "string"){
                                    setTextoErro(data[1])
                                }else{
                                    console.log(data[1])
                                }

                            }else{
                                setTextoErro("ocorreu um erro desconhecido ao tentar efetuar seu pagamento")
                            }

                        }
                    }).catch((err) => {
                        console.log("caiu no catch do pagamento")
                        console.log(err)
                    })
                }else{
                    console.log("cpf invalido")
                }

            }else{
                setTemErro(true)
                setTextoErro("Não são permitidos pontos ou vírgulas, por favor, digite APENAS NÚMEROS")    
            }
        }else{
            setTemErro(true)
            setTextoErro("O CPF precisa ter exatamente 11 números")
        }

    }


    function statusPagamento(){
        fetch("https://api.conexaoastralmistica.com.br/statusPagamentoDentroConsulta", {
            headers: {
                "authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""
            }
        }).then(res => res.json()).then(data => {
            console.log(data)
            setTemErro(false)
            setTemRespostaStatus(true)
            if(data[0] == "pago"){
                setRespostaStatus("pagamento realizado com sucesso")
                navigate("/Chat")
                socket.emit("comprouSaldoDentroConsulta", {room: salaAtual.toString()})
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

    


    
    return (
        <div>
            <div className="fixed bg-white/90 h-[30%] w-[40%] top-2 left-2 flex justify-center items-center">
                <div className="flex flex-col gap-2 lg:gap-4 px-4 lg:px-8 py-3 lg:py-6 bg-roxoPrincipal w-[90%] max-h-[90%] rounded-md text-white overflow-y-scroll">
                    <div className="w-2/3 lg:w-1/4 self-center">
                        <img src={imgLogo} alt="logo" className="w-full h-auto" />
                    </div>
                    <div className="self-center text-xl lg:text-3xl font-bold">Qual valor de crédito você deseja?</div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="emailUsuario">Digite abaixo, apenas com números, quantos reais de saldo deseja comprar:</label>
                        <div className="text-sm text-gray-500">*Exemplo: caso queira 5 reais, digite apenas o número 5</div>
                        <input className="p-2 flex-1 outline-none text-black rounded-md" type="number" min={1} id="" value={saldoAdicionar} onChange={e => setSaldoAdicionar(Number(e.target.value))}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="emailUsuario">Digite seu CPF:</label>
                        <div className="text-sm text-gray-500">*Apenas números</div>
                        <input className="p-2 flex-1 outline-none text-black rounded-md"  maxLength={11} type="number" id="" onChange={e => setCpf(e.target.value)}/>
                    </div>
                    {
                        temErro &&
                        <div className="self-center text-red-600 font-bold text-xl">{textoErro}</div>
                    }
                    {
                        temRespostaStatus &&
                        <div className={`self-center ${respostaStatus == "pagamento realizado com sucesso"? "text-green-600": (respostaStatus == "pagamento em aberto"? "text-red-600" : "text-blue-600")} font-bold text-sm lg:text-xl`}>{respostaStatus}</div>
                    }
                    <div className="flex flex-col lg:flex-row gap-4 self-center mt-3 lg:mt-5">
                        <Botao onClickFn={pagarComPix} texto="Pagar com PIX"/>
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
                            setAbrirPagamentoDentroConsulta(false)
                            window.location.reload()
                            document.body.classList.remove("modal-open")
                        }
                            
                        } texto="Cancelar Pagamento"/>
                    </div>
                    
                    <div className="flex justify-center">
                        <Botao onClickFn={statusPagamento} texto="Checar status último pagamento"/>
                    </div>
                    {
                        temQrCode && 
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
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}