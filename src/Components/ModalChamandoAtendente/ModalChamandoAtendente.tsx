import { useContext, useEffect, useRef } from "react"
import loading from "../../assets/images/Design sem nome.gif"
import campainha from "../../assets/sounds/old-style-phone-ringer-37761.mp3"
import { socket } from "../../socket"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"
import logo from "../../assets/images/logoConexao.png"

type Props = {
    usuario: string,
    idUsuario: number
}

export default function ModalChamandoAtendente({usuario, idUsuario}: Props){


    const {perfilProAtual} = useContext(ContextoProfissionais)


    const audio = useRef<HTMLAudioElement>(null)


    //VER COMO CANCELAR ESSA COISA
    const tmout = setTimeout(() => {
        audio.current?.pause()
        socket.emit("respostaChamarAtendente", {msg: "Rejeitado", idCliente: idUsuario, idProfissional: perfilProAtual.id})
    }, 59000)

    useEffect(()  => {
        audio.current?.play()
    }, [])


    function rejeitarChamada(){
        audio.current?.pause()
        clearTimeout(tmout)
        socket.emit("respostaChamarAtendente", {msg: "Rejeitado", idCliente: idUsuario, idProfissional: perfilProAtual.id})
    }

    function aceitarChamada(){
        audio.current?.pause()
        socket.emit("respostaChamarAtendente", {msg: "Aceitar", idCliente: idUsuario, idProfissional: perfilProAtual.id})
    }

    return (
        <div className="fixed inset-0 bg-white/80 flex items-center justify-center flex-col gap-8 ">
            <div className="h-5/6 w-4/5 bg-white rounded-xl flex flex-col px-12 py-8 gap-4 justify-center items-center">
                <div className="w-1/6 h-auto">
                    <img className="w-full h-auto" src={logo} alt="logomarca" />
                </div>
                <div className="flex gap-4 items-center">
                    <div className="text-5xl text-gray-700/70">{usuario} quer fazer uma consulta com você!</div>
                    <img className="w-20 h-auto" src={loading} alt="loading" />
                </div>
            </div>
            <div className="flex gap-4">
                <div onClick={aceitarChamada} className="px-8 py-4 rounded-xl bg-roxoPrincipal text-white font-bold cursor-pointer">
                    Aceitar
                </div>
                <div  onClick={rejeitarChamada} className="px-8 py-4 rounded-xl bg-roxoPrincipal text-white font-bold cursor-pointer">
                    Rejeitar
                </div>
            </div>
            <audio loop ref={audio} src={campainha}></audio>
        </div>
    )
}