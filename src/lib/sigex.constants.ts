export interface SigexTaskDef {
  id: number;
  tarefa: string;
  perfilSugerido: string;
}

export const SIGEX_TASKS: SigexTaskDef[] = [
  { id: 1, tarefa: "Entrar no sistema e localizar o Painel geral", perfilSugerido: "Qualquer" },
  { id: 2, tarefa: "Cadastrar uma empresa fictícia", perfilSugerido: "Coordenação" },
  { id: 3, tarefa: "Cadastrar um contrato com um posto", perfilSugerido: "Coordenação" },
  { id: 4, tarefa: "Definir as unidades atendidas e designar gestor e fiscal", perfilSugerido: "Coordenação" },
  { id: 5, tarefa: "Editar o posto informando jornada, escala e pessoas por posto", perfilSugerido: "Coordenação" },
  { id: 6, tarefa: "Alocar dois trabalhadores e registrar férias de um deles", perfilSugerido: "Gestor" },
  { id: 7, tarefa: "Consultar o quadro previsto × realizado em duas datas diferentes", perfilSugerido: "Gestor" },
  { id: 8, tarefa: "Vincular um modelo de composição a um posto e ler a memória de cálculo", perfilSugerido: "Coordenação" },
  { id: 9, tarefa: "Abrir a competência do mês e iniciar a fiscalização", perfilSugerido: "Gestor / Fiscal" },
  { id: 10, tarefa: "Marcar critérios do checklist, registrar uma não conformidade e concluir a fiscalização", perfilSugerido: "Fiscal" },
  { id: 11, tarefa: "Registrar uma ocorrência", perfilSugerido: "Fiscal" },
  { id: 12, tarefa: "Propor uma glosa", perfilSugerido: "Fiscal" },
  { id: 13, tarefa: "Confirmar ou revisar a glosa", perfilSugerido: "Gestor" },
  { id: 14, tarefa: "Registrar nota fiscal, atestar e liquidar", perfilSugerido: "Financeiro / Fiscal" },
  { id: 15, tarefa: "Registrar um pagamento parcial e depois quitar o saldo", perfilSugerido: "Financeiro" },
  { id: 16, tarefa: "Registrar uma alteração contratual (ex.: acréscimo de valor) e comparar original × vigente", perfilSugerido: "Coordenação" },
  { id: 17, tarefa: "Anexar um documento fictício e abri-lo", perfilSugerido: "Qualquer com permissão" },
  { id: 18, tarefa: "Exportar um relatório em XLSX", perfilSugerido: "Qualquer" },
];

export const LIKERT_QUESTIONS = [
  { id: 1, text: "Consegui realizar as tarefas sem precisar de ajuda." },
  { id: 2, text: "Os nomes dos menus, botões e campos são fáceis de entender." },
  { id: 3, text: "Quando ocorreu um erro, a mensagem explicou o que fazer." },
  { id: 4, text: "As informações exibidas pareceram corretas e coerentes." },
  { id: 5, text: "O sistema seria útil no meu dia a dia de trabalho." },
];

export const LIKERT_LABELS: Record<number, string> = {
  1: "Discordo totalmente",
  2: "Discordo parcialmente",
  3: "Neutro / Indiferente",
  4: "Concordo parcialmente",
  5: "Concordo totalmente",
};

export const COMMENT_QUESTIONS = [
  {
    id: 6,
    key: "tarefas_dificeis" as const,
    label: "6. Quais tarefas foram mais difíceis de realizar? Por quê?",
    placeholder: "Descreva quais tarefas apresentaram maior dificuldade e as razões...",
  },
  {
    id: 7,
    key: "info_confusa" as const,
    label: "7. Alguma informação ficou confusa ou faltou em alguma tela?",
    placeholder: "Indique a tela, o campo ou a instrução que não ficou clara...",
  },
  {
    id: 8,
    key: "erros_encontrados" as const,
    label: "8. Você encontrou algum erro? Se sim, informe em qual tela, o que estava fazendo e qual mensagem apareceu.",
    placeholder: "Descreva a tela, ação executada e a mensagem de erro apresentada...",
  },
  {
    id: 9,
    key: "funcionalidades_importantes" as const,
    label: "9. Quais funcionalidades você considera mais importantes? O que ainda falta para usar o sistema na rotina?",
    placeholder: "Aponte os pontos fortes e o que é indispensável para o uso diário...",
  },
  {
    id: 10,
    key: "outros_comentarios" as const,
    label: "10. Deixe aqui outros comentários ou sugestões.",
    placeholder: "Sugestões de melhoria, elogios ou considerações gerais...",
  },
];

export type TaskStatus = "S" | "Parcial" | "N" | "";

export interface SigexTaskAnswer {
  status: TaskStatus;
  observacoes: string;
}

export interface SigexComments {
  tarefas_dificeis: string;
  info_confusa: string;
  erros_encontrados: string;
  funcionalidades_importantes: string;
  outros_comentarios: string;
}

export interface SigexEvaluationData {
  id?: string;
  avaliador_nome: string;
  data_avaliacao: string; // YYYY-MM-DD
  tarefas: Record<string, SigexTaskAnswer>; // key is task id "1".."18"
  avaliacao_geral: Record<string, number>; // key is "1".."5", value is 1..5
  comentarios: SigexComments;
  current_step: number;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export function getLocalTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getInitialEvaluation(): SigexEvaluationData {
  const initialTarefas: Record<string, SigexTaskAnswer> = {};
  for (const t of SIGEX_TASKS) {
    initialTarefas[String(t.id)] = { status: "", observacoes: "" };
  }

  const initialLikert: Record<string, number> = {};
  for (const q of LIKERT_QUESTIONS) {
    initialLikert[String(q.id)] = 0;
  }

  return {
    avaliador_nome: "",
    data_avaliacao: getLocalTodayDate(),
    tarefas: initialTarefas,
    avaliacao_geral: initialLikert,
    comentarios: {
      tarefas_dificeis: "",
      info_confusa: "",
      erros_encontrados: "",
      funcionalidades_importantes: "",
      outros_comentarios: "",
    },
    current_step: 1,
    completed: false,
  };
}
