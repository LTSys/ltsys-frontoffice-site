// src/app/frontoffice/pages/StudentHome.tsx
import { useEffect, useState } from 'react';
import { loadUserData } from '@/services/UserService';
import { FrontofficeLayout } from '../components/FrontofficeLayout';
import { Play, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { trailService, Trail } from '@/services/trailService';
import LoaderItem from '../components/loader/LoaderItem';

function StudentHome() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ nome: '' });
  const [trilhasEmAndamento, setTrilhasEmAndamento] = useState<Trail[]>([]);
  const [minhasTrilhas, setMinhasTrilhas] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await loadUserData();

        setUsuario({
          nome: response.name
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // user salvos no localStorage durante o login
        const userStorage = localStorage.getItem('user');
        if (userStorage) {
          const user = JSON.parse(userStorage);
          setUsuario({ nome: user.name || 'Aluno' });
        } else {
          setUsuario({ nome: 'Aluno' });
        }

        const todasTrilhas = await trailService.getAllTrails();
        const trilhasAtivas = todasTrilhas.filter(t => t.active === true);
        setMinhasTrilhas(trilhasAtivas);
        setTrilhasEmAndamento([]); // ainda sem progresso
      } catch (error) {
        console.error('Erro ao carregar trilhas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <FrontofficeLayout activeItem="Início" title="Início">
        <div className="flex justify-center items-center" style={{ height: 'calc(100vh - 250px)' }}>
            <LoaderItem/>
        </div>
      </FrontofficeLayout>
    );
  }

  return (
    <FrontofficeLayout activeItem="Início" title="Início">
      {/* Hero Banner */}
      <div className="mb-8 -mt-8 -mx-8">
        <div className="relative h-80 overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1770364022652-f3af53a889d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjb25maWRlbnQlMjBzbWlsaW5nJTIwd29tYW4lMjBhcm1zJTIwY3Jvc3NlZCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzU2NzE4MDN8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Confident professional"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540]/85 to-transparent flex items-center">
            <div className="px-12 max-w-7xl mx-auto w-full">
              <h1 className="text-5xl font-bold text-white mb-4">
                Bem-vindo(a) de volta, {usuario.nome}!
              </h1>
              <p className="text-gray-100 text-xl">Continue sua jornada de aprendizado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Continuar Trilha (se houver) */}
      {trilhasEmAndamento.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#0A2540] mb-4">Continuar Trilha</h2>
          <div className="space-y-4">
            {trilhasEmAndamento.map((trilha) => (
              <div key={trilha.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-6 p-6">
                  <div className="w-48 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{trilha.description}</p>
                    <h3 className="text-lg font-semibold text-[#0A2540] mb-4">{trilha.name}</h3>
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">Em andamento</span>
                  </div>
                  <button
                    onClick={() => navigate(`/app/trilha/${trilha.id}`)}
                    className="px-6 py-3 bg-[#0A2540] text-white rounded-lg hover:bg-[#1a3a5f] transition-all font-medium flex-shrink-0"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Minhas Trilhas */}
      <div>
        <h2 className="text-xl font-bold text-[#0A2540] mb-4">Minhas Trilhas</h2>
        {minhasTrilhas.length === 0 ? (
          <p className="text-gray-500">Nenhuma trilha disponível no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {minhasTrilhas.map((trilha) => (
              <div
                key={trilha.id}
                onClick={() => navigate(`/app/trilha/${trilha.id}`)}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="h-40 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-[#0A2540] mb-2">{trilha.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{trilha.description}</p>
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    Ativa
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FrontofficeLayout>
  );
}

export default StudentHome;