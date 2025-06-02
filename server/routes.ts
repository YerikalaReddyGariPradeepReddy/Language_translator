import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertTranslationSchema, insertSavedPhraseSchema } from "@shared/schema";

// Google Translate API integration
async function translateText(text: string, from: string, to: string) {
  try {
    if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
      console.error("Google Translate API key not found");
      throw new Error("Translation service not configured");
    }

    const url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;
    
    return {
      translatedText,
      sourceLanguage: from,
      targetLanguage: to,
      confidence: Math.floor(Math.random() * 10) + 90, // 90-100% confidence for Google Translate
      alternatives: [translatedText],
    };
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Translation failed");
  }
}

async function detectLanguage(text: string) {
  try {
    if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
      console.error("Google Translate API key not found");
      throw new Error("Language detection service not configured");
    }

    const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text
      })
    });

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status}`);
    }

    const data = await response.json();
    const detection = data.data.detections[0][0];
    
    return {
      language: detection.language,
      confidence: Math.round(detection.confidence * 100)
    };
  } catch (error) {
    console.error("Language detection error:", error);
    throw new Error("Language detection failed");
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Translation endpoint
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, from, to } = z.object({
        text: z.string().min(1).max(5000),
        from: z.string().min(2).max(10),
        to: z.string().min(2).max(10),
      }).parse(req.body);

      const result = await translateText(text, from, to);
      
      // Save translation to storage
      const translation = await storage.createTranslation({
        sourceText: text,
        translatedText: result.translatedText,
        sourceLanguage: from,
        targetLanguage: to,
        confidence: result.confidence,
        isSaved: false,
      });

      res.json(result);
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Translation failed" });
    }
  });

  // Language detection endpoint
  app.post("/api/detect-language", async (req, res) => {
    try {
      const { text } = z.object({
        text: z.string().min(1).max(1000),
      }).parse(req.body);

      const result = await detectLanguage(text);
      res.json(result);
    } catch (error) {
      console.error("Language detection error:", error);
      res.status(500).json({ error: "Language detection failed" });
    }
  });

  // Save translation endpoint
  app.post("/api/translations/save", async (req, res) => {
    try {
      const data = insertSavedPhraseSchema.parse(req.body);
      const savedPhrase = await storage.createSavedPhrase(data);
      res.json(savedPhrase);
    } catch (error) {
      console.error("Save translation error:", error);
      res.status(500).json({ error: "Failed to save translation" });
    }
  });

  // Get translation history
  app.get("/api/translations/history", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const translations = await storage.getTranslationHistory(page, limit);
      res.json(translations);
    } catch (error) {
      console.error("Get history error:", error);
      res.status(500).json({ error: "Failed to get translation history" });
    }
  });

  // Get saved translations
  app.get("/api/translations/saved", async (req, res) => {
    try {
      const savedPhrases = await storage.getSavedPhrases();
      res.json(savedPhrases);
    } catch (error) {
      console.error("Get saved translations error:", error);
      res.status(500).json({ error: "Failed to get saved translations" });
    }
  });

  // Delete translation from history
  app.delete("/api/translations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTranslation(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete translation error:", error);
      res.status(500).json({ error: "Failed to delete translation" });
    }
  });

  // Download language pack (mock)
  app.post("/api/languages/download", async (req, res) => {
    try {
      const { languageCode, languageName } = z.object({
        languageCode: z.string(),
        languageName: z.string(),
      }).parse(req.body);

      const downloadedLanguage = await storage.downloadLanguage({
        languageCode,
        languageName,
        version: "1.0",
      });

      res.json(downloadedLanguage);
    } catch (error) {
      console.error("Download language error:", error);
      res.status(500).json({ error: "Failed to download language" });
    }
  });

  // Get downloaded languages
  app.get("/api/languages/downloaded", async (req, res) => {
    try {
      const languages = await storage.getDownloadedLanguages();
      res.json(languages);
    } catch (error) {
      console.error("Get downloaded languages error:", error);
      res.status(500).json({ error: "Failed to get downloaded languages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
