import { createContext, useContext, useState, ReactNode } from "react";

interface TranslationState {
  sourceLanguage: string;
  targetLanguage: string;
  sourceText: string;
  translatedText: string;
  isTranslating: boolean;
  confidence: number;
  autoTranslate: boolean;
  conversationMode: boolean;
}

interface TranslationContextType extends TranslationState {
  setSourceLanguage: (lang: string) => void;
  setTargetLanguage: (lang: string) => void;
  setSourceText: (text: string) => void;
  setTranslatedText: (text: string) => void;
  setIsTranslating: (loading: boolean) => void;
  setConfidence: (confidence: number) => void;
  setAutoTranslate: (auto: boolean) => void;
  setConversationMode: (mode: boolean) => void;
  swapLanguages: () => void;
  clearText: () => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TranslationState>({
    sourceLanguage: "en",
    targetLanguage: "hi",
    sourceText: "",
    translatedText: "",
    isTranslating: false,
    confidence: 0,
    autoTranslate: true,
    conversationMode: false,
  });

  const setSourceLanguage = (lang: string) => {
    setState(prev => ({ ...prev, sourceLanguage: lang }));
  };

  const setTargetLanguage = (lang: string) => {
    setState(prev => ({ ...prev, targetLanguage: lang }));
  };

  const setSourceText = (text: string) => {
    setState(prev => ({ ...prev, sourceText: text }));
  };

  const setTranslatedText = (text: string) => {
    setState(prev => ({ ...prev, translatedText: text }));
  };

  const setIsTranslating = (loading: boolean) => {
    setState(prev => ({ ...prev, isTranslating: loading }));
  };

  const setConfidence = (confidence: number) => {
    setState(prev => ({ ...prev, confidence }));
  };

  const setAutoTranslate = (auto: boolean) => {
    setState(prev => ({ ...prev, autoTranslate: auto }));
  };

  const setConversationMode = (mode: boolean) => {
    setState(prev => ({ ...prev, conversationMode: mode }));
  };

  const swapLanguages = () => {
    setState(prev => ({
      ...prev,
      sourceLanguage: prev.targetLanguage,
      targetLanguage: prev.sourceLanguage,
      sourceText: prev.translatedText,
      translatedText: prev.sourceText,
    }));
  };

  const clearText = () => {
    setState(prev => ({
      ...prev,
      sourceText: "",
      translatedText: "",
      confidence: 0,
    }));
  };

  return (
    <TranslationContext.Provider
      value={{
        ...state,
        setSourceLanguage,
        setTargetLanguage,
        setSourceText,
        setTranslatedText,
        setIsTranslating,
        setConfidence,
        setAutoTranslate,
        setConversationMode,
        swapLanguages,
        clearText,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
