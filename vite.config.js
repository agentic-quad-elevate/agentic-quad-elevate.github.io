import { existsSync, readFileSync } from 'node:fs'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base path: the built site works at the domain root or at any
// GitHub Pages project subpath (e.g. https://<org>.github.io/<repo>/) without
// changes. If you later add client-side routing, set this to '/<repo>/'.
//
// Anonymity: identifying data lives in identity.json and is injected as the
// __IDENTITY__ constant only for public builds. With VITE_ANONYMOUS=true the
// constant is null, so author names never reach the JavaScript bundle.
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
  const anonymous = env.VITE_ANONYMOUS === 'true'
  const identityPath = new URL('./identity.json', import.meta.url)
  if (!anonymous && !existsSync(identityPath)) {
    throw new Error(
      'identity.json not found. Public builds need it: copy identity.example.json to identity.json ' +
        'and fill in the authors, or run an anonymous build (npm run build:anon).',
    )
  }
  const identity = anonymous ? null : JSON.parse(readFileSync(identityPath, 'utf8'))

  return {
    base: './',
    plugins: [react()],
    define: {
      __IDENTITY__: JSON.stringify(identity),
    },
  }
})
