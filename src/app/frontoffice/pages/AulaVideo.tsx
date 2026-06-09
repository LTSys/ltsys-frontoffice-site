"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Users,
  Lock,
  CheckCircle,
  FileText,
  Play,
  ArrowLeft,
} from "lucide-react";
import { FrontofficeLayout } from "../components/FrontofficeLayout";
import {
  getContentById,
  getConteudosPorTrilha,
  Content,
} from "@/services/contentService";
import { progressService, Progress } from "@/services/progressService";
import LoaderItem from "../components/loader/LoaderItem";

// Helperzaõ para formatar tempo (segundos → mm -> ss)
function fmtTime(secs: number) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function AulaVideo() {
  const { trilhaId, lessonId } = useParams<{
    trilhaId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();

  // dados do conteudo e sidebar
  const [content, setContent] = useState<Content | null>(null);
  const [sidebarContents, setSidebarContents] = useState<Content[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ID fixo da sua Video Library no Bunny
  const VIDEO_LIBRARY_ID = 672739; ///COLOCAR ISSO EM OUTRO LUGAR DEPOIS

  useEffect(() => {
    const fetchData = async () => {
      if (!lessonId) return;
      setLoading(true);
      try {
        //Busca conteúdo atual
        const contentData = await getContentById(Number(lessonId));
        setContent(contentData);

        //Busca lista de conteudos da trilha
        if (trilhaId) {
          const allContents = await getConteudosPorTrilha(Number(trilhaId));
          setSidebarContents(allContents);
        }

        //Busca progresso do user neste conteudo
        let prog = await progressService.obter(contentData.id);

        if (prog.status !== "COMPLETED") {
          //Se n tiver registro ou estiver iniciado, o service.iniciar
          prog = await progressService.iniciar(contentData.id);
        }

        setProgress(prog);
      } catch (err) {
        console.error("Erro ao carregar aula:", err);
        setError("Não foi possível carregar os dados da aula.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId, trilhaId]);

  //Marcar aula como concluida
  const markAsDone = async () => {
    if (!content) return;
    try {
      const prog = await progressService.concluir(content.id);
      setProgress(prog);
    } catch (err) {
      console.error("Erro ao concluir aula:", err);
    }
  };

  if (loading) {
    return (
      <FrontofficeLayout title="Carregando..." activeItem="Minhas Trilhas">
        <div
          className="flex justify-center items-center"
          style={{ height: "calc(100vh - 250px)" }}
        >
          <LoaderItem />
        </div>
      </FrontofficeLayout>
    );
  }

  if (error || !content) {
    return (
      <FrontofficeLayout title="Erro" activeItem="Minhas Trilhas">
        <div className="text-center text-red-600 p-8">
          {error || "Conteúdo não encontrado"}
        </div>
      </FrontofficeLayout>
    );
  }

  const isDone = progress?.status === "COMPLETED";

  // Montar a URL do iframe do Bunny
  const embedUrl = content.fileUrl
    ? `https://player.mediadelivery.net/embed/${VIDEO_LIBRARY_ID}/${content.fileUrl}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`
    : "";

  return (
    <FrontofficeLayout title={content.title} activeItem="Minhas Trilhas">
      <div className="av-page">
        {/* Header */}
        <div className="ap-header">
          {/* Botão voltar */}
          <button
            onClick={() => navigate(`/app/trilha/${trilhaId}`)}
            className="ap-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Conteúdos
          </button>
          {/* Título da trilha */}
          <div className="ap-header-info">
            <h1 className="ap-header-title">{content.title}</h1>
            <p className="ap-header-subtitle">Conteúdo da trilha selecionada</p>
          </div>
        </div>
        <div className="av-grid">
          {/* Coluna esquerda – player e informações */}
          <div className="av-left">
            {/* Player usando iframe oficial do Bunny */}
            <div className="av-player">
              <div
                style={{
                  position: "relative",
                  paddingTop: "56.25%", // 16:9
                }}
              >
                <iframe
                  src={embedUrl}
                  loading="lazy"
                  style={{
                    border: 0,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                  }}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  title={content.title}
                />
              </div>
            </div>

            {/* Informações da aula */}
            <div className="av-info-card">
              <span className="av-tag">
                ▶ {content.type === "VIDEO" ? "Vídeo" : "PDF"} · Módulo{" "}
                {content.trilhaId}
              </span>
              <h1 className="av-title">{content.title}</h1>
              <div className="av-meta">
                <span>
                  <Clock size={12} /> {fmtTime(content.totalDuration)}
                </span>
                <span>
                  <BookOpen size={12} /> Trilha {content.trilhaId}
                </span>
                <span>
                  <Users size={12} /> Mentora LT Tax
                </span>
              </div>
              <p className="av-desc">{content.description}</p>
            </div>

            {/* Navegação entre aulas (botões de voltar/avançar) */}
            <div className="av-nav-row">
              <button
                className="av-nav-prev"
                onClick={() => navigate(-1)}
                aria-label="Aula anterior"
              >
                <ChevronLeft size={15} /> Material anterior
              </button>
              <button
                className="av-nav-next"
                onClick={() => navigate(1)}
                aria-label="Próxima aula"
              >
                Próximo Material <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Sidebar – lista de aulas da trilha */}
          <aside className="av-sidebar">
            <div className="av-sidebar-head">
              <h3>Módulo {content.trilhaId}</h3>
              <span className="av-sidebar-prog">
                {sidebarContents.length} Materiais
              </span>
            </div>
            <div className="av-sidebar-prog-track">
              <div className="av-sidebar-prog-fill" style={{ width: "0%" }} />
            </div>
            <ul className="av-lessons-list">
              {sidebarContents.map((item) => (
                <SidebarLessonItem
                  key={item.id}
                  lesson={item}
                  isCurrent={item.id === content.id}
                />
              ))}
            </ul>
            <div className="av-sidebar-footer">
              <button
                className={`av-complete-btn${isDone ? " av-complete-done" : ""}`}
                onClick={markAsDone}
              >
                <CheckCircle size={16} />
                {isDone ? "Aula Concluída!" : "Marcar como Concluída"}
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Estilos */}
      <style>{`
        .av-page {
          padding: 24px 28px;
          max-width: 1200px;
        }
        .ap-header {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 20px;
        }
        .ap-back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: #0A2540;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          width: fit-content;
        }
        .ap-back-btn:hover {
          color: #1E3A5F;
        }
        .ap-header-title {
          font-size: 2rem;
          font-weight: 700;
          color: #0A2540;
          margin: 0;
        }
        .ap-header-subtitle {
          color: #475569;
          font-size: 15px;
          margin-top: 4px;
        }
        .av-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 16px;
          align-items: start;
        }
        .av-left {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .av-player {
          background: #000;
          border-radius: 10px;
          overflow: hidden;
        }
        .av-info-card {
          background: #0A2540;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(10, 37, 64, 0.06);
          border: 1px solid rgba(10, 37, 64, 0.06);
        }
        .av-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #d4af37;
          background: #fbf5dc;
          border-radius: 20px;
          padding: 3px 10px;
          margin-bottom: 10px;
        }
        .av-title {
          font-family: "DM Serif Display", Georgia, serif;
          font-size: 1.15rem;
          color: #fff;
          margin-bottom: 8px;
          line-height: 1.35;
        }
        .av-meta {
          display: flex;
          gap: 14px;
          font-size: 12px;
          color: #fff;
          margin-bottom: 14px;
        }
        .av-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .av-desc {
          font-size: 13.5px;
          color: #fff;
          line-height: 1.6;
          padding-top: 14px;
          border-top: 1px solid #e5eaf0;
          margin: 0;
        }
        .av-nav-row {
          display: flex;
          gap: 10px;
        }
        .av-nav-prev,
        .av-nav-next {
          flex: 1;
          border-radius: 8px;
          padding: 10px 14px;
          cursor: pointer;
          transition: all 150ms;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          font-weight: 500;
        }
        .av-nav-prev {
          background: #fff;
          border: 1.5px solid #e5eaf0;
          color: #5a6c7d;
        }
        .av-nav-prev:hover {
          border-color: #0a2540;
          color: #0a2540;
        }
        .av-nav-next {
          background: #0a2540;
          border: none;
          color: #fff;
          justify-content: flex-end;
        }
        .av-nav-next:hover {
          background: #164067;
        }
        /* Sidebar styles */
        .av-sidebar {
          background: #0A2540;
          border-radius: 10px;
          box-shadow: 0 1px 3px rgba(10, 37, 64, 0.06);
          border: 1px solid rgba(10, 37, 64, 0.06);
          overflow: hidden;
          position: sticky;
          top: 16px;
        }
        .av-sidebar-head {
          padding: 14px 18px;
          border-bottom: 1px solid #e5eaf0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .av-sidebar-head h3 {
          font-size: 13.5px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }
        .av-sidebar-prog {
          font-size: 12px;
          font-weight: 700;
          color: #d4af37;
        }
        .av-sidebar-prog-track {
          height: 3px;
          background: #e5eaf0;
        }
        .av-sidebar-prog-fill {
          height: 100%;
          background: #d4af37;
          transition: width 0.6s ease;
        }
        .av-lessons-list {
          list-style: none;
          margin: 0;
          padding: 0;
          max-height: 400px;
          overflow-y: auto;
        }
        .av-sidebar-footer {
          padding: 14px;
        }
        .av-complete-btn {
          width: 100%;
          background: #d4af37;
          color: #0a2540;
          border: none;
          border-radius: 8px;
          padding: 11px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 150ms;
          font-family: "DM Sans", sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .av-complete-btn:hover {
          background: #e8cc6a;
        }
        .av-complete-done {
          background: #d1fae5;
          color: #065f46;
        }
        .av-complete-done:hover {
          background: #a7f3d0;
        }
        @media (max-width: 860px) {
          .av-grid {
            grid-template-columns: 1fr;
          }
          .av-sidebar {
            position: static;
          }
          .av-page {
            padding: 16px;
          }
        }
      `}</style>
    </FrontofficeLayout>
  );
}

// Componente para cada item da sidebar (aula da trilha)
function SidebarLessonItem({
  lesson,
  isCurrent,
}: {
  lesson: Content;
  isCurrent: boolean;
}) {
  // Para simplificar, usamos um estado fixo: a aula atual é "current",
  // as demais "locked" (não concluídas). Você pode integrar com o progressService
  // se quiser exibir o status real de cada conteúdo.
  const [status] = useState<"done" | "current" | "locked">(
    isCurrent ? "current" : "locked",
  );

  const isLocked = status === "locked";
  const isDone = status === "done";

  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "11px 16px",
        borderBottom: "1px solid rgba(229,234,240,.4)",
        cursor: isLocked ? "not-allowed" : "pointer",
        background: isCurrent ? "#0A2540" : "transparent",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isDone
            ? "#D1FAE5"
            : lesson.type === "VIDEO"
              ? "#EFF6FF"
              : "#FFF7ED",
        }}
      >
        {isDone ? (
          <CheckCircle size={14} color="#059669" />
        ) : lesson.type === "VIDEO" ? (
          <Play
            size={12}
            fill={isLocked ? "#94A3B8" : "#2563EB"}
            stroke="none"
          />
        ) : (
          <FileText size={12} color={isLocked ? "#94A3B8" : "#EA580C"} />
        )}
      </div>
      <div style={{ flex: 1, opacity: isLocked ? 0.5 : 1 }}>
        <strong
          style={{
            fontSize: 12.5,
            fontWeight: 500,
            color: "#fff",
            display: "block",
          }}
        >
          {lesson.title}
        </strong>
        <span style={{ fontSize: 12, color: "#fff" }}>
          {lesson.type === "VIDEO" ? "Vídeo" : "PDF"} ·{" "}
          {fmtTime(lesson.totalDuration)}
        </span>
      </div>
      {isDone && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            background: "#D1FAE5",
            color: "#065F46",
            padding: "2px 7px",
            borderRadius: 20,
          }}
        >
          ✓
        </span>
      )}
      {isCurrent && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            background: "#FBF5DC",
            color: "#92660A",
            padding: "2px 7px",
            borderRadius: 20,
          }}
        >
          ▶
        </span>
      )}
      {isLocked && <Lock size={12} color="#94A3B8" />}
    </li>
  );
}
