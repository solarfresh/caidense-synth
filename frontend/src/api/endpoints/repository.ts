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