import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MessageCircle } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import TranslationCard from "@/components/TranslationCard";
import ConversationMode from "@/components/ConversationMode";
import { useTranslation } from "@/contexts/TranslationContext";
import { useTranslateText } from "@/lib/translation";

export default function TranslatePage() {
  const {
    sourceLanguage,
    targetLanguage,
    sourceText,
    translatedText,
    setSourceText,
    setTranslatedText,
    setIsTranslating,
    setConfidence,
    autoTranslate,
    setAutoTranslate,
    conversationMode,
    setConversationMode,
    confidence,
  } = useTranslation();

  const translateMutation = useTranslateText();

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    try {
      const result = await translateMutation.mutateAsync({
        text: sourceText,
        from: sourceLanguage,
        to: targetLanguage,
      });
      setTranslatedText(result.translatedText);
      setConfidence(result.confidence || 95);
    } catch (error) {
      console.error("Translation failed:", error);
      setTranslatedText("Translation failed. Please try again.");
      setConfidence(0);
    } finally {
      setIsTranslating(false);
    }
  };

  // Auto-translate when source text changes
  useEffect(() => {
    if (autoTranslate && sourceText.trim()) {
      const timeoutId = setTimeout(() => {
        handleTranslate();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [sourceText, autoTranslate, sourceLanguage, targetLanguage]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Language Selector */}
      <LanguageSelector />

      {/* Translation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <TranslationCard
          type="input"
          language={sourceLanguage}
          text={sourceText}
          onTextChange={setSourceText}
        />

        {/* Output Card */}
        <TranslationCard
          type="output"
          language={targetLanguage}
          text={translatedText}
          confidence={confidence}
        />
      </div>

      {/* Action Bar */}
      <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm dark:shadow-slate-900/20 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          {/* Left Actions */}
          <div className="flex items-center space-x-3">
            {/* Auto-translate Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <Switch
                checked={autoTranslate}
                onCheckedChange={setAutoTranslate}
              />
              <span className="text-sm font-medium">Auto-translate</span>
            </label>

            {/* Conversation Mode */}
            <Button
              variant="outline"
              onClick={() => setConversationMode(!conversationMode)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border-none"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Conversation</span>
            </Button>
          </div>

          {/* Translate Button */}
          <Button
            onClick={handleTranslate}
            disabled={!sourceText.trim() || translateMutation.isPending}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25"
          >
            {translateMutation.isPending ? "Translating..." : "Translate"}
          </Button>
        </div>
      </div>

      {/* Conversation Mode */}
      <ConversationMode
        isOpen={conversationMode}
        onClose={() => setConversationMode(false)}
        languageA={sourceLanguage}
        languageB={targetLanguage}
      />

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "History",
            description: "View past translations",
            count: "247",
            color: "purple",
            icon: "📝",
          },
          {
            title: "Saved",
            description: "Bookmarked translations",
            count: "18",
            color: "yellow",
            icon: "🔖",
          },
          {
            title: "Offline",
            description: "Downloaded languages",
            count: "6",
            color: "green",
            icon: "📱",
          },
          {
            title: "Settings",
            description: "App preferences",
            count: "Dark mode",
            color: "slate",
            icon: "⚙️",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm dark:shadow-slate-900/20 border border-slate-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-900/30 transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-2xl">{item.icon}</div>
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            </div>
            <div className={`text-2xl font-bold text-${item.color}-600 dark:text-${item.color}-400`}>
              {item.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
