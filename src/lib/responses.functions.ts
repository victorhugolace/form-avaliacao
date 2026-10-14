import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";
import type { SigexEvaluationData } from "./sigex.constants";

const SESSION_PASSWORD =
  process.env.SESSION_SECRET ||
  "sigex-mvp-roteiro-secret-rotate-32chars-key-2026";

const sessionConfig = {
  password: SESSION_PASSWORD,
  name: "sigex-admin-session",
  maxAge: 60 * 60 * 8,
};

type AdminSession = { isAdmin?: boolean };

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "123456";

const sigexTaskAnswerSchema = z.object({
  status: z.enum(["S", "Parcial", "N", ""]),
  observacoes: z.string().default(""),
});

const sigexEvaluationSchema = z.object({
  id: z.string().uuid().optional(),
  avaliador_nome: z.string().max(250).default(""),
  data_avaliacao: z.string().max(50).default(""),
  tarefas: z.record(sigexTaskAnswerSchema).default({}),
  avaliacao_geral: z.record(z.number().int().min(0).max(5)).default({}),
  comentarios: z.object({
    tarefas_dificeis: z.string().default(""),
    info_confusa: z.string().default(""),
    erros_encontrados: z.string().default(""),
    funcionalidades_importantes: z.string().default(""),
    outros_comentarios: z.string().default(""),
  }).default({
    tarefas_dificeis: "",
    info_confusa: "",
    erros_encontrados: "",
    funcionalidades_importantes: "",
    outros_comentarios: "",
  }),
  current_step: z.number().int().min(1).max(5).default(1),
  completed: z.boolean().default(false),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const saveResponse = createServerFn({ method: "POST" })
  .validator((d: unknown) => sigexEvaluationSchema.parse(d))
  .handler(async ({ data }) => {
    const hasSupabase =
      Boolean(process.env.SUPABASE_URL) &&
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

    const now = new Date().toISOString();
    const id = data.id || crypto.randomUUID();

    if (hasSupabase) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const payload = {
          avaliador_nome: data.avaliador_nome,
          data_avaliacao: data.data_avaliacao,
          tarefas: data.tarefas,
          avaliacao_geral: data.avaliacao_geral,
          comentarios: data.comentarios,
          current_step: data.current_step,
          completed: data.completed,
          updated_at: now,
        };

        if (data.id) {
          const { data: row, error } = await supabaseAdmin
            .from("sigex_avaliacoes")
            .update(payload)
            .eq("id", data.id)
            .select()
            .maybeSingle();

          if (!error && row) {
            return { id: row.id };
          }
        } else {
          const { data: row, error } = await supabaseAdmin
            .from("sigex_avaliacoes")
            .insert({ ...payload, id, created_at: now })
            .select()
            .single();

          if (!error && row) {
            return { id: row.id };
          }
        }
      } catch (e) {
        console.warn("Supabase save failed, falling back to local store:", (e as Error).message);
      }
    }

    // Fallback: Local JSON persistence via server module
    const { ensureLocalDataStore, saveLocalDataStore } = await import("./local-store.server");
    const items = ensureLocalDataStore();
    const existingIndex = items.findIndex((item) => item.id === id);

    const record: SigexEvaluationData = {
      ...data,
      id,
      created_at: existingIndex >= 0 ? items[existingIndex].created_at : now,
      updated_at: now,
    };

    if (existingIndex >= 0) {
      items[existingIndex] = record;
    } else {
      items.push(record);
    }

    saveLocalDataStore(items);
    return { id };
  });

export const getResponseById = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const hasSupabase =
      Boolean(process.env.SUPABASE_URL) &&
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (hasSupabase) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: row, error } = await supabaseAdmin
          .from("sigex_avaliacoes")
          .select("*")
          .eq("id", data.id)
          .maybeSingle();

        if (!error && row) {
          return row as unknown as SigexEvaluationData;
        }
      } catch {
        // Fallback to local
      }
    }

    const { ensureLocalDataStore } = await import("./local-store.server");
    const items = ensureLocalDataStore();
    const found = items.find((item) => item.id === data.id);
    return found ?? null;
  });

export const adminLogin = createServerFn({ method: "POST" })
  .validator((d: { username: string; password: string }) =>
    z.object({ username: z.string().min(1).max(100), password: z.string().min(1).max(200) }).parse(d)
  )
  .handler(async ({ data }) => {
    if (data.username !== ADMIN_USER || data.password !== ADMIN_PASS) {
      throw new Error("Credenciais inválidas");
    }
    const session = await useSession<AdminSession>(sessionConfig);
    await session.update({ isAdmin: true });
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig);
  await session.clear();
  return { ok: true };
});

export const adminMe = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig);
  return { isAdmin: !!session.data.isAdmin };
});

export const adminListResponses = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig);
  if (!session.data.isAdmin) throw new Error("Não autorizado");

  const hasSupabase =
    Boolean(process.env.SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (hasSupabase) {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin
        .from("sigex_avaliacoes")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data as unknown as SigexEvaluationData[];
      }
    } catch {
      // Fallback to local
    }
  }

  const { ensureLocalDataStore } = await import("./local-store.server");
  const items = ensureLocalDataStore();
  return items.sort((a, b) => {
    const da = a.created_at ? new Date(a.created_at).getTime() : 0;
    const db = b.created_at ? new Date(b.created_at).getTime() : 0;
    return db - da;
  });
});

export const adminGetResponse = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const session = await useSession<AdminSession>(sessionConfig);
    if (!session.data.isAdmin) throw new Error("Não autorizado");

    const hasSupabase =
      Boolean(process.env.SUPABASE_URL) &&
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (hasSupabase) {
      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: row, error } = await supabaseAdmin
          .from("sigex_avaliacoes")
          .select("*")
          .eq("id", data.id)
          .maybeSingle();

        if (!error && row) {
          return row as unknown as SigexEvaluationData;
        }
      } catch {
        // Fallback
      }
    }

    const { ensureLocalDataStore } = await import("./local-store.server");
    const items = ensureLocalDataStore();
    const found = items.find((item) => item.id === data.id);
    return found ?? null;
  });
