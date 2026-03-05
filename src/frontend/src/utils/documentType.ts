export type DocumentType = "Invoice" | "Quotation";

const KEY = "cim_document_types";

function loadMap(): Record<string, DocumentType> {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Record<string, DocumentType>;
  } catch {
    // ignore
  }
  return {};
}

function saveMap(map: Record<string, DocumentType>): void {
  localStorage.setItem(KEY, JSON.stringify(map));
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
