import { T as TSS_SERVER_FUNCTION, a as createServerFn, u as useSession } from "./server-CDMgFY0I.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, e as enumType, b as booleanType, n as numberType, r as recordType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const SESSION_PASSWORD = process.env.SESSION_SECRET || "sigex-mvp-roteiro-secret-rotate-32chars-key-2026";
const sessionConfig = {
  password: SESSION_PASSWORD,
  name: "sigex-admin-session",
  maxAge: 60 * 60 * 8
};
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "123456";
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
const saveResponse_createServerFn_handler = createServerRpc({
  id: "1a1f31988e934373c1a56d9df4ba6d0d4026d3af903ff572e4b200031fb6636f",
  name: "saveResponse",
  filename: "src/lib/responses.functions.ts"
}, (opts) => saveResponse.__executeServer(opts));
const saveResponse = createServerFn({
  method: "POST"
}).validator((d) => sigexEvaluationSchema.parse(d)).handler(saveResponse_createServerFn_handler, async ({
  data
}) => {
  const hasSupabase = Boolean(process.env.SUPABASE_URL) && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const id = data.id || crypto.randomUUID();
  if (hasSupabase) {
    try {
      const {
        supabaseAdmin
      } = await import("./client.server-D-aV4af-.mjs");
      const payload = {
        avaliador_nome: data.avaliador_nome,
        data_avaliacao: data.data_avaliacao,
        tarefas: data.tarefas,
        avaliacao_geral: data.avaliacao_geral,
        comentarios: data.comentarios,
        current_step: data.current_step,
        completed: data.completed,
        updated_at: now
      };
      if (data.id) {
        const {
          data: row,
          error
        } = await supabaseAdmin.from("sigex_avaliacoes").update(payload).eq("id", data.id).select().maybeSingle();
        if (!error && row) {
          return {
            id: row.id
          };
        }
      } else {
        const {
          data: row,
          error
        } = await supabaseAdmin.from("sigex_avaliacoes").insert({
          ...payload,
          id,
          created_at: now
        }).select().single();
        if (!error && row) {
          return {
            id: row.id
          };
        }
      }
    } catch (e) {
      console.warn("Supabase save failed, falling back to local store:", e.message);
    }
  }
  const {
    ensureLocalDataStore,
    saveLocalDataStore
  } = await import("./local-store.server-DbtGGPsz.mjs");
  const items = ensureLocalDataStore();
  const existingIndex = items.findIndex((item) => item.id === id);
  const record = {
    ...data,
    id,
    created_at: existingIndex >= 0 ? items[existingIndex].created_at : now,
    updated_at: now
  };
  if (existingIndex >= 0) {
    items[existingIndex] = record;
  } else {
    items.push(record);
  }
  saveLocalDataStore(items);
  return {
    id
  };
});
const getResponseById_createServerFn_handler = createServerRpc({
  id: "a02545803fd437237b32e113ed1592d55d3813e6749d43dce61558d6c90a0f03",
  name: "getResponseById",
  filename: "src/lib/responses.functions.ts"
}, (opts) => getResponseById.__executeServer(opts));
const getResponseById = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(getResponseById_createServerFn_handler, async ({
  data
}) => {
  const hasSupabase = Boolean(process.env.SUPABASE_URL) && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (hasSupabase) {
    try {
      const {
        supabaseAdmin
      } = await import("./client.server-D-aV4af-.mjs");
      const {
        data: row,
        error
      } = await supabaseAdmin.from("sigex_avaliacoes").select("*").eq("id", data.id).maybeSingle();
      if (!error && row) {
        return row;
      }
    } catch {
    }
  }
  const {
    ensureLocalDataStore
  } = await import("./local-store.server-DbtGGPsz.mjs");
  const items = ensureLocalDataStore();
  const found = items.find((item) => item.id === data.id);
  return found ?? null;
});
const adminLogin_createServerFn_handler = createServerRpc({
  id: "ee09cf83792185c052813a3d87800e84d1f13b67af79867762c85f57daa8deb6",
  name: "adminLogin",
  filename: "src/lib/responses.functions.ts"
}, (opts) => adminLogin.__executeServer(opts));
const adminLogin = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  username: stringType().min(1).max(100),
  password: stringType().min(1).max(200)
}).parse(d)).handler(adminLogin_createServerFn_handler, async ({
  data
}) => {
  if (data.username !== ADMIN_USER || data.password !== ADMIN_PASS) {
    throw new Error("Credenciais inválidas");
  }
  const session = await useSession(sessionConfig);
  await session.update({
    isAdmin: true
  });
  return {
    ok: true
  };
});
const adminLogout_createServerFn_handler = createServerRpc({
  id: "38b7dd90a9f9a3468d4ac1c8de674b76d6da1e033b89db5d518cbff8d7e12d9b",
  name: "adminLogout",
  filename: "src/lib/responses.functions.ts"
}, (opts) => adminLogout.__executeServer(opts));
const adminLogout = createServerFn({
  method: "POST"
}).handler(adminLogout_createServerFn_handler, async () => {
  const session = await useSession(sessionConfig);
  await session.clear();
  return {
    ok: true
  };
});
const adminMe_createServerFn_handler = createServerRpc({
  id: "1d8fde1fd9c4d39bbad2435bbb29c8331a99667ea0a5643a60b47eb1c266d578",
  name: "adminMe",
  filename: "src/lib/responses.functions.ts"
}, (opts) => adminMe.__executeServer(opts));
const adminMe = createServerFn({
  method: "GET"
}).handler(adminMe_createServerFn_handler, async () => {
  const session = await useSession(sessionConfig);
  return {
    isAdmin: !!session.data.isAdmin
  };
});
const adminListResponses_createServerFn_handler = createServerRpc({
  id: "d6a770fe84b860d69acef2d775d3d677840402abf4a3ca87ccf20f06cf1f3c61",
  name: "adminListResponses",
  filename: "src/lib/responses.functions.ts"
}, (opts) => adminListResponses.__executeServer(opts));
const adminListResponses = createServerFn({
  method: "GET"
}).handler(adminListResponses_createServerFn_handler, async () => {
  const session = await useSession(sessionConfig);
  if (!session.data.isAdmin) throw new Error("Não autorizado");
  const hasSupabase = Boolean(process.env.SUPABASE_URL) && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (hasSupabase) {
    try {
      const {
        supabaseAdmin
      } = await import("./client.server-D-aV4af-.mjs");
      const {
        data,
        error
      } = await supabaseAdmin.from("sigex_avaliacoes").select("*").order("created_at", {
        ascending: false
      });
      if (!error && data) {
        return data;
      }
    } catch {
    }
  }
  const {
    ensureLocalDataStore
  } = await import("./local-store.server-DbtGGPsz.mjs");
  const items = ensureLocalDataStore();
  return items.sort((a, b) => {
    const da = a.created_at ? new Date(a.created_at).getTime() : 0;
    const db = b.created_at ? new Date(b.created_at).getTime() : 0;
    return db - da;
  });
});
const adminGetResponse_createServerFn_handler = createServerRpc({
  id: "62fc0706a2026ed834f5ed165f175a743bc37b603f5f64de41e4fb64220b54b0",
  name: "adminGetResponse",
  filename: "src/lib/responses.functions.ts"
}, (opts) => adminGetResponse.__executeServer(opts));
const adminGetResponse = createServerFn({
  method: "POST"
}).validator((d) => objectType({
  id: stringType().uuid()
}).parse(d)).handler(adminGetResponse_createServerFn_handler, async ({
  data
}) => {
  const session = await useSession(sessionConfig);
  if (!session.data.isAdmin) throw new Error("Não autorizado");
  const hasSupabase = Boolean(process.env.SUPABASE_URL) && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (hasSupabase) {
    try {
      const {
        supabaseAdmin
      } = await import("./client.server-D-aV4af-.mjs");
      const {
        data: row,
        error
      } = await supabaseAdmin.from("sigex_avaliacoes").select("*").eq("id", data.id).maybeSingle();
      if (!error && row) {
        return row;
      }
    } catch {
    }
  }
  const {
    ensureLocalDataStore
  } = await import("./local-store.server-DbtGGPsz.mjs");
  const items = ensureLocalDataStore();
  const found = items.find((item) => item.id === data.id);
  return found ?? null;
});
export {
  adminGetResponse_createServerFn_handler,
  adminListResponses_createServerFn_handler,
  adminLogin_createServerFn_handler,
  adminLogout_createServerFn_handler,
  adminMe_createServerFn_handler,
  getResponseById_createServerFn_handler,
  saveResponse_createServerFn_handler
};
