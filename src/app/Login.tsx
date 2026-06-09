import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import LoadingBar from "react-top-loading-bar";
import { toast } from "react-toastify";
import { authService } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loadingBarRef.current?.continuousStart();
    setLoading(true);

    try {
      const user = await authService.login(email, password);
      localStorage.setItem("user", JSON.stringify({ id: user.id, name: user.name, token: user.token })); // só o token está sendo armazenado (por enquanto)
      if (user.pendindPasswordChange) {
        navigate("/change-password");
      } else {
        toast.success(`Bem-vindo(a), ${user.name}!`);
        navigate("/app/home");
      }
    } catch (err: any) {
      console.error("Erro no login:", err);
      let message = "Erro ao realizar login";
      // Credenciais inválidas
      if (err.response?.status === 401) {
        message = "E-mail ou senha inválidos";
      }
      // Mensagem personalizada da API
      else if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      // API offline / sem conexão
      else if (err.request) {
        message = "Não foi possível conectar ao servidor";
      }
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      loadingBarRef.current?.complete();
    }
  };

  return (
    <div className="login-root">
      <LoadingBar color="#d4af37" ref={loadingBarRef} />
      <section className="animated-grid">
        {spans}
        <div className="signin-card">
          <div className="card-content">
            <h1 className="title">
              LT <span className="title-gold">Tax</span>
            </h1>
            <p className="subtitle">Clube de Contadores</p>
            <h2 className="form-title">Acesse sua conta</h2>

            <form onSubmit={handleLogin} className="form" noValidate>
              <div className="input-group">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" "
                  required />
                <i>E-mail</i>
                <Mail size={18} className="input-icon" />
              </div>
              <div className="input-group">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder=" " required />
                <i>Senha</i>
                <Lock size={18} className="input-icon" />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
                <LogIn size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      <style>{`
        /* ===== RESET e ESTILOS GLOBAIS (dentro do escopo) ===== */
        .login-root {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Quicksand', sans-serif;
        }
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');

        /* ---- Efeito de grade animada (adaptado do código original) ---- */
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
          background: var(--navy, #0a1a2f);
          z-index: 0;
        }
        .animated-grid::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(#0a1a2f, #d4af37, #0a1a2f);
          animation: animateGrid 5s linear infinite;
          opacity: 0.3;
        }
        @keyframes animateGrid {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @media (max-width: 900px) {
          .animated-grid span {
            width: calc(10vw - 2px);
            height: calc(10vw - 2px);
          }
        }
        @media (max-width: 600px) {
          .animated-grid span {
            width: calc(20vw - 2px);
            height: calc(20vw - 2px);
          }
        }

        /* ---- Card de login (estilo glassmorph + cores originais) ---- */
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
          animation: fadeUp 0.5s ease both;
          box-shadow: 0 25px 45px rgba(0,0,0,0.3);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
        }
        .logo-box {
          width: 64px;
          height: 64px;
          background: var(--gold, #d4af37);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          box-shadow: 0 8px 20px rgba(212,175,55,0.4);
        }
        .logo-box span {
          font-family: 'Quicksand', sans-serif;
          font-weight: 800;
          font-size: 28px;
          color: var(--navy, #0a1a2f);
        }
        .title {
          font-size: 3rem;
          font-weight: 700;
          color: white;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .title-gold {
          color: var(--gold, #d4af37);
        }
        .subtitle {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--gold, #d4af37);
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
          transition: all 0.2s;
        }
        .input-group input:hover {
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.04);
        }
        .input-group input:focus {
          border-color: var(--gold, #d4af37);
          box-shadow: 0 0 8px rgba(212,175,55,0.3);
        }
        .input-group i {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-style: normal;
          color: rgba(255,255,255,0.9);
          font-size: 0.9rem;
          transition: all 0.25s ease;
          pointer-events: none;
        }
        .input-group input:focus ~ i,
        .input-group input:not(:placeholder-shown)~ i {
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
          pointer-events: none;
          transition: all 0.25s ease;
        }
        .input-group input:focus ~ .input-icon {
          color: rgba(255,255,255,0.6);
        }
        .links {
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-size: 0.8rem;
        }
        .links a {
          color: #ffffff;
          text-decoration: none;
          transition: all 0.2s ease;
        } 

        .links a:hover {
          color: rgba(255,255,255,0.6);
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
          background: var(--gold, #d4af37);
          border: none;
          padding: 12px;
          border-radius: 40px;
          font-weight: 700;
          font-size: 1rem;
          color: var(--navy, #0a1a2f);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
        }
        .login-button:hover {
          background: #e5c158;
          transform: scale(1.02);
          box-shadow: 0 8px 20px rgba(212,175,55,0.4);
        }
        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        /* Ajuste responsivo */
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