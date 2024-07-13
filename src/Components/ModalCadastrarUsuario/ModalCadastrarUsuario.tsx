import { useContext, useEffect, useState } from "react"
import imgOlho from "../../assets/images/olhoSenha.svg"
import Botao from "../Botao/Botao"
import imgLogo from "../../assets/images/logoConexao.png"
import { ContextoLogin } from "../../Contexts/ContextoLogin/ContextoLogin"
import { ContextoAviso } from "../../Contexts/ContextoAviso/ContextoAviso"

export default function ModalCadastrarUsuario(){
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showPassword2, setShowPassword2] = useState<boolean>(false)
    const [emailUsuCadastrar, setEmailUsuCadastrar] = useState<string>("")
    const [emailUsuCadastrar2, setEmailUsuCadastrar2] = useState<string>("")
    const [senhaUsuCadastrar, setSenhaUsuCadastrar] = useState<string>("")
    const [senhaUsuCadastrar2, setSenhaUsuCadastrar2] = useState<string>("")
    const [nomeUsuCadastrar, setNomeUsuCadastrar] = useState<string>("")
    const [temErro, setTemErro] = useState<boolean>(false)
    const [textoErro, setTextoErro] = useState<string>("")
    const [dia, setDia] = useState<string>("")
    const [mes, setMes] = useState<string>("")
    const [ano, setAno] = useState<string>("")


    const {setAbrirModalCadastroUsuario, setAbrirModalLogUsuario} = useContext(ContextoLogin)
    const {setTemAviso, setTextoAviso} = useContext(ContextoAviso)

    function limparCampos(){
        setSenhaUsuCadastrar("")
        setSenhaUsuCadastrar2("")
        setEmailUsuCadastrar("")
        setEmailUsuCadastrar2("")
        setNomeUsuCadastrar("")
    }


    function cadastrar(){
        if(emailUsuCadastrar !== emailUsuCadastrar2){
            setTemErro(true)
            setTextoErro("os emails devem ser iguais")
        }else{
            if(senhaUsuCadastrar !== senhaUsuCadastrar2){
                setTemErro(true)
                setTextoErro("as senhas devem ser iguais")
            }else{
                if(dia.length !== 2 || mes.length !== 2 || ano.length !== 4){
                    setTemErro(true)
                    setTextoErro("Na data de nascimento o dia e o mês devem ter exatamente 2 números e o ano 4 números")
                }else{
                    if(emailUsuCadastrar == "" || senhaUsuCadastrar == "" || nomeUsuCadastrar == ""){
                        setTemErro(true)
                        setTextoErro("os campos devem ser todos preenchidos")
                    }else{
                        const dataNas = dia + "/"  + mes + "/" + ano
                        fetch("https://167.88.32.149:8080/cadastrarUsuario", {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({
                                emailUsuCadastrar,
                                senhaUsuCadastrar,
                                nomeUsuCadastrar,
                                dataNas
                            })
                        }).then(res => res.json()).then(data => {
                            if(data[0] && data[0] == "erro"){
                                setTemAviso(true)
                                if(data[1]){
                                    setTextoAviso(data[1])
                                }else{
                                    setTextoAviso("ocorreu um erro desconhecido, por favor, tente novamente.")
                                }
                            }else if(data[0] && data[0] == "sucesso"){
                                limparCampos()
                                setTemAviso(true)
                                setTextoAviso("cadastro realizado com sucesso")
                                setAbrirModalCadastroUsuario(false)
                                setAbrirModalLogUsuario(true)
                            }else{
                                setTemAviso(true)
                                setTextoAviso("ocorreu um erro desconhecido, por favor, tente novamente.")
                            }
                        })
                    }
                }
            }
        }
    }


    function aoCancelar(){
        setAbrirModalCadastroUsuario(false)
    }

    useEffect(() => {
        if(dia.length > 2){
            setDia(dia.slice(0, 2))
        }
    }, [dia])

    useEffect(() => {
        if(mes.length > 2){
            setMes(mes.slice(0, 2))
        }
    }, [mes])

    useEffect(() => {
        if(ano.length > 4){
            setAno(ano.slice(0, 4))
        }
    }, [ano])

    return(
        <div className="fixed bg-white/90 h-screen w-full top-0 left-0 flex justify-center items-center">
            <div className="flex flex-col gap-4 px-8 py-6 bg-roxoPrincipal w-1/2 rounded-md text-white">
                <div className="w-1/6 self-center">
                    <img src={imgLogo} alt="logo" className="w-full h-auto" />
                </div>
                <div className="self-center text-3xl font-bold">Cadastre-se</div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="nomeUsuario">Nome:</label>
                    <input className="p-2 flex-1 outline-none text-black rounded-md" type="text" id="nomeUsuario" onChange={e => {setNomeUsuCadastrar(e.target.value)}} />
                </div>
                <div className="flex flex-col gap-2">
                    <div>Data de Nascimento</div>
                    <div className="flex gap-2">
                        <div className="flex gap-2 items-center">
                            <label htmlFor="dia">Dia</label>
                            <input className="p-2 w-1/2 outline-none text-black rounded-md" value={dia} type="number" id="dia" onChange={e => {setDia(e.target.value)}} />
                        </div>
                        <div className="flex gap-2 items-center">
                            <label htmlFor="mes">Mes</label>
                            <input className="p-2 w-1/2 outline-none text-black rounded-md" value={mes} type="number" id="mes" onChange={e => {setMes(e.target.value)}} />
                        </div>
                        <div className="flex gap-2 items-center">
                            <label htmlFor="ano">Ano</label>
                            <input className="p-2 w-1/2 outline-none text-black rounded-md" value={ano} type="number" id="ano" onChange={e => {setAno(e.target.value)}} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="emailUsuario">Email:</label>
                    <input className="p-2 flex-1 outline-none text-black rounded-md" type="email" id="emailUsuario" onChange={e => {setEmailUsuCadastrar(e.target.value)}} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="emailUsuario">Repita o email:</label>
                    <input className="p-2 flex-1 outline-none text-black rounded-md" type="email" id="emailUsuario" onChange={e => {setEmailUsuCadastrar2(e.target.value)}} />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="senhaUsuario">Senha:</label>
                    <div className="rounded-md flex overflow-hidden bg-white">
                        <input type={showPassword ? "text" : "password"} onChange={e => {setSenhaUsuCadastrar(e.target.value)}} className="p-2 flex-1 outline-none text-black rounded-md"/>
                        <img onClick={() => setShowPassword(!showPassword)} src={imgOlho} alt="imagem-para-ver-senha" className="h-10 w-auto p-1 cursor-pointer"/>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="senhaUsuario">Repita a senha:</label>
                    <div className="rounded-md flex overflow-hidden bg-white">
                        <input type={showPassword2 ? "text" : "password"} onChange={e => {setSenhaUsuCadastrar2(e.target.value)}} className="p-2 flex-1 outline-none text-black rounded-md"/>
                        <img onClick={() => setShowPassword2(!showPassword2)} src={imgOlho} alt="imagem-para-ver-senha" className="h-10 w-auto p-1 cursor-pointer"/>
                    </div>
                </div>
                {
                    temErro &&
                    <div className="self-center text-red-600 font-bold text-xl">{textoErro}</div>
                }
                <div className="flex gap-4 self-center mt-5">
                    <Botao onClickFn={cadastrar} texto="Efetuar Cadastro"/>
                    <Botao onClickFn={aoCancelar} texto="Cancelar"/>
                </div>
            </div>
        </div>
    )
}