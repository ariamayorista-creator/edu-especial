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

## Lessons Learned & Technical Debt
- **Vercel Deployments**: Vercel silent build failures were caused by missing module dependencies (`html2pdf.js`, `@google/generative-ai`, `next-themes`) which were installed correctly locally but omitted from `package.json`. These must always be properly tracked.
- **State Management**: The dual LocalStorage + Supabase approach requires strict error boundaries if DB queries fail.
- **Supabase Authentication**: For automated initializations, the Management API with a personal access token bypassing RLS is an effective method to handle migrations and seed data.

## Upcoming Development Plan
1. **AI Option 1 (Generación de Informes Pedagógicos)**: Implement a one-click AI feature inside `/informes/[slug]/nuevo` to scrape Student Context and generate a professional pedagogical report using Gemini.
2. **AI Option 2 (Asistente de Adaptación Curricular)**: Create an interactive chat system mapping to the student's profile to suggest pedagogical adaptations in real time.

## Current Status
- Fully functional UI with mock data.
- Local persistence via Browser LocalStorage.
- Gemini AI integrated for document analysis/report generation.
- Configured for static export (`next.config.ts` probably has `output: 'export'`).

## Development Scripts
- `npm run dev`: Development server
- `npm run build`: Build for production
## Technical Debt & Observations
- **Persistence**: Data only lives in the browser. Moving to Supabase/Postgres is planned.
- **Architectural Shift**: Changing from `output: 'export'` to a dynamic server will be needed for DB integration.
- **Modularity**: Some page components are large and could be split into smaller units.
