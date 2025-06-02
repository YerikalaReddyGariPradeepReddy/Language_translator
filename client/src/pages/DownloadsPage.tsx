import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  Trash2, 
  Search, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  Clock,
  HardDrive 
} from "lucide-react";
import { getLanguageInfo, languages } from "@/lib/languages";
import { apiRequest } from "@/lib/queryClient";
import type { DownloadedLanguage } from "@shared/schema";

export default function DownloadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloadingLanguages, setDownloadingLanguages] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const { data: downloadedLanguages = [], isLoading } = useQuery<DownloadedLanguage[]>({
    queryKey: ["/api/languages/downloaded"],
  });

  const downloadLanguageMutation = useMutation({
    mutationFn: async ({ languageCode, languageName }: { languageCode: string; languageName: string }) => {
      setDownloadingLanguages(prev => new Set(prev).add(languageCode));
      // Simulate download progress
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await apiRequest("POST", "/api/languages/download", {
        languageCode,
        languageName,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/languages/downloaded"] });
    },
    onSettled: (_, __, variables) => {
      setDownloadingLanguages(prev => {
        const newSet = new Set(prev);
        newSet.delete(variables.languageCode);
        return newSet;
      });
    },
  });

  const removeLanguageMutation = useMutation({
    mutationFn: async (languageCode: string) => {
      await apiRequest("DELETE", `/api/languages/downloaded/${languageCode}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/languages/downloaded"] });
    },
  });

  const downloadedCodes = new Set(downloadedLanguages.map(lang => lang.languageCode));
  
  const availableLanguages = languages.filter(lang => 
    !downloadedCodes.has(lang.code) &&
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDownloaded = downloadedLanguages.filter(lang =>
    lang.languageName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadLanguage = (languageCode: string, languageName: string) => {
    downloadLanguageMutation.mutate({ languageCode, languageName });
  };

  const handleRemoveLanguage = (languageCode: string) => {
    removeLanguageMutation.mutate(languageCode);
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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
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
        <h1 className="text-3xl font-bold mb-2">Offline Languages</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Download language packs for offline translation
        </p>
      </div>

      {/* Connection Status */}
      <Card className={`p-4 ${isOnline ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:bg-red-900/20'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            <div>
              <h3 className={`font-medium ${isOnline ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                {isOnline ? 'Online' : 'Offline Mode'}
              </h3>
              <p className={`text-sm ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isOnline 
                  ? 'You can download new language packs and sync translations'
                  : 'Using offline language packs for translation'
                }
              </p>
            </div>
          </div>
          <Badge variant={isOnline ? "default" : "secondary"}>
            {isOnline ? "Connected" : "Offline"}
          </Badge>
        </div>
      </Card>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search languages..."
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
            <HardDrive className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{downloadedLanguages.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Downloaded</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Download className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{languages.length - downloadedLanguages.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">
                {Math.round((downloadedLanguages.length / languages.length) * 100)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Coverage</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Downloaded Languages */}
      {filteredDownloaded.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Downloaded Languages ({filteredDownloaded.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDownloaded.map((lang) => {
              const info = getLanguageInfo(lang.languageCode);
              return (
                <Card key={lang.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{info.flag}</span>
                      <div>
                        <h3 className="font-medium">{lang.languageName}</h3>
                        <p className="text-sm text-gray-500">
                          Downloaded {formatTime(lang.downloadedAt)}
                        </p>
                        {lang.version && (
                          <Badge variant="outline" className="text-xs mt-1">
                            v{lang.version}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveLanguage(lang.languageCode)}
                      disabled={removeLanguageMutation.isPending}
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
      )}

      {/* Available Languages */}
      {availableLanguages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <Download className="w-5 h-5 text-blue-500" />
            <span>Available for Download ({availableLanguages.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableLanguages.map((lang) => {
              const isDownloading = downloadingLanguages.has(lang.code);
              return (
                <Card key={lang.code} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{lang.flag}</span>
                      <div>
                        <h3 className="font-medium">{lang.name}</h3>
                        <p className="text-xs text-gray-500">{lang.code.toUpperCase()}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleDownloadLanguage(lang.code, lang.name)}
                      disabled={!isOnline || isDownloading || downloadLanguageMutation.isPending}
                      className="flex items-center space-x-2"
                    >
                      {isDownloading ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </>
                      )}
                    </Button>
                  </div>
                  {isDownloading && (
                    <div className="space-y-2">
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-gray-500">Downloading language pack...</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty States */}
      {searchQuery && availableLanguages.length === 0 && filteredDownloaded.length === 0 && (
        <Card className="text-center p-8">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Languages Found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            No languages match your search criteria.
          </p>
        </Card>
      )}

      {!searchQuery && downloadedLanguages.length === 0 && (
        <Card className="text-center p-8">
          <Download className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Downloaded Languages</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Download language packs to use translation features offline.
          </p>
        </Card>
      )}

      {/* Offline Tips */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">Offline Mode Benefits</h3>
        <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <li>• Translate without internet connection</li>
          <li>• Faster translation processing</li>
          <li>• Privacy-focused - no data sent to servers</li>
          <li>• Works in areas with poor connectivity</li>
          <li>• Download once, use anywhere</li>
        </ul>
      </Card>
    </div>
  );
}
