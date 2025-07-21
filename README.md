# Travel Clothing Club

Travel Clothing Club is a React and TypeScript application that uses Supabase for data storage and the FASHN.ai API for virtual try‑on demos. It lets you upload images of clothing and preview them on an AI model.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

### Required environment variables

Create a `.env` file in the project root with these variables:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
FASHN_API_KEY=your-fashn-api-key
```

## API functions

The serverless API functions are located in:

- `api/` – used when deploying to **Vercel**.
- `netlify/functions/` – used when deploying to **Netlify**.

Both directories contain an implementation of `fashn-tryon` which proxies requests to the FASHN.ai API.

## Deployment

Deploy the project to either Vercel or Netlify. Vercel automatically picks up functions under the `api/` directory, while Netlify uses the configuration in `netlify.toml` and the functions in `netlify/functions/`.

