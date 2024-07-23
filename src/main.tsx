import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Blog from './Components/Blog/Blog.tsx'
import Adm from './Components/Adm/Adm.tsx'
import Chat from './Components/Chat/Chat.tsx'
import AdmBlog from './Components/AdmBlog/AdmBlog.tsx'
import AdmChat from './Components/AdmChat/AdmChat.tsx'
import ControleAdm from './Components/ControleAdm/ControleAdm.tsx'
import MeusDados from './Components/MeusDados/MeusDados.tsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CadastrarProfissional from './Components/CadastrarProfissional/CadastrarProfissional.tsx'
import { AvisoProvider } from './Contexts/ContextoAviso/ContextoAviso.tsx'
import { LoginProvider } from './Contexts/ContextoLogin/ContextoLogin.tsx'
import { UsuarioProvider } from './Contexts/ContextoUsuario/ContextoUsuario.tsx'
import { ProfissionaisProvider } from './Contexts/ContextoProfissionais/ContextoProfissionais.tsx'
import Perfil from './Components/Perfil/Perfil.tsx'
import { AtendimentoProvider } from './Contexts/ContextoAtendimento/ContextoAtendimento.tsx'
import { PagamentoProvider } from './Contexts/ContextoPagamento/ContextoPagamento.tsx'
import { BlogProvider } from './Contexts/ContextoBlog/ContextoBlog.tsx'
import PostBlog from './Components/PostBlog/PostBlog.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LoginProvider>
      <AvisoProvider>
      <UsuarioProvider>
      <ProfissionaisProvider>
      <AtendimentoProvider>
      <PagamentoProvider>
      <BlogProvider>
        <Routes>
          <Route path='/' element={<App/>}></Route>
          <Route path='/Blog' element={<Blog/>}>
            <Route path='Blog/pedirPost/:id' element={<PostBlog/>}></Route>
          </Route>
          <Route path='/PerfilAtendente/:id' element={<Perfil/>}></Route>
          <Route path='/adm' element={<Adm/>}>
            <Route path='/adm/postarBlog' element={<AdmBlog/>}></Route>
            <Route path='/adm/cadastrarProfissional' element={<CadastrarProfissional/>}></Route>
            <Route path='/adm/controleAdm' element={<ControleAdm/>}></Route>
            <Route path='/adm/meusDadosAdm' element={<MeusDados tipo='AdmGeral'/>}></Route>
          </Route>
          <Route path='/Chat' element={<Chat atendente={false}/>}></Route>
          <Route path='/AdmChat' element={<AdmChat/>}></Route>
        </Routes>
      </BlogProvider>
      </PagamentoProvider>
      </AtendimentoProvider>
      </ProfissionaisProvider>
      </UsuarioProvider>
      </AvisoProvider>
      </LoginProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
