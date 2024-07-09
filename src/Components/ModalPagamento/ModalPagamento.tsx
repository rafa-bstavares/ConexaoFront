import { useContext, useEffect, useState } from "react"
import imgLogo from "../../assets/images/logoConexao.png"
import Botao from "../Botao/Botao"
import { ContextoPagamento } from "../../Contexts/ContextoPagamento/ContextoPagamento"
import { ContextoUsuario } from "../../Contexts/ContextoUsuario/ContextoUsuario"
import { createCardToken } from '@mercadopago/sdk-react/coreMethods'
import { v4 as uuidv4 } from 'uuid';



export default function ModalPagamento(){

    const [temErro, setTemErro] = useState<boolean>(false)
    const [temRespostaStatus, setTemRespostaStatus] = useState<boolean>(false)
    const [textoErro, setTextoErro] = useState<string>("")
    const [respostaStatus, setRespostaStatus] = useState<string>("")
    const [saldoAdicionar, setSaldoAdicionar] = useState<number>(1)
    const [cpf, setCpf] = useState<string>("")
    const [mostrarStatus,setMostrarStatus] = useState<boolean>(false)

    const {setAbrirModalPagamento, setIdUltimoPix, setUltimoQrCode, ultimoQrCode, setTemQrCode, temQrCode, idUltimoPix} = useContext(ContextoPagamento)
    const {usuario} = useContext(ContextoUsuario)
    const [numeroCartao, setNumeroCartao] = useState<string>("")
    const [pagarCartao, setPagarCartao] = useState<boolean>(false)


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
            const primeiroDigVer =  11 - mod11


            if(primeiroDigVer.toString() == arrDigtsVer[0]){
                const arrDezPrimeiros = [...arrNovePrimeiros, primeiroDigVer.toString()]
                let somaMult2 = 0

                for(let i = 0; i < arrDezPrimeiros.length; i++){
                    const numMult2 = 11 - i
                    const mult2 = Number(arrDezPrimeiros[i]) * numMult2
                    somaMult2 += mult2
                }
    
                const mod11 = somaMult2 % 11
                const segundoDigVer =  11 - mod11
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
                    fetch("http://localhost:8080/pagamentoPix", {
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
                        if(data[0] == "sucesso"){
                            console.log(data)
                            setIdUltimoPix(data[1].id)
                            setUltimoQrCode(data[1].point_of_interaction.transaction_data.qr_code_base64)
                            setTemQrCode(true)
                        }else if(data[0] == "pagamento aberto"){
                            setIdUltimoPix(data[1].id)
                            setUltimoQrCode(data[1].point_of_interaction.transaction_data.qr_code_base64)
                            setTemQrCode(true)
                            setTemErro(true)
                            setTextoErro("você já tem um pagamento em aberto")
                        }else{
                            setTemErro(true)
                            setTextoErro("ocorreu um erro ao tentar efetuar seu pagamento")
                        }
                    }).catch((err) => console.log(err))
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
        fetch("http://localhost:8080/statusPagamento", {
            headers: {
                "authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""
            }
        }).then(res => res.json()).then(data => {
            console.log(data)
            setTemErro(false)
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

    


    
    return (
        <div>
            <div className="fixed bg-white/90 h-screen w-full top-0 left-0 flex justify-center items-center">
                <div className="flex flex-col gap-4 px-8 py-6 bg-roxoPrincipal w-1/2 rounded-md text-white overflow-y-scroll">
                    <div className="w-1/4 self-center">
                        <img src={imgLogo} alt="logo" className="w-full h-auto" />
                    </div>
                    <div className="self-center text-3xl font-bold">Deseja uma consulta de quanto tempo?</div>
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
                        <div className={`self-center ${respostaStatus == "pagamento realizado com sucesso"? "text-green-600": (respostaStatus == "pagamento em aberto"? "text-red-600" : "text-blue-600")} font-bold text-xl`}>{respostaStatus}</div>
                    }
                    <div className="flex gap-4 self-center mt-5">
                        <Botao onClickFn={pagarComPix} texto="Pagar com PIX"/>
                        <Botao onClickFn={() => setAbrirModalPagamento(false)} texto="Cancelar"/>
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
                            <div className="w-40 h-40">
                                <img className="w-full h-full" src={`data:image/jpeg;base64,${ultimoQrCode}`}/>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}