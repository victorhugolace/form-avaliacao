import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { saveResponse, getResponseById } from "@/lib/responses.functions";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageSquare,
  Sparkles,
  FileSpreadsheet,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import manualPdf from "@/assets/manual-usuario-mvp.pdf?url";
import {
  SIGEX_TASKS,
  LIKERT_QUESTIONS,
  LIKERT_LABELS,
  COMMENT_QUESTIONS,
  getInitialEvaluation,
  type SigexEvaluationData,
  type TaskStatus,
} from "@/lib/sigex.constants";
import { generateSigexPdf } from "@/lib/sigex.pdf";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SIGEX MVP — Avaliação do Sistema" },
      {
        name: "description",
        content: "Formulário oficial de avaliação de tarefas e usabilidade do SIGEX MVP.",
      },
    ],
  }),
  component: SigexFormPage,
});

const STORAGE_KEY = "sigex-mvp-evaluation-draft";

function SigexFormPage() {
  const save = useServerFn(saveResponse);
  const fetchById = useServerFn(getResponseById);
  const [step, setStep] = useState(1);
  const [state, setState] = useState<SigexEvaluationData>(getInitialEvaluation);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Load draft from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === "object") {
          setState((prev) => ({
            ...prev,
            ...parsed,
            tarefas: { ...prev.tarefas, ...(parsed.tarefas || {}) },
            avaliacao_geral: { ...prev.avaliacao_geral, ...(parsed.avaliacao_geral || {}) },
            comentarios: { ...prev.comentarios, ...(parsed.comentarios || {}) },
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

  // Sync draft to localStorage on change
  useEffect(() => {
    if (typeof window === "undefined" || done) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, current_step: step }));
    } catch {
      // Storage quota or private browsing
    }
  }, [state, step, done]);

  // Update top-level field
  const updateField = <K extends keyof SigexEvaluationData>(k: K, v: SigexEvaluationData[K]) => {
    setState((s) => ({ ...s, [k]: v }));
  };

  // Update a specific task response
  const updateTask = (taskId: number, status: TaskStatus, observacoes?: string) => {
    setState((s) => {
      const current = s.tarefas[String(taskId)] || { status: "", observacoes: "" };
      return {
        ...s,
        tarefas: {
          ...s.tarefas,
          [String(taskId)]: {
            status: status !== undefined ? status : current.status,
            observacoes: observacoes !== undefined ? observacoes : current.observacoes,
          },
        },
      };
    });
  };

  // Update a Likert score (1-5)
  const updateLikert = (qId: number, score: number) => {
    setState((s) => ({
      ...s,
      avaliacao_geral: {
        ...s.avaliacao_geral,
        [String(qId)]: score,
      },
    }));
  };

  // Update a comment field
  const updateComment = (key: keyof SigexEvaluationData["comentarios"], value: string) => {
    setState((s) => ({
      ...s,
      comentarios: {
        ...s.comentarios,
        [key]: value,
      },
    }));
  };

  // Statistics
  const stats = useMemo(() => {
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
      totalLikert: LIKERT_QUESTIONS.length,
    };
  }, [state]);

  // Validation per step
  function validateStep(s: number): string | null {
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

  async function persist(nextStep: number, markCompleted = false) {
    setBusy(true);
    try {
      const res = await save({
        data: {
          ...state,
          current_step: nextStep,
          completed: markCompleted,
        },
      });
      if (res?.id && !state.id) {
        setState((s) => ({ ...s, id: res.id }));
      }
      return res?.id;
    } catch (e) {
      console.warn("Save note:", (e as Error).message);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    setState(getInitialEvaluation());
    setStep(1);
    setDone(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // Filter tasks in step 1
  const filteredTasks = useMemo(() => {
    if (activeFilter === "all") return SIGEX_TASKS;
    return SIGEX_TASKS.filter((t) =>
      t.perfilSugerido.toLowerCase().includes(activeFilter.toLowerCase())
    );
  }, [activeFilter]);

  const stepLabels = [
    "Tarefas do Sistema (1 a 18)",
    "Questionário: Avaliação Geral",
    "Questionário: Comentários",
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <AppHeader />
      <Toaster richColors position="top-right" />

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Hero Header */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 md:p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30 tracking-wide uppercase">
                  Roteiro Oficial de Homologação
                </span>
                <span className="text-xs text-slate-400">Tempo estimado: 40 a 60 min</span>
              </div>
              <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
                SIGEX MVP — <span className="text-emerald-400">Avaliação do Sistema</span>
              </h1>
              <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
                Este instrumento avalia a usabilidade e a aderência das funcionalidades do
                Sistema de Gestão da Execução Contratual (SIGEX). Realize as tarefas no sistema e registre suas impressões.
              </p>
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-slate-700/80 pt-5 text-xs text-slate-300">
            <div className="flex items-center gap-2.5 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                <strong>Atenção:</strong> Use somente dados fictícios.
              </span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
              <BookOpen className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                Consulte o <strong>MANUAL_USUARIO_MVP</strong> quando precisar,{" "}
                <a
                  href={manualPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-emerald-400 underline hover:text-emerald-300 inline-flex items-center gap-0.5 transition-colors"
                >
                  clicando aqui
                  <ExternalLink className="h-3 w-3 inline" />
                </a>
                .
              </span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
              <Clock className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>Tempo médio estimado: <strong>40 a 60 minutos</strong>.</span>
            </div>
          </div>

          {/* Avaliador & Data Bar */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/90 p-4 rounded-xl border border-slate-700">
            <div>
              <Label htmlFor="avaliador_nome" className="text-xs font-semibold text-slate-200">
                Avaliador(a) <span className="text-emerald-400">*</span>
              </Label>
              <Input
                id="avaliador_nome"
                value={state.avaliador_nome}
                onChange={(e) => updateField("avaliador_nome", e.target.value)}
                placeholder="Informe seu nome completo..."
                className="mt-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
                maxLength={200}
              />
            </div>
            <div>
              <Label htmlFor="data_avaliacao" className="text-xs font-semibold text-slate-200">
                Data da Avaliação <span className="text-emerald-400">*</span>
              </Label>
              <Input
                id="data_avaliacao"
                type="date"
                value={state.data_avaliacao}
                onChange={(e) => updateField("data_avaliacao", e.target.value)}
                className="mt-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Step Progress Indicator */}
        {!done && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {stepLabels.map((lbl, idx) => {
                const stepNum = idx + 1;
                const isActive = step === stepNum;
                const isPassed = step > stepNum;
                return (
                  <div
                    key={lbl}
                    className="flex-1 flex flex-col items-center relative cursor-pointer"
                    onClick={() => {
                      if (stepNum < step) setStep(stepNum);
                    }}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all shadow-sm ${isActive
                          ? "bg-slate-900 text-white ring-4 ring-emerald-500/30 scale-105"
                          : isPassed
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-slate-400 border border-slate-200"
                        }`}
                    >
                      {isPassed ? <Check className="h-5 w-5" /> : stepNum}
                    </div>
                    <span
                      className={`mt-2 text-xs text-center font-medium max-w-[130px] hidden sm:block ${isActive ? "text-slate-900 font-semibold" : "text-slate-500"
                        }`}
                    >
                      {lbl}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="relative mt-3 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${((step - 1) / (stepLabels.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Content Card */}
        <Card className="border-slate-200/80 shadow-md p-6 md:p-8 bg-white rounded-2xl">
          {done ? (
            <FinishScreen
              state={state}
              stats={stats}
              onPdf={() => generateSigexPdf(state)}
              onRestart={restart}
            />
          ) : step === 1 ? (
            <StepTasks
              state={state}
              stats={stats}
              updateTask={updateTask}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              filteredTasks={filteredTasks}
            />
          ) : step === 2 ? (
            <StepLikert state={state} stats={stats} updateLikert={updateLikert} />
          ) : (
            <StepComments
              state={state}
              stats={stats}
              updateComment={updateComment}
            />
          )}

          {/* Action Buttons */}
          {!done && (
            <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1 || busy}
                className="gap-1.5 text-slate-700"
              >
                <ChevronLeft className="h-4 w-4" /> Voltar
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => generateSigexPdf(state)}
                  className="text-xs text-slate-500 hover:text-slate-900 gap-1 hidden sm:inline-flex"
                  title="Exportar PDF parcial das respostas preenchidas"
                >
                  <Download className="h-3.5 w-3.5" /> Salvar Rascunho PDF
                </Button>

                {step < 3 ? (
                  <Button
                    onClick={handleNext}
                    disabled={busy}
                    className="bg-slate-900 text-white hover:bg-slate-800 gap-1.5 shadow-sm"
                  >
                    Próxima Etapa <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleFinish}
                    disabled={busy}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-sm font-semibold px-6"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Finalizar Avaliação
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// STEP 1: TAREFAS (1 a 18)
// -------------------------------------------------------------
function StepTasks({
  state,
  stats,
  updateTask,
  activeFilter,
  setActiveFilter,
  filteredTasks,
}: {
  state: SigexEvaluationData;
  stats: {
    completedCount: number;
    partialCount: number;
    notCompletedCount: number;
    totalAnswered: number;
    totalTasks: number;
  };
  updateTask: (taskId: number, status: TaskStatus, obs?: string) => void;
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  filteredTasks: typeof SIGEX_TASKS;
}) {
  const filterOptions = [
    { id: "all", label: "Todas as Tarefas", count: SIGEX_TASKS.length },
    { id: "coordenação", label: "Coordenação", count: 6 },
    { id: "gestor", label: "Gestor", count: 4 },
    { id: "fiscal", label: "Fiscal", count: 5 },
    { id: "financeiro", label: "Financeiro", count: 2 },
    { id: "qualquer", label: "Qualquer Perfil", count: 3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Tarefas do Sistema
            <span className="text-sm font-normal text-slate-500">
              (Total de 18 tarefas)
            </span>
          </h2>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Para cada tarefa, marque o resultado obtido no sistema e anote observações (dificuldades,
            mensagens confusas, erros).
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
            Avaliadas: <strong>{stats.totalAnswered}/18</strong>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" /> {stats.completedCount} Sim
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700 border border-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> {stats.partialCount} Parcial
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 font-medium text-rose-700 border border-rose-200">
            <XCircle className="h-3.5 w-3.5" /> {stats.notCompletedCount} Não
          </span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pb-2">
        <span className="text-xs font-semibold text-slate-500 mr-1">Filtrar perfil:</span>
        {filterOptions.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${activeFilter === f.id
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* List of Tasks */}
      <div className="space-y-4">
        {filteredTasks.map((t) => {
          const ans = state.tarefas[String(t.id)] || { status: "", observacoes: "" };
          const status = ans.status;

          // Perfil color styling
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

          return (
            <div
              key={t.id}
              className={`rounded-xl border p-4 transition-all ${status === "S"
                  ? "border-emerald-200 bg-emerald-50/20"
                  : status === "Parcial"
                    ? "border-amber-200 bg-amber-50/20"
                    : status === "N"
                      ? "border-rose-200 bg-rose-50/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Task ID and Title */}
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                    #{t.id}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                      {t.tarefa}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Perfil sugerido:</span>
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${badgeColor}`}
                      >
                        {t.perfilSugerido}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Segmented Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 self-start lg:self-center">
                  <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">
                    Concluiu?
                  </span>
                  <button
                    type="button"
                    onClick={() => updateTask(t.id, "S")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${status === "S"
                        ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30"
                        : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Sim (S)
                  </button>

                  <button
                    type="button"
                    onClick={() => updateTask(t.id, "Parcial")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${status === "Parcial"
                        ? "bg-amber-600 text-white shadow-sm ring-2 ring-amber-600/30"
                        : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                      }`}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Parcial
                  </button>

                  <button
                    type="button"
                    onClick={() => updateTask(t.id, "N")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${status === "N"
                        ? "bg-rose-600 text-white shadow-sm ring-2 ring-rose-600/30"
                        : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                      }`}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Não (N)
                  </button>
                </div>
              </div>

              {/* Observation Field */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Observações (dificuldades, mensagens confusas, erros):</span>
                </div>
                <Input
                  value={ans.observacoes}
                  onChange={(e) => updateTask(t.id, ans.status, e.target.value)}
                  placeholder="Ex: Botão difícil de localizar, tela demorou para carregar, mensagem clara..."
                  className="text-xs bg-slate-50/50 border-slate-200 placeholder:text-slate-400 focus-visible:ring-emerald-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// STEP 2: QUESTIONÁRIO PARTE 1 — AVALIAÇÃO GERAL (1 a 5)
// -------------------------------------------------------------
function StepLikert({
  state,
  stats,
  updateLikert,
}: {
  state: SigexEvaluationData;
  stats: { likertCount: number; totalLikert: number; likertAvg: string };
  updateLikert: (qId: number, score: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Questionário — Parte 1
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Avaliação Geral de Usabilidade
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500">Média Geral:</span>
            <div className="text-xl font-extrabold text-slate-900">
              {stats.likertAvg} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
            </div>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Para cada afirmação abaixo, marque uma nota de <strong>1 a 5</strong>, sendo:
          <br />
          <span className="inline-block mt-1 font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs">
            1 = Discordo totalmente &nbsp;·&nbsp; 2 = Discordo &nbsp;·&nbsp; 3 = Neutro &nbsp;·&nbsp; 4 = Concordo &nbsp;·&nbsp; 5 = Concordo totalmente
          </span>
        </p>
      </div>

      <div className="space-y-6">
        {LIKERT_QUESTIONS.map((q) => {
          const selected = state.avaliacao_geral[String(q.id)] || 0;

          return (
            <div
              key={q.id}
              className={`rounded-xl border p-5 transition-all ${selected > 0
                  ? "border-slate-300 bg-slate-50/50"
                  : "border-slate-200 bg-white"
                }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  {q.id}
                </span>
                <p className="text-sm md:text-base font-semibold text-slate-900">
                  {q.text}
                </p>
              </div>

              {/* 1 to 5 Pill Grid */}
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((score) => {
                  const isCur = selected === score;
                  let activeStyle = "";
                  if (score <= 2) {
                    activeStyle = isCur
                      ? "bg-rose-600 text-white ring-2 ring-rose-400 font-bold shadow-md"
                      : "hover:bg-rose-50 text-slate-700";
                  } else if (score === 3) {
                    activeStyle = isCur
                      ? "bg-amber-600 text-white ring-2 ring-amber-400 font-bold shadow-md"
                      : "hover:bg-amber-50 text-slate-700";
                  } else {
                    activeStyle = isCur
                      ? "bg-emerald-600 text-white ring-2 ring-emerald-400 font-bold shadow-md"
                      : "hover:bg-emerald-50 text-slate-700";
                  }

                  return (
                    <button
                      key={score}
                      type="button"
                      onClick={() => updateLikert(q.id, score)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2.5 sm:p-3.5 transition-all ${isCur
                          ? activeStyle
                          : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                    >
                      <span className="text-base sm:text-lg font-bold">{score}</span>
                      <span className="text-[10px] sm:text-xs text-center mt-1 font-medium opacity-90 hidden sm:block">
                        {LIKERT_LABELS[score]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selected > 0 && (
                <div className="mt-2 text-right">
                  <span className="text-xs text-slate-500 font-medium">
                    Selecionado: <strong className="text-slate-800">{LIKERT_LABELS[selected]}</strong>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// STEP 3: QUESTIONÁRIO PARTE 2 — COMENTÁRIOS (6 a 10)
// -------------------------------------------------------------
function StepComments({
  state,
  stats,
  updateComment,
}: {
  state: SigexEvaluationData;
  stats: { completedCount: number; partialCount: number; notCompletedCount: number; likertAvg: string };
  updateComment: (key: keyof SigexEvaluationData["comentarios"], v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
          Questionário — Parte 2
        </span>
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          Comentários e Sugestões Detalhadas
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Responda com sinceridade às questões abertas abaixo. Seu feedback é indispensável para os
          ajustes antes do lançamento oficial.
        </p>
      </div>

      <div className="space-y-6">
        {COMMENT_QUESTIONS.map((c) => {
          const val = state.comentarios[c.key] || "";

          return (
            <div key={c.id} className="space-y-2">
              <Label htmlFor={c.key} className="text-sm font-semibold text-slate-900 flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-xs font-bold text-slate-700 mt-0.5">
                  {c.id}
                </span>
                <span>{c.label.replace(/^\d+\.\s*/, "")}</span>
              </Label>
              <Textarea
                id={c.key}
                rows={3}
                value={val}
                onChange={(e) => updateComment(c.key, e.target.value)}
                placeholder={c.placeholder}
                className="resize-y text-sm bg-slate-50/50 border-slate-200 focus-visible:ring-emerald-500"
                maxLength={4000}
              />
            </div>
          );
        })}
      </div>

      {/* Review Box before final send */}
      <div className="mt-8 rounded-xl bg-slate-900 p-5 text-white">
        <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Resumo da sua avaliação antes de finalizar:
        </h4>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 block">Avaliador(a):</span>
            <span className="font-semibold text-white truncate block">
              {state.avaliador_nome || "Não informado"}
            </span>
          </div>
          <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 block">Tarefas Concluídas:</span>
            <span className="font-semibold text-emerald-400">
              {stats.completedCount} Sim · {stats.partialCount} Parcial
            </span>
          </div>
          <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 block">Média de Usabilidade:</span>
            <span className="font-semibold text-amber-300">
              {stats.likertAvg} / 5.0
            </span>
          </div>
          <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 block">Data de Registro:</span>
            <span className="font-semibold text-white">
              {state.data_avaliacao || "Hoje"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FINISH SCREEN
// -------------------------------------------------------------
function FinishScreen({
  state,
  stats,
  onPdf,
  onRestart,
}: {
  state: SigexEvaluationData;
  stats: {
    completedCount: number;
    partialCount: number;
    notCompletedCount: number;
    likertAvg: string;
    totalTasks: number;
  };
  onPdf: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="py-8 text-center space-y-6">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
          Avaliação do SIGEX Registrada!
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 leading-relaxed">
          Muito obrigado pela colaboração de <strong>{state.avaliador_nome || "Avaliador(a)"}</strong>.
          Suas respostas foram salvas no sistema e fornecerão insumos valiosos para o aprimoramento do SIGEX MVP.
        </p>
      </div>

      {/* Snapshot Cards */}
      <div className="mx-auto max-w-lg grid grid-cols-3 gap-3 text-left">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[11px] font-medium text-slate-500 block">Tarefas Concluídas</span>
          <span className="text-lg font-bold text-emerald-600">
            {stats.completedCount} <span className="text-xs text-slate-400">/{stats.totalTasks}</span>
          </span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[11px] font-medium text-slate-500 block">Parciais / Não</span>
          <span className="text-lg font-bold text-amber-600">
            {stats.partialCount + stats.notCompletedCount}
          </span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[11px] font-medium text-slate-500 block">Média Geral</span>
          <span className="text-lg font-bold text-slate-900">
            {stats.likertAvg} <span className="text-xs text-slate-400">/ 5.0</span>
          </span>
        </div>
      </div>

      {/* Call to Actions */}
      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={onPdf}
          className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md font-semibold px-6 py-2.5"
        >
          <Download className="h-4 w-4" /> Baixar PDF Oficial do Roteiro
        </Button>

        <Link to="/respostas">
          <Button variant="outline" className="gap-2 text-slate-700">
            <FileSpreadsheet className="h-4 w-4" /> Visualizar no Painel
          </Button>
        </Link>

        <Button variant="ghost" onClick={onRestart} className="gap-2 text-slate-500 hover:text-slate-900">
          <RotateCcw className="h-4 w-4" /> Preencher Nova Avaliação
        </Button>
      </div>
    </div>
  );
}
