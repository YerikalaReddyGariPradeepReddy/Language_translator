import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Clock, Volume2, BookmarkPlus, BookmarkMinus } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { getLanguageInfo } from "@/lib/languages";
import { apiRequest } from "@/lib/queryClient";
import type { Translation } from "@shared/schema";

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { speak } = useTextToSpeech();
  const queryClient = useQueryClient();

  const { data: translations = [], isLoading } = useQuery<Translation[]>({
    queryKey: ["/api/translations/history", currentPage],
    queryFn: async () => {
      const response = await apiRequest(`/api/translations/history?page=${currentPage}&limit=20`);
      return response.json();
    },
  });

  const deleteTranslationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/translations/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translations/history"] });
    },
  });

  const saveTranslationMutation = useMutation({
    mutationFn: async (translation: Translation) => {
      await apiRequest("/api/translations/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceLanguage: translation.sourceLanguage,
          targetLanguage: translation.targetLanguage,
          phrase: translation.sourceText,
          translation: translation.translatedText,
          category: "general",
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translations/saved"] });
    },
  });

  const filteredTranslations = translations.filter(
    (translation) =>
      translation.sourceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translation.translatedText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayText = (text: string, language: string) => {
    speak(text, language);
  };

  const handleDeleteTranslation = (id: number) => {
    deleteTranslationMutation.mutate(id);
  };

  const handleSaveTranslation = (translation: Translation) => {
    saveTranslationMutation.mutate(translation);
  };

  const formatTime = (dateString: string | Date | null) => {
    if (!dateString) return "Unknown time";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Translation History</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and manage your previous translations
        </p>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search translations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{translations.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Translations</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <BookmarkPlus className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{translations.filter(t => t.isSaved).length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Saved Phrases</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Volume2 className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">
                {Math.round(translations.reduce((acc, t) => acc + (t.confidence || 0), 0) / Math.max(translations.length, 1))}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Confidence</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Translation List */}
      <div className="space-y-4">
        {filteredTranslations.length === 0 ? (
          <Card className="text-center p-8">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Translation History</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? "No translations match your search." : "Start translating to see your history here."}
            </p>
          </Card>
        ) : (
          filteredTranslations.map((translation) => {
            const sourceInfo = getLanguageInfo(translation.sourceLanguage);
            const targetInfo = getLanguageInfo(translation.targetLanguage);

            return (
              <Card key={translation.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{sourceInfo.flag}</span>
                      <span className="text-sm font-medium">{sourceInfo.name}</span>
                    </div>
                    <span className="text-gray-400">→</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{targetInfo.flag}</span>
                      <span className="text-sm font-medium">{targetInfo.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {translation.confidence && (
                      <Badge variant="secondary" className="text-xs">
                        {translation.confidence}% confidence
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatTime(translation.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">Original</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePlayText(translation.sourceText, translation.sourceLanguage)}
                        className="h-6 w-6 p-0"
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100">{translation.sourceText}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">Translation</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePlayText(translation.translatedText, translation.targetLanguage)}
                        className="h-6 w-6 p-0"
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100">{translation.translatedText}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSaveTranslation(translation)}
                      disabled={saveTranslationMutation.isPending || translation.isSaved}
                      className="flex items-center space-x-2"
                    >
                      {translation.isSaved ? <BookmarkMinus className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                      <span>{translation.isSaved ? "Saved" : "Save"}</span>
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteTranslation(translation.id)}
                    disabled={deleteTranslationMutation.isPending}
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {translations.length >= 20 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={translations.length < 20}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
