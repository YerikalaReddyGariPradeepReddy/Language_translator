import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  sourceText: text("source_text").notNull(),
  translatedText: text("translated_text").notNull(),
  sourceLanguage: text("source_language").notNull(),
  targetLanguage: text("target_language").notNull(),
  confidence: integer("confidence"),
  isSaved: boolean("is_saved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  participantA: text("participant_a").notNull(),
  participantB: text("participant_b").notNull(),
  languageA: text("language_a").notNull(),
  languageB: text("language_b").notNull(),
  messages: text("messages").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const savedPhrases = pgTable("saved_phrases", {
  id: serial("id").primaryKey(),
  phrase: text("phrase").notNull(),
  translation: text("translation").notNull(),
  sourceLanguage: text("source_language").notNull(),
  targetLanguage: text("target_language").notNull(),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const downloadedLanguages = pgTable("downloaded_languages", {
  id: serial("id").primaryKey(),
  languageCode: text("language_code").notNull().unique(),
  languageName: text("language_name").notNull(),
  downloadedAt: timestamp("downloaded_at").defaultNow(),
  version: text("version").default("1.0"),
});

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  createdAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertSavedPhraseSchema = createInsertSchema(savedPhrases).omit({
  id: true,
  createdAt: true,
});

export const insertDownloadedLanguageSchema = createInsertSchema(downloadedLanguages).omit({
  id: true,
  downloadedAt: true,
});

export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type SavedPhrase = typeof savedPhrases.$inferSelect;
export type InsertSavedPhrase = z.infer<typeof insertSavedPhraseSchema>;
export type DownloadedLanguage = typeof downloadedLanguages.$inferSelect;
export type InsertDownloadedLanguage = z.infer<typeof insertDownloadedLanguageSchema>;
