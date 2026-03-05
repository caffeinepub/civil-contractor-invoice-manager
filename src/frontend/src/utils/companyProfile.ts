export interface CompanyProfile {
  name: string;
  address: string;
  logo: string; // base64 data URL or empty string
}

const KEY = "cim_company_profile";

export function getCompanyProfile(): CompanyProfile {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as CompanyProfile;
  } catch {
    // ignore parse errors
  }
  return { name: "", address: "", logo: "" };
}

export function saveCompanyProfile(profile: CompanyProfile): void {
  localStorage.setItem(KEY, JSON.stringify(profile));
}
