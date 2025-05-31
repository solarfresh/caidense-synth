interface ImportMetaEnv {
  readonly VITE_NODE_ENV: 'development' | 'production' | 'test';
  readonly VITE_CAIDENSE_SYNTH_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}