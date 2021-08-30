export interface Configuration {
  app: {
    port: number;
  };
  database: {
    type: string;
    host: string;
    port: number;
    name: string;
    sync: boolean;
    username: string;
    password: string;
  };
  firebase: {
    projectId: string;
    privateKey: string;
    clientEmail: string;
  };
  googleBooks: {
    apiKey: string;
    apiEndpointSearch: string;
  };
}

const envString = (variableName: string): string => {
  return process.env[variableName];
};

const envNumber = (variableName: string): number => {
  return parseInt(process.env[variableName], 10);
};

const envBoolean = (variableName: string): boolean => {
  return process.env[variableName] === 'true';
};

export default (): { config: Configuration } => ({
  config: {
    app: {
      port: envNumber('APP_CONTAINER_PORT'),
    },
    database: {
      type: envString('DATABASE_TYPE'),
      host: envString('DATABASE_HOST'),
      port: envNumber('DATABASE_PORT'),
      name: envString('DATABASE_NAME'),
      sync: envBoolean('DATABASE_SYNC'),
      username: envString('DATABASE_USERNAME'),
      password: envString('DATABASE_PASSWORD'),
    },
    firebase: {
      projectId: envString('FIREBASE_PROJECT_ID'),
      privateKey: envString('FIREBASE_PRIVATE_KEY'),
      clientEmail: envString('FIREBASE_CLIENT_EMAIL'),
    },
    googleBooks: {
      apiKey: envString('GOOGLE_BOOKS_API_KEY'),
      apiEndpointSearch: envString('GOOGLE_BOOKS_API_ENDPOINT_SEARCH'),
    },
  },
});
