# Logo to Experience Mapping

## How It Works

1. **Dice faces** are assigned by array index in `companyLogos.ts`
2. **Clicking a face** looks up the experience by matching `company` name
3. **Company names must match exactly** (case-sensitive)

## Current Mapping

| Dice Face | Array Index | Logo File | Company Name (Logo) | Company Name (DB) | Match? |
|-----------|-------------|-----------|---------------------|-------------------|---------|
| Face 1 | 0 | Waturbine.svg | "Waturbine" | "Waturbine" | ✅ |
| Face 2 | 1 | Wato.svg | "WATO" | "WATO" | ✅ |
| Face 3 | 2 | needlist.svg | "Needlist" | "Needlist" | ✅ |
| Face 4 | 3 | baja.svg | "Baja" | "Baja" | ✅ |
| Face 5 | 4 | AfterQuery.svg | "AfterQuery" | "AfterQuery" | ✅ |
| Face 6 | 5 | studica.svg | "Studica" | "Studica" | ✅ |

## Files to Check

### companyLogos.ts (defines dice order)
```typescript
export const COMPANY_LOGOS: CompanyLogo[] = [
  { company: "Waturbine", logo: waturbineLogo },    // Face 1
  { company: "WATO", logo: watoLogo },              // Face 2
  { company: "Needlist", logo: needlistLogo },      // Face 3
  { company: "Baja", logo: bajaLogo },              // Face 4
  { company: "AfterQuery", logo: afterqueryLogo },  // Face 5
  { company: "Studica", logo: studicaLogo },        // Face 6
];
```

### seed.ts (database records)
```typescript
await db.insert(experience).values([
  { company: "Waturbine", ... },   // Matches Face 1
  { company: "WATO", ... },        // Matches Face 2
  { company: "Needlist", ... },    // Matches Face 3
  { company: "Baja", ... },        // Matches Face 4
  { company: "AfterQuery", ... },  // Matches Face 5
  { company: "Studica", ... },     // Matches Face 6
]);
```

## To Fix Mix-ups

If the wrong experience shows for a dice face:

1. **Check company names match exactly** (case-sensitive)
2. **Reorder `COMPANY_LOGOS` array** if you want different face assignments
3. **Database `displayOrder` doesn't affect dice** - only used for list views

## Example: Swap Baja and Needlist on Dice

If you want Baja on Face 3 and Needlist on Face 4:

```typescript
// In companyLogos.ts
export const COMPANY_LOGOS: CompanyLogo[] = [
  { company: "Waturbine", logo: waturbineLogo },
  { company: "WATO", logo: watoLogo },
  { company: "Baja", logo: bajaLogo },              // Now Face 3
  { company: "Needlist", logo: needlistLogo },      // Now Face 4
  { company: "AfterQuery", logo: afterqueryLogo },
  { company: "Studica", logo: studicaLogo },
];
```

No database changes needed - it matches by name automatically!
