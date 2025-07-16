# TravelClothingClub

## Environment Variables

Create a `.env` file in the project root using the provided `.env.example` as a starting point. These variables are required for the application to function:

- `FASHN_API_KEY` - Server side key for calling the FASHN API.
- `VITE_SUPABASE_URL` - URL of your Supabase project.
- `VITE_SUPABASE_ANON_KEY` - Anonymous public key for Supabase.
- `VITE_FASHN_AI_API_KEY` - Client side key for Fashn's AI try-on service.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

To create a production build and preview it locally:

```bash
npm run build
npm run preview
```
