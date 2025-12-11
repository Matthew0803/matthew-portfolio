# Database Setup Guide

This portfolio uses **SQLite** with **Drizzle ORM** to manage portfolio content (projects, experience, skills, education, and certifications).

## 📁 Database Structure

```
server/
├── db/
│   ├── schema.ts          # Database schema definitions
│   ├── index.ts           # Database connection
│   ├── seed.ts            # Seed data script
│   ├── portfolio.db       # SQLite database file (generated)
│   └── migrations/        # Database migrations (generated)
└── routes/
    └── portfolio.ts       # API endpoints
```

## 🗄️ Database Tables

### Projects
- Stores portfolio projects with title, description, technologies, links, etc.
- Fields: `id`, `title`, `description`, `longDescription`, `technologies`, `imageUrl`, `demoUrl`, `githubUrl`, `featured`, `displayOrder`

### Experience
- Work experience with company, position, responsibilities, achievements
- Fields: `id`, `company`, `position`, `location`, `description`, `responsibilities`, `achievements`, `technologies`, `startDate`, `endDate`, `current`

### Skills
- Technical skills grouped by category with proficiency levels
- Fields: `id`, `name`, `category`, `proficiency`, `icon`, `displayOrder`

### Education
- Educational background
- Fields: `id`, `institution`, `degree`, `field`, `location`, `description`, `gpa`, `startDate`, `endDate`

### Certifications
- Professional certifications
- Fields: `id`, `name`, `issuer`, `issueDate`, `expiryDate`, `credentialId`, `credentialUrl`, `description`

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `drizzle-orm` - TypeScript ORM
- `better-sqlite3` - SQLite driver
- `drizzle-kit` - Database toolkit (dev dependency)

### 2. Generate Database Schema

```bash
npm run db:push
```

This creates the SQLite database file and all tables based on the schema.

### 3. Seed the Database

```bash
npm run db:seed
```

This populates the database with sample data (projects, experience, skills, etc.).

## 📝 Available Scripts

- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes to database (quick sync)
- `npm run db:studio` - Open Drizzle Studio (visual database editor)
- `npm run db:seed` - Seed database with sample data

## 🔌 API Endpoints

All endpoints are prefixed with `/api`:

### GET /api/projects
Returns all projects ordered by featured status and display order.

### GET /api/projects/:id
Returns a single project by ID.

### GET /api/experience
Returns all work experience ordered by current position and display order.

### GET /api/skills
Returns all skills grouped by category.

### GET /api/education
Returns all education entries.

### GET /api/certifications
Returns all certifications.

### GET /api/portfolio
Returns all portfolio data in a single request (recommended for initial page load).

## 🎨 Using Drizzle Studio

Drizzle Studio provides a visual interface to view and edit your database:

```bash
npm run db:studio
```

This opens a web interface at `https://local.drizzle.studio` where you can:
- View all tables and data
- Edit records directly
- Run queries
- Manage relationships

## ✏️ Customizing Your Data

### Option 1: Edit seed.ts
1. Open `server/db/seed.ts`
2. Modify the sample data with your actual information
3. Run `npm run db:seed` to repopulate the database

### Option 2: Use Drizzle Studio
1. Run `npm run db:studio`
2. Edit data directly in the visual interface

### Option 3: Direct Database Access
Use any SQLite client to connect to `server/db/portfolio.db`

## 🔄 Making Schema Changes

1. Edit `server/db/schema.ts`
2. Run `npm run db:push` to sync changes to the database
3. Re-seed if needed: `npm run db:seed`

## 📦 Production Deployment

The SQLite database file (`portfolio.db`) will be created in the `server/db/` directory. Make sure to:

1. Run `npm run db:push` on your production server
2. Run `npm run db:seed` to populate data
3. Or copy your local `portfolio.db` file to production

## 🛠️ Troubleshooting

### better-sqlite3 installation issues
If you encounter build errors with `better-sqlite3`:

**Windows**: Install Visual Studio Build Tools
```bash
npm install --global windows-build-tools
```

**Alternative**: Use prebuilt binaries
```bash
npm install better-sqlite3 --build-from-source=false
```

### Database locked errors
SQLite uses file-based locking. Make sure only one process accesses the database at a time.

### TypeScript errors
Run `npm install` to ensure all type definitions are installed:
- `@types/better-sqlite3`
- `drizzle-orm`
- `drizzle-kit`

## 📚 Learn More

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [better-sqlite3 Documentation](https://github.com/WiseLibs/better-sqlite3)
