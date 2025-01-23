declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string; // Add other variables as needed
    NODE_ENV: "development" | "production" | "test"; // Example of a common variable
    // Add more environment variables below
  }
}
