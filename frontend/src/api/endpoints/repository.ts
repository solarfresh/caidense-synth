import config from '@/config';


const CAIDENSE_SYNTH_API_URL = config.CAIDENSE_SYNTH_API_URL || '';
export const RepositoryEndpoints = {
  get: () =>
    `${CAIDENSE_SYNTH_API_URL}/prompt/set`,
  create: () =>
    `${CAIDENSE_SYNTH_API_URL}/prompt/set`,
  update: (repositoryId: string) =>
    `${CAIDENSE_SYNTH_API_URL}/prompt/set/${repositoryId}`,
  delete: (repositoryId: string) =>
    `${CAIDENSE_SYNTH_API_URL}/prompt/set/${repositoryId}`,
}