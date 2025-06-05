interface RuntimeConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  CAIDENSE_SYNTH_API_URL: string;
}


const config: RuntimeConfig = {
  NODE_ENV: import.meta.env.VITE_NODE_ENV as RuntimeConfig['NODE_ENV'],
  CAIDENSE_SYNTH_API_URL: import.meta.env.VITE_CAIDENSE_SYNTH_API_URL as string,
};

export default config;