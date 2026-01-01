/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PREVIEW_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
