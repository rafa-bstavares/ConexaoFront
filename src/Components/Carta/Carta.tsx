import { Dispatch, SetStateAction, useEffect, useState } from "react"

type Props = {
    urlImg: string,
    cartasSelecionadas: string[],
    setCartasSelecionadas: Dispatch<SetStateAction<string[]>>,
    idxCarta: number
}

export default function Carta({urlImg, cartasSelecionadas, setCartasSelecionadas}: Props){
    const [clicada, setClicada] = useState<boolean>(false)

    useEffect(() => {
        if(cartasSelecionadas.length == 0){
            setClicada(false)
        }
    }, [cartasSelecionadas])

    function cliqueNaCarta(){
        if(cartasSelecionadas.every(item => item !== urlImg)){
            const cartasSelecionadasClone = [...cartasSelecionadas]
            cartasSelecionadasClone.push(urlImg)
            setCartasSelecionadas(cartasSelecionadasClone)
        }else{
            const cartasSelecionadasClone = cartasSelecionadas.filter(item => item !== urlImg)
            setCartasSelecionadas(cartasSelecionadasClone)
        }
        setClicada(!clicada)
    }

    return(
        <div  onClick={cliqueNaCarta} className={`w-full h-full ${clicada? "bg-roxoPrincipal" : ""} transition-colors rounded-md flex justify-center items-center`}>
            <img className={`w-2/3 h-auto`} src={urlImg} alt="" />
        </div>
    )
}