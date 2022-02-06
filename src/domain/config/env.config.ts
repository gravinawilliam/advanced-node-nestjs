export type IEnvConfig = {
  application: {
    name: string;
    port: number;
    nodeEnv: 'DEVELOPMENT' | 'PRODUCTION' | 'TEST' | 'LOCAL';
  };
};
