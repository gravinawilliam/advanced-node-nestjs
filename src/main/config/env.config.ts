import { IEnvConfig } from '@domain/config/env.config';

import 'dotenv/config';
import packageJson from '../../../package.json';

export const envConfig: IEnvConfig = {
  application: {
    name: packageJson.version,
    nodeEnv: process.env.NODE_ENV as 'DEVELOPMENT' | 'PRODUCTION' | 'TEST' | 'LOCAL',
    port: 2222,
  },
};
