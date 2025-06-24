import config from '@/config';


const CAIDENSE_SYNTH_API_URL = config.CAIDENSE_SYNTH_API_URL || '';
export const NodeEndpoints = {
  getAll: () =>
    `${CAIDENSE_SYNTH_API_URL}/reasoning/nodes`,
  create: () =>
    `${CAIDENSE_SYNTH_API_URL}/reasoning/nodes`,
  get: (nodeId: string) =>
    `${CAIDENSE_SYNTH_API_URL}/reasoning/nodes/${nodeId}`,
  update: (nodeId: string) =>
    `${CAIDENSE_SYNTH_API_URL}/reasoning/nodes/${nodeId}`,
  delete: (nodeId: string) =>
    `${CAIDENSE_SYNTH_API_URL}/reasoning/nodes/${nodeId}`,
}