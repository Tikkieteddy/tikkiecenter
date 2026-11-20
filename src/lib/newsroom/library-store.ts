import { legalReferences } from "./mock-data";
import type { LegalReference } from "./types";

const STORE_KEY = "__newsRiskRuntimeLibraryReferences";

type RuntimeGlobal = typeof globalThis & {
  [STORE_KEY]?: LegalReference[];
};

function runtimeStore() {
  const runtime = globalThis as RuntimeGlobal;
  runtime[STORE_KEY] ||= [];
  return runtime[STORE_KEY];
}

export function getAllLibraryReferences() {
  const uploaded = runtimeStore();
  const merged = [...uploaded, ...legalReferences];
  const seen = new Set<string>();

  return merged.filter((reference) => {
    if (seen.has(reference.id)) return false;
    seen.add(reference.id);
    return true;
  });
}

export function addRuntimeLibraryReference(reference: LegalReference) {
  const store = runtimeStore();
  const existingIndex = store.findIndex((item) => item.id === reference.id);

  if (existingIndex >= 0) {
    store[existingIndex] = reference;
  } else {
    store.unshift(reference);
  }

  return reference;
}
