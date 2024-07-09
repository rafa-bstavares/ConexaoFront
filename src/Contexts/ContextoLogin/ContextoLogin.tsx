import { createContext, useState, Dispatch, SetStateAction } from "react";

type TiposContextoLogin = {   
    setAtendenteLogado: Dispatch<SetStateAction<boolean>>,
    setUsuarioLogado: Dispatch<SetStateAction<boolean>>,
    setAdmGeralLogado: Dispatch<SetStateAction<boolean>>,
    setAbrirModalLogUsuario: Dispatch<SetStateAction<boolean>>,
    setAbrirModalCadastroUsuario: Dispatch<SetStateAction<boolean>>,
    setAbrirModalRedefinir: Dispatch<SetStateAction<boolean>>,
    atendenteLogado: boolean,
    usuarioLogado: boolean,
    admGeralLogado: boolean,
    abrirModalLogUsuario: boolean,
    abrirModalCadastroUsuario: boolean,
    abrirModalRedefinir: boolean,
}

export const ContextoLogin = createContext<TiposContextoLogin>({
    setAtendenteLogado: () => {},
    setUsuarioLogado: () => {},
    setAdmGeralLogado: () => {},
    setAbrirModalLogUsuario: () => {},
    setAbrirModalCadastroUsuario: () => {},
    setAbrirModalRedefinir: () => {},
    atendenteLogado: false,
    usuarioLogado: false,
    admGeralLogado: false,
    abrirModalLogUsuario: false,
    abrirModalCadastroUsuario: false,
    abrirModalRedefinir: false,
} as TiposContextoLogin)


export const LoginProvider = ({children}: {children: React.ReactNode}) => {

    const [atendenteLogado, setAtendenteLogado] = useState<boolean>(false)
    const [usuarioLogado, setUsuarioLogado] = useState<boolean>(false)
    const [admGeralLogado, setAdmGeralLogado] = useState<boolean>(false)
    const [abrirModalLogUsuario, setAbrirModalLogUsuario] = useState<boolean>(false)
    const [abrirModalCadastroUsuario, setAbrirModalCadastroUsuario] = useState<boolean>(false)
    const [abrirModalRedefinir, setAbrirModalRedefinir] = useState<boolean>(false)



    return (
        <ContextoLogin.Provider value={{
            atendenteLogado,
            usuarioLogado,
            admGeralLogado,
            setAtendenteLogado,
            setUsuarioLogado,
            setAdmGeralLogado,
            setAbrirModalLogUsuario,
            setAbrirModalCadastroUsuario,
            setAbrirModalRedefinir,
            abrirModalLogUsuario,
            abrirModalCadastroUsuario,
            abrirModalRedefinir
        }}>
            {children}
        </ContextoLogin.Provider>
    )
}