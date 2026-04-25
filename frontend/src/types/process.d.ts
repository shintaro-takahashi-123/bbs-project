declare namespace NodeJS {
  interface ProcessEnv {
    MICROCMS_SERVICE_DOMAIN?: string;
    MICROCMS_API_KEY?: string;
    MICROCMS_ENDPOINT?: string;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};
