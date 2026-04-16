# Edu-Especial Project Summary

## Tech Stack
- **Framework**: Next.js 15+ (using App Router)
- **UI**: React 19, Tailwind CSS 4, Lucide React
- **AI**: Google Generative AI (@google/generative-ai)
- **Deployment**: Netlify / Vercel (configured for static export)
- **Persistence**: Hybrid (Supabase/Postgres + LocalStorage fallback via `StudentContext`)

## Project Structure
- `app/`: Next.js App Router pages
  - `(app)/`: Core application routes
  - `api/`: API routes (Gemini integration, file uploads)
- `components/`:
  - `home/`: Modular sub-components for HomePage
  - `student/`: Modular sub-components for AlumnoPage
- `lib/`:
  - `context/`: State management (StudentContext)
  - `services/`: Data access layer (studentService)
  - `supabase.ts`: Supabase client configuration
  - `mock.ts`: Data models and mock data fallback

## Current Status
- Fully functional UI with mock data.
- Local persistence via Browser LocalStorage.
- Gemini AI integrated for document analysis/report generation.
- Configured for static export (`next.config.ts` probably has `output: 'export'`).

## Development Scripts
- `npm run dev`: Development server
- `npm run build`: Build for production
- `npm run lint`: ESLint check

## Technical Debt & Observations
- **Persistence**: Data only lives in the browser. Moving to Supabase/Postgres is planned.
- **Architectural Shift**: Changing from `output: 'export'` to a dynamic server will be needed for DB integration.
- **Modularity**: Some page components are large and could be split into smaller units.
