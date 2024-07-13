import { useContext, useEffect, useState } from "react"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import ItemProfissionaisAdm from "../ItemProfissionaisAdm/ItemProfissionaisAdm"
import ItemUsuariosAdm from "../ItemUsuariosAdm/ItemUsuariosAdm"
import { ContextoUsuario } from "../../Contexts/ContextoUsuario/ContextoUsuario"
import Botao from "../Botao/Botao"



export default function ControleAdm(){

    const {setProfissionais, profissionais} = useContext(ContextoProfissionais)
    const { setTemAviso, setTextoAviso} = useContext(ContextoAviso)
    const {arrUsuarios, setArrUsuarios} = useContext(ContextoUsuario)
    const [abrirModalCertezaSaldo, setAbrirModalCertezaSaldo] = useState<boolean>(false)
    const [idAtual, setIdAtual] = useState<number>(0)
    const [saldoAtual, setSaldoAtual] = useState<number>(0)

    useEffect(() => {
        fetch("https://api.conexaoastralmistica.com.br/pegarInfoProfissionais").then(res => res.json()).then(data => {
            if(data[0] == "sucesso"){
                setProfissionais(data[1])
            }else{
                if(data[1]){
                    setTemAviso(true)
                    setTextoAviso(data[1])
                }else{
                    setTemAviso(true)
                    setTextoAviso("ocorreu um erro ao pegar as informações dos profissinais. Por favor, recarregue a página")
                }
            }
        })


        fetch("https://api.conexaoastralmistica.com.br/listaClientes", {
            headers: { "authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}
        }).then((res => res.json())).then(data => {
            if(data.length > 0){
                if(data[0] == "sucesso"){
                    setArrUsuarios(data[1])
                }else{
                    setTemAviso(true)
                    setTextoAviso("ocorreu um erro ao pegar as informações dos usuários. Por favor, tente novamente.")
                }
            }else{
                setTemAviso(true)
                setTextoAviso("ocorreu um erro ao pegar as informações dos usuários. Por favor, tente novamente.")
            }
        })
    }, [])

    function alterarSaldoFn(){
        setAbrirModalCertezaSaldo(false)
        fetch("https://api.conexaoastralmistica.com.br/alterarSaldo", {
            method: "POST",
            headers: {"Content-Type": "application/json", "authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""},
            body: JSON.stringify({
                novoSaldo: saldoAtual,
                idMudarSaldo: idAtual
            })
        }).then(res => res.json()).then(data => {
            if(data.length > 0){
                if(data[0] == "sucesso"){
                    setTemAviso(true)
                    setTextoAviso("saldo atualizado com sucesso!")
                }else{
                    setTemAviso(true)
                    setTextoAviso("não foi possível atualizar o saldo. Por favor, tente novamente")
                }
            }else{
                setTemAviso(true)
                setTextoAviso("não foi possível atualizar o saldo. Por favor, tente novamente")
            }
        })
    }


    return(
        <div className="px-[var(--paddingXGeralCel)] lg:hgpx-[var(--paddingXGeral)] py-[var(--paddingYGeral)] flex flex-col items-center gap-16 relative">
            <div className="text-3xl font-bold text-center">Profissionais:</div>
            <div className="flex flex-col gap-8">
                {
                    profissionais.length > 0 &&
                    profissionais.map(item => (
                        <ItemProfissionaisAdm totalArrecadado={item.totalArrecadado} img={item.foto} nomeProfissional={item.nome} idProfissional={item.id}/>
                    ))
                }
            </div>
            <div>Clientes:</div>
                {
                    arrUsuarios &&
                    arrUsuarios.map(item => (
                        <ItemUsuariosAdm email={item.email} id={item.id} nome={item.nome} saldo={item.saldo} abrirModalCertezaFn={setAbrirModalCertezaSaldo} idAtualFn={setIdAtual} saldoAtualFn={setSaldoAtual}/>
                    ))
                }
                {
                    abrirModalCertezaSaldo &&
                    <div className="fixed inset-0 bg-black/90 flex flex-col gap-4 justify-center items-center">
                        <div>
                            Tem certeza que deseja alterar esse saldo?
                        </div>
                        <div className="flex gap-4">
                            <Botao onClickFn={() => setAbrirModalCertezaSaldo(false)} texto="Cancelar"/>
                            <Botao onClickFn={alterarSaldoFn} texto="Alterar o saldo"/>
                        </div>
                    </div>
                }
        </div>
    )
}