import { useContext, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import MenuAdm from "../MenuAdm/MenuAdm"
import ModalAviso from "../ModalAviso/ModalAviso"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import ModalDetalhes from "../ModalDetalhes/ModalDetalhes"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"


export default function Adm(){

    const {temAviso, setTemAviso, textoAviso} = useContext(ContextoAviso)
    const {abrirModalDetalhes} = useContext(ContextoProfissionais)

    useEffect(() => {
        console.log(temAviso)
    }, [temAviso])

    return(
        <div className="relative min-h-screen bg-roxoPrincipal flex flex-col gap-4 text-white">
            <MenuAdm/>
            <div className="flex flex-col gap-4">
                <Outlet/>
            </div>
            {
                temAviso &&
                <ModalAviso />
            }
            {
                abrirModalDetalhes && 
                <ModalDetalhes/>
            }
        </div>  
    )
}