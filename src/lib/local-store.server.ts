import fs from "node:fs";
import path from "node:path";
import type { SigexEvaluationData } from "./sigex.constants";

const DATA_DIR = path.resolve(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "sigex_avaliacoes.json");

export function ensureLocalDataStore(): SigexEvaluationData[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([]), "utf-8");
      return [];
    }
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content) as SigexEvaluationData[];
  } catch (err) {
    console.error("Local data store error:", err);
    return [];
  }
}

export function saveLocalDataStore(items: SigexEvaluationData[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to local data store:", err);
  }
}
