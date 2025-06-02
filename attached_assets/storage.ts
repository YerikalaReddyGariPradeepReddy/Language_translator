import { 
  users, type User, type InsertUser, 
  languages, type Language, type InsertLanguage,
  translations, type Translation, type InsertTranslation,
  offlineLanguages, type OfflineLanguage, type InsertOfflineLanguage
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Language operations
  getLanguages(): Promise<Language[]>;
  getLanguageByCode(code: string): Promise<Language | undefined>;
  createLanguage(language: InsertLanguage): Promise<Language>;
  updateLanguage(id: number, language: Partial<InsertLanguage>): Promise<Language | undefined>;
  
  // Translation operations
  getTranslations(userId?: number, limit?: number): Promise<Translation[]>;
  getTranslationById(id: number): Promise<Translation | undefined>;
  createTranslation(translation: InsertTranslation): Promise<Translation>;
  updateTranslation(id: number, translation: Partial<InsertTranslation>): Promise<Translation | undefined>;
  deleteTranslation(id: number): Promise<boolean>;
  getSavedTranslations(userId?: number): Promise<Translation[]>;
  saveTranslation(id: number): Promise<Translation | undefined>;
  unsaveTranslation(id: number): Promise<Translation | undefined>;
  
  // Offline language operations
  getOfflineLanguages(userId?: number): Promise<(OfflineLanguage & { language: Language })[]>;
  addOfflineLanguage(offlineLanguage: InsertOfflineLanguage): Promise<OfflineLanguage>;
  removeOfflineLanguage(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private languages: Map<number, Language>;
  private translations: Map<number, Translation>;
  private offlineLanguages: Map<number, OfflineLanguage>;
  
  currentUserId: number;
  currentLanguageId: number;
  currentTranslationId: number;
  currentOfflineLanguageId: number;

  constructor() {
    this.users = new Map();
    this.languages = new Map();
    this.translations = new Map();
    this.offlineLanguages = new Map();
    
    this.currentUserId = 1;
    this.currentLanguageId = 1;
    this.currentTranslationId = 1;
    this.currentOfflineLanguageId = 1;
    
    // Initialize with default languages
    this.initializeDefaultLanguages();
  }

  private initializeDefaultLanguages() {
    const defaultLanguages: InsertLanguage[] = [
      // Common languages
      { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', isOfflineAvailable: true, sizeInMb: 85 },
      { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isOfflineAvailable: true, sizeInMb: 110 },
      { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isOfflineAvailable: true, sizeInMb: 125 },
      { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isOfflineAvailable: true, sizeInMb: 130 },
      { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', isOfflineAvailable: true, sizeInMb: 105 },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', isOfflineAvailable: true, sizeInMb: 120 },
      { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', isOfflineAvailable: true, sizeInMb: 140 },
      { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', isOfflineAvailable: true, sizeInMb: 155 },
      { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', isOfflineAvailable: true, sizeInMb: 150 },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪', isOfflineAvailable: true, sizeInMb: 135 },
      
      // Indian languages
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', isOfflineAvailable: true, sizeInMb: 95 },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', isOfflineAvailable: true, sizeInMb: 100 },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', isOfflineAvailable: true, sizeInMb: 98 },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', isOfflineAvailable: true, sizeInMb: 92 },
      { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', isOfflineAvailable: true, sizeInMb: 105 },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', isOfflineAvailable: true, sizeInMb: 90 },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', isOfflineAvailable: true, sizeInMb: 96 },
      { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', isOfflineAvailable: true, sizeInMb: 94 },
      { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', isOfflineAvailable: true, sizeInMb: 89 },
      { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', isOfflineAvailable: true, sizeInMb: 91 },
      { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', isOfflineAvailable: true, sizeInMb: 88 },
      
      // Additional Asian languages
      { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', isOfflineAvailable: true, sizeInMb: 125 },
      { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', isOfflineAvailable: true, sizeInMb: 118 },
      { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', isOfflineAvailable: true, sizeInMb: 110 },
      { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', isOfflineAvailable: true, sizeInMb: 92 },
      { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', isOfflineAvailable: true, sizeInMb: 95 },
      
      // European languages
      { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', isOfflineAvailable: true, sizeInMb: 105 },
      { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', isOfflineAvailable: true, sizeInMb: 115 },
      { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', isOfflineAvailable: true, sizeInMb: 108 },
      { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', isOfflineAvailable: true, sizeInMb: 100 },
      { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', isOfflineAvailable: true, sizeInMb: 98 },
      
      // Middle Eastern languages
      { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', isOfflineAvailable: true, sizeInMb: 115 },
      { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', isOfflineAvailable: true, sizeInMb: 102 },
      { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', isOfflineAvailable: true, sizeInMb: 107 },
    ];
    
    defaultLanguages.forEach(lang => this.createLanguage(lang));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Language operations
  async getLanguages(): Promise<Language[]> {
    return Array.from(this.languages.values());
  }
  
  async getLanguageByCode(code: string): Promise<Language | undefined> {
    return Array.from(this.languages.values()).find(
      (language) => language.code === code,
    );
  }
  
  async createLanguage(insertLanguage: InsertLanguage): Promise<Language> {
    const id = this.currentLanguageId++;
    const language: Language = { ...insertLanguage, id };
    this.languages.set(id, language);
    return language;
  }
  
  async updateLanguage(id: number, language: Partial<InsertLanguage>): Promise<Language | undefined> {
    const existingLanguage = this.languages.get(id);
    if (!existingLanguage) return undefined;
    
    const updatedLanguage = { ...existingLanguage, ...language };
    this.languages.set(id, updatedLanguage);
    return updatedLanguage;
  }
  
  // Translation operations
  async getTranslations(userId?: number, limit?: number): Promise<Translation[]> {
    let translations = Array.from(this.translations.values());
    
    if (userId) {
      translations = translations.filter(t => t.userId === userId);
    }
    
    // Sort by createdAt, newest first
    translations.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt as string);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt as string);
      return dateB.getTime() - dateA.getTime();
    });
    
    if (limit) {
      return translations.slice(0, limit);
    }
    
    return translations;
  }
  
  async getTranslationById(id: number): Promise<Translation | undefined> {
    return this.translations.get(id);
  }
  
  async createTranslation(insertTranslation: InsertTranslation): Promise<Translation> {
    const id = this.currentTranslationId++;
    const now = new Date();
    const translation: Translation = { 
      ...insertTranslation, 
      id, 
      createdAt: now
    };
    this.translations.set(id, translation);
    return translation;
  }
  
  async updateTranslation(id: number, translation: Partial<InsertTranslation>): Promise<Translation | undefined> {
    const existingTranslation = this.translations.get(id);
    if (!existingTranslation) return undefined;
    
    const updatedTranslation = { ...existingTranslation, ...translation };
    this.translations.set(id, updatedTranslation);
    return updatedTranslation;
  }
  
  async deleteTranslation(id: number): Promise<boolean> {
    return this.translations.delete(id);
  }
  
  async getSavedTranslations(userId?: number): Promise<Translation[]> {
    let translations = Array.from(this.translations.values())
      .filter(t => t.isSaved);
    
    if (userId) {
      translations = translations.filter(t => t.userId === userId);
    }
    
    return translations;
  }
  
  async saveTranslation(id: number): Promise<Translation | undefined> {
    const translation = this.translations.get(id);
    if (!translation) return undefined;
    
    const updatedTranslation = { ...translation, isSaved: true };
    this.translations.set(id, updatedTranslation);
    return updatedTranslation;
  }
  
  async unsaveTranslation(id: number): Promise<Translation | undefined> {
    const translation = this.translations.get(id);
    if (!translation) return undefined;
    
    const updatedTranslation = { ...translation, isSaved: false };
    this.translations.set(id, updatedTranslation);
    return updatedTranslation;
  }
  
  // Offline language operations
  async getOfflineLanguages(userId?: number): Promise<(OfflineLanguage & { language: Language })[]> {
    let offlineLanguages = Array.from(this.offlineLanguages.values());
    
    if (userId) {
      offlineLanguages = offlineLanguages.filter(ol => ol.userId === userId);
    }
    
    return offlineLanguages.map(ol => {
      const language = this.languages.get(ol.languageId);
      return { ...ol, language: language! };
    });
  }
  
  async addOfflineLanguage(insertOfflineLanguage: InsertOfflineLanguage): Promise<OfflineLanguage> {
    const id = this.currentOfflineLanguageId++;
    const now = new Date();
    const offlineLanguage: OfflineLanguage = { 
      ...insertOfflineLanguage, 
      id, 
      downloadedAt: now
    };
    this.offlineLanguages.set(id, offlineLanguage);
    
    // Update the language to mark it as offline available
    const language = this.languages.get(offlineLanguage.languageId);
    if (language) {
      this.languages.set(language.id, { ...language, isOfflineAvailable: true });
    }
    
    return offlineLanguage;
  }
  
  async removeOfflineLanguage(id: number): Promise<boolean> {
    const offlineLanguage = this.offlineLanguages.get(id);
    if (!offlineLanguage) return false;
    
    // Update the language to mark it as not offline available
    const language = this.languages.get(offlineLanguage.languageId);
    if (language) {
      this.languages.set(language.id, { ...language, isOfflineAvailable: false });
    }
    
    return this.offlineLanguages.delete(id);
  }
}

export const storage = new MemStorage();
