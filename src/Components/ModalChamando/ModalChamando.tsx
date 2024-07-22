import { useContext } from "react"
import loading from "../../assets/images/Design sem nome.gif"
import logo from "../../assets/images/logoConexao.png"
import { socket } from "../../socket"
import { ContextoUsuario } from "../../Contexts/ContextoUsuario/ContextoUsuario"

export default function ModalChamando(){

    const {usuario, idMeuAtendente} = useContext(ContextoUsuario)

    function rejeitarChamada(){
        socket.emit("respostaChamarAtendente", {msg: "Rejeitado", idCliente: usuario.id, idProfissional: idMeuAtendente})
    }


    return (
        <div className="fixed inset-0 bg-white/80 flex flex-col items-center justify-center">
            <div className="h-5/6 w-[90%] lg:w-4/5 bg-white rounded-xl flex flex-col px-4 lg:px-12 py-3 lg:py-8 gap-4 lg:gap-8 justify-center items-center">
                <div className=" w-2/3 lg:w-1/6 h-auto">
                    <img className="w-full h-auto" src={logo} alt="logomarca" />
                </div>
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 items-center w-full justify-center">
                    <div className="text-xl lg:text-5xl text-gray-700/70">Chamando Atendente</div>
                    <img className="w-1/2 lg:w-20 h-auto" src={loading} alt="loading" />
                </div>
                <div className="text-center text-gray-600 text-sm lg:text-lg px-2 lg:px-24">
                    *Caso não haja resposta dentro de um minuto você será redirecionado para a página principal. Você também pode retornnar a página principal por conta própria clicando no botão abaixo
                </div>
                <div onClick={rejeitarChamada} className="px-4 lg:px-8 py-2 lg:py-4 rounded-xl bg-roxoPrincipal text-white font-bold cursor-pointer">
                    Cancelar Pedido
                </div>
            </div>
        </div>
    )
}