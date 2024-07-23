import { createContext, useState, Dispatch, SetStateAction } from "react";

type TiposContextoBlog = {   
    tituloBlog: string,
    setTituloBlog: Dispatch<SetStateAction<string>>,
    imgBlog: string,
    setImgBlog: Dispatch<SetStateAction<string>>
}

export const ContextoBlog = createContext<TiposContextoBlog>({
    tituloBlog: "",
    setTituloBlog: () => {},
    imgBlog: "",
    setImgBlog: () => {}
} as TiposContextoBlog)


export const BlogProvider = ({children}: {children: React.ReactNode}) => {

    const [tituloBlog, setTituloBlog] = useState<string>("")
    const [imgBlog, setImgBlog] = useState<string>("")



    return (
        <ContextoBlog.Provider value={{
            tituloBlog,
            setTituloBlog,
            imgBlog,
            setImgBlog
        }}>
            {children}
        </ContextoBlog.Provider>
    )
}