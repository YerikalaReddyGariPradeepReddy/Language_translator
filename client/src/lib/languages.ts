export interface Language {
  code: string;
  name: string;
  flag: string;
  category?: string;
}

export const languages: Language[] = [
  // Major Languages
  { code: "en", name: "English", flag: "🇺🇸", category: "Major" },
  { code: "es", name: "Spanish", flag: "🇪🇸", category: "Major" },
  { code: "fr", name: "French", flag: "🇫🇷", category: "Major" },
  { code: "de", name: "German", flag: "🇩🇪", category: "Major" },
  { code: "it", name: "Italian", flag: "🇮🇹", category: "Major" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹", category: "Major" },
  { code: "ru", name: "Russian", flag: "🇷🇺", category: "Major" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", category: "Major" },
  { code: "ko", name: "Korean", flag: "🇰🇷", category: "Major" },
  { code: "zh", name: "Chinese (Simplified)", flag: "🇨🇳", category: "Major" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", category: "Major" },

  // Indian Languages
  { code: "hi", name: "Hindi", flag: "🇮🇳", category: "Indian" },
  { code: "bn", name: "Bengali", flag: "🇧🇩", category: "Indian" },
  { code: "te", name: "Telugu", flag: "🇮🇳", category: "Indian" },
  { code: "ta", name: "Tamil", flag: "🇮🇳", category: "Indian" },
  { code: "mr", name: "Marathi", flag: "🇮🇳", category: "Indian" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳", category: "Indian" },
  { code: "kn", name: "Kannada", flag: "🇮🇳", category: "Indian" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳", category: "Indian" },
  { code: "pa", name: "Punjabi", flag: "🇮🇳", category: "Indian" },
  { code: "ur", name: "Urdu", flag: "🇵🇰", category: "Indian" },
  { code: "or", name: "Odia", flag: "🇮🇳", category: "Indian" },
  { code: "as", name: "Assamese", flag: "🇮🇳", category: "Indian" },

  // Other Languages
  { code: "nl", name: "Dutch", flag: "🇳🇱", category: "European" },
  { code: "sv", name: "Swedish", flag: "🇸🇪", category: "European" },
  { code: "no", name: "Norwegian", flag: "🇳🇴", category: "European" },
  { code: "da", name: "Danish", flag: "🇩🇰", category: "European" },
  { code: "fi", name: "Finnish", flag: "🇫🇮", category: "European" },
  { code: "pl", name: "Polish", flag: "🇵🇱", category: "European" },
  { code: "cs", name: "Czech", flag: "🇨🇿", category: "European" },
  { code: "sk", name: "Slovak", flag: "🇸🇰", category: "European" },
  { code: "hu", name: "Hungarian", flag: "🇭🇺", category: "European" },
  { code: "ro", name: "Romanian", flag: "🇷🇴", category: "European" },
  { code: "bg", name: "Bulgarian", flag: "🇧🇬", category: "European" },
  { code: "hr", name: "Croatian", flag: "🇭🇷", category: "European" },
  { code: "sr", name: "Serbian", flag: "🇷🇸", category: "European" },
  { code: "sl", name: "Slovenian", flag: "🇸🇮", category: "European" },
  { code: "lt", name: "Lithuanian", flag: "🇱🇹", category: "European" },
  { code: "lv", name: "Latvian", flag: "🇱🇻", category: "European" },
  { code: "et", name: "Estonian", flag: "🇪🇪", category: "European" },
  { code: "el", name: "Greek", flag: "🇬🇷", category: "European" },
  { code: "tr", name: "Turkish", flag: "🇹🇷", category: "Asian" },
  { code: "th", name: "Thai", flag: "🇹🇭", category: "Asian" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳", category: "Asian" },
  { code: "id", name: "Indonesian", flag: "🇮🇩", category: "Asian" },
  { code: "ms", name: "Malay", flag: "🇲🇾", category: "Asian" },
  { code: "he", name: "Hebrew", flag: "🇮🇱", category: "Middle Eastern" },
  { code: "fa", name: "Persian", flag: "🇮🇷", category: "Middle Eastern" },
  { code: "sw", name: "Swahili", flag: "🇹🇿", category: "African" },
  { code: "zu", name: "Zulu", flag: "🇿🇦", category: "African" },
  { code: "af", name: "Afrikaans", flag: "🇿🇦", category: "African" },
];

export function getLanguageInfo(code: string): Language {
  return languages.find(lang => lang.code === code) || {
    code,
    name: "Unknown",
    flag: "🏴",
  };
}

export function getLanguagesByCategory(category: string): Language[] {
  return languages.filter(lang => lang.category === category);
}

export function searchLanguages(query: string): Language[] {
  const lowerQuery = query.toLowerCase();
  return languages.filter(lang => 
    lang.name.toLowerCase().includes(lowerQuery) ||
    lang.code.toLowerCase().includes(lowerQuery)
  );
}
