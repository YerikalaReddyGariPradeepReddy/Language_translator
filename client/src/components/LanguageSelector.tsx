import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { languages, getLanguageInfo } from "@/lib/languages";
import { useTranslation } from "@/contexts/TranslationContext";

export default function LanguageSelector() {
  const {
    sourceLanguage,
    targetLanguage,
    setSourceLanguage,
    setTargetLanguage,
    swapLanguages,
  } = useTranslation();

  const [sourceOpen, setSourceOpen] = useState(false);
  const [targetOpen, setTargetOpen] = useState(false);

  const sourceInfo = getLanguageInfo(sourceLanguage);
  const targetInfo = getLanguageInfo(targetLanguage);

  const detectLanguage = () => {
    // TODO: Implement language detection
    console.log("Detecting language...");
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-6 shadow-sm dark:shadow-slate-900/20 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        {/* Source Language */}
        <div className="flex items-center space-x-3">
          <Popover open={sourceOpen} onOpenChange={setSourceOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={sourceOpen}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border-none"
              >
                <span className="text-2xl">{sourceInfo.flag}</span>
                <span className="font-medium">{sourceInfo.name}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <Command>
                <CommandInput placeholder="Search languages..." />
                <CommandEmpty>No language found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    {languages.map((language) => (
                      <CommandItem
                        key={language.code}
                        value={language.code}
                        onSelect={(currentValue) => {
                          setSourceLanguage(currentValue);
                          setSourceOpen(false);
                        }}
                      >
                        <span className="mr-2 text-lg">{language.flag}</span>
                        <span>{language.name}</span>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            sourceLanguage === language.code ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Button
            variant="secondary"
            size="sm"
            onClick={detectLanguage}
            className="px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            Detect language
          </Button>
        </div>

        {/* Swap Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={swapLanguages}
          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all duration-200 hover:scale-105 border-none"
        >
          <ArrowRightLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </Button>

        {/* Target Language */}
        <Popover open={targetOpen} onOpenChange={setTargetOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={targetOpen}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border-none"
            >
              <span className="text-2xl">{targetInfo.flag}</span>
              <span className="font-medium">{targetInfo.name}</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Command>
              <CommandInput placeholder="Search languages..." />
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {languages.map((language) => (
                    <CommandItem
                      key={language.code}
                      value={language.code}
                      onSelect={(currentValue) => {
                        setTargetLanguage(currentValue);
                        setTargetOpen(false);
                      }}
                    >
                      <span className="mr-2 text-lg">{language.flag}</span>
                      <span>{language.name}</span>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          targetLanguage === language.code ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
