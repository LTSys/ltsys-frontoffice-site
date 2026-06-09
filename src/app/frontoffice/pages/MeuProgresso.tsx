import { useEffect, useState } from 'react';
import { FrontofficeLayout } from '../components/FrontofficeLayout';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trailService, Trail } from '@/services/trailService';
import { getConteudosPorTrilha, Content } from '@/services/contentService';
import { progressService } from '@/services/progressService';
import LoaderItem from '../components/loader/LoaderItem';

type TrilhaComStatus = Trail & {
  status: 'EM_ANDAMENTO' | 'CONCLUIDO';
};

function MeuProgresso() {
  const navigate = useNavigate();
  const [trilhasEmAndamento, setTrilhasEmAndamento] = useState<TrilhaComStatus[]>([]);
  const [trilhasFinalizadas, setTrilhasFinalizadas] = useState<TrilhaComStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgresso = async () => {
      try {
        //Buscar todas as trilhas ativas
        const todasTrilhas = await trailService.getAllTrails();
        const trilhasAtivas = todasTrilhas.filter(t => t.active === true);

        //Para cada trilha, determinar se está concluída
        const trilhasComStatus = await Promise.all(
          trilhasAtivas.map(async (trilha): Promise<TrilhaComStatus> => {
            // Buscar conteúdos da trilha
            const conteudos = await getConteudosPorTrilha(trilha.id);
            if (conteudos.length === 0) {
              //Trilha sem conteúdo: considerar como em andamento? Você decide
              return { ...trilha, status: 'EM_ANDAMENTO' };
            }

            //Buscar progresso de cada conteúdo
            const promessasProgresso = conteudos.map(c => progressService.obter(c.id));
            const resultados = await Promise.allSettled(promessasProgresso);

            //Verificar se todos os conteúdos estão concluídos
            const todosConcluidos = resultados.every(res => {
              console.log(res);
              if (res.status === 'fulfilled') {
                return res.value.status === 'COMPLETED';
              }
              return false;
            });

            return {
              ...trilha,
              status: todosConcluidos ? 'CONCLUIDO' : 'EM_ANDAMENTO',
            };
          })
        );

        //Separar as listas
        const emAndamento = trilhasComStatus.filter(t => t.status === 'EM_ANDAMENTO');
        const finalizadas = trilhasComStatus.filter(t => t.status === 'CONCLUIDO');

        setTrilhasEmAndamento(emAndamento);
        setTrilhasFinalizadas(finalizadas);
      } catch (err) {
        console.error('Erro ao carregar progresso:', err);
        setError('Não foi possível carregar seu progresso. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgresso();
  }, []);

  if (loading) {
    return (
      <FrontofficeLayout activeItem="Meu Progresso">
        <div className="flex justify-center items-center" style={{ height: 'calc(100vh - 250px)' }}>
            <LoaderItem />
        </div>
      </FrontofficeLayout>
    );
  }

  if (error) {
    return (
      <FrontofficeLayout activeItem="Meu Progresso">
        <div className="text-center text-red-600 p-8">{error}</div>
      </FrontofficeLayout>
    );
  }

  return (
    <FrontofficeLayout activeItem="Meu Progresso">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0A2540] mb-2 break-words">
          Meu Progresso
        </h1>
        <p className="text-gray-600">Acompanhe sua evolução e conquistas</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg"><Clock className="w-5 h-5 text-blue-600" /></div>
            <p className="text-sm text-gray-600">Em Andamento</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#0A2540]">{trilhasEmAndamento.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
            <p className="text-sm text-gray-600">Concluídas</p>
          </div>
          <p className="text-3xl font-bold text-[#0A2540]">{trilhasFinalizadas.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg"><BookOpen className="w-5 h-5 text-purple-600" /></div>
            <p className="text-sm text-gray-600">Total de Trilhas</p>
          </div>
          <p className="text-3xl font-bold text-[#0A2540]">{trilhasEmAndamento.length + trilhasFinalizadas.length}</p>
        </div>
      </div>

      {/* Trilhas em Andamento */}
      {trilhasEmAndamento.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#0A2540] mb-4">Trilhas em Andamento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {trilhasEmAndamento.map((trilha) => (
              <div
                key={trilha.id}
                onClick={() => navigate(`/app/trilha/${trilha.id}`)}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="h-40 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#0A2540] mb-4">{trilha.name}</h3>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4" /> Em andamento
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trilhas Finalizadas */}
      {trilhasFinalizadas.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-[#0A2540] mb-4">Trilhas Finalizadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {trilhasFinalizadas.map((trilha) => (
              <div
                key={trilha.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="h-28 sm:h-40 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-semibold text-[#0A2540] mb-4 break-words text-sm sm:text-base">{trilha.name}</h3>
                  <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Concluído
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {trilhasEmAndamento.length === 0 && trilhasFinalizadas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Você ainda não possui trilhas. Explore nossos cursos!</p>
        </div>
      )}
    </FrontofficeLayout>
  );
}

export default MeuProgresso;