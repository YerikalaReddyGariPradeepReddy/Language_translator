import {
  translations,
  conversations,
  savedPhrases,
  downloadedLanguages,
  type Translation,
  type InsertTranslation,
  type Conversation,
  type InsertConversation,
  type SavedPhrase,
  type InsertSavedPhrase,
  type DownloadedLanguage,
  type InsertDownloadedLanguage,
} from "@shared/schema";

export interface IStorage {
  // Translation operations
  createTranslation(translation: InsertTranslation): Promise<Translation>;
  getTranslationHistory(page?: number, limit?: number): Promise<Translation[]>;
  deleteTranslation(id: number): Promise<void>;
  
  // Saved phrases operations
  createSavedPhrase(phrase: InsertSavedPhrase): Promise<SavedPhrase>;
  getSavedPhrases(): Promise<SavedPhrase[]>;
  deleteSavedPhrase(id: number): Promise<void>;
  
  // Conversation operations
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversations(): Promise<Conversation[]>;
  updateConversation(id: number, messages: string[]): Promise<Conversation>;
  
  // Downloaded languages operations
  downloadLanguage(language: InsertDownloadedLanguage): Promise<DownloadedLanguage>;
  getDownloadedLanguages(): Promise<DownloadedLanguage[]>;
  removeDownloadedLanguage(languageCode: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private translations: Map<number, Translation>;
  private savedPhrases: Map<number, SavedPhrase>;
  private conversations: Map<number, Conversation>;
  private downloadedLanguages: Map<number, DownloadedLanguage>;
  private currentTranslationId: number;
  private currentSavedPhraseId: number;
  private currentConversationId: number;
  private currentLanguageId: number;

  constructor() {
    this.translations = new Map();
    this.savedPhrases = new Map();
    this.conversations = new Map();
    this.downloadedLanguages = new Map();
    this.currentTranslationId = 1;
    this.currentSavedPhraseId = 1;
    this.currentConversationId = 1;
    this.currentLanguageId = 1;
  }

  // Translation operations
  async createTranslation(insertTranslation: InsertTranslation): Promise<Translation> {
    const id = this.currentTranslationId++;
    const translation: Translation = {
      ...insertTranslation,
      id,
      createdAt: new Date(),
    };
    this.translations.set(id, translation);
    return translation;
  }

  async getTranslationHistory(page = 1, limit = 20): Promise<Translation[]> {
    const allTranslations = Array.from(this.translations.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return allTranslations.slice(startIndex, endIndex);
  }

  async deleteTranslation(id: number): Promise<void> {
    this.translations.delete(id);
  }

  // Saved phrases operations
  async createSavedPhrase(insertSavedPhrase: InsertSavedPhrase): Promise<SavedPhrase> {
    const id = this.currentSavedPhraseId++;
    const savedPhrase: SavedPhrase = {
      ...insertSavedPhrase,
      id,
      createdAt: new Date(),
    };
    this.savedPhrases.set(id, savedPhrase);
    return savedPhrase;
  }

  async getSavedPhrases(): Promise<SavedPhrase[]> {
    return Array.from(this.savedPhrases.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async deleteSavedPhrase(id: number): Promise<void> {
    this.savedPhrases.delete(id);
  }

  // Conversation operations
  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async updateConversation(id: number, messages: string[]): Promise<Conversation> {
    const conversation = this.conversations.get(id);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    
    const updatedConversation = { ...conversation, messages };
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }

  // Downloaded languages operations
  async downloadLanguage(insertLanguage: InsertDownloadedLanguage): Promise<DownloadedLanguage> {
    // Check if language already exists
    const existing = Array.from(this.downloadedLanguages.values())
      .find(lang => lang.languageCode === insertLanguage.languageCode);
    
    if (existing) {
      return existing;
    }

    const id = this.currentLanguageId++;
    const downloadedLanguage: DownloadedLanguage = {
      ...insertLanguage,
      id,
      downloadedAt: new Date(),
    };
    this.downloadedLanguages.set(id, downloadedLanguage);
    return downloadedLanguage;
  }

  async getDownloadedLanguages(): Promise<DownloadedLanguage[]> {
    return Array.from(this.downloadedLanguages.values())
      .sort((a, b) => a.languageName.localeCompare(b.languageName));
  }

  async removeDownloadedLanguage(languageCode: string): Promise<void> {
    for (const [id, language] of this.downloadedLanguages.entries()) {
      if (language.languageCode === languageCode) {
        this.downloadedLanguages.delete(id);
        break;
      }
    }
  }
}

export const storage = new MemStorage();
