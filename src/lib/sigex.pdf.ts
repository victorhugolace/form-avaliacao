import jsPDF from "jspdf";
import {
  SIGEX_TASKS,
  LIKERT_QUESTIONS,
  COMMENT_QUESTIONS,
  type SigexEvaluationData,
} from "./sigex.constants";

export function generateSigexPdf(data: SigexEvaluationData) {
  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
  const margin = 40;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - margin * 2;

  // Format date DD/MM/AAAA
  let formattedDate = data.data_avaliacao || "";
  if (formattedDate.includes("-")) {
    const [y, m, d] = formattedDate.split("-");
    formattedDate = `${d}/${m}/${y}`;
  }

  // --- PAGE 1: CABEÇALHO & TAREFAS ---
  let y = margin + 15;

  // Título Principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(20, 60, 80);
  doc.text("SIGEX MVP — Roteiro de avaliação", margin, y);

  // Linha separadora abaixo do título
  y += 12;
  doc.setDrawColor(20, 60, 80);
  doc.setLineWidth(1.5);
  doc.line(margin, y, margin + contentW, y);

  // Identificação: Avaliador e Data
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

  // Aviso explicativo
  y += 20;
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  const avisos =
    "Use somente dados fictícios. Consulte o MANUAL_USUARIO_MVP quando precisar. Tempo estimado: 40 a 60 minutos.";
  doc.text(avisos, margin, y);

  // Seção Tarefas
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

  // Tabela de Tarefas
  y += 12;
  const colW = {
    num: 18,
    tarefa: 220,
    perfil: 100,
    status: 58,
    obs: contentW - (18 + 220 + 100 + 58), // ~119 pt
  };

  // Header da tabela
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

  // Linhas das 18 tarefas
  for (const t of SIGEX_TASKS) {
    const ans = data.tarefas[String(t.id)] || { status: "", observacoes: "" };

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.8);
    const tarefaLines = doc.splitTextToSize(t.tarefa, colW.tarefa - 10);
    const obsLines = doc.splitTextToSize(ans.observacoes || "—", colW.obs - 10);
    const numLines = Math.max(tarefaLines.length, obsLines.length, 1);
    const rowHeight = Math.max(numLines * 10 + 7, 18);

    // Checar quebra de página se exceder
    if (y + rowHeight > pageH - margin) {
      doc.addPage();
      y = margin + 15;
      drawTableHeader();
    }

    // Linha de fundo alternada sutil
    if (t.id % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentW, rowHeight, "F");
    }

    // Borda da linha
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, contentW, rowHeight, "S");

    let curX = margin;
    // Col #
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(String(t.id), curX + 4, y + 12);
    curX += colW.num;

    // Col Tarefa
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(tarefaLines, curX + 6, y + 11);
    curX += colW.tarefa;

    // Col Perfil
    doc.setTextColor(71, 85, 105);
    doc.text(t.perfilSugerido, curX + 6, y + 11);
    curX += colW.perfil;

    // Col Concluiu?
    const statusText =
      ans.status === "S"
        ? "Sim (S)"
        : ans.status === "Parcial"
        ? "Parcial"
        : ans.status === "N"
        ? "Não (N)"
        : "—";

    if (ans.status === "S") doc.setTextColor(22, 101, 52);
    else if (ans.status === "Parcial") doc.setTextColor(180, 83, 9);
    else if (ans.status === "N") doc.setTextColor(185, 28, 28);
    else doc.setTextColor(148, 163, 184);

    doc.setFont("helvetica", ans.status ? "bold" : "normal");
    doc.text(statusText, curX + 4, y + 11);
    curX += colW.status;

    // Col Observações
    doc.setFont("helvetica", "normal");
    doc.setTextColor(ans.observacoes ? 15 : 148, ans.observacoes ? 23 : 163, ans.observacoes ? 42 : 184);
    doc.text(obsLines, curX + 6, y + 11);

    y += rowHeight;
  }

  // --- PAGE 2: QUESTIONÁRIO (PARTE 1 & PARTE 2) ---
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
  // Tabela Likert
  const likertColW = {
    num: 20,
    text: contentW - (20 + 5 * 30),
    colScore: 30,
  };

  // Header Likert
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

  // Linhas Likert
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

  // PARTE 2: Comentários
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

  // Rodapé com data e identificação
  const safeName = (data.avaliador_nome || "avaliacao")
    .slice(0, 30)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_");

  doc.save(`SIGEX_MVP_Roteiro_Avaliacao_${safeName}.pdf`);
}
