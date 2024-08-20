import { useContext, useEffect, useRef, useState } from "react"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import xis from "../../assets/images/xisFechar.svg"
import ModalDeletarCarta from "../ModalDeletarCarta/ModalDeletarCarta"


export default function CadastrarProfissional(){

    type objTrabalho = {
        trabalho: string,
        id: number
    }

    const [nomeProf, setNomeProf] = useState<string>("")
    const [emailProf, setEmailProf] = useState<string>("")
    const [descricaoMenor, setDescricaoMenor] = useState<string>("")
    const [descricaoMaior, setDescricaoMaior] = useState<string>("")
    const [novoTrabalho, setNovoTrabalho] = useState<string>("")
    const [novoTrabalho2, setNovoTrabalho2] = useState<string>("")
    const [imgProf, setImgProf] = useState<File>()
    const [arrTrabalhosTotais, setArrTrabalhosTotais] = useState<objTrabalho[]>([])
    /*const [arrTrabalho, setArrTrabalho] = useState<string[]>([])*/
    const [fotos, setFotos] = useState<FileList | []>([])
    const [valorMin, setValorMin] = useState<number>(1)
    const [percentualPro, setPercentualPro] = useState<number>(30)
    const [idItemDeletar, setIdItemDeletar] = useState<number>(0)
    const [queroDeletar, setQueroDeletar] = useState<boolean>(false)


    const {setTextoAviso, setTemAviso} = useContext(ContextoAviso)

    const ref = useRef<HTMLInputElement>(null)


    useEffect(() => {
        setTemAviso(false)
        setTextoAviso("")

        fetch("https://api.conexaoastralmistica.com.br/pegarTrabalhos").then(res => res.json()).then(data => {
            if(data[0] == "sucesso"){
                setArrTrabalhosTotais(data[1])
            }else{
                setTextoAviso("ocorreu um erro desconhecido, por favor tente novamente")
                console.log("ocorreu um erro desconhecido, por favor tente novamente")
                setTemAviso(true)
            }
        }).catch(err => {
            setTextoAviso("ocorreu um erro no fetch. Erro: " + err)
            console.log("ocorreu um erro no fetch. Erro: " + err)
            setTemAviso(true)
        })
    }, [])


    function cadastrarProfFn(){
        if(valorMin > 0 && emailProf !== "" && percentualPro >= 1 && percentualPro <= 100){
            let formData = new FormData()
            if(imgProf){
                formData.append("imgProf", imgProf)
            }
            fetch("https://api.conexaoastralmistica.com.br/addFotoProfissional", {
                method: "POST",
                body: formData
            }).then(res => res.json()).then(data => {
                if(data[0] == "sucesso" && data[1][0].id){
                    //fazer segundo fetch
                    fetch("https://api.conexaoastralmistica.com.br/addInfosProfissional", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            nomeProf,
                            emailProf,
                            descricaoMenor,
                            descricaoMaior,
                            id: data[1][0].id,
                            valorMin,
                            percentualPro
                        })
                    }).then(res => res.json()).then(data => {
                        if(data[0] == "sucesso"){
                            setTextoAviso(data[1])
                            setTemAviso(true)
                        }else{
                            if(data[1]){
                                setTextoAviso(data[1])
                                setTemAviso(true)
                            }else{
                                setTextoAviso("ocorreu um erro desconhecido, por favor tente novamente")
                                setTemAviso(true)
                            }
                        }
                    }).catch((err) => {
                        setTextoAviso("ocorreu um erro no fetch. Erro: " + err)
                        console.log("ocorreu um erro no fetch. Erro: " + err)
                        setTemAviso(true)
                    })
                }else{
                    if(data[1]){
                        setTextoAviso(data[1])
                        setTemAviso(true)
                    }else{
                        setTextoAviso("ocorreu um erro desconhecido, por favor tente novamente")
                        setTemAviso(true)
                    }
                }
            }).catch((err) => {
                setTextoAviso("ocorreu um erro no fetch. Erro: " + err)
                console.log("ocorreu um erro no fetch. Erro: " + err)
                setTemAviso(true)
            })
        }
    }


    function cadastrarTrabFn(){
        if(novoTrabalho == novoTrabalho2 && novoTrabalho){

            const formData = new FormData()
            for(let i = 0; i < fotos.length; i++){
                formData.append("files", fotos[i])
            }
            formData.append("novoTrabalho", novoTrabalho)


            fetch("https://api.conexaoastralmistica.com.br/cadastrarTrabalho", {
                method: "POST",
                body: formData
            }).then(res => res.json()).then(data => {
                if(data[0] == "sucesso"){
                    setTextoAviso(data[1])
                    console.log(data[1])
                    setTemAviso(true)
                    fetch("https://api.conexaoastralmistica.com.br/pegarTrabalhos").then(res => res.json()).then(data => {
                        if(data[0] == "sucesso"){
                            setArrTrabalhosTotais(data[1])
                        }else{
                            setTextoAviso("ocorreu um erro desconhecido, por favor tente novamente")
                            console.log("ocorreu um erro desconhecido, por favor tente novamente")
                            setTemAviso(true)
                        }
                    }).catch(err => {
                        setTextoAviso("ocorreu um erro no fetch. Erro: " + err)
                        console.log("ocorreu um erro no fetch. Erro: " + err)
                        setTemAviso(true)
                    })
                    setNovoTrabalho("")
                    setNovoTrabalho2("")
                }else{
                    setTextoAviso("ocorreu um erro desconhecido, por favor tente novamente")
                    console.log("ocorreu um erro desconhecido, por favor tente novamente")
                    setTemAviso(true)
                }
            }).catch((err) => {
                setTextoAviso("ocorreu um erro no fetch. Erro: " + err)
                console.log("ocorreu um erro no fetch. Erro: " + err)
                setTemAviso(true)
            })
        }else{
            //setar modal avisando que está diferente
            setTextoAviso("Os dois campos do Novo Trabalho tem que estar identicos e não podem estar vazios")
            console.log("Os dois campos do Novo Trabalho tem que estar identicos e não podem estar vazios")
            setTemAviso(true)
        }
    }




    

   /* function confereCheckbox(ev: ChangeEvent<HTMLInputElement>, trabalho: string){
        let arrTrabClone = [...arrTrabalho]
        if(ev.target.checked){
            arrTrabClone.push(trabalho)
        }else{
            arrTrabClone = arrTrabClone.filter(elem => elem !== trabalho)
        }
        setArrTrabalho(arrTrabClone)
    }*/

    /*function inputFn(file: File){
        if(idxUltimaClicada !== undefined){
            console.log(fotos)
            let newFotos = [...fotos]
            newFotos[idxUltimaClicada] = file
            setFotos(newFotos)
        }
    }*/

    function inputArrFn(files: FileList){
        setFotos(files)
    }


    
    function deletarItemBaralho(idItem: number){
        setQueroDeletar(false)
        fetch("https://api.conexaoastralmistica.com.br/deletarBaralho", {
            method: "POST",
            headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : "", "Content-Type": "application/json"},
            body: JSON.stringify({
                idItem
            })
        }).then(res => res.json()).then(data => {
            if(data.length > 0){
                if(data[0] == "sucesso"){
                    setTemAviso(true)
                    setTextoAviso("item deletado com sucesso")
                    fetch("https://api.conexaoastralmistica.com.br/pegarTrabalhos").then(res => res.json()).then(data => {
                        if(data[0] == "sucesso"){
                            setArrTrabalhosTotais(data[1])
                        }else{
                            setTextoAviso("ocorreu um erro desconhecido, por favor tente novamente")
                            console.log("ocorreu um erro desconhecido, por favor tente novamente")
                            setTemAviso(true)
                        }
                    }).catch(err => {
                        setTextoAviso("ocorreu um erro no fetch. Erro: " + err)
                        console.log("ocorreu um erro no fetch. Erro: " + err)
                        setTemAviso(true)
                    })
                }else{
                    setTextoAviso("ocorreu um erro ao deletar o item, por favor, tente novamente")
                    setTemAviso(true)
                }
            }else{
                setTextoAviso("ocorreu um erro ao deletar o item, por favor, tente novamente")
                setTemAviso(true)
            }
        })
    }

    /*useEffect(() => {
        let newArr = []
        let initialFotos = new Array(numeroFotos)
        for(let i = 0; i < numeroFotos; i++){
            newArr.push("item")
        }
        setArrNumFotos(newArr)
        setFotos(initialFotos)
    }, [numeroFotos])*/

    return(
        <div className="p-10 grid grid-cols-2 justify-evenly">
            <div className="flex flex-col gap-5">
                <div className="text-white text-2xl">Cadastrar Profissional</div>
                <input className="px-4 py-2  text-black" type="text" placeholder="nome do profissional" value={nomeProf} onChange={e => setNomeProf(e.target.value)}/>
                <input className="px-4 py-2  text-black" type="text" placeholder="email do profissional" value={emailProf} onChange={e => setEmailProf(e.target.value)}/>
                <div>Descrição menor (máx 200 caracteres): </div>
                <textarea onChange={e => setDescricaoMenor(e.target.value)} className="h-32 p-2 text-black outline-none" maxLength={200} id=""></textarea>
                <div>Descrição maior (máx 2000 caracteres): </div>
                <textarea onChange={e => setDescricaoMaior(e.target.value)} className="h-32 p-2 text-black outline-none" maxLength={2000} id=""></textarea>
                <input type="file" onChange={(e) => {if(e.target.files){setImgProf(e.target.files[0])}}}  className=""/> {/* e.target.files[0].name */}
                <div>Valor em reais do minuto do profissional:</div>
                <input type="number" min={1} onChange={e => setValorMin(Number(e.target.value))} className="text-black"/>
                <div>Percentual do profissional. Ex: Caso queira que seja 30% colocar abaixo apenas o número 30.</div>
                <input type="number" min={1} onChange={e => setPercentualPro(Number(e.target.value))} className="text-black"/>
                <button className="self-start px-4 py-2 rounded-md bg-white text-black" onClick={cadastrarProfFn}>Cadastrar</button>
            </div>
            <div className="flex flex-col gap-2 p-4 items-start">
                <div className="text-white text-2xl">Cadastrar Novo Baralho</div>
                <input className="px-4 py-2  text-black" type="text" placeholder="Digite o novo trabalho" value={novoTrabalho} onChange={e => setNovoTrabalho(e.target.value)}/>
                <input className="px-4 py-2  text-black" type="text" placeholder="Repita o novo trabalho" value={novoTrabalho2} onChange={e => setNovoTrabalho2(e.target.value)}/>
                {/*<div className="flex flex-col">
                    <label htmlFor="selectNumFotos" className="text-lg">Numero de cartas</label>
                    <select onChange={(e) => {setNumeroFotos(Number(e.target.value))}} name="selectNumFotos" id="selectNumFotos" className="border-2 border-solid border-black text-black">
                        {ordinalidade.map((item, index) => <option value={index + 1} key={item}>{index + 1}</option>)}
                    </select>
                </div>*/}
                <div className="flex flex-col relative">
                    {/*<div className="grid grid-cols-3 gap-2">
                        {arrNumFotos.map((item, index) =>  <div key={item} className={`cursor-pointer p-1 rounded-md bg-${fotos[index] ? "verdeMaisEscuro" : "white"} text-${fotos[index] ? "white" : "black"} text-sm flex justify-center items-center`} onClick={() => {setIdxUltimaClicada(index); ref.current?.click()}}>
                        {fotos[index] ? "foto selecionada" : ordinalidade[index] + " foto"}</div>)}
                    </div>*/}
                    <input multiple={true} type="file" ref={ref} onChange={/*(e) => {if(e.target.files){inputFn(e.target.files[0])}}*/(e) => {
                        if(e.target.files){
                            inputArrFn(e.target.files)
                        }
                    }}  className={/*"opacity-0 absolute inset-0 -z-10"*/""}/> {/* e.target.files[0].name */}
                </div>
                <button className="self-start px-4 py-2 rounded-md bg-white text-black" onClick={cadastrarTrabFn}>Cadastrar Novo Baralho</button>
                <div className="mt-10">Baralhos Cadastrados:</div>
                <div>
                    <div className="flex flex-col gap-4">
                        {arrTrabalhosTotais.map(item => (
                            <div  className="flex gap-2">
                                <div>
                                    {item.trabalho}
                                </div>
                                <button className="flex items-center gap-1 bg-red-600 rounded-md p-1" onClick={() => {setIdItemDeletar(item.id); setQueroDeletar(true)}}>
                                    <img src={xis} alt="xis deletar item baralho" className="w-3 h-auto"/>
                                    <div>
                                        deletar
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {
                queroDeletar &&
                <ModalDeletarCarta deletarFn={deletarItemBaralho} idItem={idItemDeletar} setQueroDeletar={setQueroDeletar}/>
            }
        </div>
    )
}