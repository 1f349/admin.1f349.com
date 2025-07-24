/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_VERSION: string;
  VITE_APP_LASTMOD: string;

  VITE_SSO_ORIGIN: string;
  VITE_OAUTH2_CLIENT_ID: string;
  VITE_OAUTH2_CLIENT_SCOPE: string;
  VITE_LOGOUT_PAGE: string;
  VITE_API_VIOLET: string;
  VITE_API_ORCHID: string;
  VITE_API_VERBENA: string;
  VITE_API_SITE_HOSTING: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
