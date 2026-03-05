import { getCurrentUser } from "./auth";

export interface CompanyProfile {
  name: string;
  address: string;
  logo: string; // base64 data URL or empty string
}

function getKey(): string {
  return `cim_company_profile_${getCurrentUser()}`;
}

export function getCompanyProfile(): CompanyProfile {
  try {
    const raw = localStorage.getItem(getKey());
    if (raw) return JSON.parse(raw) as CompanyProfile;
  } catch {
    // ignore parse errors
  }
  return { name: "", address: "", logo: "" };
}

export function saveCompanyProfile(profile: CompanyProfile): void {
  localStorage.setItem(getKey(), JSON.stringify(profile));
}
