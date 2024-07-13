import Menu from "../Menu/Menu"
import Botao from "../Botao/Botao"





export default function Banner(){





  /*  function criarSala(){
        fetch("api.conexaoastralmistica.com.br/criarSala", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                idCliente: usuario.id,
                idProfissional: 15 
            })
        }).then(res => res.json()).then(data => {
            if(data[0] == "sucesso" && data[1].idSala){
                console.log("ta chegando no redirect")
                console.log(data[1].idSala)
                setSalaAtual(data[1].idSala)
                navigate("/Chat")
            }else{
                setTemAviso(true)
                if(data[1] && typeof data[1] == "string"){
                    setTextoAviso(data[1])
                }else{
                    
                    setTextoAviso("Ocorreu um erro não esperado no servidor")
                }
            }
        }).catch(err => {
            setTemAviso(true)
            setTextoAviso("Ocorreu um erro, por favor tente novamnete. Erro: " + err)
        })
    }

    function irParaChat(){
        fetch("api.conexaoastralmistica.com.br/confereTokenUsuario", {headers: {"authorization": localStorage.getItem("authToken")? `Bearer ${localStorage.getItem("authToken")}` : ""}}).then(res => res.json()).then(data => {
            if(data[0] == "erro"){
              setUsuarioLogado(false)
              localStorage.setItem("authToken", "")
              setTemAviso(true)
              setTextoAviso("você precisa se logar para entrar no chat")
              setAbrirModalLogUsuario(true)
            }else{
              setUsuarioLogado(true)
              criarSala()
            }
            console.log(data)
          }).catch(() => {
              setTemAviso(true)
              setTextoAviso("ocorreu algum erro, por favor, tente novamente")
          })
    }*/



    return (
        <div className="min-h-[70vh] lg:h-[70vh] bg-bannerImg lg:px-[var(--paddingXGeral)] px-[var(--paddingXGeralCel)] py-4 flex flex-col text-white relative">
            <Menu/>
            <div className="flex-1 flex flex-col justify-center lg:pr-80">
                <div className="lg:text-7xl text-4xl font-bold">Bem-vindo(a) à Conexão Mística</div>
                <div className="lg:text-xl text-lg">
                    Onde o universo se encontra com a sabedoria ancestral. Orientação espiritual para ajudá-lo a encontrar clareza, paz interior e prosperidade. Inicie sua jornada de auto conhecimento e crescimento espiritual.
                </div>
                <div className="flex gap-3 mt-10">
                    <Botao onClickFn={()=>{}} texto="Contato"/> 
                    <Botao onClickFn={()=>{}} texto="Blog"/> 
                </div>
            </div>
        </div>
    )
}


/*
Ao buscar usuario:

    function criarSala(){
        fetch("api.conexaoastralmistica.com.br/criarSala", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                usuarioCliente: "usuario1@gmail.com"
            })
        }).then(res => res.json()).then(data => {
            if(data[0] == "sucesso" && data[1] && data[1].id && data[1].nome && data[1].email && data[1].saldo){
                setUsuario(data[1])
            }else{
                setTemAviso(true)
                if(data[1] && typeof data[1] == "string"){
                    setTextoAviso(data[1])
                }else{
                    setTextoAviso("Ocorreu um erro não esperado no servidor")
                }
            }
        }).catch(err => {
            setTemAviso(true)
            setTextoAviso("Ocorreu um erro, por favor tente novamnete. Erro: " + err)
        })
    }
*/