import { CardPayment } from "@mercadopago/sdk-react";
import { useContext, useState } from "react";
import { ContextoPagamento } from "../../Contexts/ContextoPagamento/ContextoPagamento";
import Botao from "../Botao/Botao";
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso";





export default function ModalCartao(){
    const [saldoAdicionar, setSaldoAdicionar] =  useState<number>(0)
    const {setAbrirModalCartao} = useContext(ContextoPagamento)
    const {setTemAviso, setTextoAviso} = useContext(ContextoAviso)


    return (
            <div className="fixed bg-white/90 h-screen w-full top-0 left-0 flex justify-center items-center">
                <div className="flex flex-col gap-4 px-4 lg:px-8 py-3 lg:py-6 bg-roxoPrincipal w-[90%] lg:w-1/2 rounded-md text-white overflow-scroll">
                    <div className="flex flex-col gap-2">
                        <label className="text-xl" htmlFor="emailUsuario">Digite abaixo, apenas com números, quantos reais de saldo deseja comprar:</label>
                        <div className="text-sm text-gray-500">*Exemplo: caso queira 5 reais, digite apenas o número 5</div>
                        <input className="p-2 flex-1 outline-none text-black rounded-md" type="number"  id="" onChange={e => setSaldoAdicionar(Number(e.target.value))}/>
                    </div>
                    {
                        saldoAdicionar >= 5 ? 
                        <CardPayment initialization={{ amount: saldoAdicionar }}
                        onSubmit={async (param) => {
                            console.log(param);
                            fetch("https://api.conexaoastralmistica.com.br/pagamentoCartao", {
                                method: "POST",
                                headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
                                body: JSON.stringify(param)
                            }).then(res => res.json()).then(data => {
                                console.log(data)
                                if(data[0] == "sucesso"){
                                    if(data[1]){
                                        if(data[1].status){
                                            switch(data[1].status){
                                                case "aprovado":
                                                    setTemAviso(true)
                                                    setTextoAviso("seu pagamento foi aprovado!")
                                                    break
    
                                                case "negado":
                                                    setTemAviso(true)
                                                    setTextoAviso("seu pagamento foi negado, por favor, confira os dados do cartão e tente novamente.")
                                                    break
    
                                                case "sem info":
                                                    setTemAviso(true)
                                                    setTextoAviso("O banco não nos enviou informações sobre o seu pagamento. Pode ter ocorrido um problema no sistema deles. Caso você seja cobrado, mande o comprovante e explique a situação no seguinte whatsapp: +55 11 91636-7979")
                                                    break
                                            }
                                        }else{
                                            setTemAviso(true)
                                            setTextoAviso("Houve um problema desconhecido. Caso você seja cobrado, mande o comprovante e explique a situação no seguinte whatsapp: +55 11 91636-7979")
                                        }
                                    }else{
                                        setTemAviso(true)
                                        setTextoAviso("Houve um problema desconhecido. Caso você seja cobrado, mande o comprovante e explique a situação no seguinte whatsapp: +55 11 91636-7979")
                                    }
                                }else{
                                    setTemAviso(true)
                                    setTextoAviso("Houve um problema desconhecido. Caso você seja cobrado, mande o comprovante e explique a situação no seguinte whatsapp: +55 11 91636-7979")
                                }
                            })
                        }}
                        /> 
                        :
                        <div className="text-red-600 w-full text-center">
                            O saldo precisa ser no mínimo 5
                        </div>
                    }
                    <div className="flex justify-center">
                        <Botao onClickFn={() => {setAbrirModalCartao(false); window.location.reload()}} texto="Fechar"/>
                    </div>
                </div>
            </div>
    )
}



{

    /**
     useEffect(() => {
        if(abrirModalCartao == false || abrirModalPagamento == "false"){
            window.reload() //pra puxar o saldo novo
        }
     }, [abrirModalCartao, abrirModalPagamento])
     */
}