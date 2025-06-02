import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, X, Volume2 } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { getLanguageInfo } from "@/lib/languages";

interface ConversationMessage {
  id: string;
  speaker: "A" | "B";
  originalText: string;
  translatedText: string;
  timestamp: Date;
  language: string;
}

interface ConversationModeProps {
  isOpen: boolean;
  onClose: () => void;
  languageA: string;
  languageB: string;
}

export default function ConversationMode({
  isOpen,
  onClose,
  languageA,
  languageB,
}: ConversationModeProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: "1",
      speaker: "A",
      originalText: "Hello, how are you today?",
      translatedText: "नमस्ते, आज आप कैसे हैं?",
      timestamp: new Date(Date.now() - 60000),
      language: languageA,
    },
    {
      id: "2",
      speaker: "B",
      originalText: "मैं ठीक हूँ, धन्यवाद!",
      translatedText: "I'm fine, thank you!",
      timestamp: new Date(),
      language: languageB,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const { speak } = useTextToSpeech();

  const languageAInfo = getLanguageInfo(languageA);
  const languageBInfo = getLanguageInfo(languageB);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // TODO: Implement actual translation
    const newMessage: ConversationMessage = {
      id: Date.now().toString(),
      speaker: "A", // Toggle between A and B based on context
      originalText: inputText,
      translatedText: "Translation would appear here",
      timestamp: new Date(),
      language: languageA,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  const handlePlayAudio = (text: string, language: string) => {
    speak(text, language);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/20 border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Conversation Header */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 border-b border-slate-200 dark:border-slate-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className="font-heading font-semibold">Conversation Mode</h3>
              <span className="px-2 py-1 bg-white dark:bg-slate-700 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400">
                {languageAInfo.name} ↔ {languageBInfo.name}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="p-2 rounded-lg bg-white/50 dark:bg-slate-600/50 hover:bg-white dark:hover:bg-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Conversation Messages */}
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.speaker === "B" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.speaker === "A"
                  ? "bg-blue-100 dark:bg-blue-900/50"
                  : "bg-green-100 dark:bg-green-900/50"
              }`}>
                <span className={`text-sm font-medium ${
                  message.speaker === "A"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-green-600 dark:text-green-400"
                }`}>
                  {message.speaker}
                </span>
              </div>
              <div className="flex-1">
                <div className={`rounded-2xl p-4 ${
                  message.speaker === "A"
                    ? "bg-blue-50 dark:bg-blue-900/30 rounded-tl-lg"
                    : "bg-green-50 dark:bg-green-900/30 rounded-tr-lg"
                } ${message.speaker === "B" ? "text-right" : ""}`}>
                  <p className="text-slate-900 dark:text-slate-100 mb-2">
                    {message.originalText}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                    {message.translatedText}
                  </p>
                </div>
                <div className={`flex items-center space-x-2 mt-2 ${
                  message.speaker === "B" ? "justify-end flex-row-reverse space-x-reverse" : ""
                }`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePlayAudio(message.originalText, message.language)}
                    className={`p-1 rounded text-slate-500 transition-colors ${
                      message.speaker === "A"
                        ? "hover:text-blue-500"
                        : "hover:text-green-500"
                    }`}
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>
                  <span className="text-xs text-slate-500">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Conversation Input */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex space-x-3">
            <Button
              variant="default"
              size="icon"
              className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              <Mic className="w-5 h-5" />
            </Button>
            <Input
              type="text"
              placeholder="Type message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
