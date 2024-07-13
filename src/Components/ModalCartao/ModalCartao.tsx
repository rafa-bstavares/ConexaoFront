import { CardPayment } from "@mercadopago/sdk-react";
import { useState } from "react";





export default function ModalCartao(){
    const [saldoAdicionar, setSaldoAdicionar] =  useState<number>(5)


    return (
            <div className="fixed bg-white/90 h-screen w-full top-0 left-0 flex justify-center items-center">
                <div className="flex flex-col gap-4 px-8 py-6 bg-roxoPrincipal w-1/2 rounded-md text-white overflow-scroll">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="emailUsuario">Digite abaixo, apenas com números, quantos reais de saldo deseja comprar:</label>
                        <div className="text-sm text-gray-500">*Exemplo: caso queira 5 reais, digite apenas o número 5</div>
                        <input className="p-2 flex-1 outline-none text-black rounded-md" type="number" min={1} id="" value={saldoAdicionar} onChange={e => setSaldoAdicionar(Number(e.target.value))}/>
                    </div>
                    <CardPayment initialization={{ amount: saldoAdicionar }}
                    onSubmit={async (param) => {
                        console.log(param);
                        fetch("https://167.88.32.149:8080/pagamentoCartao", {
                            method: "POST",
                            headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
                            body: JSON.stringify(param)
                        }).then(res => res.json()).then(data => {
                            console.log(data)
                        })
                    }}
                    />
                </div>
            </div>
    )
}