import { Link } from "@tanstack/react-router";
import tjpbLogo from "@/assets/brasao-tjpb.png";
import lynoLogo from "@/assets/lyno-white.png";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, FileSpreadsheet } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-border/50 bg-slate-900 text-white shadow-sm sticky top-0 z-50 backdrop-blur-md bg-slate-900/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 md:gap-4">
          <a
            href="https://www.tjpb.jus.br/"
            target="_blank"
            rel="noopener noreferrer"
            title="Portal do TJPB"
            className="flex items-center"
          >
            <img
              src={tjpbLogo}
              alt="TJPB"
              className="h-10 w-auto opacity-95 transition-transform hover:scale-105"
            />
          </a>

          <div className="hidden sm:block h-8 w-px bg-slate-700" />

          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={lynoLogo}
              alt="Lyno Laboratório"
              className="h-8 w-auto hidden sm:block opacity-90 transition-transform group-hover:scale-105"
            />
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  SIGEX
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                  MVP
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Avaliação do Sistema
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800 text-xs gap-1.5 hidden md:inline-flex"
            >
              <ClipboardCheck className="h-3.5 w-3.5" />
              Novo Roteiro
            </Button>
          </Link>

          <Link to="/respostas">
            <Button
              size="sm"
              className="gap-2 bg-emerald-600 text-white hover:bg-emerald-500 font-medium shadow-sm transition-all"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline">Painel de</span> Respostas
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
