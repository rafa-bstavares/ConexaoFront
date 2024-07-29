import { useContext, useEffect, useState } from "react"
import { ContextoProfissionais } from "../../Contexts/ContextoProfissionais/ContextoProfissionais"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"
import ModalAviso from "../ModalAviso/ModalAviso"




export default function ModalEditarDetalhes(){

    const {profEditar, setProfEditar} = useContext(ContextoProfissionais)
    const {temAviso, setTemAviso, setTextoAviso} = useContext(ContextoAviso)

    const [nomeProfEditar, setNomeProfEditar] = useState<string>(profEditar.nome)
    const [emailProfEditar, setEmailProfEditar] = useState<string>(profEditar.email)
    const [descricaoMenorEditar, setDescricaoMenorEditar] = useState<string>(profEditar.descricaoMenor)
    const [descricaoMaiorEditar, setDescricaoMaiorEditar] = useState<string>(profEditar.descricaoMaior)
    const [imgProfAtual, setImgProfAtual] = useState<string>(profEditar.foto)
    const [imgProfEditar, setImgProfEditar] = useState<File>()
    const [valorMinEditar, setValorMinEditar] = useState<number>(profEditar.valorMin)


    function EditarCampo(nomeCampo: string, valorCampo: string | number){
        fetch("https://api.conexaoastralmistica.com.br/editarCampo", {
            method: "POST",
            headers: {"Content-Type": "application/json", "authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""},
            body: JSON.stringify({
                nomeCampo,
                valorCampo,
                idProfissional: profEditar.id
            })
        }).then(res => res.json()).then(data => {
            if(data.length > 0){
                if(data[0] == "sucesso"){
                    const novoProfEditar = {
                        foto: data.foto,
                        nome: data.nome,
                        descricaoMenor: data.descricaoMenor,
                        descricaoMaior: data.descricaoMaior,
                        email: data.email,
                        valorMin: data.valorMin,
                        id: data.id
                    }
                    setProfEditar(novoProfEditar)
                    setTemAviso(true)
                    setTextoAviso("edição feita com sucesso!")
                }
            }

        }).catch((err) => {
            setTemAviso(true)
            setTextoAviso("ocorreu um erro ao editar as informações. Por favor, tente novamente. Confira sua conexão com a internet")
        })
    }

    function Editarfoto(arquivo: File){

    }

    useEffect(() => {
        console.log(profEditar.descricaoMaior)
        console.log(profEditar.descricaoMenor)
        console.log(profEditar.valorMin)
    }, [])


    return (
        <div className="bg-roxoPrincipal flex items-center justify-center relative">
            <div className="p-10 grid grid-cols-2 justify-evenly">
                <div className="flex flex-col gap-5">
                    <div className="text-white text-2xl">Cadastrar Profissional</div>
                    <div className="flex gap-2 items-center">
                        <input className="px-4 py-2  text-black" type="text" placeholder="nome do profissional" value={nomeProfEditar} onChange={e => setNomeProfEditar(e.target.value)}/>
                        <button className="self-start px-4 py-2 rounded-md bg-white text-black" onClick={() => EditarCampo("nome", nomeProfEditar)}>Editar Nome</button>
                    </div>
                    <div className="flex gap-2 items-center">
                        <input className="px-4 py-2  text-black" type="text" placeholder="email do profissional" value={emailProfEditar} onChange={e => setEmailProfEditar(e.target.value)}/>
                        <button className="self-start px-4 py-2 rounded-md bg-white text-black" onClick={() => EditarCampo("email", emailProfEditar)}>Editar email</button>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div>
                            <div>Descrição menor (máx 200 caracteres): </div>
                            <textarea value={descricaoMenorEditar} onChange={e => setDescricaoMenorEditar(e.target.value)} className="h-32 p-2 text-black outline-none" maxLength={200} id=""></textarea>
                        </div>
                        <button className="self-start px-4 py-2 rounded-md bg-white text-black" onClick={() => EditarCampo("descricaoMenor", descricaoMenorEditar)}>Editar desc. menor</button>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div>
                            <div>Descrição maior (máx 2000 caracteres): </div>
                            <textarea value={descricaoMaiorEditar} onChange={e => setDescricaoMaiorEditar(e.target.value)} className="h-32 p-2 text-black outline-none" maxLength={2000} id=""></textarea>
                        </div>
                        <button className="self-start px-4 py-2 rounded-md bg-white text-black" onClick={() => EditarCampo("descricaoMaior", descricaoMaiorEditar)}>Editar desc. maior</button>
                    </div>
                    {/*<div className="flex gap-2 items-center">
                        <input type="file" onChange={(e) => {if(e.target.files){setImgProfAtual(e.target.files[0])}}}  className=""/> {//e.target.files[0].name }
                        <button className="self-start px-4 py-2 rounded-md bg-white text-black" onClick={() => {}}>Editar foto</button>
                    </div>*/}
                    <div className="flex gap-2 items-center"> 
                        <div>
                            <div>Valor em reais do minuto do profissional:</div>
                            <input value={valorMinEditar} type="number" min={1} onChange={e => setValorMinEditar(Number(e.target.value))} className="text-black"/>
                        </div>
                        <button className="self-start px-4 py-2 rounded-md bg-white text-black" onClick={() => EditarCampo("valorMin", valorMinEditar)}>Editar valor minuto</button>
                    </div>
                </div>
                {/*<div className="flex flex-col gap-2 p-4 items-start">
                    <div className="text-white text-2xl">Cadastrar Novo Baralho</div>
                    <div className="flex flex-col">
                        <label htmlFor="selectNumFotos" className="text-lg">Numero de cartas</label>
                        <select onChange={(e) => {setNumeroFotos(Number(e.target.value))}} name="selectNumFotos" id="selectNumFotos" className="border-2 border-solid border-black text-black">
                            {ordinalidade.map((item, index) => <option value={index + 1} key={item}>{index + 1}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col relative">
                        <div className="grid grid-cols-3 gap-2">
                            {arrNumFotos.map((item, index) =>  <div key={item} className={`cursor-pointer p-1 rounded-md bg-${fotos[index] ? "verdeMaisEscuro" : "white"} text-${fotos[index] ? "white" : "black"} text-sm flex justify-center items-center`} onClick={() => {setIdxUltimaClicada(index); ref.current?.click()}}>
                            {fotos[index] ? "foto selecionada" : ordinalidade[index] + " foto"}</div>)}
                        </div>
                        <input type="file" ref={ref} onChange={(e) => {if(e.target.files){inputFn(e.target.files[0])}}}  className="opacity-0 absolute inset-0 -z-10"/> {// e.target.files[0].name }
                    </div>
                    <button className="self-start px-4 py-2 rounded-md bg-white text-black" onClick={cadastrarTrabFn}>Cadastrar Novo Baralho</button>
                    <div className="mt-10">Baralhos Cadastrados:</div>
                    <div>
                        {arrTrabalhosTotais.map(item => <div>{item.trabalho}</div>)}
                    </div>
                </div>*/}
            </div>
            {
                temAviso &&
                <ModalAviso/>
            }        
        </div>
    )
}