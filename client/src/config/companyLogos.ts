/**
 * Company logo configuration for the interactive dice component.
 * 
 * Workflow:
 * 1. Get/create colored SVG logos (official brand assets, vectorizer.ai, etc.)
 * 2. Save to `client/src/assets/logos/company_name.svg`
 * 3. Import below
 * 4. Add to COMPANY_LOGOS with exact company name from database
 * 
 * Note: Dice is limited to 6 faces, keep array ≤ 6 entries.
 */
import waturbineLogo from "@/assets/logos/waturbine.svg";
import watoLogo from "@/assets/logos/wato.svg";
import needlistLogo from "@/assets/logos/needlist.svg";
import bajaLogo from "@/assets/logos/baja.svg";
import afterqueryLogo from "@/assets/logos/afterquery.svg";
import studicaLogo from "@/assets/logos/studica.svg";

export type CompanyLogo = {
  /** Must match experience.company field exactly (case-sensitive) */
  company: string;
  /** Imported logo file (PNG/WEBP/SVG) */
  logo: string;
};

export const COMPANY_LOGOS: CompanyLogo[] = [
  { company: "WATO", logo: watoLogo },                // Face 1
  { company: "AfterQuery", logo: afterqueryLogo },    // Face 2
  { company: "UW Baja SAE", logo: bajaLogo },         // Face 3
  { company: "MobileSurety", logo: needlistLogo },    // Face 4
  { company: "FoloBotics", logo: waturbineLogo },     // Face 5
];
