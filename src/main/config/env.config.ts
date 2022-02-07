import { IEnvConfig } from '@domain/config/env.config';
import 'dotenv/config';

export const envConfig: IEnvConfig = {
  application: {
    name: 'advanced-node-nestjs',
    nodeEnv: process.env.NODE_ENV as 'DEVELOPMENT' | 'PRODUCTION' | 'TEST' | 'LOCAL',
    port: +process.env.ADVANCED_NODE_NESTJS_PORT ?? 2222,
  },
};
