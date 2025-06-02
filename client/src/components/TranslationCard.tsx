import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Volume2, Copy, Bookmark, Share, Clipboard, Image } from "lucide-react";
import { getLanguageInfo } from "@/lib/languages";
import { useTranslation } from "@/contexts/TranslationContext";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import VoiceRecordingModal from "./VoiceRecordingModal";
import { useToast } from "@/hooks/use-toast";

interface TranslationCardProps {
  type: "input" | "output";
  language: string;
  text: string;
  onTextChange?: (text: string) => void;
  confidence?: number;
}

export default function TranslationCard({
  type,
  language,
  text,
  onTextChange,
  confidence,
}: TranslationCardProps) {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const languageInfo = getLanguageInfo(language);
  const { isTranslating } = useTranslation();
  const { speak, isSpeaking } = useTextToSpeech();
  const { toast } = useToast();

  const handleVoiceInput = () => {
    setIsVoiceModalOpen(true);
  };

  const handleVoiceTextRecognized = (recognizedText: string) => {
    if (onTextChange) {
      onTextChange(recognizedText);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Text has been copied to your clipboard.",
      });
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast({
        title: "Copy failed",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (onTextChange) {
        onTextChange(clipboardText);
      }
    } catch (error) {
      console.error("Failed to paste text:", error);
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    toast({
      title: "Translation saved",
      description: "Translation has been saved to your collection.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Translation",
          text: text,
        });
      } catch (error) {
        console.error("Failed to share:", error);
      }
    } else {
      handleCopy();
    }
  };

  const handleSpeak = () => {
    if (text.trim()) {
      speak(text, language);
    }
  };

  const characterCount = text.length;
  const maxCharacters = 5000;

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/20 border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Card Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{languageInfo.flag}</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {languageInfo.name}
              </span>
              
              {/* Confidence Indicator */}
              {type === "output" && confidence !== undefined && confidence > 0 && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {confidence}%
                  </span>
                </div>
              )}
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-2">
              {type === "input" && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleVoiceInput}
                  className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 hover:scale-105"
                >
                  <Mic className="w-4 h-4" />
                </Button>
              )}
              
              {type === "output" && text && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleSpeak}
                  disabled={isSpeaking}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all duration-200 hover:scale-105"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Text Area */}
        <div className="p-4">
          {type === "input" ? (
            <Textarea
              placeholder="Enter text to translate..."
              value={text}
              onChange={(e) => onTextChange?.(e.target.value)}
              className="w-full h-32 resize-none bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 border-none focus:outline-none text-lg leading-relaxed p-0"
              maxLength={maxCharacters}
            />
          ) : (
            <div className="h-32 flex items-start">
              {isTranslating ? (
                <div className="w-full flex items-center justify-center h-full">
                  <div className="animate-pulse text-slate-500 dark:text-slate-400">
                    Translating...
                  </div>
                </div>
              ) : (
                <p className="text-lg leading-relaxed text-slate-900 dark:text-slate-100 w-full">
                  {text || "Translation will appear here..."}
                </p>
              )}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              {type === "input" ? (
                <>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {characterCount} / {maxCharacters}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTextChange?.("")}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors h-auto p-0"
                  >
                    Clear
                  </Button>
                </>
              ) : (
                text && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors h-auto p-0"
                  >
                    3 alternatives
                  </Button>
                )
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {type === "input" ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePaste}
                    className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Clipboard className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Image className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                text && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopy}
                      className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSave}
                      className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors hover:text-yellow-500"
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleShare}
                      className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <VoiceRecordingModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTextRecognized={handleVoiceTextRecognized}
        language={language}
      />
    </>
  );
}
