import config from '@/config';


const CAIDENSE_SYNTH_AUTH_URL = config.CAIDENSE_SYNTH_AUTH_URL || '';
export const AuthEndpoints = {
  login: () =>
    `${CAIDENSE_SYNTH_AUTH_URL}/auth/login`,
};