interface TermsModalProps {
    onAccept: () => void;
    onClose: () => void;
}

export default function TermsModal({
    onAccept,
    onClose,
}: TermsModalProps) {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999] p-4">
            <div className="bg-[#162133] w-full max-w-4xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">

                <div className="px-8 py-6 border-b border-white/10">
                    <h2 className="text-3xl font-bold text-white">
                        Termos de Uso e Privacidade
                    </h2>

                    <p className="text-sm text-white/60 mt-2">
                        Leia atentamente as informações abaixo antes de continuar.
                    </p>
                </div>

                <div className="terms-scroll p-8 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto space-y-10">
                    <section className="space-y-5">
                        <div>
                            <h3 className="text-2xl font-bold text-[#d4af37]">
                                Política de Privacidade
                            </h3>
                            <p className="text-white/50 text-sm mt-1">
                                Última atualização: 30 de maio de 2026
                            </p>
                        </div>
                        <div className="space-y-4 text-white/80 leading-7 text-sm">
                            <p>
                                A LT SYS valoriza a privacidade e a proteção dos dados pessoais dos usuários.
                            </p>
                            <p>
                                Esta Política de Privacidade explica como as informações são coletadas,
                                utilizadas e protegidas.
                            </p>
                            <div>
                                <h4 className="text-[#d4af37] font-semibold mb-2">
                                    1. Dados coletados
                                </h4>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Nome</li>
                                    <li>Endereço de e-mail</li>
                                    <li>Endereço IP e informações de acesso</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-[#d4af37] font-semibold mb-2">
                                    2. Finalidade da coleta
                                </h4>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Autenticação e login</li>
                                    <li>Recuperação de senha</li>
                                    <li>Melhoria da experiência do usuário</li>
                                    <li>Geração de relatórios internos</li>
                                    <li>Monitoramento de segurança</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-[#d4af37] font-semibold mb-2">
                                    3. Compartilhamento de dados
                                </h4>
                                <p>
                                    Os dados poderão ser armazenados e processados em serviços
                                    da Amazon Web Services (AWS), utilizados para hospedagem e
                                    funcionamento da plataforma.
                                </p>
                                <p className="mt-2">
                                    A LT SYS não comercializa dados pessoais dos usuários.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[#d4af37] font-semibold mb-2">
                                    4. Segurança dos dados
                                </h4>
                                <p>
                                    A LT SYS adota medidas técnicas e administrativas para proteger
                                    os dados contra acesso não autorizado, perda, alteração ou
                                    divulgação indevida.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[#d4af37] font-semibold mb-2">
                                    5. Direitos dos usuários
                                </h4>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Acesso aos seus dados</li>
                                    <li>Correção de informações</li>
                                    <li>Exclusão de dados quando aplicável</li>
                                    <li>Esclarecimentos sobre o tratamento realizado</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <div className="border-t border-white/10"></div>
                    <section className="space-y-5">
                        <div>
                            <h3 className="text-2xl font-bold text-[#d4af37]">
                                Termos de Uso
                            </h3>
                            <p className="text-white/50 text-sm mt-1">
                                Última atualização: 30 de maio de 2026
                            </p>
                        </div>
                        <div className="space-y-4 text-white/80 leading-7 text-sm">
                            <p>
                                Bem-vindo(a) à plataforma LT SYS.
                            </p>
                            <p>
                                Ao acessar e utilizar a plataforma, o usuário concorda com os
                                presentes Termos de Uso e com a Política de Privacidade.
                            </p>
                            <div>
                                <h4 className="text-[#d4af37] font-semibold mb-2">
                                    1. Sobre a plataforma
                                </h4>
                                <p>
                                    A LT SYS é uma plataforma voltada para mentoria financeira,
                                    oferecendo conteúdos, comunicação entre usuários e mentores,
                                    área administrativa e funcionalidades de interação.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[#d4af37] font-semibold mb-2">
                                    2. Cadastro e acesso
                                </h4>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Manter a confidencialidade da senha</li>
                                    <li>Proteger o acesso da conta</li>
                                    <li>Informar uso não autorizado</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-[#d4af37] font-semibold mb-2">
                                    3. Uso adequado da plataforma
                                </h4>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Não utilizar para fins ilegais</li>
                                    <li>Não publicar conteúdos ofensivos</li>
                                    <li>Não tentar acessar áreas restritas</li>
                                    <li>Não comprometer a segurança da plataforma</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-[#d4af37] font-semibold mb-2">
                                    4. Direitos autorais
                                </h4>
                                <p>
                                    Todos os materiais disponibilizados são protegidos por direitos
                                    autorais e pertencem à LT SYS.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-[#d4af37] font-semibold mb-2">
                                    5. Limitação de responsabilidade
                                </h4>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Falhas causadas por terceiros</li>
                                    <li>Indisponibilidade temporária do sistema</li>
                                    <li>Decisões financeiras tomadas pelos usuários</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="px-8 py-5 border-t border-white/10 flex items-center justify-end gap-4 bg-black/10">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl border border-white/10 text-white hover:bg-white/10 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onAccept}
                        className="bg-[#d4af37] hover:bg-[#e5c158] text-[#0A2540] font-semibold px-6 py-2 rounded-xl transition-all"
                    >
                        Aceitar e continuar
                    </button>
                </div>
            </div>
            <style>{`
                .terms-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(212, 175, 55, 0.5) transparent;
                }

                .terms-scroll::-webkit-scrollbar {
                    width: 6px;
                }

                .terms-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }

                .terms-scroll::-webkit-scrollbar-thumb {
                    background: rgba(212, 175, 55, 0.5);
                    border-radius: 999px;
                }

                .terms-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(212, 175, 55, 0.8);
                }
            `}</style>
        </div>
    );
}