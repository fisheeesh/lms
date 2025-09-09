import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './routes'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './api/query'
import { Toaster } from 'sonner'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@/components/shared/theme-provider'

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router />
      <Toaster richColors />
    </ThemeProvider>
  </QueryClientProvider>
)
