# Logo Setup

## Simple Workflow

1. **Get colored SVG logos**
   - Download official brand assets from company websites
   - Use vectorizer.ai to convert PNG → colored SVG
   - Create manually in Figma/Inkscape
   - Ensure transparent background and full color

2. **Add to project**
   - Save to: `client/src/assets/logos/company_name.svg`

3. **Import in config**
   - Edit: `client/src/config/companyLogos.ts`
   - Add import and entry to array

4. **Match company name**
   - Company name must match `experience.company` in database exactly

## Example

```typescript
// In companyLogos.ts
import newLogo from "@/assets/logos/company_name.svg";

export const COMPANY_LOGOS: CompanyLogo[] = [
  { company: "Company Name", logo: newLogo },
  // ... other logos
];
```

## Getting Colored SVGs

**Best Sources:**
1. **Official brand assets** - Company websites (press/media section)
2. **[Vectorizer.ai](https://vectorizer.ai/)** - Free AI conversion from PNG
3. **[Vector Magic](https://vectormagic.com/)** - Paid, best quality
4. **Manual creation** - Figma (free), Inkscape (free), Illustrator (paid)

## File Structure

```
client/src/assets/logos/
├── Waturbine.svg
├── Wato.svg
├── Studica.svg
├── needlist.svg
├── baja.svg
└── AfterQuery.svg
```

## Frontend vs Backend

**Logos stay in frontend** because:
- ✅ Static assets, optimized by Vite
- ✅ Faster load times (bundled with app)
- ✅ No database overhead
- ✅ Matched by company name in config

**Backend should NOT store logos** - it only stores company names in the experience records.
