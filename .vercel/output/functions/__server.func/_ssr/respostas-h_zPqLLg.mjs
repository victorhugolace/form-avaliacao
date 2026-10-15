import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useServerFn, A as AppHeader, a as adminListResponses, b as adminLogout, B as Button, C as Card, S as SIGEX_TASKS, L as LIKERT_QUESTIONS, g as generateSigexPdf, c as LIKERT_LABELS, d as COMMENT_QUESTIONS, e as adminLogin, f as adminMe } from "./sigex.pdf-Bwiybpvo.mjs";
import { u as useQuery, a as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Toaster, I as Input, L as Label } from "./sonner-BKXzPP6m.mjs";
import "../_libs/seroval.mjs";
import "../_libs/jspdf.mjs";
import { L as LogOut, S as Search, U as User, C as Calendar, a as CircleCheck, T as TriangleAlert, b as CircleX, c as Star, D as Download, d as ChevronUp, e as ChevronDown, F as FileSpreadsheet } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./server-BhhT1TRu.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./router-Bpt5C6h6.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "fs";
import "path";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
function RespostasPage() {
  const me = useServerFn(adminMe);
  const {
    data,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["admin-me"],
    queryFn: () => me()
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-12 text-center text-slate-500 text-sm", children: "Carregando painel..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" }),
    data?.isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsx(RespostasList, { onLogout: () => refetch() }) : /* @__PURE__ */ jsxRuntimeExports.jsx(LoginForm, { onSuccess: () => refetch() })
  ] });
}
function LoginForm({
  onSuccess
}) {
  const login = useServerFn(adminLogin);
  const [username, setUsername] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await login({
        data: {
          username,
          password
        }
      });
      toast.success("Login realizado com sucesso!");
      onSuccess();
    } catch (err) {
      toast.error(err.message || "Credenciais inválidas");
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-md px-4 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-8 shadow-lg border-slate-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-slate-900", children: "Acesso ao Painel SIGEX" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-slate-500", children: "Informe suas credenciais para visualizar as avaliações consolidadas do MVP." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "u", className: "text-xs font-semibold text-slate-700", children: "Usuário" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "u", value: username, onChange: (e) => setUsername(e.target.value), placeholder: "admin", autoFocus: true, className: "mt-1" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "p", className: "text-xs font-semibold text-slate-700", children: "Senha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "p", type: "password", placeholder: "••••••", value: password, onChange: (e) => setPassword(e.target.value), className: "mt-1" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full bg-slate-900 text-white hover:bg-slate-800 font-semibold", disabled: busy, children: busy ? "Entrando..." : "Acessar Respostas" })
    ] })
  ] }) });
}
function RespostasList({
  onLogout
}) {
  const list = useServerFn(adminListResponses);
  const logout = useServerFn(adminLogout);
  const qc = useQueryClient();
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-responses"],
    queryFn: () => list()
  });
  const logoutMut = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      qc.removeQueries({
        queryKey: ["admin-responses"]
      });
      onLogout();
    }
  });
  const responses = data || [];
  const filteredResponses = responses.filter((r) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return r.avaliador_nome?.toLowerCase().includes(term) || r.data_avaliacao?.toLowerCase().includes(term);
  });
  function toggleCard(id) {
    setExpandedId((prev) => prev === id ? null : id);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-5xl px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-extrabold text-slate-900 tracking-tight", children: "Avaliações Consolidadas — SIGEX MVP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 mt-1", children: [
          "Total de ",
          responses.length,
          " roteiro(s) registrado(s)."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => logoutMut.mutate(), className: "gap-2 text-slate-700 self-start sm:self-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
        " Sair"
      ] })
    ] }),
    responses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3.5 top-3 h-4 w-4 text-slate-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Filtrar por nome do avaliador ou data...", className: "pl-10 text-xs bg-white border-slate-200" })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center py-12 text-slate-500 text-sm", children: "Carregando avaliações..." }) : filteredResponses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-12 text-center text-slate-500 text-sm border-slate-200", children: "Nenhuma avaliação encontrada." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: filteredResponses.map((r, idx) => {
      const cardId = r.id || String(idx);
      const isOpen = expandedId === cardId;
      let countS = 0;
      let countParcial = 0;
      let countN = 0;
      for (const t of SIGEX_TASKS) {
        const st = r.tarefas?.[String(t.id)]?.status;
        if (st === "S") countS++;
        else if (st === "Parcial") countParcial++;
        else if (st === "N") countN++;
      }
      let lSum = 0;
      let lCount = 0;
      for (const q of LIKERT_QUESTIONS) {
        const val = r.avaliacao_geral?.[String(q.id)];
        if (val && val > 0) {
          lSum += val;
          lCount++;
        }
      }
      const lAvg = lCount > 0 ? (lSum / lCount).toFixed(1) : "—";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden border-slate-200 shadow-sm bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 bg-white hover:bg-slate-50/70 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex-1 text-left flex items-start sm:items-center gap-3 cursor-pointer", onClick: () => toggleCard(cardId), "aria-expanded": isOpen, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-slate-900 text-base", children: r.avaliador_nome || "(Avaliador não identificado)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 text-xs text-slate-500", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
                  " ",
                  r.data_avaliacao || "Data não informada"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-semibold ${r.completed ? "text-emerald-700" : "text-amber-700"}`, children: r.completed ? "Concluída" : `Em andamento (Etapa ${r.current_step || 1})` })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 self-end sm:self-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 border border-emerald-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                " ",
                countS
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 font-medium text-amber-700 border border-amber-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
                " ",
                countParcial
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 font-medium text-rose-700 border border-rose-200", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
                " ",
                countN
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 text-amber-500 fill-amber-500" }),
                " ",
                lAvg
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: (e) => {
              e.stopPropagation();
              generateSigexPdf(r);
            }, className: "gap-1 text-xs h-8 text-slate-700", title: "Baixar PDF deste roteiro", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
              " PDF"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleCard(cardId), className: "p-1 text-slate-400 hover:text-slate-700", "aria-label": "Expandir detalhes", children: isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-5 w-5" }) })
          ] })
        ] }),
        isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-100 p-5 space-y-6 bg-slate-50/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold uppercase tracking-wider text-slate-500 mb-3", children: "Tarefas do Sistema (18 itens)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 text-xs", children: SIGEX_TASKS.map((t) => {
              const ans = r.tarefas?.[String(t.id)] || {
                status: "",
                observacoes: ""
              };
              const st = ans.status;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg border border-slate-200 bg-white", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-slate-500 shrink-0", children: [
                    "#",
                    t.id
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-800", children: t.tarefa }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-[10px] text-slate-400 font-medium", children: [
                      "[",
                      t.perfilSugerido,
                      "]"
                    ] }),
                    ans.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-slate-600 italic", children: [
                      'Obs: "',
                      ans.observacoes,
                      '"'
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 self-start sm:self-center", children: st === "S" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                  " Sim"
                ] }) : st === "Parcial" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
                  " Parcial"
                ] }) : st === "N" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
                  " Não"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-[11px]", children: "—" }) })
              ] }, t.id);
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-200 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold uppercase tracking-wider text-slate-500 mb-3", children: "Avaliação Geral (Escala 1 a 5)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 text-xs", children: LIKERT_QUESTIONS.map((q) => {
              const score = r.avaliacao_geral?.[String(q.id)] || 0;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-800 pr-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                    q.id,
                    "."
                  ] }),
                  " ",
                  q.text
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold px-2 py-0.5 rounded text-[11px] shrink-0 ${score >= 4 ? "bg-emerald-100 text-emerald-800" : score === 3 ? "bg-amber-100 text-amber-800" : score > 0 ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-400"}`, children: score > 0 ? `${score} - ${LIKERT_LABELS[score]}` : "—" })
              ] }, q.id);
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-slate-200 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold uppercase tracking-wider text-slate-500 mb-3", children: "Comentários e Sugestões (Questões 6 a 10)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 text-xs", children: COMMENT_QUESTIONS.map((c) => {
              const ans = r.comentarios?.[c.key] || "";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg border border-slate-200 bg-white", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900 mb-1", children: c.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-700 whitespace-pre-wrap leading-relaxed", children: ans || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 italic", children: "Sem resposta" }) })
              ] }, c.id);
            }) })
          ] })
        ] })
      ] }, cardId);
    }) })
  ] });
}
export {
  RespostasPage as component
};
