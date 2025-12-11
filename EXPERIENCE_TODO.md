# Experience Records - Fill In Later

The database has been seeded with dummy experience records matching your 6 dice logos.

## Companies (in display order)

1. **Waturbine** - Current position
2. **WATO**
3. **Needlist**
4. **Baja**
5. **AfterQuery**
6. **Studica**

## Fields to Fill In

For each company, update the following in `server/db/seed.ts`:

```typescript
{
  company: "Company Name",        // ✅ Already set
  position: "[Position Title]",   // TODO: e.g., "Software Engineer"
  location: "[Location]",         // TODO: e.g., "San Francisco, CA"
  description: "[Brief description of role and responsibilities]",
  responsibilities: JSON.stringify([
    "[Responsibility 1]",         // TODO: What you did
    "[Responsibility 2]",
    "[Responsibility 3]",
  ]),
  achievements: JSON.stringify([
    "[Achievement 1]",            // TODO: Impact/results
    "[Achievement 2]",
  ]),
  technologies: JSON.stringify([  // TODO: Tech stack used
    "[Tech 1]",
    "[Tech 2]",
    "[Tech 3]",
  ]),
  startDate: "YYYY-MM",           // ✅ Already set (approximate)
  endDate: "YYYY-MM" or null,     // ✅ Already set
  current: true/false,            // ✅ Already set
  displayOrder: 1-6,              // ✅ Already set
}
```

## How to Update

1. **Edit** `server/db/seed.ts`
2. **Replace** `[Position Title]`, `[Location]`, etc. with actual content
3. **Run** `npm run db:seed` to update database
4. **Refresh** your browser

## Quick Commands

```bash
# Re-seed database after editing
npm run db:seed

# View database in browser
npm run db:studio
```

## Notes

- Company names match exactly with `companyLogos.ts`
- Dice will automatically show the correct logo for each company
- Start dates are staggered from newest (2023) to oldest (2020)
- Waturbine is set as current position
