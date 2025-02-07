/* @refresh reload */
import { render } from 'solid-js/web';
import { ErrorBoundary } from "solid-js";
import './styles/index.css';
import Routing from './routes';
import IndexedDBProvider, { StoreSchema } from 'context/indexedDB';
import { Toaster } from 'solid-toast';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

const stores: StoreSchema[] = [
  {
    name: "folder",
    options: {
      keyPath: "id"
    },
  },
  {
    name: "note",
    options: {
      keyPath: "id"
    },
  },
  {
    name: "pending",
    options: {
      autoIncrement: true
    },
  }
];

const config = {
  name: "nowted",
  version: 2,
  stores
}

render(() => (
  <ErrorBoundary fallback={(err) => <div class="flex justify-center items-center">Error: {err.message}</div>}>
    <IndexedDBProvider value={config}>
      <Toaster />
      <Routing />
    </IndexedDBProvider>
  </ErrorBoundary>
), root!);
