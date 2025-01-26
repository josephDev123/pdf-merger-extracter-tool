declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string; // Add other variables as needed
    AWS_ACCESS_KEY: string;
    AWS_SECRET_ACCESS_KEY: string;
    CLOUDFRONT_URL: string;
    NODE_ENV: "development" | "production" | "test"; // Example of a common variable
    // Add more environment variables below
  }
}
