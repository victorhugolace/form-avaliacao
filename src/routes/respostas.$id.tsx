import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { adminGetResponse, adminMe } from "@/lib/responses.functions";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  User,
} from "lucide-react";
import {
  SIGEX_TASKS,
  LIKERT_QUESTIONS,
  LIKERT_LABELS,
  COMMENT_QUESTIONS,
  type SigexEvaluationData,
} from "@/lib/sigex.constants";
import { generateSigexPdf } from "@/lib/sigex.pdf";

export const Route = createFileRoute("/respostas/$id")({
  ssr: false,
  head: () => ({ meta: [{ title: "Detalhes da Avaliação — SIGEX MVP" }] }),
  component: ResponseDetail,
});

function ResponseDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const me = useServerFn(adminMe);
  const get = useServerFn(adminGetResponse);

  const meQ = useQuery({ queryKey: ["admin-me"], queryFn: () => me() });

  useEffect(() => {
    if (meQ.data && !meQ.data.isAdmin) navigate({ to: "/respostas" });
  }, [meQ.data, navigate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-response", id],
    queryFn: () => get({ data: { id } }),
    enabled: !!meQ.data?.isAdmin,
  });

  const evaluation = data as unknown as SigexEvaluationData | null;

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <Link to="/respostas">
            <Button variant="outline" size="sm" className="gap-2 text-slate-700">
              <ChevronLeft className="h-4 w-4" /> Voltar para lista
            </Button>
          </Link>

          {evaluation && (
            <Button
              size="sm"
              onClick={() => generateSigexPdf(evaluation)}
              className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <Download className="h-4 w-4" /> Baixar PDF
            </Button>
          )}
        </div>

        {isLoading || !meQ.data?.isAdmin ? (
          <p className="text-center py-12 text-slate-500 text-sm">Carregando detalhes...</p>
        ) : error ? (
          <p className="text-rose-600">Erro: {(error as Error).message}</p>
        ) : !evaluation ? (
          <Card className="p-8 text-center text-slate-500">Avaliação não encontrada.</Card>
        ) : (
          <Card className="p-6 md:p-8 space-y-8 bg-white border-slate-200 shadow-sm">
            <header className="border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                SIGEX MVP · Roteiro de Avaliação
              </div>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                {evaluation.avaliador_nome || "(Avaliador não informado)"}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {evaluation.data_avaliacao}
                </span>
                <span>·</span>
                <span
                  className={`font-semibold ${
                    evaluation.completed ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {evaluation.completed ? "Status: Concluída" : `Status: Em andamento`}
                </span>
              </div>
            </header>

            {/* Tarefas */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                Tarefas Avaliadas (1 a 18)
              </h2>
              <div className="space-y-2 text-xs">
                {SIGEX_TASKS.map((t) => {
                  const ans = evaluation.tarefas?.[String(t.id)] || {
                    status: "",
                    observacoes: "",
                  };
                  return (
                    <div
                      key={t.id}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex-1">
                        <span className="font-bold text-slate-700 mr-2">#{t.id}</span>
                        <span className="font-semibold text-slate-900">{t.tarefa}</span>
                        <span className="ml-2 text-slate-400">[{t.perfilSugerido}]</span>
                        {ans.observacoes && (
                          <p className="mt-1 text-slate-600 italic">Obs: {ans.observacoes}</p>
                        )}
                      </div>
                      <div className="shrink-0">
                        {ans.status === "S" ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                            <CheckCircle2 className="h-3 w-3" /> Sim
                          </span>
                        ) : ans.status === "Parcial" ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                            <AlertTriangle className="h-3 w-3" /> Parcial
                          </span>
                        ) : ans.status === "N" ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded text-[11px]">
                            <XCircle className="h-3 w-3" /> Não
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Avaliação Geral Likert */}
            <section className="border-t border-slate-100 pt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                Questionário — Parte 1: Avaliação Geral
              </h2>
              <div className="space-y-2 text-xs">
                {LIKERT_QUESTIONS.map((q) => {
                  const score = evaluation.avaliacao_geral?.[String(q.id)] || 0;
                  return (
                    <div
                      key={q.id}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <span className="text-slate-800">
                        <strong>{q.id}.</strong> {q.text}
                      </span>
                      <span className="font-bold text-slate-900 shrink-0 ml-4">
                        {score > 0 ? `${score} - ${LIKERT_LABELS[score]}` : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Comentários */}
            <section className="border-t border-slate-100 pt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                Questionário — Parte 2: Comentários
              </h2>
              <div className="space-y-3 text-xs">
                {COMMENT_QUESTIONS.map((c) => {
                  const ans = evaluation.comentarios?.[c.key] || "";
                  return (
                    <div key={c.id} className="p-3 rounded-lg border border-slate-200 bg-white">
                      <div className="font-semibold text-slate-900 mb-1">{c.label}</div>
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {ans || <span className="text-slate-400 italic">Sem resposta</span>}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </Card>
        )}
      </main>
    </div>
  );
}
