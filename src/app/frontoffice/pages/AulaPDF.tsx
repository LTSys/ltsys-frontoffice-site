"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Lock,
  CheckCircle,
  BookOpen,
  Send,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { FrontofficeLayout } from "../components/FrontofficeLayout";
import {
  getContentById,
  getConteudosPorTrilha,
  Content,
} from "@/services/contentService";
import { getSignedURL } from "@/services/pdfService";
import { progressService, Progress } from "@/services/progressService";
import LoaderItem from "../components/loader/LoaderItem";

import { Document, Page, pdfjs } from "react-pdf";

// Worker do PDF.js via CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Annotation {
  id: number;
  page: number;
  text: string;
  date: string;
}

export default function AulaPDF() {
  const { trilhaId, lessonId } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState<Content | null>(null);
  const [sidebarContents, setSidebarContents] = useState<Content[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [newNote, setNewNote] = useState("");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!lessonId) return;
      setLoading(true);
      try {
        const contentData = await getContentById(Number(lessonId));
        setContent(contentData);

        if (trilhaId) {
          const all = await getConteudosPorTrilha(Number(trilhaId));
          setSidebarContents(all);
        }

        let prog = await progressService.obter(contentData.id);
        if (prog.status !== "COMPLETED") {
          prog = await progressService.iniciar(contentData.id);
        }
        setProgress(prog);

        if (contentData.type === "PDF" && contentData.fileUrl) {
          const token = getTokenFromLocalStorage();
          if (!token) {
            console.log("SEM TOKEN");
            setError("Sessão expirada");
            return;
          }
          const assignedUrl = await getSignedURL(contentData.fileUrl, token);
          setPdfUrl(assignedUrl);
        }
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar PDF.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lessonId, trilhaId]);

  const getTokenFromLocalStorage = (): string | null => {
    try {
      const obj = JSON.parse(localStorage.getItem("user") ?? "{}");
      return obj.token || null;
    } catch {
      return null;
    }
  };

  const markAsDone = async () => {
    if (!content) return;
    try {
      const prog = await progressService.concluir(content.id);
      setProgress(prog);
    } catch (err) {
      console.error(err);
    }
  };

  const addAnnotation = () => {
    if (!newNote.trim()) return;
    setAnnotations((prev) => [
      ...prev,
      {
        id: Date.now(),
        page: currentPage,
        text: newNote.trim(),
        date: new Date().toLocaleString(),
      },
    ]);
    setNewNote("");
  };

  const removeAnnotation = (id: number) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) {
    return (
      <FrontofficeLayout title="Carregando..." activeItem="Minhas Trilhas">
        <div className="flex justify-center items-center" style={{ height: 'calc(100vh - 250px)' }}>
          <LoaderItem />
        </div>
      </FrontofficeLayout>
    );
  }

  if (error || !content) {
    return (
      <FrontofficeLayout title="Erro" activeItem="Minhas Trilhas">
        <div className="text-red-600 p-8">
          {error || "Conteúdo não encontrado"}
        </div>
      </FrontofficeLayout>
    );
  }

  const isDone = progress?.status === "COMPLETED";

  return (
    <FrontofficeLayout title={content.title} activeItem="Minhas Trilhas">
      <div className="ap-page">
        {/* Header */}
        <div className="ap-header">
          <button
            onClick={() => navigate(`/app/trilha/${trilhaId}`)}
            className="ap-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Conteúdos
          </button>
          <div className="ap-header-info">
            <h1 className="ap-header-title">{content.title}</h1>
            <p className="ap-header-subtitle">Conteúdo da trilha selecionada</p>
          </div>
        </div>

        <div className="ap-grid">
          {/*PDF Viewer com react-pdf */}
          <div className="ap-left">
            <div className="ap-viewer">
              <div className="ap-toolbar">
                <FileText size={14} style={{ color: "rgba(255,255,255,.6)" }} />
                <span className="ap-filename">{content.fileUrl}</span>
              </div>

              <div className="ap-pdf-wrap">
                {pdfUrl ? (
                  <>
                    <Document
                      file={pdfUrl}
                      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                      loading={<div className="ap-pdf-loading">Carregando PDF…</div>}
                      error={<div className="ap-pdf-error">Erro ao carregar PDF.</div>}
                    >
                      <Page
                        pageNumber={currentPage}
                        scale={typeof window !== "undefined" && window.innerWidth < 768 ? 0.6 : 1.2}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        className="ap-pdf-page"
                      />
                    </Document>

                    {numPages > 1 && (
                      <div className="ap-pdf-controls">
                        <button
                          className="ap-pdf-btn"
                          disabled={currentPage <= 1}
                          onClick={() => setCurrentPage((p) => p - 1)}
                        >
                          <ChevronLeft size={16} /> Anterior
                        </button>
                        <span className="ap-pdf-pageinfo">
                          Página {currentPage} de {numPages}
                        </span>
                        <button
                          className="ap-pdf-btn"
                          disabled={currentPage >= numPages}
                          onClick={() => setCurrentPage((p) => p + 1)}
                        >
                          Próxima <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p>PDF não disponível</p>
                )}
              </div>
            </div>

            {/* Informações da aula */}
            <div className="ap-info-card">
              <span className="ap-tag">📄 PDF · Módulo {content.trilhaId}</span>
              <h1 className="ap-title">{content.title}</h1>
              <div className="ap-meta">
                <span><FileText size={12} /> Documento</span>
                <span><BookOpen size={12} /> Trilha {content.trilhaId}</span>
              </div>
              <p className="ap-desc">{content.description}</p>
            </div>

            <div className="ap-nav-row">
              <button className="ap-nav-prev" onClick={() => navigate(-1)}>
                <ChevronLeft size={15} /> Aula anterior
              </button>
              <button className="ap-nav-next" onClick={() => navigate(1)}>
                Próxima aula <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="ap-sidebar">
            <div className="ap-sidebar-card">
              <div className="ap-sidebar-head">
                <h3>Módulo {content.trilhaId}</h3>
                <span>
                  {sidebarContents.filter((c) => c.type === "PDF").length} PDFs
                </span>
              </div>
              <div className="av-sidebar-prog-track">
                <div className="av-sidebar-prog-fill" style={{ width: "0%" }} />
              </div>
              <ul className="ap-lessons-list">
                {sidebarContents.map((item) => (
                  <SidebarLessonItem
                    key={item.id}
                    lesson={item}
                    isCurrent={item.id === content.id}
                  />
                ))}
              </ul>
              <div className="ap-sidebar-footer">
                <button
                  className={`ap-complete-btn${isDone ? " ap-done" : ""}`}
                  onClick={markAsDone}
                >
                  <CheckCircle size={16} />
                  {isDone ? "PDF Marcado como Lido!" : "Marcar PDF como Lido"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        /* Estilos já existentes – mantêm-se iguais */
        .ap-page { padding: 24px 28px; max-width: 1200px; }
        .ap-header { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;}
        .ap-back-btn { display: flex; align-items: center; gap: 8px; background: transparent; border: none; color: #0A2540; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; width: fit-content;}
        .ap-back-btn:hover { color: #1E3A5F; }
        .ap-header-title { font-size: 2rem; font-weight: 700; color: #0A2540; margin: 0; }
        .ap-header-subtitle { color: #475569; font-size: 15px; margin-top: 4px; }
        .ap-grid { display: grid; grid-template-columns: 1fr 300px; gap: 16px; align-items: start; }
        .ap-left { display: flex; flex-direction: column; gap: 12px; }
        .ap-viewer { background: #fff; border-radius: 10px; border: 1px solid rgba(10,37,64,.06); overflow: hidden; }
        .ap-toolbar { background: #1E293B; padding: 10px 16px; display: flex; align-items: center; gap: 8px; }
        .ap-filename { flex: 1; font-size: 12px; color: rgba(255,255,255,.65); }
        .ap-pdf-wrap { background: #525659; min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 16px; overflow-y: auto; }
        .ap-pdf-page { box-shadow: 0 4px 12px rgba(0,0,0,.35); margin-bottom: 12px; }
        .ap-pdf-loading, .ap-pdf-error { color: #fff; padding: 40px; text-align: center; }
        .ap-pdf-controls { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 12px; background: #1E293B; width: 100%; border-radius: 0 0 10px 10px; }
        .ap-pdf-btn { display: flex; align-items: center; gap: 4px; background: #D4AF37; color: #0A2540; border: none; border-radius: 6px; padding: 6px 12px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .ap-pdf-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .ap-pdf-pageinfo { color: rgba(255,255,255,.8); font-size: 13px; }
        .ap-info-card, .ap-sidebar-card { background: #0A2540; border-radius: 10px; padding: 20px; border: 1px solid rgba(10,37,64,.06); }
        .ap-tag { background: #FFF7ED; color: #EA580C; border-radius: 20px; padding: 3px 10px; display: inline-block; font-size: 10px; margin-bottom: 10px; }
        .ap-title { font-size: 1.30rem; color: #fff; margin-bottom: 8px; }
        .ap-meta { display: flex; gap: 14px; font-size: 12px; color: #fff; margin-bottom: 14px; }
        .ap-desc { font-size: 13.5px; color: #fff; line-height: 1.6; padding-top: 14px; border-top: 1px solid #E5EAF0; }
        .ap-nav-row { display: flex; gap: 10px; margin-top: 8px; }
        .ap-nav-prev, .ap-nav-next { flex: 1; border-radius: 8px; padding: 10px; background: #fff; border: 1px solid #E5EAF0; cursor: pointer; }
        .ap-nav-next { background: #0A2540; color: #fff; justify-content: flex-end; display: flex; align-items: center; gap: 8px; }
        .ap-sidebar { display: flex; flex-direction: column; gap: 12px; position: sticky; top: 16px; }
        .ap-sidebar-head, .ap-lessons-list { color: #fff}
        .av-sidebar-prog { font-size: 12px; font-weight: 700; color: #d4af37; }
        .av-sidebar-prog-track { height: 3px; background: #e5eaf0; }
        .av-sidebar-prog-fill { height: 100%; background: #d4af37; transition: width 0.6s ease; }
        .ap-sidebar-footer { padding: 14px; }
        .ap-lessons-list { list-style: none; padding: 0; margin: 0; }
        .ap-complete-btn { width: 100%; background: #D4AF37; padding: 11px; border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; border: none; }
        .ap-done { background: #D1FAE5; color: #065F46; }
        @media (max-width: 860px) { .ap-grid { grid-template-columns: 1fr; } .ap-sidebar { position: static; } }
      `}</style>
    </FrontofficeLayout>
  );
}

function SidebarLessonItem({
  lesson,
  isCurrent,
}: {
  lesson: Content;
  isCurrent: boolean;
}) {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "11px 16px",
        borderBottom: "1px solid rgba(229,234,240,.4)",
        cursor: "pointer",
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
          background: "#FFF7ED",
        }}
      >
        <FileText size={12} color="#EA580C" />
      </div>
      <div style={{ flex: 1 }}>
        <strong style={{ fontSize: 12.5, fontWeight: 500, color: "#fff" }}>
          {lesson.title}
        </strong>
        <span style={{ fontSize: 11, color: "#5A6C7D", display: "block" }}>
          PDF · Documento
        </span>
      </div>
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
    </li>
  );
}