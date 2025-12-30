// This service demonstrates how to use the API key from environment variables
// Compatible with both standard env and Vite

const API_KEY = process.env.API_KEY;

export const logCompletion = async (data: any) => {
  if (!API_KEY) {
    console.log("No API Key configured in environment variables.");
    return;
  }

  // Example of how one might send data to an external endpoint if needed in the future
  console.log("Logging completion with secure key...", "Data sent.");
};