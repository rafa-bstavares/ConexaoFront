import imgServicos1 from "../../assets/images/servicosConexao1.jpg"
import imgServicos2 from "../../assets/images/servicosConexao2.jpg"
import imgServicos3 from "../../assets/images/servicosConexao3.jpg"
import imgServicos4 from "../../assets/images/servicosConexao4.jpg"
import imgServicos5 from "../../assets/images/servicosConexao5.jpg"
import imgServicos6 from "../../assets/images/servicosConexao6.jpg"
import TituloDesc  from "../TituloDesc/TituloDesc"

export default function Servicos(){

    const arrImgsServicos = [
        {img: imgServicos1},
        {img: imgServicos2},
        {img: imgServicos3},
        {img: imgServicos4},
        {img: imgServicos5},
        {img: imgServicos6},
    ]

    return (
        <div className="px-[var(--paddingXGeral)] py-[var(--paddingYGeral)] bg-roxoPrincipal">
            <TituloDesc titulo="Serviços" desc="Guiando você rumo à paz interior e iluminação espiritual." />
            <div className="grid grid-cols-3 gap-2">
                {arrImgsServicos.map(item => <img className="w-full h-auto" src={item.img} />)}
            </div>
        </div>
    )
}