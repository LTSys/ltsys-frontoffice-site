"use client";

import React from "react";
import { useNavigate } from 'react-router-dom';
import { Bell, Play } from "lucide-react";

export default function StudentHeader({ title }: { title: string }) {
  const navigate = useNavigate();
  const [bellHov, setBellHov] = React.useState(false);
  const [ctaHov, setCtaHov]   = React.useState(false);

  return (
    <header style={{ background:"#fff", borderBottom:"1px solid #E5EAF0", padding:"0 32px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, boxShadow:"0 1px 3px rgba(10,37,64,.06)" }}>
      <h1 style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:"1.25rem", color:"#0A2540", fontWeight:400, margin:0 }}>{title}</h1>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <button
          style={{ display:"flex", alignItems:"center", gap:6, border:"1.5px solid", borderColor: bellHov ? "#0A2540" : "#E5EAF0", borderRadius:8, padding:"7px 14px", fontSize:13, fontWeight:500, background:"none", cursor:"pointer", color: bellHov ? "#0A2540" : "#5A6C7D", transition:"all 150ms", fontFamily:"'DM Sans',sans-serif" }}
          onMouseOver={() => setBellHov(true)} onMouseOut={() => setBellHov(false)}
          aria-label="Notificações"
        >
          <Bell size={14} /> Notificações
        </button>
        <button
          style={{ display:"flex", alignItems:"center", gap:6, background: ctaHov ? "#164067" : "#0A2540", border:"none", borderRadius:8, padding:"8px 18px", fontSize:13, fontWeight:500, color:"#fff", cursor:"pointer", transition:"all 150ms", transform: ctaHov ? "translateY(-1px)" : "none", boxShadow: ctaHov ? "0 4px 16px rgba(10,37,64,.2)" : "none", fontFamily:"'DM Sans',sans-serif" }}
          onMouseOver={() => setCtaHov(true)} onMouseOut={() => setCtaHov(false)}
          onClick={() => navigate("/app/trilhas")}
        >
          <Play size={13} fill="#fff" stroke="none" /> Continuar Trilha
        </button>
      </div>
    </header>
  );
}
