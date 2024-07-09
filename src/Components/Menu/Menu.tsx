import { Link } from "react-router-dom"
import logo from "../../assets/images/logoConexao.png"
import Botao from "../Botao/Botao"
import { useContext, useState } from "react"
import { ContextoLogin } from "../../Contexts/ContextoLogin/ContextoLogin"
import { ContextoUsuario } from "../../Contexts/ContextoUsuario/ContextoUsuario"
import { ContextoPagamento } from "../../Contexts/ContextoPagamento/ContextoPagamento"

export default function Menu(){


    const {usuarioLogado, setAbrirModalLogUsuario, setAbrirModalCadastroUsuario, setUsuarioLogado} = useContext(ContextoLogin)
    const {usuario} = useContext(ContextoUsuario)
    const {setAbrirModalEscolher} = useContext(ContextoPagamento)

    const arrItensMenu = [
        {nome: "Home", link: "/"},
        {nome: "Serviços", link: "/"},
        {nome: "Sobre", link: "/"},
        {nome: "Blog", link: "/Blog"},
        {nome: "Contato", link: "/"},
        {nome: "Trabalhe conosco", link: "/"},
        {nome: "Consulta", link: "/"},
    ]

    function aoClicarBtLogin(){
        setAbrirModalLogUsuario(true)
    }

    function aoClicarBtCadastro(){
        setAbrirModalCadastroUsuario(true)
    }

    function sair(){
        localStorage.setItem("authToken", "")
        setUsuarioLogado(false)

    }


    function abrirModalPagar(){
        setAbrirModalEscolher(true)
    }

    


    return (
        <div className="h-1/6 flex flex-col lg:flex-row items-center lg:gap-5 justify-between">
            <img src={logo} alt="logo" className="h-full md:w-auto w-1/2" />
            <div className="h-full flex">
                {arrItensMenu.map(item => (
                    <Link to={item.link}>
                        <div className="px-4 h-full lg:flex justify-center items-center text-white text-xl hidden">
                            {item.nome}
                        </div>
                    </Link>
                ))}
            </div>
            <div className="flex gap-5">
                {
                    usuarioLogado?
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <Botao onClickFn={abrirModalPagar} texto="Comprar saldo" />
                            <div className="flex gap-4 items-center">
                                <div className="text-center text-xl my-10">
                                    Seja bem vindo, {usuario.nome}<br/>Você têm R${usuario.saldo} de saldo
                                </div>
                                <div className="px-4 py-2 bg-red-600 font-bold rounded-md cursor-pointer" onClick={sair}>sair</div>
                            </div>
                        </div>
                        :
                        <>
                            <Botao onClickFn={aoClicarBtCadastro} texto="Cadastre-se"/>
                            <Botao onClickFn={aoClicarBtLogin} texto="Fazer login"/>      
                        </>

                }
            </div>
        </div>
    )
}