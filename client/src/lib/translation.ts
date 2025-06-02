import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";

interface TranslateRequest {
  text: string;
  from: string;
  to: string;
}

interface TranslateResponse {
  translatedText: string;
  confidence?: number;
}

export function useTranslateText() {
  return useMutation({
    mutationFn: async ({ text, from, to }: TranslateRequest): Promise<TranslateResponse> => {
      const response = await apiRequest("POST", "/api/translate", { text, from, to });
      return await response.json();
    },
  });
}

export function useDetectLanguage() {
  return useMutation({
    mutationFn: async (text: string): Promise<{ language: string; confidence: number }> => {
      const response = await apiRequest("POST", "/api/detect-language", { text });
      return await response.json();
    },
  });
}