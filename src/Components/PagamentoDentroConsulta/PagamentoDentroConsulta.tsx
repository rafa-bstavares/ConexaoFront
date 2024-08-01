import { useContext, useState } from "react"
import imgLogo from "../../assets/images/logoConexao.png"
import xisFechar from "../../assets/images/xisFechar.svg"
import Botao from "../Botao/Botao"
import { ContextoPagamento } from "../../Contexts/ContextoPagamento/ContextoPagamento"
import { ContextoUsuario } from "../../Contexts/ContextoUsuario/ContextoUsuario"
import { v4 as uuidv4 } from 'uuid';



export default function PagamentoDentroConsulta(){

    const [temErro, setTemErro] = useState<boolean>(false)
    const [textoErro, setTextoErro] = useState<string>("")
    const [saldoAdicionar, setSaldoAdicionar] = useState<number>(1)
    const [cpf, setCpf] = useState<string>("")

    const {setAbrirPagamentoDentroConsulta, setIdUltimoPix, setUltimoQrCode, setTemQrCode, setChaveQr} = useContext(ContextoPagamento)
    const {usuario} = useContext(ContextoUsuario)


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


 

    


    
    return (
        <div>
            <div className="fixed bg-white/90 h-[30%] w-[40%] top-2 left-2 flex justify-center items-center">
                <div className="flex flex-col gap-2 lg:gap-4 px-4 lg:px-8 py-3 lg:py-6 bg-roxoPrincipal w-[90%] max-h-[90%] rounded-md text-white overflow-y-scroll relative">
                    <img className="w-10 cursor-pointer aspect-square absolute top-2 right-2" src={xisFechar} alt="xis para fechar" onClick={() => setAbrirPagamentoDentroConsulta(false)}/>
                    <div className="w-full lg:w-1/4 self-center">
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
                    <div className="flex flex-col lg:flex-row gap-4 self-center mt-3 lg:mt-5">
                        <Botao onClickFn={pagarComPix} texto="Pagar com PIX"/>
                    </div>
                </div>
            </div>
        </div>
    )
}