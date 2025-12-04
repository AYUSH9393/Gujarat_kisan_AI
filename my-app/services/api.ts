// services/api.ts
// This handles all communication with backend

const API_BASE_URL = 'http://172.20.10.9:8000'; // REPLACE WITH YOUR IP!

export interface AskQuestionRequest {
  question: string;
  language?: string;
}

export interface AskQuestionResponse {
  answer: string;
  question: string;
  language: string;
}

export const apiService = {
  // Test if backend is reachable
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  },

  // Ask question to AI
  async askQuestion(request: AskQuestionRequest): Promise<AskQuestionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};