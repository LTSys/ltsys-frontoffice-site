"use client";

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, Play, BarChart3, MessageSquare, User, LogOut } from "lucide-react";

interface NavItem { label: string; icon: React.ElementType; href: string; badge?: number; }

const PRIMARY_NAV: NavItem[] = [
  { label: "Início",               icon: Home,          href: "/app/home" },
  { label: "Minhas Trilhas",       icon: BookOpen,      href: "/app/trilhas" },
  { label: "Continuar Assistindo", icon: Play,          href: "/app/assistindo" },
];
const TOOLS_NAV: NavItem[] = [
  { label: "Meu Progresso",        icon: BarChart3,     href: "/app/progresso" },
  { label: "Dúvidas",              icon: MessageSquare, href: "/app/duvidas", badge: 3 },
];

export default function StudentSidebar({ activeItem }: { activeItem?: string }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside style={{ width:256, minHeight:"100vh", background:"#0A2540", display:"flex", flexDirection:"column", flexShrink:0, position:"relative", overflow:"hidden" }}>
      {/* decorative blob */}
      <div style={{ position:"absolute", top:-80, right:-80, width:200, height:200, background:"rgba(22,64,103,.6)", borderRadius:"50%", pointerEvents:"none" }} />

      {/* Logo */}
      <div style={{ padding:"26px 22px 18px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid rgba(255,255,255,.08)", flexShrink:0, position:"relative", zIndex:1 }}>
        <div style={{ width:38, height:38, background:"#D4AF37", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Serif Display',Georgia,serif", fontSize:15, fontWeight:700, color:"#0A2540", flexShrink:0, boxShadow:"0 2px 10px rgba(212,175,55,.4)" }}>LT</div>
        <div>
          <strong style={{ display:"block", fontSize:14, fontWeight:600, color:"#fff" }}>LT Tax</strong>
          <span style={{ display:"block", fontSize:10.5, color:"rgba(255,255,255,.42)", fontWeight:300, letterSpacing:".07em", textTransform:"uppercase" }}>Mentoria Tributária</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"14px 10px", display:"flex", flexDirection:"column", gap:1, overflowY:"auto", position:"relative", zIndex:1 }}>
        <NavLabel>Principal</NavLabel>
        {PRIMARY_NAV.map(i => <NavBtn key={i.href} item={i} active={active(i.href)} onClick={() => navigate(i.href)} />)}
        <NavLabel style={{ marginTop:8 }}>Ferramentas</NavLabel>
        {TOOLS_NAV.map(i => <NavBtn key={i.href} item={i} active={active(i.href)} onClick={() => navigate(i.href)} />)}
        <div style={{ flex:1 }} />
        <NavBtn item={{ label:"Meu Perfil", icon:User, href:"/app/perfil" }} active={active("/app/perfil")} onClick={() => navigate("/app/perfil")} />
      </nav>

      {/* User strip */}
      <button onClick={() => navigate("/app/perfil")} style={{ margin:"0 10px 12px", padding:"14px 12px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", borderRadius:9, background:"none", border:"none", borderTop:"1px solid rgba(255,255,255,.08)", transition:"background 150ms", width:"calc(100% - 20px)", textAlign:"left", position:"relative", zIndex:1 }}
        onMouseOver={e => (e.currentTarget.style.background="rgba(255,255,255,.05)")}
        onMouseOut={e => (e.currentTarget.style.background="none")}
      >
        <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#D4AF37 0%,#B8941E 100%)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12.5, fontWeight:700, color:"#0A2540", flexShrink:0, boxShadow:"0 2px 8px rgba(212,175,55,.35)" }}>MS</div>
        <div style={{ flex:1, minWidth:0 }}>
          <strong style={{ display:"block", fontSize:13, fontWeight:500, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>Maria Silva</strong>
          <span style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>Aluna ativa</span>
        </div>
        <LogOut size={14} style={{ color:"rgba(255,255,255,.28)", flexShrink:0 }} />
      </button>
    </aside>
  );
}

function NavLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize:10, fontWeight:700, letterSpacing:".11em", textTransform:"uppercase", color:"rgba(255,255,255,.26)", padding:"10px 12px 5px", margin:0, ...style }}>{children}</p>;
}

function NavBtn({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  const [hov, setHov] = React.useState(false);
  const bg = active ? "rgba(212,175,55,.13)" : hov ? "rgba(255,255,255,.07)" : "none";
  const col = active ? "#D4AF37" : hov ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.55)";
  return (
    <button onClick={onClick} onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}
      style={{ display:"flex", alignItems:"center", gap:11, padding:"9px 12px", borderRadius:8, border:"none", background:bg, width:"100%", textAlign:"left", cursor:"pointer", color:col, fontSize:13.5, fontWeight:400, fontFamily:"'DM Sans',sans-serif", transition:"background 150ms,color 150ms", position:"relative" }}
      aria-current={active ? "page" : undefined}
    >
      {active && <span style={{ position:"absolute", left:0, top:6, bottom:6, width:3, background:"#D4AF37", borderRadius:"0 3px 3px 0" }} />}
      <Icon size={16} style={{ flexShrink:0, opacity: active ? 1 : .7 }} />
      {item.label}
      {item.badge != null && (
        <span style={{ marginLeft:"auto", background:"#D4AF37", color:"#0A2540", fontSize:10, fontWeight:700, borderRadius:20, padding:"2px 7px", lineHeight:1.4 }}>{item.badge}</span>
      )}
    </button>
  );
}
