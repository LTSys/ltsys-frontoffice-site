import { createBrowserRouter, Navigate } from "react-router-dom";

// Portal Selection Page
import Login from "./Login";
import ChangePassword from "./frontoffice/pages/ChangePassword";

// Protected Route
import ProtectedRoute from "../ProtectedRoute";

// Backoffice (Admin) Pages


// Frontoffice (Student) Pages
import StudentHome from "./frontoffice/pages/StudentHome";
import TrilhaDetails from "./frontoffice/pages/TrilhaDetails";
import MeuPerfil from "./frontoffice/pages/MeuPerfil";
import MeuProgresso from "./frontoffice/pages/MeuProgresso";
import Duvidas from "./frontoffice/pages/Duvidas"
import AulaPDF from "./frontoffice/pages/AulaPDF";
import AulaVideo from "./frontoffice/pages/AulaVideo";
import TrilhaConteudo from "./frontoffice/pages/TrilhaConteudo";

// Shared Components
import { PlaceholderPage } from "./shared/components/PlaceholderPage";
import { FrontPlaceholderPage } from "./shared/components/FrontPlaceholderPage";

import {
  BarChart3,
  MessageSquare,
  Settings,
  BookOpen,
  Play,
  Trophy,
  User,
} from "lucide-react";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/change-password",
    Component: ChangePassword,
  },
  // Frontoffice Routes - Student Area
  {
    element: <ProtectedRoute />,

    children: [

      {
        path: "/app",
        element: <Navigate to="/app/home" replace />,
      },

      {
        path: "/app/home",
        Component: StudentHome,
      },

      {
        path: "/app/trilha/:id",
        Component: TrilhaConteudo,
      },

      {
        path: "/app/trilha/:trilhaId/aula/video/:lessonId",
        Component: AulaVideo,
      },

      {
        path: "/app/trilha/:trilhaId/aula/pdf/:lessonId",
        Component: AulaPDF,
      },

      {
        path: "/app/perfil",
        Component: MeuPerfil,
      },

      {
        path: "/app/progresso",
        Component: MeuProgresso,
      },

      {
        path: "/app/duvidas",
        Component: Duvidas,
      },

      {
        path: "/app/trilhas",
        element: (
          <FrontPlaceholderPage
            title="Minhas Trilhas"
            description="Acesse todo o conteúdo das suas trilhas ativas"
            icon={BookOpen}
            activeItem="Minhas Trilhas"
          />
        ),
      },

      {
        path: "/app/assistindo",
        element: (
          <FrontPlaceholderPage
            title="Continuar Assistindo"
            description="Retome de onde você parou"
            icon={Play}
            activeItem="Continuar Assistindo"
          />
        ),
      },

      {
        path: "/app/duvidas-placeholder",
        element: (
          <FrontPlaceholderPage
            title="Dúvidas"
            description="Tire suas dúvidas com a mentora"
            icon={MessageSquare}
            activeItem="Dúvidas"
          />
        ),
      },
    ],
  },
]);
