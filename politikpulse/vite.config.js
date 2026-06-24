import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// WICHTIG: Ändere '/politikpulse/' zum Namen deines GitHub-Repositories
// Beispiel: Wenn dein Repo 'meine-umfrage' heißt → base: '/meine-umfrage/'
export default defineConfig({
  plugins: [react()],
  base: '/politikpulse/',
})
