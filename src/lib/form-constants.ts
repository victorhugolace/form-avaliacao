export const PERFIS_USUARIO = [
  "Magistrado(a)",
  "Chefe de Cartório",
  "Analista Judiciário",
  "Técnico Judiciário",
  "Assessor(a) de Magistrado",
  "Servidor(a) de Secretaria",
  "Conciliador(a) / Mediador(a)",
  "Oficial de Justiça",
  "Estagiário(a)",
  "Advogado(a)",
  "Defensor(a) Público(a)",
  "Membro do Ministério Público",
  "Administrador(a) de Sistema",
];

export const REGRAS_NEGOCIO = [
  'O script deve rodar na transição "Distribuído" para "Triagem".',
  "Deve haver um painel para o administrador da vara atualizar a lista de CNPJs.",
  "Caso o sistema não reconheça o CNPJ, manter o fluxo normal sem travar a distribuição.",
  "A automação deve gerar log de cada execução para auditoria.",
  "A funcionalidade deve respeitar os perfis de acesso já configurados no PJe.",
  "Em caso de falha, o sistema deve notificar o administrador da vara por e-mail.",
  "A solução não pode alterar movimentos processuais sem confirmação humana.",
  "O processamento deve ocorrer em lote, fora do horário de pico (após 20h).",
  "Deve haver opção de execução manual pelo servidor responsável.",
  "Os dados sensíveis (CPF/CNPJ das partes) devem ser mascarados nos relatórios.",
];
