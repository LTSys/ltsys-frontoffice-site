import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import LoadingBar from "react-top-loading-bar";
import { toast } from "react-toastify";
import TermsModal from "../components/TermsModal.tsx";
import { changePassword } from "@/services/UserService.ts";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const navigate = useNavigate();
  const loadingBarRef = useRef<any>(null);

  const generateSpans = () => {
    const screenWidth = window.innerWidth;
    let cols = screenWidth <= 600 ? 5 : screenWidth <= 900 ? 10 : 16;
    const rows = Math.ceil(window.innerHeight / 60) + 2;

    return Array.from({ length: cols * rows }, (_, i) => <span key={i} />);
  };

  const [spans, setSpans] = useState(generateSpans);

  useEffect(() => {
    const handleResize = () => setSpans(generateSpans());
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChangePassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    loadingBarRef.current?.continuousStart();

    if (!newPassword || !confirmPassword) {
      setError("Preencha todos os campos");
      loadingBarRef.current?.complete();
      return;
    }

    if (newPassword.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      loadingBarRef.current?.complete();
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      loadingBarRef.current?.complete();
      return;
    }

    try {
      setLoading(true);

      let userData = JSON.parse(localStorage.getItem("user") ?? "null");

      const response = await changePassword(userData.token, newPassword);

      toast.success("Senha alterada com sucesso");

      // abre modal dos termos
      setShowTerms(true);

    } catch (err: any) {
      setError("Erro ao alterar senha");
    } finally {
      setLoading(false);
      loadingBarRef.current?.complete();
    }
  };

  const handleAcceptTerms = () => {
    setShowTerms(false);

    // redireciona para home
    navigate("/app/home");
  };

  return (
    <div className="login-root">
      <LoadingBar color="#d4af37" ref={loadingBarRef} />

      <section className="animated-grid">
        {spans}

        <div className="signin-card">
          <div className="card-content">
            <h1 className="title">LT <span className="title-gold">Tax</span> </h1>
            <p className="subtitle">Clube de Contadores</p>
            <h2 className="form-title">Alterar senha</h2>
            <form
              onSubmit={handleChangePassword}
              className="form">
              <div className="input-group">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder=" "
                  required
                />

                <i>Nova senha</i>

                <Lock
                  size={18}
                  className="input-icon"
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder=" "
                  required
                />

                <i>Confirmar senha</i>

                <Lock
                  size={18}
                  className="input-icon"
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "Alterando..."
                  : "Continuar"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {showTerms && (
        <TermsModal
          onAccept={handleAcceptTerms}
          onClose={() => setShowTerms(false)}
        />
      )}

      <style>{`
        .login-root {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Quicksand', sans-serif;
        }

        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');

        .animated-grid {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2px;
          flex-wrap: wrap;
          overflow: hidden;
          background: #0a1a2f;
          z-index: 0;
        }

        .animated-grid::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            #0a1a2f,
            #d4af37,
            #0a1a2f
          );

          animation: animateGrid 5s linear infinite;
          opacity: 0.3;
        }

        @keyframes animateGrid {
          0% {
            transform: translateY(-100%);
          }

          100% {
            transform: translateY(100%);
          }
        }

        .signin-card {
          position: absolute;
          width: 100%;
          max-width: 440px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 28px;
          padding: 2rem 2rem 2.5rem;
          z-index: 100;
          box-shadow: 0 25px 45px rgba(0,0,0,0.3);
        }

        .card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
        }

        .title {
          font-size: 3rem;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .title-gold {
          color: #d4af37;
        }

        .subtitle {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #d4af37;
          font-weight: 500;
          margin-top: -6px;
        }

        .form-title {
          font-size: 1.3rem;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          margin: 16px 0 8px;
        }

        .form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 22px;
          margin-top: 8px;
        }

        .input-group {
          position: relative;
          width: 100%;
        }

        .input-group input {
          width: 100%;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.15);
          outline: none;
          padding: 18px 40px 8px 16px;
          border-radius: 14px;
          color: white;
          font-size: 1rem;
        }

        .input-group i {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-style: normal;
          color: rgba(255,255,255,0.9);
          transition: all 0.25s ease;
          pointer-events: none;
        }

        .input-group input:focus ~ i,
        .input-group input:not(:placeholder-shown) ~ i {
          transform: translateY(-18px);
          font-size: 0.7rem;
          color: rgba(255,255,255,0.6);
        }

        .input-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.9);
        }

        .error-message {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #fecaca;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .login-button {
          background: #d4af37;
          border: none;
          padding: 12px;
          border-radius: 40px;
          font-weight: 700;
          font-size: 1rem;
          color: #0a1a2f;
          cursor: pointer;
          transition: all 0.2s;
        }

        .login-button:hover {
          background: #e5c158;
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 520px) {
          .signin-card {
            margin: 0 20px;
            padding: 1.5rem;
          }

          .title {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
}