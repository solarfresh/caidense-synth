import config from '@/config';


const CAIDENSE_SYNTH_API_URL = config.CAIDENSE_SYNTH_API_URL || '';
export const WorkflowEndpoints = {
  getAll: () =>
    `${CAIDENSE_SYNTH_API_URL}/reasoning/template`,
  create: () =>
    `${CAIDENSE_SYNTH_API_URL}/reasoning/template`,
  get: (templateId: string) =>
    `${CAIDENSE_SYNTH_API_URL}/reasoning/template/${templateId}`,
  update: (templateId: string) =>
    `${CAIDENSE_SYNTH_API_URL}/reasoning/template/${templateId}`,
  delete: (templateId: string) =>
    `${CAIDENSE_SYNTH_API_URL}/reasoning/template/${templateId}`,
  createThinking: (templateId: string) =>
    `${CAIDENSE_SYNTH_API_URL}/reasoning/template/${templateId}/thinking/create`,
  updateThinking: (templateId: string) =>
    `${CAIDENSE_SYNTH_API_URL}/reasoning/template/${templateId}/thinking/update`,
  executeWorkflow: () =>
    `${CAIDENSE_SYNTH_API_URL}/execution/send`,
};