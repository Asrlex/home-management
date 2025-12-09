interface ImportMeta {
  readonly env: {
    readonly [key: string]: string | undefined;
    readonly VITE_NODE_ENV: string;
    readonly VITE_API_BASE_URL: string;
    readonly VITE_API_KEY: string;
  };
}
