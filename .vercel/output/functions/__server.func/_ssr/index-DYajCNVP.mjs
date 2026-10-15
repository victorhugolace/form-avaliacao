import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn, i as getInitialEvaluation, S as SIGEX_TASKS, L as LIKERT_QUESTIONS, A as AppHeader, C as Card, g as generateSigexPdf, B as Button, c as LIKERT_LABELS, d as COMMENT_QUESTIONS, h as cn, s as saveResponse, j as getResponseById } from "./sigex.pdf-Bwiybpvo.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Toaster, L as Label, I as Input } from "./sonner-BKXzPP6m.mjs";
import "../_libs/seroval.mjs";
import "../_libs/jspdf.mjs";
import { g as CircleAlert, B as BookOpen, h as Clock, i as Check, j as ChevronLeft, D as Download, k as ChevronRight, a as CircleCheck, F as FileSpreadsheet, R as RotateCcw, T as TriangleAlert, b as CircleX, M as MessageSquare, l as Sparkles } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-query.mjs";
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
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const STORAGE_KEY = "sigex-mvp-evaluation-draft";
function SigexFormPage() {
  const save = useServerFn(saveResponse);
  useServerFn(getResponseById);
  const [step, setStep] = reactExports.useState(1);
  const [state, setState] = reactExports.useState(getInitialEvaluation);
  const [busy, setBusy] = reactExports.useState(false);
  const [done, setDone] = reactExports.useState(false);
  const [activeFilter, setActiveFilter] = reactExports.useState("all");
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === "object") {
          setState((prev) => ({
            ...prev,
            ...parsed,
            tarefas: {
              ...prev.tarefas,
              ...parsed.tarefas || {}
            },
            avaliacao_geral: {
              ...prev.avaliacao_geral,
              ...parsed.avaliacao_geral || {}
            },
            comentarios: {
              ...prev.comentarios,
              ...parsed.comentarios || {}
            }
          }));
          if (parsed.current_step) {
            setStep(parsed.current_step);
          }
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);
  reactExports.useEffect(() => {
    if (typeof window === "undefined" || done) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...state,
        current_step: step
      }));
    } catch {
    }
  }, [state, step, done]);
  const updateField = (k, v) => {
    setState((s) => ({
      ...s,
      [k]: v
    }));
  };
  const updateTask = (taskId, status, observacoes) => {
    setState((s) => {
      const current = s.tarefas[String(taskId)] || {
        status: "",
        observacoes: ""
      };
      return {
        ...s,
        tarefas: {
          ...s.tarefas,
          [String(taskId)]: {
            status: status !== void 0 ? status : current.status,
            observacoes: observacoes !== void 0 ? observacoes : current.observacoes
          }
        }
      };
    });
  };
  const updateLikert = (qId, score) => {
    setState((s) => ({
      ...s,
      avaliacao_geral: {
        ...s.avaliacao_geral,
        [String(qId)]: score
      }
    }));
  };
  const updateComment = (key, value) => {
    setState((s) => ({
      ...s,
      comentarios: {
        ...s.comentarios,
        [key]: value
      }
    }));
  };
  const stats = reactExports.useMemo(() => {
    let completedCount = 0;
    let partialCount = 0;
    let notCompletedCount = 0;
    let totalAnswered = 0;
    for (const t of SIGEX_TASKS) {
      const st = state.tarefas[String(t.id)]?.status;
      if (st === "S") completedCount++;
      else if (st === "Parcial") partialCount++;
      else if (st === "N") notCompletedCount++;
      if (st) totalAnswered++;
    }
    let likertSum = 0;
    let likertCount = 0;
    for (const q of LIKERT_QUESTIONS) {
      const v = state.avaliacao_geral[String(q.id)];
      if (v && v > 0) {
        likertSum += v;
        likertCount++;
      }
    }
    const likertAvg = likertCount > 0 ? (likertSum / likertCount).toFixed(1) : "—";
    return {
      completedCount,
      partialCount,
      notCompletedCount,
      totalAnswered,
      totalTasks: SIGEX_TASKS.length,
      likertAvg,
      likertCount,
      totalLikert: LIKERT_QUESTIONS.length
    };
  }, [state]);
  function validateStep(s) {
    if (s === 1) {
      if (!state.avaliador_nome.trim()) {
        return "Por favor, informe o nome do(a) Avaliador(a) no topo da página.";
      }
      if (!state.data_avaliacao.trim()) {
        return "Por favor, informe a Data da avaliação.";
      }
      if (stats.totalAnswered < 5) {
        return `Você respondeu apenas ${stats.totalAnswered} de ${stats.totalTasks} tarefas. Recomendamos avaliar ao menos as tarefas pertinentes ao seu perfil antes de prosseguir.`;
      }
    }
    return null;
  }
  async function persist(nextStep, markCompleted = false) {
    setBusy(true);
    try {
      const res = await save({
        data: {
          ...state,
          current_step: nextStep,
          completed: markCompleted
        }
      });
      if (res?.id && !state.id) {
        setState((s) => ({
          ...s,
          id: res.id
        }));
      }
      return res?.id;
    } catch (e) {
      console.warn("Save note:", e.message);
    } finally {
      setBusy(false);
    }
  }
  async function handleNext() {
    const err = validateStep(step);
    if (err) {
      toast.warning(err);
      return;
    }
    const next = step + 1;
    await persist(next);
    setStep(next);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }
  async function handleFinish() {
    if (!state.avaliador_nome.trim()) {
      toast.error("Informe o nome do(a) Avaliador(a) antes de concluir.");
      setStep(1);
      return;
    }
    await persist(step, true);
    setDone(true);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    toast.success("Avaliação finalizada e salva com sucesso!");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  function restart() {
    setState(getInitialEvaluation());
    setStep(1);
    setDone(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  const filteredTasks = reactExports.useMemo(() => {
    if (activeFilter === "all") return SIGEX_TASKS;
    return SIGEX_TASKS.filter((t) => t.perfilSugerido.toLowerCase().includes(activeFilter.toLowerCase()));
  }, [activeFilter]);
  const stepLabels = ["Tarefas do Sistema (1 a 18)", "Questionário: Avaliação Geral", "Questionário: Comentários"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50 text-slate-900 pb-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-4xl px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 md:p-8 text-white shadow-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30 tracking-wide uppercase", children: "Roteiro Oficial de Homologação" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400", children: "Tempo estimado: 40 a 60 min" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-3 text-2xl md:text-3xl font-extrabold tracking-tight", children: [
            "SIGEX MVP — ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400", children: "Avaliação do Sistema" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed", children: "Este instrumento avalia a usabilidade e a aderência das funcionalidades do Sistema de Gestão da Execução Contratual (SIGEX). Realize as tarefas no sistema e registre suas impressões." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-slate-700/80 pt-5 text-xs text-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-400 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Atenção:" }),
              " Use somente dados fictícios."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 text-emerald-400 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Consulte o ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "MANUAL_USUARIO_MVP" }),
              " quando precisar."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-cyan-400 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Tempo médio estimado: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "40 a 60 minutos" }),
              "."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/90 p-4 rounded-xl border border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "avaliador_nome", className: "text-xs font-semibold text-slate-200", children: [
              "Avaliador(a) ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "avaliador_nome", value: state.avaliador_nome, onChange: (e) => updateField("avaliador_nome", e.target.value), placeholder: "Informe seu nome completo...", className: "mt-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500", maxLength: 200 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "data_avaliacao", className: "text-xs font-semibold text-slate-200", children: [
              "Data da Avaliação ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "data_avaliacao", type: "date", value: state.data_avaliacao, onChange: (e) => updateField("data_avaliacao", e.target.value), className: "mt-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500" })
          ] })
        ] })
      ] }),
      !done && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: stepLabels.map((lbl, idx) => {
          const stepNum = idx + 1;
          const isActive = step === stepNum;
          const isPassed = step > stepNum;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center relative cursor-pointer", onClick: () => {
            if (stepNum < step) setStep(stepNum);
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all shadow-sm ${isActive ? "bg-slate-900 text-white ring-4 ring-emerald-500/30 scale-105" : isPassed ? "bg-emerald-600 text-white" : "bg-white text-slate-400 border border-slate-200"}`, children: isPassed ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-5 w-5" }) : stepNum }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `mt-2 text-xs text-center font-medium max-w-[130px] hidden sm:block ${isActive ? "text-slate-900 font-semibold" : "text-slate-500"}`, children: lbl })
          ] }, lbl);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-3 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-emerald-500 transition-all duration-300 rounded-full", style: {
          width: `${(step - 1) / (stepLabels.length - 1) * 100}%`
        } }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-slate-200/80 shadow-md p-6 md:p-8 bg-white rounded-2xl", children: [
        done ? /* @__PURE__ */ jsxRuntimeExports.jsx(FinishScreen, { state, stats, onPdf: () => generateSigexPdf(state), onRestart: restart }) : step === 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(StepTasks, { state, stats, updateTask, activeFilter, setActiveFilter, filteredTasks }) : step === 2 ? /* @__PURE__ */ jsxRuntimeExports.jsx(StepLikert, { state, stats, updateLikert }) : /* @__PURE__ */ jsxRuntimeExports.jsx(StepComments, { state, stats, updateComment }),
        !done && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex items-center justify-between border-t border-slate-100 pt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: handleBack, disabled: step === 1 || busy, className: "gap-1.5 text-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
            " Voltar"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => generateSigexPdf(state), className: "text-xs text-slate-500 hover:text-slate-900 gap-1 hidden sm:inline-flex", title: "Exportar PDF parcial das respostas preenchidas", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
              " Salvar Rascunho PDF"
            ] }),
            step < 3 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleNext, disabled: busy, className: "bg-slate-900 text-white hover:bg-slate-800 gap-1.5 shadow-sm", children: [
              "Próxima Etapa ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleFinish, disabled: busy, className: "bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-sm font-semibold px-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
              "Finalizar Avaliação"
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function StepTasks({
  state,
  stats,
  updateTask,
  activeFilter,
  setActiveFilter,
  filteredTasks
}) {
  const filterOptions = [{
    id: "all",
    label: "Todas as Tarefas",
    count: SIGEX_TASKS.length
  }, {
    id: "coordenação",
    label: "Coordenação",
    count: 6
  }, {
    id: "gestor",
    label: "Gestor",
    count: 4
  }, {
    id: "fiscal",
    label: "Fiscal",
    count: 5
  }, {
    id: "financeiro",
    label: "Financeiro",
    count: 2
  }, {
    id: "qualquer",
    label: "Qualquer Perfil",
    count: 3
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold text-slate-900 flex items-center gap-2", children: [
          "Tarefas do Roteiro",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-normal text-slate-500", children: "(Total de 18 tarefas)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-slate-500 leading-relaxed", children: "Para cada tarefa, marque o resultado obtido no sistema e anote observações (dificuldades, mensagens confusas, erros)." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700", children: [
          "Avaliadas: ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
            stats.totalAnswered,
            "/18"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 border border-emerald-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
          " ",
          stats.completedCount,
          " Sim"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700 border border-amber-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
          " ",
          stats.partialCount,
          " Parcial"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 font-medium text-rose-700 border border-rose-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5" }),
          " ",
          stats.notCompletedCount,
          " Não"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5 pb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-500 mr-1", children: "Filtrar perfil:" }),
      filterOptions.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveFilter(f.id), className: `rounded-full px-3 py-1 text-xs font-medium transition-all ${activeFilter === f.id ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`, children: [
        f.label,
        " (",
        f.count,
        ")"
      ] }, f.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: filteredTasks.map((t) => {
      const ans = state.tarefas[String(t.id)] || {
        status: "",
        observacoes: ""
      };
      const status = ans.status;
      let badgeColor = "bg-slate-100 text-slate-700 border-slate-200";
      if (t.perfilSugerido.includes("Coordenação")) {
        badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
      } else if (t.perfilSugerido.includes("Gestor")) {
        badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
      } else if (t.perfilSugerido.includes("Fiscal")) {
        badgeColor = "bg-purple-50 text-purple-700 border-purple-200";
      } else if (t.perfilSugerido.includes("Financeiro")) {
        badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border p-4 transition-all ${status === "S" ? "border-emerald-200 bg-emerald-50/20" : status === "Parcial" ? "border-amber-200 bg-amber-50/20" : status === "N" ? "border-rose-200 bg-rose-50/20" : "border-slate-200 hover:border-slate-300 bg-white"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700", children: [
              "#",
              t.id
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-900 leading-snug", children: t.tarefa }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-400", children: "Perfil sugerido:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${badgeColor}`, children: t.perfilSugerido })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0 self-start lg:self-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-500 mr-1 hidden sm:inline", children: "Concluiu?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => updateTask(t.id, "S"), className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${status === "S" ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30" : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
              "Sim (S)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => updateTask(t.id, "Parcial"), className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${status === "Parcial" ? "bg-amber-600 text-white shadow-sm ring-2 ring-amber-600/30" : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
              "Parcial"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => updateTask(t.id, "N"), className: `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${status === "N" ? "bg-rose-600 text-white shadow-sm ring-2 ring-rose-600/30" : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5" }),
              "Não (N)"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-slate-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-slate-500 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Observações (dificuldades, mensagens confusas, erros):" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: ans.observacoes, onChange: (e) => updateTask(t.id, ans.status, e.target.value), placeholder: "Ex: Botão difícil de localizar, tela demorou para carregar, mensagem clara...", className: "text-xs bg-slate-50/50 border-slate-200 placeholder:text-slate-400 focus-visible:ring-emerald-500" })
        ] })
      ] }, t.id);
    }) })
  ] });
}
function StepLikert({
  state,
  stats,
  updateLikert
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-slate-100 pb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-emerald-600 uppercase tracking-wider", children: "Questionário — Parte 1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-slate-900 mt-1", children: "Avaliação Geral de Usabilidade" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: "Média Geral:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-extrabold text-slate-900", children: [
            stats.likertAvg,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-slate-400", children: "/ 5.0" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-slate-600", children: [
        "Para cada afirmação abaixo, marque uma nota de ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "1 a 5" }),
        ", sendo:",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block mt-1 font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs", children: "1 = Discordo totalmente  ·  2 = Discordo  ·  3 = Neutro  ·  4 = Concordo  ·  5 = Concordo totalmente" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: LIKERT_QUESTIONS.map((q) => {
      const selected = state.avaliacao_geral[String(q.id)] || 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border p-5 transition-all ${selected > 0 ? "border-slate-300 bg-slate-50/50" : "border-slate-200 bg-white"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white", children: q.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm md:text-base font-semibold text-slate-900", children: q.text })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-2", children: [1, 2, 3, 4, 5].map((score) => {
          const isCur = selected === score;
          let activeStyle = "";
          if (score <= 2) {
            activeStyle = isCur ? "bg-rose-600 text-white ring-2 ring-rose-400 font-bold shadow-md" : "hover:bg-rose-50 text-slate-700";
          } else if (score === 3) {
            activeStyle = isCur ? "bg-amber-600 text-white ring-2 ring-amber-400 font-bold shadow-md" : "hover:bg-amber-50 text-slate-700";
          } else {
            activeStyle = isCur ? "bg-emerald-600 text-white ring-2 ring-emerald-400 font-bold shadow-md" : "hover:bg-emerald-50 text-slate-700";
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => updateLikert(q.id, score), className: `flex flex-col items-center justify-center rounded-xl border p-2.5 sm:p-3.5 transition-all ${isCur ? activeStyle : "border-slate-200 bg-white hover:border-slate-300"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base sm:text-lg font-bold", children: score }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] sm:text-xs text-center mt-1 font-medium opacity-90 hidden sm:block", children: LIKERT_LABELS[score] })
          ] }, score);
        }) }),
        selected > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500 font-medium", children: [
          "Selecionado: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-slate-800", children: LIKERT_LABELS[selected] })
        ] }) })
      ] }, q.id);
    }) })
  ] });
}
function StepComments({
  state,
  stats,
  updateComment
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-slate-100 pb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-emerald-600 uppercase tracking-wider", children: "Questionário — Parte 2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-slate-900 mt-1", children: "Comentários e Sugestões Detalhadas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-500", children: "Responda com sinceridade às questões abertas abaixo. Seu feedback é indispensável para os ajustes antes do lançamento oficial." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: COMMENT_QUESTIONS.map((c) => {
      const val = state.comentarios[c.key] || "";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: c.key, className: "text-sm font-semibold text-slate-900 flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-700 mt-0.5", children: c.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.label.replace(/^\d+\.\s*/, "") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: c.key, rows: 3, value: val, onChange: (e) => updateComment(c.key, e.target.value), placeholder: c.placeholder, className: "resize-y text-sm bg-slate-50/50 border-slate-200 focus-visible:ring-emerald-500", maxLength: 4e3 })
      ] }, c.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-xl bg-slate-900 p-5 text-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-bold text-emerald-400 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
        "Resumo da sua avaliação antes de finalizar:"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-800 p-2.5 rounded-lg border border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 block", children: "Avaliador(a):" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white truncate block", children: state.avaliador_nome || "Não informado" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-800 p-2.5 rounded-lg border border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 block", children: "Tarefas Concluídas:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-emerald-400", children: [
            stats.completedCount,
            " Sim · ",
            stats.partialCount,
            " Parcial"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-800 p-2.5 rounded-lg border border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 block", children: "Média de Usabilidade:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-amber-300", children: [
            stats.likertAvg,
            " / 5.0"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-800 p-2.5 rounded-lg border border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 block", children: "Data de Registro:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white", children: state.data_avaliacao || "Hoje" })
        ] })
      ] })
    ] })
  ] });
}
function FinishScreen({
  state,
  stats,
  onPdf,
  onRestart
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 text-center space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-10 w-10" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-extrabold text-slate-900 md:text-3xl", children: "Avaliação do SIGEX Registrada!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mx-auto mt-2 max-w-lg text-sm text-slate-600 leading-relaxed", children: [
        "Muito obrigado pela colaboração de ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: state.avaliador_nome || "Avaliador(a)" }),
        ". Suas respostas foram salvas no sistema e fornecerão insumos valiosos para o aprimoramento do SIGEX MVP."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-lg grid grid-cols-3 gap-3 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-slate-500 block", children: "Tarefas Concluídas" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold text-emerald-600", children: [
          stats.completedCount,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-400", children: [
            "/",
            stats.totalTasks
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-slate-500 block", children: "Parciais / Não" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-amber-600", children: stats.partialCount + stats.notCompletedCount })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-slate-500 block", children: "Média Geral" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold text-slate-900", children: [
          stats.likertAvg,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400", children: "/ 5.0" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 flex flex-wrap items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onPdf, className: "gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md font-semibold px-6 py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
        " Baixar PDF Oficial do Roteiro"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/respostas", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "gap-2 text-slate-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4" }),
        " Visualizar no Painel"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", onClick: onRestart, className: "gap-2 text-slate-500 hover:text-slate-900", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4" }),
        " Preencher Nova Avaliação"
      ] })
    ] })
  ] });
}
export {
  SigexFormPage as component
};
