import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";

export interface TranslateRequest {
  text: string;
  from: string;
  to: string;
}

export interface TranslateResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence?: number;
  alternatives?: string[];
}

export function useTranslateText() {
  return useMutation({
    mutationFn: async (request: TranslateRequest): Promise<TranslateResponse> => {
      const response = await apiRequest("POST", "/api/translate", request);
      return response.json();
    },
  });
}

export function useDetectLanguage() {
  return useMutation({
    mutationFn: async (text: string): Promise<{ language: string; confidence: number }> => {
      const response = await apiRequest("POST", "/api/detect-language", { text });
      return response.json();
    },
  });
}

export function useSaveTranslation() {
  return useMutation({
    mutationFn: async (translation: {
      sourceText: string;
      translatedText: string;
      sourceLanguage: string;
      targetLanguage: string;
    }) => {
      const response = await apiRequest("POST", "/api/translations/save", translation);
      return response.json();
    },
  });
}
