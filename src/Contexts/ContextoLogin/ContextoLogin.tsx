import { createContext, useState, Dispatch, SetStateAction } from "react";

type TiposContextoLogin = {   
    setAtendenteLogado: Dispatch<SetStateAction<boolean>>,
    setUsuarioLogado: Dispatch<SetStateAction<boolean>>,
    setAbrirModalLogUsuario: Dispatch<SetStateAction<boolean>>,
    setAbrirModalCadastroUsuario: Dispatch<SetStateAction<boolean>>,
    atendenteLogado: boolean,
    usuarioLogado: boolean,
    abrirModalLogUsuario: boolean,
    abrirModalCadastroUsuario: boolean,
}

export const ContextoLogin = createContext<TiposContextoLogin>({
    setAtendenteLogado: () => {},
    setUsuarioLogado: () => {},
    setAbrirModalLogUsuario: () => {},
    setAbrirModalCadastroUsuario: () => {},
    atendenteLogado: false,
    usuarioLogado: false,
    abrirModalLogUsuario: false,
    abrirModalCadastroUsuario: false,
} as TiposContextoLogin)


export const LoginProvider = ({children}: {children: React.ReactNode}) => {

    const [atendenteLogado, setAtendenteLogado] = useState<boolean>(false)
    const [usuarioLogado, setUsuarioLogado] = useState<boolean>(false)
    const [abrirModalLogUsuario, setAbrirModalLogUsuario] = useState<boolean>(false)
    const [abrirModalCadastroUsuario, setAbrirModalCadastroUsuario] = useState<boolean>(false)



    return (
        <ContextoLogin.Provider value={{
            atendenteLogado,
            usuarioLogado,
            setAtendenteLogado,
            setUsuarioLogado,
            setAbrirModalLogUsuario,
            setAbrirModalCadastroUsuario,
            abrirModalLogUsuario,
            abrirModalCadastroUsuario
        }}>
            {children}
        </ContextoLogin.Provider>
    )
}