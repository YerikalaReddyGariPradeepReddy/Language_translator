import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Volume2, MicOff, RefreshCw } from "lucide-react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useTranslateText } from "@/lib/translation";
import { useTranslation } from "@/contexts/TranslationContext";
import { getLanguageInfo } from "@/lib/languages";
import LanguageSelector from "@/components/LanguageSelector";

export default function VoiceTranslatePage() {
  const [isListening, setIsListening] = useState(false);
  const [translatedAudio, setTranslatedAudio] = useState("");
  const { 
    sourceLanguage, 
    targetLanguage, 
    setSourceText, 
    setTranslatedText,
    sourceText,
    translatedText 
  } = useTranslation();

  const { 
    transcript, 
    isListening: voiceIsListening, 
    startListening, 
    stopListening, 
    resetTranscript,
    hasRecognitionSupport 
  } = useVoiceRecognition({
    language: sourceLanguage,
    continuous: true,
    interimResults: true,
  });

  const { speak, isSpeaking } = useTextToSpeech();
  const translateMutation = useTranslateText();

  const sourceInfo = getLanguageInfo(sourceLanguage);
  const targetInfo = getLanguageInfo(targetLanguage);

  // Update source text when transcript changes
  useEffect(() => {
    if (transcript) {
      setSourceText(transcript);
    }
  }, [transcript, setSourceText]);

  // Auto-translate when voice input stops
  useEffect(() => {
    if (!voiceIsListening && transcript.trim()) {
      handleTranslate();
    }
  }, [voiceIsListening, transcript]);

  const handleStartListening = () => {
    resetTranscript();
    setIsListening(true);
    startListening();
  };

  const handleStopListening = () => {
    setIsListening(false);
    stopListening();
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    try {
      const result = await translateMutation.mutateAsync({
        text: sourceText,
        from: sourceLanguage,
        to: targetLanguage,
      });
      setTranslatedText(result.translatedText);
      setTranslatedAudio(result.translatedText);
    } catch (error) {
      console.error("Translation failed:", error);
    }
  };

  const handlePlayTranslation = () => {
    if (translatedText) {
      speak(translatedText, targetLanguage);
    }
  };

  const handleClear = () => {
    resetTranscript();
    setSourceText("");
    setTranslatedText("");
    setTranslatedAudio("");
  };

  if (!hasRecognitionSupport) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center p-8">
          <CardContent>
            <div className="mb-4">
              <MicOff className="w-16 h-16 mx-auto text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Voice Recognition Not Supported</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your browser doesn't support voice recognition. Please try using Chrome, Edge, or Safari.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Voice Translation</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Speak naturally and get instant translations with voice output
        </p>
      </div>

      {/* Language Selector */}
      <LanguageSelector />

      {/* Voice Input Section */}
      <Card className="p-6">
        <div className="text-center space-y-6">
          {/* Voice Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={isListening ? handleStopListening : handleStartListening}
              disabled={translateMutation.isPending}
              className={`w-32 h-32 rounded-full ${
                isListening 
                  ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white shadow-lg transition-all duration-300 transform hover:scale-105`}
            >
              {isListening ? (
                <div className="flex flex-col items-center">
                  <Mic className="w-8 h-8 mb-1" />
                  <span className="text-sm">Listening...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Mic className="w-8 h-8 mb-1" />
                  <span className="text-sm">Tap to speak</span>
                </div>
              )}
            </Button>
          </div>

          {/* Status */}
          <div className="text-center">
            {isListening && (
              <div className="flex items-center justify-center space-x-2 text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Recording... Speak clearly in {sourceInfo.name}</span>
              </div>
            )}

            {translateMutation.isPending && (
              <div className="flex items-center justify-center space-x-2 text-blue-500">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Translating...</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleClear}
              disabled={!sourceText && !translatedText}
            >
              Clear All
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTranslate}
              disabled={!sourceText.trim() || translateMutation.isPending}
            >
              Translate Again
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Section */}
      {(sourceText || translatedText) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Text */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{sourceInfo.flag}</span>
                <h3 className="font-semibold">{sourceInfo.name}</h3>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-24">
              <p className="text-lg">{sourceText || "Your speech will appear here..."}</p>
            </div>
          </Card>

          {/* Translated Text */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{targetInfo.flag}</span>
                <h3 className="font-semibold">{targetInfo.name}</h3>
              </div>
              {translatedText && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePlayTranslation}
                  disabled={isSpeaking}
                  className="flex items-center space-x-2"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isSpeaking ? "Playing..." : "Play"}</span>
                </Button>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-24">
              <p className="text-lg">{translatedText || "Translation will appear here..."}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Usage Tips */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">Voice Translation Tips</h3>
        <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <li>• Speak clearly and at a normal pace</li>
          <li>• Pause briefly between sentences for better accuracy</li>
          <li>• Use the play button to hear translations aloud</li>
          <li>• Works best in quiet environments</li>
          <li>• Supports all major languages with voice recognition</li>
        </ul>
      </Card>
    </div>
  );
}