import {
  Bell,
  Search,
  Menu,
  User,
  TrendingUp,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { loadUserData } from "@/services/UserService";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface StudentHeaderProps {
  title?: string;
}

export function StudentHeader({ title = "LT Tax" }: StudentHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(() => {
  const userStorage = localStorage.getItem("user");
  if (userStorage) {
    const parsed = JSON.parse(userStorage);
    return { name: parsed.name || parsed.name || "Colaborador", email: "" };
  }
  return { name: "Colaborador", email: "" };
});

useEffect(() => {
  fetchUser();
}, []);

const fetchUser = async () => {
  try {
    const data = await loadUserData();
    setUsuario({
      name: data.name || "Colaborador",
      email: data.email || "",
    });
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
    const userStorage = localStorage.getItem("user");
    if (userStorage) {
      const user = JSON.parse(userStorage);
      setUsuario({ name: user.name || user.name || "Colaborador", email: "" });
    }
  }
};

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }
    if (menuOpen || notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, notificationsOpen]);

  const handleMenuClick = (path: string) => {
    setMenuOpen(false);
    if (path === "/logout") {
      localStorage.removeItem("user");
      navigate("/");
    } else {
      navigate(path);
    }
  };

  const iniciais = usuario.name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="bg-[#0A2540] border-b border-gray-200 px-4 md:px-8 py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto flex-wrap lg:flex-nowrap">
        {/* Logo - Esquerda */}
        <button
          onClick={() => navigate("/app/home")}
          className="py-2 text-left hover:opacity-80 transition-opacity cursor-pointer shrink-0"
        >
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#FFFFFF]">
            LT <span className="text-[#D4AF37]">Tax</span>
          </h1>
          <p className="hidden sm:block text-xs text-[#FFFFFF]/60 mt-1">
            Mentoria Premium
          </p>
        </button>

        {/* Barra de busca - central */}
        <div className="hidden md:block flex-1 max-w-2xl relative">
          <div className="relative z-10">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar trilhas, materiais..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2540]/20 focus:border-[#0A2540] bg-gray-50"
            />
          </div>
        </div>

        {/* Ações da direita */}
        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          {/* Menu hamburguer */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 md:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-30">
                <button
                  onClick={() => handleMenuClick("/app/perfil")}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-200 flex items-center gap-3 text-gray-700 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Meu Perfil</span>
                </button>
                <button
                  onClick={() => handleMenuClick("/app/progresso")}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-200 flex items-center gap-3 text-gray-700 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Meu Progresso</span>
                </button>
                <button
                  onClick={() => handleMenuClick("/app/duvidas")}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-200 flex items-center gap-3 text-gray-700 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Dúvidas</span>
                </button>
              </div>
            )}
          </div>

          {/* Icone de notificaçoes */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-30">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhuma notificação no momento.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Area do user e logout */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/app/perfil")}
              className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941E] flex items-center justify-center text-[#0A2540] font-bold text-sm shadow-lg">
                {iniciais}
              </div>
              <div className="text-left hidden md:block">
                <strong className="block text-sm text-white leading-none">
                  {usuario.name}
                </strong>
              </div>
            </button>
            <button
              onClick={() => handleMenuClick("/logout")}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
