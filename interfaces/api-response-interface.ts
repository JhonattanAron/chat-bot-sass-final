export interface APIResponse {
  error?: boolean;
  data?: {
    error?: string;
    // ...otros campos
  };
  // ...otros posibles campos
}
