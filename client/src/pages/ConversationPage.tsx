import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, Send, Volume2, MessageCircle, Users, MicOff } from "lucide-react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useTranslateText } from "@/lib/translation";
import { useTranslation } from "@/contexts/TranslationContext";
import { getLanguageInfo } from "@/lib/languages";
import LanguageSelector from "@/components/LanguageSelector";

interface ConversationMessage {
  id: string;
  speaker: "A" | "B";
  originalText: string;
  translatedText: string;
  timestamp: Date;
  sourceLanguage: string;
  targetLanguage: string;
}

export default function ConversationPage() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [currentSpeaker, setCurrentSpeaker] = useState<"A" | "B">("A");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { sourceLanguage, targetLanguage } = useTranslation();
  const { speak, isSpeaking } = useTextToSpeech();
  const translateMutation = useTranslateText();
  
  const { 
    transcript, 
    isListening: voiceIsListening, 
    startListening, 
    stopListening, 
    resetTranscript,
    hasRecognitionSupport 
  } = useVoiceRecognition({
    language: currentSpeaker === "A" ? sourceLanguage : targetLanguage,
    continuous: false,
    interimResults: true,
  });

  const speakerAInfo = getLanguageInfo(sourceLanguage);
  const speakerBInfo = getLanguageInfo(targetLanguage);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle voice input completion
  useEffect(() => {
    if (!voiceIsListening && transcript.trim()) {
      setInputText(transcript);
      handleSendMessage(transcript);
    }
  }, [voiceIsListening, transcript]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    const isFromA = currentSpeaker === "A";
    const fromLang = isFromA ? sourceLanguage : targetLanguage;
    const toLang = isFromA ? targetLanguage : sourceLanguage;

    try {
      // Translate the message
      const result = await translateMutation.mutateAsync({
        text: messageText,
        from: fromLang,
        to: toLang,
      });

      // Create new message
      const newMessage: ConversationMessage = {
        id: Date.now().toString(),
        speaker: currentSpeaker,
        originalText: messageText,
        translatedText: result.translatedText,
        timestamp: new Date(),
        sourceLanguage: fromLang,
        targetLanguage: toLang,
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText("");
      resetTranscript();

      // Auto-play translation if enabled
      setTimeout(() => {
        speak(result.translatedText, toLang);
      }, 500);

    } catch (error) {
      console.error("Translation failed:", error);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      resetTranscript();
      setIsListening(true);
      startListening();
    }
  };

  const handlePlayMessage = (text: string, language: string) => {
    speak(text, language);
  };

  const handleSwitchSpeaker = () => {
    setCurrentSpeaker(prev => prev === "A" ? "B" : "A");
    setInputText("");
    resetTranscript();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!hasRecognitionSupport) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center p-8">
          <div className="mb-4">
            <MicOff className="w-16 h-16 mx-auto text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Voice Recognition Not Supported</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your browser doesn't support voice recognition. You can still use text input for conversations.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Conversation Mode</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time translation for two-way conversations
        </p>
      </div>

      {/* Language Selector */}
      <LanguageSelector />

      {/* Speaker Selection */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Current Speaker:</span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={currentSpeaker === "A" ? "default" : "outline"}
              onClick={() => setCurrentSpeaker("A")}
              className="flex items-center space-x-2"
            >
              <span className="text-lg">{speakerAInfo.flag}</span>
              <span>Speaker A ({speakerAInfo.name})</span>
            </Button>
            <Button
              variant={currentSpeaker === "B" ? "default" : "outline"}
              onClick={() => setCurrentSpeaker("B")}
              className="flex items-center space-x-2"
            >
              <span className="text-lg">{speakerBInfo.flag}</span>
              <span>Speaker B ({speakerBInfo.name})</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Conversation Messages */}
      <Card className="h-96 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Conversation</h3>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
              {messages.length} messages
            </span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Start a conversation by speaking or typing a message</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.speaker === "B" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.speaker === "A"
                      ? "bg-blue-500 text-white rounded-bl-none"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-br-none"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs opacity-75">
                      {message.speaker === "A" ? speakerAInfo.name : speakerBInfo.name}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePlayMessage(message.originalText, message.sourceLanguage)}
                      className="h-6 w-6 p-0 hover:bg-black/10"
                    >
                      <Volume2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm mb-2">{message.originalText}</p>
                  <div className="border-t border-white/20 pt-2">
                    <p className="text-xs opacity-75 italic">{message.translatedText}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePlayMessage(message.translatedText, message.targetLanguage)}
                      className="h-5 w-5 p-0 mt-1 hover:bg-black/10"
                    >
                      <Volume2 className="w-2.5 h-2.5" />
                    </Button>
                  </div>
                  <p className="text-xs opacity-50 mt-1">{formatTime(message.timestamp)}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      {/* Input Section */}
      <Card className="p-4">
        <div className="flex space-x-3">
          <Button
            size="icon"
            onClick={handleVoiceInput}
            disabled={translateMutation.isPending}
            className={`${
              isListening 
                ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            <Mic className="w-5 h-5" />
          </Button>
          
          <Input
            type="text"
            placeholder={`Type message in ${currentSpeaker === "A" ? speakerAInfo.name : speakerBInfo.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
            disabled={translateMutation.isPending}
          />
          
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || translateMutation.isPending}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        {isListening && (
          <div className="mt-3 flex items-center justify-center space-x-2 text-red-500">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              Listening for {currentSpeaker === "A" ? speakerAInfo.name : speakerBInfo.name}...
            </span>
          </div>
        )}
        
        {translateMutation.isPending && (
          <div className="mt-3 flex items-center justify-center space-x-2 text-blue-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm font-medium">Translating...</span>
          </div>
        )}
      </Card>

      {/* Usage Tips */}
      <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <h3 className="font-semibold mb-3 text-green-800 dark:text-green-200">Conversation Mode Tips</h3>
        <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
          <li>• Select the current speaker before speaking or typing</li>
          <li>• Translations are played automatically for the other speaker</li>
          <li>• Tap the speaker icons to replay any message</li>
          <li>• Use voice input for natural conversations</li>
          <li>• Works great for face-to-face multilingual communication</li>
        </ul>
      </Card>
    </div>
  );
}
