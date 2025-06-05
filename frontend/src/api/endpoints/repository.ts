import config from '@/config';


const CAIDENSE_SYNTH_API_URL = config.CAIDENSE_SYNTH_API_URL || '';
export const RepositoryEndpoints = {
  getAll: () =>
    `${CAIDENSE_SYNTH_API_URL}/prompt/set`,
  create: () =>
    `${CAIDENSE_SYNTH_API_URL}/prompt/set`,
  get: (repositoryId: string) =>
    `${CAIDENSE_SYNTH_API_URL}/prompt/set/${repositoryId}`,
  update: (repositoryId: string) =>
    `${CAIDENSE_SYNTH_API_URL}/prompt/set/${repositoryId}`,
  delete: (repositoryId: string) =>
    `${CAIDENSE_SYNTH_API_URL}/prompt/set/${repositoryId}`,
}

export const PromptEndpoints = {
  getAll: () =>
    `${CAIDENSE_SYNTH_API_URL}/prompt/text`,
  create: () =>
    `${CAIDENSE_SYNTH_API_URL}/prompt/text`,
  get: (promptId: string) =>
    `${CAIDENSE_SYNTH_API_URL}/prompt/text/${promptId}`,
  update: (promptId: string) =>
    `${CAIDENSE_SYNTH_API_URL}/prompt/text/${promptId}`,
  delete: (promptId: string) =>
    `${CAIDENSE_SYNTH_API_URL}/prompt/text/${promptId}`,
}

export const GenAIEndPoints = {
  GoogleAIStudio: () =>
    `${CAIDENSE_SYNTH_API_URL}/genai/google/aistudio/generate`
}