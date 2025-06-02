import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Trash2, Volume2, BookmarkMinus, Folder, Tag } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { getLanguageInfo } from "@/lib/languages";
import { apiRequest } from "@/lib/queryClient";
import type { SavedPhrase } from "@shared/schema";

export default function SavedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { speak } = useTextToSpeech();
  const queryClient = useQueryClient();

  const { data: savedPhrases = [], isLoading } = useQuery<SavedPhrase[]>({
    queryKey: ["/api/translations/saved"],
  });

  const deletePhrasemutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/translations/saved/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/translations/saved"] });
    },
  });

  // Get unique categories
  const categories = Array.from(new Set(savedPhrases.map(phrase => phrase.category).filter(Boolean)));
  
  const filteredPhrases = savedPhrases.filter((phrase) => {
    const matchesSearch = 
      phrase.phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phrase.translation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || phrase.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handlePlayText = (text: string, language: string) => {
    speak(text, language);
  };

  const handleDeletePhrase = (id: number) => {
    deletePhrasemutation.mutate(id);
  };

  const formatTime = (dateString: string | Date | null) => {
    if (!dateString) return "Unknown time";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Group phrases by category
  const groupedPhrases = filteredPhrases.reduce((acc, phrase) => {
    const category = phrase.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(phrase);
    return acc;
  }, {} as Record<string, SavedPhrase[]>);

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
        <h1 className="text-3xl font-bold mb-2">Saved Phrases</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Quick access to your frequently used translations
        </p>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search saved phrases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>
        
        <Card className="p-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <BookmarkMinus className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{savedPhrases.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Saved</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Folder className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{categories.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Tag className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{filteredPhrases.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Filtered Results</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Saved Phrases */}
      {Object.keys(groupedPhrases).length === 0 ? (
        <Card className="text-center p-8">
          <BookmarkMinus className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Saved Phrases</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery || selectedCategory !== "all" 
              ? "No phrases match your search criteria." 
              : "Save translations from the history page to access them quickly here."
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPhrases).map(([category, phrases]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center space-x-2">
                <Folder className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold">{category}</h2>
                <Badge variant="secondary">{phrases.length}</Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {phrases.map((phrase) => {
                  const sourceInfo = getLanguageInfo(phrase.sourceLanguage);
                  const targetInfo = getLanguageInfo(phrase.targetLanguage);

                  return (
                    <Card key={phrase.id} className="p-6">
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
                          <span className="text-xs text-gray-500">
                            Saved {formatTime(phrase.createdAt)}
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
                              onClick={() => handlePlayText(phrase.phrase, phrase.sourceLanguage)}
                              className="h-6 w-6 p-0"
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-gray-900 dark:text-gray-100">{phrase.phrase}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-700 dark:text-gray-300">Translation</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handlePlayText(phrase.translation, phrase.targetLanguage)}
                              className="h-6 w-6 p-0"
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-gray-900 dark:text-gray-100">{phrase.translation}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          {phrase.category && (
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <Tag className="w-3 h-3" />
                              <span>{phrase.category}</span>
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePhrase(phrase.id)}
                          disabled={deletePhrasemutation.isPending}
                          className="flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <h3 className="font-semibold mb-3 text-green-800 dark:text-green-200">Quick Access Tips</h3>
        <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
          <li>• Save frequently used phrases from your translation history</li>
          <li>• Organize phrases by categories for easy access</li>
          <li>• Use the search function to quickly find specific phrases</li>
          <li>• Play audio to practice pronunciation</li>
          <li>• Perfect for travelers and language learners</li>
        </ul>
      </Card>
    </div>
  );
}
