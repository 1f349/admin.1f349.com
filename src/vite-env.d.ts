/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_SSO_ORIGIN: string;
  VITE_API_VIOLET: string;
  VITE_API_ORCHID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
