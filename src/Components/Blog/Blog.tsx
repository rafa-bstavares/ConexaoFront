import PostPreview from "../PostPreview/PostPreview"
import imgPost from "../../assets/images/bannerConexao.jpg"


export default function Blog(){
    return  (
        <div className="px-[var(--paddingXGeralCel)] lg:px-[var(--paddingXGeral)] flex flex-col min-h-screen bg-roxoPrincipal gap-16">
            <PostPreview titulo="Nos Caminhos da Luz: A Jornada de Adriana Querino" desc="Desde os primeiros dias de minha infância, fui envolvida pelos mistérios do mundo espiritual. Nasci em um lar onde a…" data="03/12" id={0} img=""/>
            <PostPreview titulo="Mantras: Como Essas Palavras Podem Transformar sua Vida" desc="Mantras têm sido uma parte essencial das práticas espirituais e meditativas há milhares de anos, encontrando raízes em tradições antigas…" data="04/01" id={1} img={imgPost}/>
        </div>
    )
}