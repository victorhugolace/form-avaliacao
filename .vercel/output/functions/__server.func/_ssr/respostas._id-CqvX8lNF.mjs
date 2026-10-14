import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn, A as AppHeader, B as Button, g as generateSigexPdf, C as Card, S as SIGEX_TASKS, L as LIKERT_QUESTIONS, c as LIKERT_LABELS, d as COMMENT_QUESTIONS, f as adminMe, k as adminGetResponse } from "./sigex.pdf-DdN_dIYl.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { R as Route } from "./router-CgBj8XiU.mjs";
import "../_libs/seroval.mjs";
import "../_libs/jspdf.mjs";
import { j as ChevronLeft, D as Download, C as Calendar, a as CircleCheck, T as TriangleAlert, b as CircleX } from "../_libs/lucide-react.mjs";
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
import "./server-54mtEly1.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
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
function ResponseDetail() {
  const {
    id
  } = Route.useParams();
  const navigate = useNavigate();
  const me = useServerFn(adminMe);
  const get = useServerFn(adminGetResponse);
  const meQ = useQuery({
    queryKey: ["admin-me"],
    queryFn: () => me()
  });
  reactExports.useEffect(() => {
    if (meQ.data && !meQ.data.isAdmin) navigate({
      to: "/respostas"
    });
  }, [meQ.data, navigate]);
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["admin-response", id],
    queryFn: () => get({
      data: {
        id
      }
    }),
    enabled: !!meQ.data?.isAdmin
  });
  const evaluation = data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-4xl px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/respostas", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "gap-2 text-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
          " Voltar para lista"
        ] }) }),
        evaluation && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => generateSigexPdf(evaluation), className: "gap-2 bg-emerald-600 hover:bg-emerald-500 text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
          " Baixar PDF"
        ] })
      ] }),
      isLoading || !meQ.data?.isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center py-12 text-slate-500 text-sm", children: "Carregando detalhes..." }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-rose-600", children: [
        "Erro: ",
        error.message
      ] }) : !evaluation ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-slate-500", children: "Avaliação não encontrada." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 md:p-8 space-y-8 bg-white border-slate-200 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "border-b border-slate-100 pb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600", children: "SIGEX MVP · Roteiro de Avaliação" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-2xl font-bold text-slate-900", children: evaluation.avaliador_nome || "(Avaliador não informado)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
              " ",
              evaluation.data_avaliacao
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-semibold ${evaluation.completed ? "text-emerald-700" : "text-amber-700"}`, children: evaluation.completed ? "Status: Concluída" : `Status: Em andamento` })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold uppercase tracking-wider text-slate-500 mb-3", children: "Tarefas Avaliadas (1 a 18)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 text-xs", children: SIGEX_TASKS.map((t) => {
            const ans = evaluation.tarefas?.[String(t.id)] || {
              status: "",
              observacoes: ""
            };
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-slate-700 mr-2", children: [
                  "#",
                  t.id
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-900", children: t.tarefa }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-slate-400", children: [
                  "[",
                  t.perfilSugerido,
                  "]"
                ] }),
                ans.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-slate-600 italic", children: [
                  "Obs: ",
                  ans.observacoes
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: ans.status === "S" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                " Sim"
              ] }) : ans.status === "Parcial" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[11px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
                " Parcial"
              ] }) : ans.status === "N" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded text-[11px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
                " Não"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "—" }) })
            ] }, t.id);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "border-t border-slate-100 pt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold uppercase tracking-wider text-slate-500 mb-3", children: "Questionário — Parte 1: Avaliação Geral" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 text-xs", children: LIKERT_QUESTIONS.map((q) => {
            const score = evaluation.avaliacao_geral?.[String(q.id)] || 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  q.id,
                  "."
                ] }),
                " ",
                q.text
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-900 shrink-0 ml-4", children: score > 0 ? `${score} - ${LIKERT_LABELS[score]}` : "—" })
            ] }, q.id);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "border-t border-slate-100 pt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold uppercase tracking-wider text-slate-500 mb-3", children: "Questionário — Parte 2: Comentários" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 text-xs", children: COMMENT_QUESTIONS.map((c) => {
            const ans = evaluation.comentarios?.[c.key] || "";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg border border-slate-200 bg-white", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900 mb-1", children: c.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-700 whitespace-pre-wrap leading-relaxed", children: ans || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 italic", children: "Sem resposta" }) })
            ] }, c.id);
          }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  ResponseDetail as component
};
