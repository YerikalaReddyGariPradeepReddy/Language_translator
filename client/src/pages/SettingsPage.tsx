import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Settings, 
  Volume2, 
  Mic, 
  Globe, 
  Moon, 
  Sun, 
  Smartphone,
  Bell,
  Shield,
  Database,
  RefreshCw,
  Download,
  Check,
  Search
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { getLanguageInfo, languages } from "@/lib/languages";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { DownloadedLanguage } from "@shared/schema";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { autoTranslate, setAutoTranslate } = useTranslation();

  // Local settings state
  const [settings, setSettings] = useState({
    speechRate: [1.0],
    speechVolume: [0.8],
    voiceGender: "female",
    autoPlay: true,
    notifications: true,
    offlineMode: false,
    autoOfflineMode: false,
    offlineFirstMode: false,
    autoSave: true,
    maxHistory: 100,
    language: "en",
    region: "US"
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem('vertoSettings', JSON.stringify(settings));
    console.log('Settings saved:', settings);
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      speechRate: [1.0],
      speechVolume: [0.8],
      voiceGender: "female",
      autoPlay: true,
      notifications: true,
      offlineMode: false,
      autoOfflineMode: false,
      offlineFirstMode: false,
      autoSave: true,
      maxHistory: 100,
      language: "en",
      region: "US"
    };
    setSettings(defaultSettings);
    localStorage.removeItem('vertoSettings');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your translation experience
        </p>
      </div>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sun className="w-5 h-5" />
            <span>Appearance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Theme</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose your preferred color scheme
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="flex items-center space-x-2"
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="flex items-center space-x-2"
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Translation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Auto-translate</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically translate text as you type
              </p>
            </div>
            <Switch
              checked={autoTranslate}
              onCheckedChange={setAutoTranslate}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-base">Default Interface Language</Label>
            <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5" />
            <span>Voice & Audio</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Auto-play translations</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically play audio for translated text
              </p>
            </div>
            <Switch
              checked={settings.autoPlay}
              onCheckedChange={(checked) => handleSettingChange('autoPlay', checked)}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-base">Speech Rate: {settings.speechRate[0]}x</Label>
            <Slider
              value={settings.speechRate}
              onValueChange={(value) => handleSettingChange('speechRate', value)}
              max={2}
              min={0.5}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Slow (0.5x)</span>
              <span>Normal (1.0x)</span>
              <span>Fast (2.0x)</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base">Volume: {Math.round(settings.speechVolume[0] * 100)}%</Label>
            <Slider
              value={settings.speechVolume}
              onValueChange={(value) => handleSettingChange('speechVolume', value)}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base">Voice Gender</Label>
            <Select value={settings.voiceGender} onValueChange={(value) => handleSettingChange('voiceGender', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="auto">Auto (System Default)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Offline Mode Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Offline Mode</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Enable offline mode</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use downloaded language packs when available
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.offlineMode}
                onCheckedChange={(checked) => handleSettingChange('offlineMode', checked)}
              />
              <Badge variant="secondary" className="text-xs">
                Beta
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Auto-detect offline mode</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically switch to offline when connection is lost
                </p>
              </div>
              <Switch
                checked={settings.autoOfflineMode || false}
                onCheckedChange={(checked) => handleSettingChange('autoOfflineMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Offline-first mode</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Prefer offline translation even when online
                </p>
              </div>
              <Switch
                checked={settings.offlineFirstMode || false}
                onCheckedChange={(checked) => handleSettingChange('offlineFirstMode', checked)}
              />
            </div>
          </div>

          <Separator />

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Offline Benefits</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Works without internet connection</li>
              <li>• Faster translation processing</li>
              <li>• Enhanced privacy protection</li>
              <li>• Reduced data usage</li>
            </ul>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Download Languages</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select languages to download for offline use
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/downloads'}
                className="flex items-center space-x-2"
              >
                <Database className="w-4 h-4" />
                <span>Manage Downloads</span>
              </Button>
            </div>

            <OfflineLanguageSelector />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacy & Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Auto-save translations</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically save translations to history
              </p>
            </div>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-base">Maximum history entries: {settings.maxHistory}</Label>
            <Slider
              value={[settings.maxHistory]}
              onValueChange={(value) => handleSettingChange('maxHistory', value[0])}
              max={1000}
              min={50}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>50 entries</span>
              <span>500 entries</span>
              <span>1000 entries</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button variant="outline" onClick={handleResetSettings} className="flex-1">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button onClick={handleSaveSettings} className="flex-1">
          <Settings className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* About Section */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">Verto Translate</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Version 1.0.0</p>
            <p className="text-xs text-gray-500">
              Powered by Google Translate API
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OfflineLanguageSelector() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const { data: downloadedLanguages = [], isLoading } = useQuery<DownloadedLanguage[]>({
    queryKey: ["/api/languages/downloaded"],
  });

  const downloadLanguageMutation = useMutation({
    mutationFn: async ({ languageCode, languageName }: { languageCode: string; languageName: string }) => {
      const response = await apiRequest("POST", "/api/languages/download", {
        languageCode,
        languageName,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/languages/downloaded"] });
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

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageToggle = (languageCode: string, languageName: string, isDownloaded: boolean) => {
    if (isDownloaded) {
      removeLanguageMutation.mutate(languageCode);
    } else {
      downloadLanguageMutation.mutate({ languageCode, languageName });
    }
  };

  const handleBulkDownload = () => {
    selectedLanguages.forEach(languageCode => {
      const language = languages.find(lang => lang.code === languageCode);
      if (language && !downloadedCodes.has(languageCode)) {
        downloadLanguageMutation.mutate({ 
          languageCode: language.code, 
          languageName: language.name 
        });
      }
    });
    setSelectedLanguages(new Set());
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Bulk Actions */}
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {selectedLanguages.size > 0 && (
          <Button 
            onClick={handleBulkDownload}
            disabled={downloadLanguageMutation.isPending}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download ({selectedLanguages.size})</span>
          </Button>
        )}
      </div>

      {/* Language List */}
      <div className="border rounded-lg">
        <ScrollArea className="h-64">
          <div className="p-2 space-y-1">
            {filteredLanguages.map((language) => {
              const isDownloaded = downloadedCodes.has(language.code);
              const isSelected = selectedLanguages.has(language.code);
              const isProcessing = downloadLanguageMutation.isPending || removeLanguageMutation.isPending;

              return (
                <div 
                  key={language.code} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {!isDownloaded && (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          const newSelected = new Set(selectedLanguages);
                          if (checked) {
                            newSelected.add(language.code);
                          } else {
                            newSelected.delete(language.code);
                          }
                          setSelectedLanguages(newSelected);
                        }}
                      />
                    )}
                    <span className="text-xl">{language.flag}</span>
                    <div>
                      <p className="font-medium">{language.name}</p>
                      <p className="text-xs text-gray-500 uppercase">{language.code}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isDownloaded && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <Check className="w-3 h-3 mr-1" />
                        Downloaded
                      </Badge>
                    )}

                    <Button
                      size="sm"
                      variant={isDownloaded ? "destructive" : "default"}
                      onClick={() => handleLanguageToggle(language.code, language.name, isDownloaded)}
                      disabled={isProcessing}
                      className="min-w-[80px]"
                    >
                      {isDownloaded ? "Remove" : "Download"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{downloadedLanguages.length} languages downloaded</span>
        <span>{languages.length - downloadedLanguages.length} available to download</span>
      </div>
    </div>
  );
}