/* @refresh reload */
import { render } from 'solid-js/web';
import { ErrorBoundary } from "solid-js";
import { Toaster } from 'solid-toast';
import IndexedDBProvider from '@/shared/context/indexedDB';
import Routing from './routes';
import '@/styles/index.css';
import { config } from '@/config/indexedDB';
const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => (
  <ErrorBoundary fallback={(err) => <div class="flex justify-center items-center">Error: {err.message}</div>}>
    <Toaster />
    <IndexedDBProvider value={config}>
      <Routing />
    </IndexedDBProvider>
  </ErrorBoundary>
), root!);
