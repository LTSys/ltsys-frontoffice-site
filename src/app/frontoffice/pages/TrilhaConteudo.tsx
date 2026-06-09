"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  Play,
  FileText,
  Lock,
  CheckCircle,
  Search,
  Clock,
  BookOpen,
  Download,
  Star,
  Filter,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { FrontofficeLayout } from "../components/FrontofficeLayout";
import { getConteudosPorTrilha, Content } from "@/services/contentService";
import { trailService } from "@/services/trailService";
import { progressService, Progress } from "@/services/progressService";
import LoaderItem from "../components/loader/LoaderItem";
import { EmptyTrailState } from "../components/EmptyTrailState";

export default function TrilhaConteudo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const trilhaId = Number(id);

  const [conteudos, setConteudos] = useState<Content[]>([]);
  const [trilha, setTrilha] = useState<any>(null);
  const [progressos, setProgressos] = useState<Record<number, Progress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const trilhaData = await trailService.getTrailById(trilhaId);
        setTrilha(trilhaData);
        const dados = await getConteudosPorTrilha(trilhaId);
        setConteudos(dados);

        // Busca o progresso de cada conteúdo
        const promessas = dados.map((c) => progressService.obter(c.id));
        const resultados = await Promise.allSettled(promessas);

        const mapa: Record<number, Progress> = {};
        resultados.forEach((res, index) => {
          if (res.status === "fulfilled") {
            mapa[dados[index].id] = res.value;
          } else {
            // fallback: progresso não iniciado
            mapa[dados[index].id] = {
              id: null,
              usuarioId: 0,
              materialId: dados[index].id,
              status: "NOT_STARTED",
              dataInicio: null,
              dataConclusao: null,
            };
          }
        });
        setProgressos(mapa);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [trilhaId]);

  const iniciar = async (materialId: number) => {
    try {
      const prog = await progressService.iniciar(materialId);
      setProgressos((prev) => ({ ...prev, [materialId]: prog }));
    } catch (err) {
      console.error("Erro ao iniciar:", err);
    }
  };

  const concluir = async (materialId: number) => {
    try {
      const prog = await progressService.concluir(materialId);
      setProgressos((prev) => ({ ...prev, [materialId]: prog }));
    } catch (err) {
      console.error("Erro ao concluir:", err);
    }
  };

  const abrirAula = (conteudo: Content) => {
    const { type, id } = conteudo;
    const rota =
      type === "VIDEO"
        ? `/app/trilha/${trilhaId}/aula/video/${id}`
        : `/app/trilha/${trilhaId}/aula/pdf/${id}`;
    navigate(rota);
  };

  if (loading)
    return (
      <FrontofficeLayout title="Carregando...">
        <div
          className="flex justify-center items-center"
          style={{ height: "calc(100vh - 250px)" }}
        >
          <LoaderItem />
        </div>
      </FrontofficeLayout>
    );

  return (
    <FrontofficeLayout title="Conteúdo da Trilha" activeItem="Minhas Trilhas">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 overflow-x-hidden">
        {/* Botão voltar */}
        <button
          onClick={() => navigate("/app/home")}
          className="flex items-center gap-2 text-[#0A2540]-400 hover:text-gray mb-6 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Início
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-[#0A2540] mb-2 break-words">
            Trilha <span className="text-[#0A2540]">{trilha?.name}</span>
          </h1>

          {conteudos.length > 0 && (
            <p className="text-gray-700 text-lg">Conteúdos disponíveis</p>
          )}
        </div>

        {/* Lista */}
        {conteudos.length > 0 ? (
          <div className="space-y-4">
            {conteudos.map((conteudo) => {
              const prog = progressos[conteudo.id] || {
                status: "NAO_INICIADO",
              };

              const isDone = prog.status === "COMPLETED";
              const isProgress = prog.status === "IN_PROGRESS";

              return (
                <button
                  key={conteudo.id}
                  className="w-full bg-[#162133] border border-white/10 rounded-2xl p-6 hover:border-[#d4af37]/40 hover:bg-[#1c2a40] transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    {/* Ícone */}
                    <div
                      className={`
                        flex items-center justify-center
                        w-12 h-12 sm:w-16 sm:h-16
                        rounded-xl transition-all
                        ${
                          conteudo.type === "VIDEO"
                            ? "bg-blue-500/10 group-hover:bg-blue-500/20"
                            : "bg-orange-500/10 group-hover:bg-orange-500/20"
                        }
                   `}
                    >
                      {conteudo.type === "VIDEO" ? (
                        <Play className="w-5 h-5 sm:w-7 sm:h-7 text-blue-400" />
                      ) : (
                        <FileText className="w-5 h-5 sm:w-7 sm:h-7 text-orange-400" />
                      )}
                    </div>

                    {/* Informações */}
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-[#d4af37] transition-colors break-words">
                          {conteudo.title}
                        </h3>

                        {isDone && (
                          <span className="text-xs bg-emerald-500/15 text-emerald-400 px-3 py-1 rounded-full">
                            Concluído
                          </span>
                        )}

                        {isProgress && (
                          <span className="text-xs bg-blue-500/15 text-blue-400 px-3 py-1 rounded-full">
                            Em andamento
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-3 break-words whitespace-normal">
                        {conteudo.description ||
                          "Conteúdo disponível na trilha"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span
                          className={`flex items-center gap-1
                        ${
                          conteudo.type === "VIDEO"
                            ? "text-blue-400"
                            : "text-orange-400"
                        }
                      `}
                        >
                          {conteudo.type === "VIDEO" ? (
                            <>
                              <Play className="w-3 h-3" />
                              Vídeo
                            </>
                          ) : (
                            <>
                              <FileText className="w-3 h-3" />
                              PDF
                            </>
                          )}
                        </span>

                        {conteudo.totalDuration > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {conteudo.totalDuration} min
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          abrirAula(conteudo);
                        }}
                        className="w-full sm:w-auto bg-[#d4af37] hover:bg-[#e5c158] text-[#0A2540] px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                      >
                        Iniciar
                      </button>

                      {isProgress && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            concluir(conteudo.id);
                          }}
                          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                        >
                          Concluir
                        </button>
                      )}

                      <ChevronRight className="hidden sm:block w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyTrailState />
        )}
      </div>
    </FrontofficeLayout>
  );
}
