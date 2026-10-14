import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { m as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-CKT48O9-.mjs";
import { t as tjpbLogo } from "./router-DsDoI2BA.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { j as jsPDF } from "../_libs/jspdf.mjs";
import { f as ClipboardCheck, F as FileSpreadsheet } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, b as booleanType, n as numberType, r as recordType, e as enumType } from "../_libs/zod.mjs";
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const sigexTaskAnswerSchema = objectType({
  status: enumType(["S", "Parcial", "N", ""]),
  observacoes: stringType().default("")
});
const sigexEvaluationSchema = objectType({
  id: stringType().uuid().optional(),
  avaliador_nome: stringType().max(250).default(""),
  data_avaliacao: stringType().max(50).default(""),
  tarefas: recordType(sigexTaskAnswerSchema).default({}),
  avaliacao_geral: recordType(numberType().int().min(0).max(5)).default({}),
  comentarios: objectType({
    tarefas_dificeis: stringType().default(""),
    info_confusa: stringType().default(""),
    erros_encontrados: stringType().default(""),
    funcionalidades_importantes: stringType().default(""),
    outros_comentarios: stringType().default("")
  }).default({
    tarefas_dificeis: "",
    info_confusa: "",
    erros_encontrados: "",
    funcionalidades_importantes: "",
    outros_comentarios: ""
  }),
  current_step: numberType().int().min(1).max(5).default(1),
  completed: booleanType().default(false),
  created_at: stringType().optional(),
  updated_at: stringType().optional()
});
const saveResponse = createServerFn({
  method: "POST"
}).validator((d) => sigexEvaluationSchema.parse(d)).handler(createSsrRpc("1a1f31988e934373c1a56d9df4ba6d0d4026d3af903ff572e4b200031fb6636f"));
const getResponseById = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(createSsrRpc("a02545803fd437237b32e113ed1592d55d3813e6749d43dce61558d6c90a0f03"));
const adminLogin = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  username: stringType().min(1).max(100),
  password: stringType().min(1).max(200)
}).parse(d)).handler(createSsrRpc("ee09cf83792185c052813a3d87800e84d1f13b67af79867762c85f57daa8deb6"));
const adminLogout = createServerFn({
  method: "POST"
}).handler(createSsrRpc("38b7dd90a9f9a3468d4ac1c8de674b76d6da1e033b89db5d518cbff8d7e12d9b"));
const adminMe = createServerFn({
  method: "GET"
}).handler(createSsrRpc("1d8fde1fd9c4d39bbad2435bbb29c8331a99667ea0a5643a60b47eb1c266d578"));
const adminListResponses = createServerFn({
  method: "GET"
}).handler(createSsrRpc("d6a770fe84b860d69acef2d775d3d677840402abf4a3ca87ccf20f06cf1f3c61"));
const adminGetResponse = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(createSsrRpc("62fc0706a2026ed834f5ed165f175a743bc37b603f5f64de41e4fb64220b54b0"));
const lynoLogo = "/assets/lyno-white-rlS0rcxc.png";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
function AppHeader() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border/50 bg-slate-900 text-white shadow-sm sticky top-0 z-50 backdrop-blur-md bg-slate-900/95", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-6xl items-center justify-between px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 md:gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "https://www.tjpb.jus.br/",
          target: "_blank",
          rel: "noopener noreferrer",
          title: "Portal do TJPB",
          className: "flex items-center",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: tjpbLogo,
              alt: "TJPB",
              className: "h-10 w-auto opacity-95 transition-transform hover:scale-105"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block h-8 w-px bg-slate-700" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-3 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: lynoLogo,
            alt: "Lyno Laboratório",
            className: "h-8 w-auto hidden sm:block opacity-90 transition-transform group-hover:scale-105"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors", children: "SIGEX" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30", children: "MVP" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400 font-medium", children: "Roteiro de Avaliação do Sistema" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "text-slate-300 hover:text-white hover:bg-slate-800 text-xs gap-1.5 hidden md:inline-flex",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { className: "h-3.5 w-3.5" }),
            "Novo Roteiro"
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/respostas", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "gap-2 bg-emerald-600 text-white hover:bg-emerald-500 font-medium shadow-sm transition-all",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Painel de" }),
            " Respostas"
          ]
        }
      ) })
    ] })
  ] }) });
}
const Card = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const SIGEX_TASKS = [
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
  { id: 18, tarefa: "Exportar um relatório em XLSX", perfilSugerido: "Qualquer" }
];
const LIKERT_QUESTIONS = [
  { id: 1, text: "Consegui realizar as tarefas sem precisar de ajuda." },
  { id: 2, text: "Os nomes dos menus, botões e campos são fáceis de entender." },
  { id: 3, text: "Quando ocorreu um erro, a mensagem explicou o que fazer." },
  { id: 4, text: "As informações exibidas pareceram corretas e coerentes." },
  { id: 5, text: "O sistema seria útil no meu dia a dia de trabalho." }
];
const LIKERT_LABELS = {
  1: "Discordo totalmente",
  2: "Discordo parcialmente",
  3: "Neutro / Indiferente",
  4: "Concordo parcialmente",
  5: "Concordo totalmente"
};
const COMMENT_QUESTIONS = [
  {
    id: 6,
    key: "tarefas_dificeis",
    label: "6. Quais tarefas foram mais difíceis de realizar? Por quê?",
    placeholder: "Descreva quais tarefas apresentaram maior dificuldade e as razões..."
  },
  {
    id: 7,
    key: "info_confusa",
    label: "7. Alguma informação ficou confusa ou faltou em alguma tela?",
    placeholder: "Indique a tela, o campo ou a instrução que não ficou clara..."
  },
  {
    id: 8,
    key: "erros_encontrados",
    label: "8. Você encontrou algum erro? Se sim, informe em qual tela, o que estava fazendo e qual mensagem apareceu.",
    placeholder: "Descreva a tela, ação executada e a mensagem de erro apresentada..."
  },
  {
    id: 9,
    key: "funcionalidades_importantes",
    label: "9. Quais funcionalidades você considera mais importantes? O que ainda falta para usar o sistema na rotina?",
    placeholder: "Aponte os pontos fortes e o que é indispensável para o uso diário..."
  },
  {
    id: 10,
    key: "outros_comentarios",
    label: "10. Deixe aqui outros comentários ou sugestões.",
    placeholder: "Sugestões de melhoria, elogios ou considerações gerais..."
  }
];
function getInitialEvaluation() {
  const initialTarefas = {};
  for (const t of SIGEX_TASKS) {
    initialTarefas[String(t.id)] = { status: "", observacoes: "" };
  }
  const initialLikert = {};
  for (const q of LIKERT_QUESTIONS) {
    initialLikert[String(q.id)] = 0;
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  return {
    avaliador_nome: "",
    data_avaliacao: today,
    tarefas: initialTarefas,
    avaliacao_geral: initialLikert,
    comentarios: {
      tarefas_dificeis: "",
      info_confusa: "",
      erros_encontrados: "",
      funcionalidades_importantes: "",
      outros_comentarios: ""
    },
    current_step: 1,
    completed: false
  };
}
function generateSigexPdf(data) {
  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
  const margin = 40;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - margin * 2;
  let formattedDate = data.data_avaliacao || "";
  if (formattedDate.includes("-")) {
    const [y2, m, d] = formattedDate.split("-");
    formattedDate = `${d}/${m}/${y2}`;
  }
  let y = margin + 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(20, 60, 80);
  doc.text("SIGEX MVP — Roteiro de avaliação", margin, y);
  y += 12;
  doc.setDrawColor(20, 60, 80);
  doc.setLineWidth(1.5);
  doc.line(margin, y, margin + contentW, y);
  y += 22;
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.text("Avaliador(a): ", margin, y);
  doc.setFont("helvetica", "normal");
  const avalText = data.avaliador_nome.trim() || "_________________________________";
  doc.text(avalText, margin + 75, y);
  doc.setFont("helvetica", "bold");
  doc.text("Data: ", margin + 350, y);
  doc.setFont("helvetica", "normal");
  doc.text(formattedDate || "___/___/______", margin + 385, y);
  y += 20;
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  const avisos = "Use somente dados fictícios. Consulte o MANUAL_USUARIO_MVP quando precisar. Tempo estimado: 40 a 60 minutos.";
  doc.text(avisos, margin, y);
  y += 24;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("Tarefas", margin, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    "Para cada tarefa, marque o resultado e anote observações (dificuldades, mensagens confusas, erros).",
    margin,
    y
  );
  y += 12;
  const colW = {
    num: 18,
    tarefa: 220,
    perfil: 100,
    status: 58,
    obs: contentW - (18 + 220 + 100 + 58)
    // ~119 pt
  };
  const drawTableHeader = () => {
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentW, 20, "F");
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.6);
    doc.rect(margin, y, contentW, 20, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    let curX = margin;
    doc.text("#", curX + 4, y + 13);
    curX += colW.num;
    doc.text("Tarefa", curX + 6, y + 13);
    curX += colW.tarefa;
    doc.text("Perfil sugerido", curX + 6, y + 13);
    curX += colW.perfil;
    doc.text("Concluí?", curX + 4, y + 13);
    curX += colW.status;
    doc.text("Observações", curX + 6, y + 13);
    y += 20;
  };
  drawTableHeader();
  for (const t of SIGEX_TASKS) {
    const ans = data.tarefas[String(t.id)] || { status: "", observacoes: "" };
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.8);
    const tarefaLines = doc.splitTextToSize(t.tarefa, colW.tarefa - 10);
    const obsLines = doc.splitTextToSize(ans.observacoes || "—", colW.obs - 10);
    const numLines = Math.max(tarefaLines.length, obsLines.length, 1);
    const rowHeight = Math.max(numLines * 10 + 7, 18);
    if (y + rowHeight > pageH - margin) {
      doc.addPage();
      y = margin + 15;
      drawTableHeader();
    }
    if (t.id % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentW, rowHeight, "F");
    }
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, contentW, rowHeight, "S");
    let curX = margin;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(String(t.id), curX + 4, y + 12);
    curX += colW.num;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(tarefaLines, curX + 6, y + 11);
    curX += colW.tarefa;
    doc.setTextColor(71, 85, 105);
    doc.text(t.perfilSugerido, curX + 6, y + 11);
    curX += colW.perfil;
    const statusText = ans.status === "S" ? "Sim (S)" : ans.status === "Parcial" ? "Parcial" : ans.status === "N" ? "Não (N)" : "—";
    if (ans.status === "S") doc.setTextColor(22, 101, 52);
    else if (ans.status === "Parcial") doc.setTextColor(180, 83, 9);
    else if (ans.status === "N") doc.setTextColor(185, 28, 28);
    else doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", ans.status ? "bold" : "normal");
    doc.text(statusText, curX + 4, y + 11);
    curX += colW.status;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(ans.observacoes ? 15 : 148, ans.observacoes ? 23 : 163, ans.observacoes ? 42 : 184);
    doc.text(obsLines, curX + 6, y + 11);
    y += rowHeight;
  }
  doc.addPage();
  y = margin + 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(20, 60, 80);
  doc.text("Questionário", margin, y);
  y += 18;
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Parte 1 — Avaliação geral", margin, y);
  y += 13;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    "Para cada afirmação, marque uma nota de 1 a 5, sendo 1 = discordo totalmente e 5 = concordo totalmente.",
    margin,
    y
  );
  y += 12;
  const likertColW = {
    num: 20,
    text: contentW - (20 + 5 * 30),
    colScore: 30
  };
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentW, 18, "F");
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.6);
  doc.rect(margin, y, contentW, 18, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  let curLX = margin;
  doc.text("#", curLX + 5, y + 12);
  curLX += likertColW.num;
  doc.text("Afirmação", curLX + 6, y + 12);
  curLX += likertColW.text;
  for (let s = 1; s <= 5; s++) {
    doc.text(String(s), curLX + 12, y + 12);
    curLX += likertColW.colScore;
  }
  y += 18;
  for (const q of LIKERT_QUESTIONS) {
    const selected = data.avaliacao_geral[String(q.id)] || 0;
    const rowH = 20;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, contentW, rowH, "S");
    curLX = margin;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(String(q.id), curLX + 5, y + 13);
    curLX += likertColW.num;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(q.text, curLX + 6, y + 13);
    curLX += likertColW.text;
    for (let s = 1; s <= 5; s++) {
      if (selected === s) {
        doc.setFillColor(37, 99, 235);
        doc.circle(curLX + 14, y + 10, 5, "F");
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.text("X", curLX + 12, y + 12.5);
      } else {
        doc.setDrawColor(203, 213, 225);
        doc.circle(curLX + 14, y + 10, 5, "S");
      }
      curLX += likertColW.colScore;
    }
    y += rowH;
  }
  y += 24;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Parte 2 — Comentários", margin, y);
  y += 14;
  for (const c of COMMENT_QUESTIONS) {
    const answer = (data.comentarios[c.key] || "").trim();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const qLines = doc.splitTextToSize(c.label, contentW);
    doc.text(qLines, margin, y);
    y += qLines.length * 11 + 3;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(answer ? 15 : 148, answer ? 23 : 163, answer ? 42 : 184);
    const txt = answer || "Não informado.";
    const ansLines = doc.splitTextToSize(txt, contentW - 16);
    const boxH = Math.max(ansLines.length * 11 + 8, 22);
    if (y + boxH > pageH - margin) {
      doc.addPage();
      y = margin + 15;
    }
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentW, boxH, "F");
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentW, boxH, "S");
    doc.text(ansLines, margin + 8, y + 12);
    y += boxH + 10;
  }
  const safeName = (data.avaliador_nome || "avaliacao").slice(0, 30).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  doc.save(`SIGEX_MVP_Roteiro_Avaliacao_${safeName}.pdf`);
}
export {
  AppHeader as A,
  Button as B,
  Card as C,
  LIKERT_QUESTIONS as L,
  SIGEX_TASKS as S,
  adminListResponses as a,
  adminLogout as b,
  LIKERT_LABELS as c,
  COMMENT_QUESTIONS as d,
  adminLogin as e,
  adminMe as f,
  generateSigexPdf as g,
  cn as h,
  getInitialEvaluation as i,
  getResponseById as j,
  adminGetResponse as k,
  saveResponse as s,
  useServerFn as u
};
