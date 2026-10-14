import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  adminLogin,
  adminLogout,
  adminMe,
  adminListResponses,
} from "@/lib/responses.functions";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import {
  LogOut,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  Search,
  Calendar,
  User,
  Star,
} from "lucide-react";
import {
  SIGEX_TASKS,
  LIKERT_QUESTIONS,
  LIKERT_LABELS,
  COMMENT_QUESTIONS,
  type SigexEvaluationData,
} from "@/lib/sigex.constants";
import { generateSigexPdf } from "@/lib/sigex.pdf";

export const Route = createFileRoute("/respostas")({
  ssr: false,
  head: () => ({ meta: [{ title: "Painel de Respostas — SIGEX MVP" }] }),
  component: RespostasPage,
});

function RespostasPage() {
  const me = useServerFn(adminMe);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-me"],
    queryFn: () => me(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppHeader />
        <div className="p-12 text-center text-slate-500 text-sm">Carregando painel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <Toaster richColors position="top-right" />
      {data?.isAdmin ? (
        <RespostasList onLogout={() => refetch()} />
      ) : (
        <LoginForm onSuccess={() => refetch()} />
      )}
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const login = useServerFn(adminLogin);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await login({ data: { username, password } });
      toast.success("Login realizado com sucesso!");
      onSuccess();
    } catch (err) {
      toast.error((err as Error).message || "Credenciais inválidas");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <Card className="p-8 shadow-lg border-slate-200">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Acesso ao Painel SIGEX</h1>
          <p className="mt-1 text-xs text-slate-500">
            Informe suas credenciais para visualizar as avaliações consolidadas do MVP.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="u" className="text-xs font-semibold text-slate-700">
              Usuário
            </Label>
            <Input
              id="u"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoFocus
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="p" className="text-xs font-semibold text-slate-700">
              Senha
            </Label>
            <Input
              id="p"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-slate-900 text-white hover:bg-slate-800 font-semibold"
            disabled={busy}
          >
            {busy ? "Entrando..." : "Acessar Respostas"}
          </Button>
        </form>
      </Card>
    </main>
  );
}

