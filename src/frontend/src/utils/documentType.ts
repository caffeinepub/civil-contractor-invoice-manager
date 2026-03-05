import { getCurrentUser } from "./auth";

export type DocumentType = "Invoice" | "Quotation";

function getKey(): string {
  return `cim_document_types_${getCurrentUser()}`;
}

function loadMap(): Record<string, DocumentType> {
  try {
    const raw = localStorage.getItem(getKey());
    if (raw) return JSON.parse(raw) as Record<string, DocumentType>;
  } catch {
    // ignore
  }
  return {};
}

function saveMap(map: Record<string, DocumentType>): void {
  localStorage.setItem(getKey(), JSON.stringify(map));
}

export function getDocumentType(invoiceId: string | bigint): DocumentType {
  const map = loadMap();
  return map[invoiceId.toString()] ?? "Invoice";
}

export function setDocumentType(
  invoiceId: string | bigint,
  type: DocumentType,
): void {
  const map = loadMap();
  map[invoiceId.toString()] = type;
  saveMap(map);
}