function RespostasList({ onLogout }: { onLogout: () => void }) {
  const list = useServerFn(adminListResponses);
  const logout = useServerFn(adminLogout);
  const qc = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-responses"],
    queryFn: () => list(),
  });

  const logoutMut = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      qc.removeQueries({ queryKey: ["admin-responses"] });
      onLogout();
    },
  });

  const responses = (data as unknown as SigexEvaluationData[]) || [];

  const filteredResponses = responses.filter((r) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.avaliador_nome?.toLowerCase().includes(term) ||
      r.data_avaliacao?.toLowerCase().includes(term)
    );
  });

  function toggleCard(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* Header Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Avaliações Consolidadas — SIGEX MVP
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Total de {responses.length} roteiro(s) registrado(s).
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => logoutMut.mutate()}
          className="gap-2 text-slate-700 self-start sm:self-auto"
        >
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </div>

      {/* Search Input */}
      {responses.length > 0 && (
        <div className="mb-6 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por nome do avaliador ou data..."
            className="pl-10 text-xs bg-white border-slate-200"
          />
        </div>
      )}

      {isLoading ? (
        <p className="text-center py-12 text-slate-500 text-sm">Carregando avaliações...</p>
      ) : filteredResponses.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 text-sm border-slate-200">
          Nenhuma avaliação encontrada.
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredResponses.map((r, idx) => {
            const cardId = r.id || String(idx);
            const isOpen = expandedId === cardId;

            // Compute task totals
            let countS = 0;
            let countParcial = 0;
            let countN = 0;
            for (const t of SIGEX_TASKS) {
              const st = r.tarefas?.[String(t.id)]?.status;
              if (st === "S") countS++;
              else if (st === "Parcial") countParcial++;
              else if (st === "N") countN++;
            }

            // Likert average
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

            return (
              <Card key={cardId} className="overflow-hidden border-slate-200 shadow-sm bg-white">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 bg-white hover:bg-slate-50/70 transition-colors">
                  <button
                    className="flex-1 text-left flex items-start sm:items-center gap-3 cursor-pointer"
                    onClick={() => toggleCard(cardId)}
                    aria-expanded={isOpen}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-sm">
                      <User className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 text-base">
                        {r.avaliador_nome || "(Avaliador não identificado)"}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {r.data_avaliacao || "Data não informada"}
                        </span>
                        <span>·</span>
                        <span
                          className={`font-semibold ${
                            r.completed ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {r.completed ? "Concluída" : `Em andamento (Etapa ${r.current_step || 1})`}
                        </span>
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {/* Metrics badges */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" /> {countS}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 font-medium text-amber-700 border border-amber-200">
                        <AlertTriangle className="h-3 w-3" /> {countParcial}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 font-medium text-rose-700 border border-rose-200">
                        <XCircle className="h-3 w-3" /> {countN}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-800">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {lAvg}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        generateSigexPdf(r);
                      }}
                      className="gap-1 text-xs h-8 text-slate-700"
                      title="Baixar PDF deste roteiro"
                    >
                      <Download className="h-3.5 w-3.5" /> PDF
                    </Button>

                    <button
                      onClick={() => toggleCard(cardId)}
                      className="p-1 text-slate-400 hover:text-slate-700"
                      aria-label="Expandir detalhes"
                    >
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isOpen && (
                  <div className="border-t border-slate-100 p-5 space-y-6 bg-slate-50/40">
                    {/* Section 1: Tarefas */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Tarefas do Sistema (18 itens)
                      </h3>
                      <div className="space-y-2 text-xs">
                        {SIGEX_TASKS.map((t) => {
                          const ans = r.tarefas?.[String(t.id)] || {
                            status: "",
                            observacoes: "",
                          };
                          const st = ans.status;

                          return (
                            <div
                              key={t.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg border border-slate-200 bg-white"
                            >
                              <div className="flex items-start gap-2 flex-1">
                                <span className="font-bold text-slate-500 shrink-0">#{t.id}</span>
                                <div>
                                  <span className="font-semibold text-slate-800">{t.tarefa}</span>
                                  <span className="ml-2 text-[10px] text-slate-400 font-medium">
                                    [{t.perfilSugerido}]
                                  </span>
                                  {ans.observacoes && (
                                    <p className="mt-1 text-slate-600 italic">
                                      Obs: "{ans.observacoes}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="shrink-0 self-start sm:self-center">
                                {st === "S" ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                                    <CheckCircle2 className="h-3 w-3" /> Sim
                                  </span>
                                ) : st === "Parcial" ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                                    <AlertTriangle className="h-3 w-3" /> Parcial
                                  </span>
                                ) : st === "N" ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px]">
                                    <XCircle className="h-3 w-3" /> Não
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[11px]">—</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 2: Likert */}
                    <div className="border-t border-slate-200 pt-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Avaliação Geral (Escala 1 a 5)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {LIKERT_QUESTIONS.map((q) => {
                          const score = r.avaliacao_geral?.[String(q.id)] || 0;
                          return (
                            <div
                              key={q.id}
                              className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                            >
                              <span className="text-slate-800 pr-2">
                                <strong>{q.id}.</strong> {q.text}
                              </span>
                              <span
                                className={`font-bold px-2 py-0.5 rounded text-[11px] shrink-0 ${
                                  score >= 4
                                    ? "bg-emerald-100 text-emerald-800"
                                    : score === 3
                                    ? "bg-amber-100 text-amber-800"
                                    : score > 0
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-slate-100 text-slate-400"
                                }`}
                              >
                                {score > 0 ? `${score} - ${LIKERT_LABELS[score]}` : "—"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 3: Comentários */}
                    <div className="border-t border-slate-200 pt-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Comentários e Sugestões (Questões 6 a 10)
                      </h3>
                      <div className="space-y-3 text-xs">
                        {COMMENT_QUESTIONS.map((c) => {
                          const ans = r.comentarios?.[c.key] || "";
                          return (
                            <div
                              key={c.id}
                              className="p-3 rounded-lg border border-slate-200 bg-white"
                            >
                              <div className="font-semibold text-slate-900 mb-1">{c.label}</div>
                              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                {ans || <span className="text-slate-400 italic">Sem resposta</span>}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
